'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useSyncExternalStore } from 'react';
import type { IngredientKey } from '@/domain/data/ingredients';
import { weekStartOf } from '@/domain/dates';
import type { Pantry, Profile, Recipe, WeekRecord } from '@/domain/types';

/** Un import vidéo réussi, gardé pour l'historique « Mes derniers imports ». */
export interface ImportRecord {
  id: string;
  recipe: Recipe;
  guessed: string[];
  importedAt: string;
  addedTo: 'week' | 'list' | null;
}

export interface AppState {
  version: 1;
  profile: Profile | null;
  /** Réglages à appliquer à la semaine suivante. */
  pendingProfile: Profile | null;
  weekStart: string;
  /** Identifiants des dîners, du lundi au dernier jour. */
  plan: string[];
  /** Recettes importées utilisables dans le plan. */
  customRecipes: Record<string, Recipe>;
  /** Ingrédients ajoutés à la liste sans changer la semaine (imports « liste seule »). */
  listOnlyRecipes: string[];
  pantry: Pantry;
  checked: Partial<Record<IngredientKey, boolean>>;
  cooked: Record<number, boolean>;
  history: WeekRecord[];
  imports: ImportRecord[];
}

const STORAGE_KEY = 'diallo:v1';

export const DEFAULT_PROFILE: Profile = {
  store: 'lidl', extras: [], people: 1, dinners: 5, budget: 25,
  diet: 'omni', exclusions: [], cuisines: [], maxMinutes: 45,
};

/** `weekStart` vide côté serveur : la date du jour n'est lue que sur l'appareil. */
export const initialState = (weekStart = weekStartOf()): AppState => ({
  version: 1,
  profile: null,
  pendingProfile: null,
  weekStart,
  plan: [],
  customRecipes: {},
  listOnlyRecipes: [],
  pantry: {},
  checked: {},
  cooked: {},
  history: [],
  imports: [],
});

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'start'; profile: Profile; plan: string[] }
  | { type: 'setPlan'; plan: string[] }
  | { type: 'restore'; state: AppState }
  | { type: 'swap'; day: number; recipeId: string }
  | { type: 'toggleCooked'; day: number }
  | { type: 'toggleChecked'; key: IngredientKey }
  | { type: 'setPantry'; key: IngredientKey; value: number | true | null }
  | { type: 'saveProfile'; profile: Profile; applyNow: boolean; plan?: string[] }
  | { type: 'finishWeek'; record: WeekRecord; pantry: Pantry; profile: Profile; plan: string[] }
  | { type: 'saveImport'; record: ImportRecord }
  | { type: 'useImport'; id: string; day: number | null }
  | { type: 'reset' };

/** Nouvelle semaine : coches, dîners cuisinés et imports « liste seule » remis à zéro. */
const freshWeek = { checked: {}, cooked: {}, listOnlyRecipes: [] as string[] };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
    case 'restore':
      return action.state;
    case 'start':
      return { ...state, profile: action.profile, pendingProfile: null, plan: action.plan, weekStart: weekStartOf(), ...freshWeek };
    case 'setPlan':
      return { ...state, plan: action.plan, ...freshWeek };
    case 'swap': {
      const plan = state.plan.map((id, i) => (i === action.day ? action.recipeId : id));
      return { ...state, plan, cooked: { ...state.cooked, [action.day]: false } };
    }
    case 'toggleCooked':
      return { ...state, cooked: { ...state.cooked, [action.day]: !state.cooked[action.day] } };
    case 'toggleChecked':
      return { ...state, checked: { ...state.checked, [action.key]: !state.checked[action.key] } };
    case 'setPantry': {
      const pantry = { ...state.pantry };
      if (action.value === null) delete pantry[action.key];
      else pantry[action.key] = action.value;
      return { ...state, pantry };
    }
    case 'saveProfile':
      return action.applyNow
        ? { ...state, profile: action.profile, pendingProfile: null, plan: action.plan ?? state.plan, ...freshWeek }
        : { ...state, pendingProfile: action.profile };
    case 'finishWeek':
      return {
        ...state,
        history: [...state.history, action.record].slice(-52),
        pantry: action.pantry,
        profile: action.profile,
        pendingProfile: null,
        plan: action.plan,
        weekStart: weekStartOf(),
        ...freshWeek,
      };
    case 'saveImport':
      return {
        ...state,
        imports: [action.record, ...state.imports.filter((i) => i.id !== action.record.id)].slice(0, 20),
        customRecipes: { ...state.customRecipes, [action.record.id]: action.record.recipe },
      };
    case 'useImport': {
      const imports = state.imports.map((i) => (i.id === action.id ? { ...i, addedTo: action.day === null ? ('list' as const) : ('week' as const) } : i));
      if (action.day === null) return { ...state, imports, listOnlyRecipes: [...new Set([...state.listOnlyRecipes, action.id])] };
      const plan = state.plan.map((id, i) => (i === action.day ? action.id : id));
      return { ...state, imports, plan, cooked: { ...state.cooked, [action.day]: false } };
    }
    case 'reset':
      return initialState();
  }
}

function load(): AppState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AppState;
    return parsed.version === 1 ? { ...initialState(), ...parsed } : null;
  } catch {
    return null;
  }
}

function save(state: AppState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Stockage indisponible (navigation privée, quota) : l'app reste utilisable pour la session.
  }
}

const noopSubscribe = () => () => {};

interface StoreValue {
  state: AppState;
  hydrated: boolean;
  dispatch: (action: Action) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/** État de l'app, gardé sur l'appareil (aucun compte en P1). */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // Côté serveur : état vide. Côté client : état sauvegardé, lu une seule fois.
  const [state, rawDispatch] = useReducer(reducer, undefined, () => (typeof window === 'undefined' ? initialState('') : (load() ?? initialState())));
  // Faux pendant le rendu serveur et l'hydratation, vrai ensuite : évite tout écart de rendu.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated]);

  const dispatch = useCallback((action: Action) => rawDispatch(action), []);
  const value = useMemo(() => ({ state, hydrated, dispatch }), [state, hydrated, dispatch]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppState(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useAppState doit être utilisé dans <AppStateProvider>');
  return value;
}

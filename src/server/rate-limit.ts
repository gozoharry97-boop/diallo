import 'server-only';

const hits = new Map<string, number[]>();

/**
 * Limite simple en mémoire (par instance) : suffisante pour un MVP,
 * à remplacer par un stockage partagé si l'app tourne sur plusieurs instances.
 */
export function allowRequest(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function clientKey(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'anonyme';
}

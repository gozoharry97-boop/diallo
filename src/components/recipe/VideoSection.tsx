'use client';

import { useEffect, useRef, useState } from 'react';
import { PLATFORM_LABEL } from '@/domain/import/platform';
import type { VideoLink } from '@/server/videos';
import { Icon } from '../ui/Icon';
import styles from './recipe.module.css';

const durationLabel = (s?: number) => (s === undefined ? '' : s < 60 ? `${s} s` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60}` : ''}`);

/** Vidéos du plat : onglets accessibles et lecteur officiel chargé seulement au clic (cookies tiers). */
export function VideoSection({ recipeId, fallback, heading = true }: { recipeId: string; fallback?: VideoLink[]; heading?: boolean }) {
  const [videos, setVideos] = useState<VideoLink[] | null>(fallback ?? null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (fallback) return;
    let cancelled = false;
    fetch(`/api/videos?recipe=${encodeURIComponent(recipeId)}`)
      .then((r) => (r.ok ? (r.json() as Promise<VideoLink[]>) : []))
      .then((v) => !cancelled && setVideos(v))
      .catch(() => !cancelled && setVideos([]));
    return () => {
      cancelled = true;
    };
  }, [recipeId, fallback]);

  if (!videos) return heading ? null : <p className={styles.muted} role="status">Recherche de vidéos…</p>;
  if (videos.length === 0) return heading ? null : <p className={styles.muted}>Pas encore de vidéo pour ce plat. Les étapes de la fiche suffisent pour le réussir.</p>;
  const video = videos[Math.min(active, videos.length - 1)];
  const vertical = video.platform !== 'youtube';

  const select = (i: number) => {
    setActive(i);
    setPlaying(false);
    tabs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = videos.length - 1;
    if (e.key === 'ArrowRight') select(active === last ? 0 : active + 1);
    else if (e.key === 'ArrowLeft') select(active === 0 ? last : active - 1);
    else if (e.key === 'Home') select(0);
    else if (e.key === 'End') select(last);
    else return;
    e.preventDefault();
  };

  return (
    <section className={heading ? styles.videos : undefined} aria-labelledby={heading ? 'videos-titre' : undefined} aria-label={heading ? undefined : 'Vidéos du plat'}>
      {heading && <div className={styles.videosHead}>
        <h2 id="videos-titre" className={styles.h2}>
          <span className={styles.playBadge} aria-hidden="true"><Icon name="play" size={18} /></span>
          En vidéo
        </h2>
        <span className={styles.muted}>{videos.length} {videos.length > 1 ? 'vidéos trouvées' : 'vidéo'}</span>
      </div>}

      {videos.length > 1 && (
        <div role="tablist" aria-label="Choisir une plateforme" className={styles.tabs} onKeyDown={onKeyDown}>
          {videos.map((v, i) => (
            <button
              key={v.videoId}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`video-tab-${i}`}
              aria-selected={i === active}
              aria-controls="video-panel"
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => select(i)}
            >
              <span>{PLATFORM_LABEL[v.platform]}</span>
              <span className={styles.tabDetail}>{durationLabel(v.durationSeconds) || (v.captions ? 'sous-titrée' : 'vidéo')}</span>
            </button>
          ))}
        </div>
      )}

      <div id="video-panel" role={videos.length > 1 ? 'tabpanel' : undefined} aria-labelledby={videos.length > 1 ? `video-tab-${active}` : undefined} className={styles.panel}>
        <div className={vertical ? styles.playerVertical : styles.player}>
          {playing ? (
            <iframe
              src={`${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
              title={`${video.title || 'Vidéo de la recette'} (${PLATFORM_LABEL[video.platform]})`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button type="button" className={styles.facade} onClick={() => setPlaying(true)}>
              <span className={styles.facadePlay} aria-hidden="true"><Icon name="play" size={28} /></span>
              <span>Lire la vidéo sur {PLATFORM_LABEL[video.platform]}</span>
              <span className={styles.facadeNote}>{PLATFORM_LABEL[video.platform]} peut déposer des cookies.</span>
            </button>
          )}
        </div>
        {video.title && <p className={styles.videoTitle}>{video.title}</p>}
        <p className={styles.muted}>Par {video.author || 'son créateur'}, sur {PLATFORM_LABEL[video.platform]}.</p>
        <p className={video.captions ? styles.ccYes : styles.ccNo}>
          <span className={styles.cc} aria-hidden="true">CC</span>
          {video.captions === true ? 'Sous-titres disponibles' : video.captions === false ? 'Sans sous-titres' : 'Sous-titres selon la vidéo'}
        </p>
        <a href={video.url} target="_blank" rel="noopener noreferrer" className={styles.external}>
          Ouvrir sur {PLATFORM_LABEL[video.platform]}<span className="visually-hidden"> (nouvel onglet)</span>
        </a>
      </div>
      <p className={styles.muted}>Les quantités de la fiche sont adaptées à ton foyer : elles peuvent différer de la vidéo.</p>
    </section>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { type WordItem } from '../data/words';

export interface ModalProps {
  item: WordItem | null;
  onClose: () => void;
  onModalMouseEnter?: () => void;
  onModalMouseLeave?: () => void;
}

export default function Modal({
  item,
  onClose,
  onModalMouseEnter,
  onModalMouseLeave,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Domyślny stan odtwarzacza
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(0);

  // Animacja wejścia GSAP (tylko synchronizacja z zewnętrzną biblioteką DOM)
  useEffect(() => {
    if (!item) return;

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    );
    tl.fromTo(
      cardRef.current,
      { y: 30, scale: 0.98 },
      { y: 0, scale: 1, duration: 0.3, ease: 'power3.out' },
      '-=0.1'
    );
  }, [item]);

  // Sterowanie odtwarzaniem
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  // Zmiana głośności
  const handleSetVolume = (e: React.MouseEvent, newVol: number) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVol;
    video.muted = newVol === 0;
    setVolume(newVol);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onModalMouseLeave) onModalMouseLeave();

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(cardRef.current, {
      y: 30,
      scale: 0.98,
      duration: 0.2,
      ease: 'power3.in',
    });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.15 }, '-=0.1');
  };

  const handleOpenCompactWindow = (url: string) => {
    const width = 1000;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      url,
      'ProjectPreview',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  if (!item) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      onPointerDown={(e) => e.stopPropagation()}
      style={{ zIndex: 999999 }}
      className="fixed inset-0 flex items-center justify-center p-4 pointer-events-auto bg-black/90"
    >
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseEnter={onModalMouseEnter}
        onMouseLeave={onModalMouseLeave}
        style={{ backgroundColor: '#09090b', opacity: 1 }}
        className="w-full max-h-[88vh] overflow-y-auto p-6 shadow-[0_25px_60px_rgba(0,0,0,1)] select-none sm:max-w-lg border border-zinc-800 rounded-2xl text-zinc-100"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 text-lime-400 border border-lime-400/30">
            {item.category}
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Zamknij modal"
            className="flex items-center justify-center w-8 h-8 text-xs transition-colors rounded-full cursor-pointer bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white active:scale-90"
          >
            ✕
          </button>
        </div>

        {/* Sekcja Mediów */}
        {(item.videoUrl || item.imageUrl) && (
          <div className="relative w-full mb-4 overflow-hidden border shadow-inner rounded-xl border-zinc-800 bg-zinc-900 aspect-video">
            {item.videoUrl ? (
              <>
                <video
                  ref={videoRef}
                  key={item.videoUrl}
                  loop
                  playsInline
                  muted={volume === 0}
                  poster={item.imageUrl}
                  preload="metadata"
                  src={item.videoUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="object-cover w-full h-full"
                />

                {/* Kontrolki */}
                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex items-center gap-1.5 px-3 py-1 font-mono text-[11px] rounded-lg bg-zinc-900/90 hover:bg-lime-400 hover:text-black border border-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                  >
                    <span>{isPlaying ? '⏸ Wstrzymaj' : '▶ Włącz film'}</span>
                  </button>

                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={(e) => handleSetVolume(e, 0)}
                      className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                        volume === 0
                          ? 'bg-zinc-800 border-lime-400 text-lime-400'
                          : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      🔇 0%
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSetVolume(e, 0.4)}
                      className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                        volume > 0 && volume <= 0.5
                          ? 'bg-zinc-800 border-lime-400 text-lime-400'
                          : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      🔉 50%
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleSetVolume(e, 1)}
                      className={`px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                        volume > 0.5
                          ? 'bg-zinc-800 border-lime-400 text-lime-400'
                          : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:text-white'
                      }`}
                    >
                      🔊 100%
                    </button>
                  </div>
                </div>
              </>
            ) : item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.label}
                loading="eager"
                className="object-cover w-full h-full"
              />
            ) : null}
          </div>
        )}

        <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
          {item.label}
        </h2>
        <p className="mb-6 font-sans text-sm leading-relaxed text-zinc-300">
          {item.description}
        </p>

        <div className="flex flex-col gap-2.5 pt-4 border-t border-zinc-800 font-mono text-xs">
          {item.projectUrl && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => handleOpenCompactWindow(item.projectUrl!)}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-lime-400 hover:text-lime-400 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>❐</span> Okno
              </button>

              <a
                href={item.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:border-lime-400 hover:text-lime-400 transition-all text-center flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>↗</span> Nowa karta
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="w-full py-3 font-bold tracking-wider text-black uppercase rounded-xl bg-lime-400 hover:bg-lime-300 transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)] cursor-pointer active:scale-98"
          >
            Zamknij kartę
          </button>
        </div>
      </div>
    </div>
  );
}
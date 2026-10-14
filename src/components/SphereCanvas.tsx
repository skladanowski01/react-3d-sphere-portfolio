import React, { useEffect, useRef, useState } from 'react';
import { WORDS_DATA, type WordItem } from '../data/words';

export interface SphereCanvasProps {
  onSelectWord: (item: WordItem) => void;
  isPaused: boolean;
  visitedIds: number[];
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function SphereCanvas({
  onSelectWord,
  isPaused,
  visitedIds,
}: SphereCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elementsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const [hoveredItem, setHoveredItem] = useState<WordItem | null>(null);
  const hoverVideoRef = useRef<HTMLVideoElement>(null);

  const targetCursorRef = useRef({ x: 0, y: 0 });
  const previewPosRef = useRef({ x: 0, y: 0 });
  const previewDivRef = useRef<HTMLDivElement>(null);

  const shouldPause = isPaused || hoveredItem !== null;
  const shouldPauseRef = useRef(shouldPause);

  useEffect(() => {
    shouldPauseRef.current = shouldPause;
  }, [shouldPause]);

  useEffect(() => {
    if (hoveredItem?.videoUrl && hoverVideoRef.current) {
      const video = hoverVideoRef.current;
      video.muted = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [hoveredItem]);

  const dimensionsRef = useRef({
    radius: 140,
    focalLength: 320,
    width: 0,
    height: 0,
  });

  const motionRef = useRef({
    yaw: 0,
    pitch: 0,
    speedYaw: 0.0012,
    speedPitch: 0.0004,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    dragDistance: 0,
  });

  useEffect(() => {
    const canvasElement = canvasRef.current;
    let animationFrameId: number;

    const updateDimensions = () => {
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;
      const minDimension = Math.min(width, height);

      const calculatedRadius = Math.max(130, Math.min(minDimension * 0.34, 320));
      const calculatedFocal = calculatedRadius * 2.2;

      dimensionsRef.current = {
        radius: calculatedRadius,
        focalLength: calculatedFocal,
        width,
        height,
      };

      if (canvasElement) {
        const dpr = window.devicePixelRatio || 1;
        canvasElement.width = width * dpr;
        canvasElement.height = height * dpr;
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const latitudes = [-0.65, -0.3, 0, 0.3, 0.65];
    const distribution = [3, 4, 6, 4, 3];

    const baseWordPoints: Point3D[] = [];
    let wordIndex = 0;

    latitudes.forEach((latY, ringIdx) => {
      const countOnRing = distribution[ringIdx];
      const ringRadius = Math.sqrt(1 - latY * latY);
      const offsetAngle = ringIdx % 2 === 0 ? 0 : Math.PI / countOnRing;

      for (let j = 0; j < countOnRing; j++) {
        if (wordIndex >= WORDS_DATA.length) break;
        const theta = (j / countOnRing) * Math.PI * 2 + offsetAngle;

        baseWordPoints.push({
          x: Math.cos(theta) * ringRadius,
          y: latY,
          z: Math.sin(theta) * ringRadius,
        });
        wordIndex++;
      }
    });

    const wireframeRings: Point3D[][] = [];
    const ringSteps = 48;

    latitudes.forEach((latY) => {
      const ring: Point3D[] = [];
      const ringR = Math.sqrt(1 - latY * latY);
      for (let j = 0; j <= ringSteps; j++) {
        const theta = (j / ringSteps) * Math.PI * 2;
        ring.push({
          x: Math.cos(theta) * ringR,
          y: latY,
          z: Math.sin(theta) * ringR,
        });
      }
      wireframeRings.push(ring);
    });

    const meridianAngles = [0, Math.PI / 3, (2 * Math.PI) / 3];
    meridianAngles.forEach((baseAngle) => {
      const ring: Point3D[] = [];
      for (let j = 0; j <= ringSteps; j++) {
        const theta = (j / ringSteps) * Math.PI * 2;
        ring.push({
          x: Math.cos(baseAngle) * Math.cos(theta),
          y: Math.sin(theta),
          z: Math.sin(baseAngle) * Math.cos(theta),
        });
      }
      wireframeRings.push(ring);
    });

    const loop = () => {
      const motion = motionRef.current;
      const { radius, focalLength, width, height } = dimensionsRef.current;
      const centerX = width / 2;
      const centerY = height / 2;
      const paused = shouldPauseRef.current;

      previewPosRef.current.x += (targetCursorRef.current.x - previewPosRef.current.x) * 0.12;
      previewPosRef.current.y += (targetCursorRef.current.y - previewPosRef.current.y) * 0.12;

      if (previewDivRef.current) {
        previewDivRef.current.style.transform = `translate3d(${previewPosRef.current.x + 24}px, ${previewPosRef.current.y + 24}px, 0)`;
      }

      if (!motion.isDragging) {
        if (paused) {
          motion.speedYaw *= 0.88;
          motion.speedPitch *= 0.88;
          motion.yaw += motion.speedYaw;
          motion.pitch += motion.speedPitch;
        } else {
          motion.yaw += motion.speedYaw;
          motion.pitch += motion.speedPitch;

          motion.speedYaw *= 0.96;
          motion.speedPitch *= 0.96;

          if (Math.abs(motion.speedYaw) < 0.0008) motion.speedYaw = 0.0008;
          if (Math.abs(motion.speedPitch) < 0.0002) motion.speedPitch = 0.0002;
        }
      }

      const cosY = Math.cos(motion.yaw);
      const sinY = Math.sin(motion.yaw);
      const cosX = Math.cos(motion.pitch);
      const sinX = Math.sin(motion.pitch);

      const projectPoint = (p: Point3D) => {
        const px = p.x * radius;
        const py = p.y * radius;
        const pz = p.z * radius;

        const x1 = px * cosY - pz * sinY;
        const z1 = pz * cosY + px * sinY;

        const y2 = py * cosX - z1 * sinX;
        const z2 = z1 * cosX + py * sinX;

        const scale = focalLength / (focalLength - z2);
        return {
          sx: x1 * scale,
          sy: y2 * scale,
          scale,
          z: z2,
        };
      };

      if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        if (ctx) {
          const dpr = window.devicePixelRatio || 1;
          ctx.save();
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

          ctx.scale(dpr, dpr);
          ctx.translate(centerX, centerY);

          wireframeRings.forEach((ring) => {
            ctx.beginPath();
            let first = true;
            for (let j = 0; j < ring.length; j++) {
              const { sx, sy } = projectPoint(ring[j]);

              if (first) {
                ctx.moveTo(sx, sy);
                first = false;
              } else {
                ctx.lineTo(sx, sy);
              }
            }
            ctx.strokeStyle = isPaused
              ? 'rgba(255, 255, 255, 0.02)'
              : 'rgba(204, 255, 0, 0.18)';
            ctx.lineWidth = 1;
            ctx.stroke();
          });

          ctx.restore();
        }
      }

      baseWordPoints.forEach((point, i) => {
        const el = elementsRef.current[i];
        if (!el) return;

        const { sx, sy, scale, z } = projectPoint(point);
        const depth = (z + radius) / (2 * radius);
        const baseOpacity = Math.max(0.2, depth);

        el.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(${scale})`;
        el.style.zIndex = `${Math.round(z + radius)}`;

        if (isPaused) {
          el.style.opacity = '0.04';
        } else if (!shouldPauseRef.current) {
          el.style.opacity = `${baseOpacity}`;
        }
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateDimensions);
      if (canvasElement) {
        const ctx = canvasElement.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        }
      }
    };
  }, [isPaused]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isPaused) return;
    motionRef.current.isDragging = true;
    motionRef.current.lastX = e.clientX;
    motionRef.current.lastY = e.clientY;
    motionRef.current.dragDistance = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    targetCursorRef.current = { x: e.clientX, y: e.clientY };

    const motion = motionRef.current;
    if (!motion.isDragging || isPaused) return;

    const deltaX = e.clientX - motion.lastX;
    const deltaY = e.clientY - motion.lastY;
    motion.dragDistance += Math.hypot(deltaX, deltaY);

    const sensitivity = 0.004;
    motion.yaw += deltaX * sensitivity;
    motion.pitch -= deltaY * sensitivity;

    motion.speedYaw = deltaX * sensitivity * 0.5;
    motion.speedPitch = -deltaY * sensitivity * 0.5;

    motion.lastX = e.clientX;
    motion.lastY = e.clientY;
  };

  const handlePointerUp = () => {
    motionRef.current.isDragging = false;
  };

  const handleClickWord = (item: WordItem) => {
    if (motionRef.current.dragDistance > 6) return;
    setHoveredItem(null);
    onSelectWord(item);
  };

  const getButtonClasses = (item: WordItem, index: number) => {
    const isPrimaryAboutMe = index === 0;
    const isVisited = visitedIds.includes(item.id);
    const isCurrentHovered = hoveredItem?.id === item.id;
    const hasAnyHover = hoveredItem !== null;

    const baseColor = isPrimaryAboutMe
      ? isVisited
        ? 'bg-emerald-950 border border-emerald-500/60 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
        : 'bg-emerald-950 border-2 border-emerald-400 text-emerald-300 font-semibold shadow-[0_0_20px_rgba(16,185,129,0.45)]'
      : isVisited
      ? 'bg-red-950 border border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
      : 'bg-zinc-900 border border-zinc-700 text-zinc-300';

    const focusState = hasAnyHover
      ? isCurrentHovered
        ? '!opacity-100 scale-[1.05] !border-lime-400 !text-lime-300 shadow-[0_0_25px_rgba(204,255,0,0.35)] z-50'
        : '!opacity-25 transition-opacity duration-700'
      : '';

    return `${baseColor} ${focusState}`.trim();
  };

  const hasHoverMedia = Boolean(hoveredItem?.videoUrl || hoveredItem?.imageUrl);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative flex items-center justify-center w-full h-full overflow-hidden select-none touch-none ${
        isPaused ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Pływające okienko podglądu z fontem Lato */}
      <div
        ref={previewDivRef}
        style={{ zIndex: 9999 }}
        className={`fixed top-0 left-0 hidden pointer-events-none md:block transition-opacity duration-300 ease-out will-change-transform ${
          !isPaused && hasHoverMedia
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-64 p-2 rounded-xl border border-zinc-700 bg-black shadow-[0_20px_45px_rgba(0,0,0,0.9)]">
          <div className="relative w-full overflow-hidden rounded-lg h-36 bg-zinc-900">
            {hoveredItem?.videoUrl ? (
              <video
                key={hoveredItem.videoUrl}
                ref={hoverVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                src={hoveredItem.videoUrl}
                onLoadedMetadata={(e) => {
                  const target = e.currentTarget;
                  target.muted = true;
                  target.play().catch(() => {});
                }}
                className="object-cover w-full h-full"
              />
            ) : hoveredItem?.imageUrl ? (
              <img
                src={hoveredItem.imageUrl}
                alt={hoveredItem.label}
                loading="eager"
                className="object-cover w-full h-full"
              />
            ) : null}
          </div>
          <div className="flex items-center justify-between px-1.5 pt-2 pb-0.5">
            <span className="text-xs font-bold tracking-normal text-white">
              {hoveredItem?.label}
            </span>
            <span className="text-[11px] font-semibold text-lime-400">
              {hoveredItem?.category}
            </span>
          </div>
        </div>
      </div>

      {/* Przyciski słów z fontem Lato */}
      {WORDS_DATA.map((item, index) => {
        const isPrimaryAboutMe = index === 0;
        const isVisited = visitedIds.includes(item.id);

        return (
          <button
            key={item.id}
            ref={(el) => {
              elementsRef.current[index] = el;
            }}
            disabled={isPaused}
            onClick={() => handleClickWord(item)}
            onPointerEnter={() => {
              if (!isPaused) setHoveredItem(item);
            }}
            onPointerLeave={() => {
              setHoveredItem(null);
            }}
            className={`absolute will-change-transform px-3 sm:px-4 py-1.5 rounded-full font-medium text-xs sm:text-sm whitespace-nowrap active:scale-95 transition-all duration-500 ease-out cursor-pointer disabled:pointer-events-none ${getButtonClasses(
              item,
              index
            )}`}
          >
            {isPrimaryAboutMe ? (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 align-middle animate-ping" />
            ) : isVisited ? (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 align-middle animate-pulse" />
            ) : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
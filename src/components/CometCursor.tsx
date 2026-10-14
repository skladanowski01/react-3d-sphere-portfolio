import { useEffect, useRef } from 'react';

// ==========================================
// 1. TYPOWANIE STRUKTUR CZĄSTECZEK (TypeScript)
// ==========================================

/**
 * Pojedynczy punkt tworzący ślad (ogon) komety.
 * x, y - położenie w pikselach.
 * alpha - współczynnik przezroczystości (od 1.0 do 0.0), który maleje z każdą klatką.
 */
interface TrailPoint {
  x: number;
  y: number;
  alpha: number;
}

/**
 * Pojedyncza iskra wystrzeliwana promieniście podczas kliknięcia myszą.
 * vx, vy - wektory prędkości (velocity), określające kierunek i pęd cząsteczki.
 * size - promień cząsteczki w pikselach.
 */
interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

/**
 * Rozszerzający się pierścień fali uderzeniowej (shockwave) po kliknięciu.
 * radius - bieżący promień koła.
 * maxRadius - maksymalny rozmiar, po którego osiągnięciu fala znika.
 */
interface ShockwaveRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export default function CometCursor() {
  // Referencja do elementu DOM <canvas> – pozwala na bezpośredni dostęp do API graficznego 2D
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Bieżące współrzędne i stan obecności kursora na ekranie.
  // Używamy useRef, aby aktualizacja pozycji myszy nie wywoływała re-renderów Reacta.
  const mouseRef = useRef({ x: -100, y: -100, active: false });

  // Tablice przechowujące aktywne cząsteczki animacji.
  // Dane żyją poza stanem Reacta (60-120 FPS bez spadków wydajności).
  const pointsRef = useRef<TrailPoint[]>([]);
  const particlesRef = useRef<SparkParticle[]>([]);
  const ringsRef = useRef<ShockwaveRing[]>([]);

  useEffect(() => {
    // -------------------------------------------------------------
    // FUNKCJA SPRAWDZAJĄCA TYP URZĄDZENIA WSKAZUJĄCEGO
    // Rola: Wykrywa, czy użytkownik korzysta z precyzyjnej myszy (desktop).
    // Jeśli to ekran dotykowy (pointer: coarse), przerywamy działanie,
    // oszczędzając baterię i procesor na urządzeniach mobilnych.
    // -------------------------------------------------------------
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    // Pobieramy instancję canvasu i jego kontekst rysowania 2D ('pędzel')
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Identyfikator klatki zwracany przez requestAnimationFrame – niezbędny do zatrzymania pętli
    let animationFrameId: number;

    // -------------------------------------------------------------
    // FUNKCJA: resize()
    // Rola: Ustawia wewnętrzną rozdzielczość bufora płótna na dokładne
    // wymiary okna przeglądarki. Zapobiega to rozmyciu grafiki (zapewnia ostrość 1:1).
    // -------------------------------------------------------------
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // -------------------------------------------------------------
    // FUNKCJA: onMouseMove()
    // Rola: Zapisuje współrzędne kursora oraz dodaje nowy punkt
    // o pełnym kryciu (alpha: 1.0) na początek ogona komety.
    // -------------------------------------------------------------
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;

      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        alpha: 1.0,
      });
    };

    // -------------------------------------------------------------
    // FUNKCJA: onMouseLeave()
    // Rola: Wyłącza widoczność głowy kursora, kiedy kursor opuści
    // obszar okna przeglądarki (np. przejdzie na pasek kart).
    // -------------------------------------------------------------
    const onMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // -------------------------------------------------------------
    // FUNKCJA: onMouseDown()
    // Rola: Generator wybuchu. Tworzy powiększający się pierścień
    // fali uderzeniowej oraz generuje 8 iskier wystrzeliwujących
    // w losowych kierunkach (zamienia kąt biegunowy na wektory vx/vy).
    // -------------------------------------------------------------
    const onMouseDown = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Generowanie fali uderzeniowej
      ringsRef.current.push({
        x: clickX,
        y: clickY,
        radius: 3,
        maxRadius: 28,
        alpha: 0.8,
      });

      // Generowanie drobnych iskier rozbłysku
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        // Obliczamy kąt w radianach z lekką losowością, aby wybuch wyglądał organicznie
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
        const speed = 1.8 + Math.random() * 2.2;

        particlesRef.current.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          size: 1.2 + Math.random() * 1.0,
        });
      }
    };

    // Podpinamy nasłuchiwacze do obiektu window/document, aby reagowały
    // nawet wtedy, gdy kursor znajduje się nad innymi elementami interfejsu
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseleave', onMouseLeave);

    // -------------------------------------------------------------
    // GŁÓWNA FUNKCJA PĘTLI ANIMACJI: render()
    // Rola: Wywoływana w każdej klatce monitora (60/120 Hz).
    // Czyści ekran, przelicza fizykę (ruch, opór, gaśnięcie) i rysuje klatkę.
    // -------------------------------------------------------------
    const render = () => {
      // 1. Czyszczenie całego płótna – bez tego klatki nakładałyby się w nieskończoność
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const points = pointsRef.current;
      const rings = ringsRef.current;
      const particles = particlesRef.current;

      // --- KROK A: Fizyka i rysowanie pierścieni fali uderzeniowej ---
      // Iterujemy od końca tablicy (i--), aby bezpiecznie usuwać martwe elementy przez splice()
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        // Łagodne rozszerzanie (interpolacja do maxRadius)
        ring.radius += (ring.maxRadius - ring.radius) * 0.22 + 0.8;
        ring.alpha *= 0.86; // Wygaszanie przezroczystości

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(204, 255, 0, ${ring.alpha * 0.65})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Usuwanie pierścienia, gdy całkowicie zgaśnie lub osiągnie limit rozmiaru
        if (ring.alpha < 0.02 || ring.radius >= ring.maxRadius) {
          rings.splice(i, 1);
        }
      }

      // --- KROK B: Fizyka i rysowanie iskier wybuchu ---
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; // Ruch w osi X
        p.y += p.vy; // Ruch w osi Y
        p.vx *= 0.92; // Symulacja oporu powietrza w osi X
        p.vy *= 0.92; // Symulacja oporu powietrza w osi Y
        p.alpha *= 0.88; // Wygaszanie blasku iskry

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

        // Usunięcie wygasłej iskry z pamięci
        if (p.alpha < 0.02) {
          particles.splice(i, 1);
        }
      }

      // --- KROK C: Fizyka i rysowanie ogona komety ---
      // Stopniowe wygaszanie punktów ogona
      for (let i = 0; i < points.length; i++) {
        points[i].alpha *= 0.88;
      }
      // Usuwanie najstarszych punktów z początku tablicy, które już zgasły
      while (points.length > 0 && points[0].alpha < 0.02) {
        points.shift();
      }

      // Łączenie kolejnych punktów w gładką, zwężającą się linię ogona
      if (points.length > 1) {
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];
          // Współczynnik odległości w ogonie: 0.0 (koniec ogona) do 1.0 (przy głowie komety)
          const factor = i / points.length;
          const lineWidth = Math.max(0.5, factor * 2.5); // Zwężanie ku końcowi

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(204, 255, 0, ${p1.alpha * 0.45})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round'; // Zaokrąglone łączenia zapobiegają kanciastym załamaniom
          ctx.stroke();
        }
      }

      // --- KROK D: Rysowanie świecącej głowy komety ---
      if (mouseRef.current.active) {
        const { x, y } = mouseRef.current;

        // 1. Zewnętrzna poświata radialna (Acid Lime glow)
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, 'rgba(204, 255, 0, 0.55)');
        gradient.addColorStop(1, 'rgba(204, 255, 0, 0)');

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // 2. Ostry, centralny biały rdzeń komety
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // Planujemy wywołanie kolejnej klatki przez silnik przeglądarki
      animationFrameId = requestAnimationFrame(render);
    };

    // Start pętli renderującej
    animationFrameId = requestAnimationFrame(render);

    // -------------------------------------------------------------
    // FUNKCJA SPRZĄTAJĄCA (CLEANUP)
    // Rola: Zwalnia pamięć podręczną przy odmontowywaniu komponentu.
    // Zatrzymuje pętlę i usuwa globalne zdarzenia myszy i okna.
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []); // Pusta tablica zależności – efekt montuje się dokładnie raz

  // Zwracamy przezroczyste płótno na całe okno (pointer-events-none przepuszcza kliknięcia)
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999999] hidden md:block"
    />
  );
}
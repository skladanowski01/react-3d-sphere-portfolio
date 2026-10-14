export interface WordItem {
  id: number;
  label: string;
  category: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  projectUrl?: string;
}

export const WORDS_DATA: WordItem[] = [
  {
    id: 1,
    label: "O Mnie",
    category: "BIO",
    description: "Sprawiam, że design działa. Koduję, animuję i testuję z myślą o ludziach. Zaczynałem od grafiki i marketingu, ale to w kodzie znalazłem swoje miejsce. Po 3 latach studiów z grafiki komputerowej i 2 latach pracy w agencjach przerzuciłem się na pisanie kodu. Robię to w wolnym czasie już od kilku miesięcy. Mam giga zajawkę na programowanie z użyciem platformy GSAP. Jest ona dla mnie skomplikowana, ale się nie poddaje. Codziennie szkole swoje umiejętności w pisaniu kodu. Używam AI jako narzędzia do pomocy, wcześniej towarzyszył mi StackOverFlow. W wolnym czasie spędzam czas na świeżym powietrzu. Grywam w gry komputerowe. Wiedźmin 3 to faworyt wśród gier. Lubię też grać w DOTA2. Uwielbiam zabawe ze swoimi dziećmi.",
    videoUrl: "/video/WorkInProgress.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 2,
    label: "Sphere Nav 3D",
    category: "REACT / CANVAS",
    description: "Matematyczne rzutowanie trójwymiarowych współrzędnych sfery na płaszczyznę 2D z synchronizacją Canvas i przycisków DOM.",
    videoUrl: "/video/SphereNav3D.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 3,
    label: "Design & Emocje",
    category: "UI / UX",
    description: "Projektowanie oparte na psychologii percepcji, hierarchii wizualnej i budowaniu zaangażowania użytkownika.",
    videoUrl: "/video/DesignEmocje.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 4,
    label: "GSAP Interactions",
    category: "ANIMACJE",
    description: "Kinetyczna typografia, płynne timeliny i choreografia elementów wejściowych inspirowana serwisem Awwwards.",
    videoUrl: "/video/GsapInteractions.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 5,
    label: "QA & Testing",
    category: "JAKOŚĆ",
    description: "Weryfikacja zachowania responsywnego, audyty dostępności cyfrowej i prewencja regresji w aplikacjach webowych.",
    videoUrl: "/video/QATesting.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 6,
    label: "Tailwind CSS",
    category: "STYLING",
    description: "Modułowe kompozycje klas narzędziowych, responsywne breakpointy i minimalistyczne motywy ciemne.",
    videoUrl: "video/TailwindCSS.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 7,
    label: "Clean Code",
    category: "ARCHITEKTURA",
    description: "Dekompozycja komponentów, precyzyjne typowanie w TypeScript i optymalizacja cyklu życia renderowania.",
    videoUrl: "/video/CleanCode.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 8,
    label: "Vite Environment",
    category: "TOOLING",
    description: "Błyskawiczny bundling modułów ESM i bezstratna konfiguracja środowiska frontendowego.",
    videoUrl: "/video/ViteEnvironment.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 9,
    label: "Responsive Flow",
    category: "MOBILE FIRST",
    description: "Płynne skalowanie geometrii 3D na ekranach o ograniczonej przestrzeni roboczej.",
    videoUrl: "/video/ResponsiveFlow.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 10,
    label: "Micro-UX",
    category: "DETALE",
    description: "Subtelne reakcje na ruch kursora, stany aktywności i dotykowe sprzężenie zwrotne.",
    videoUrl: "/video/MicroUX.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 11,
    label: "TypeScript Strict",
    category: "BEZPIECZEŃSTWO",
    description: "Statyczna kontrola typów parametrów sfery, zdarzeń wskaźnika i struktur danych projektów.",
    videoUrl: "/video/TypeScriptStrict.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 12,
    label: "Dark Aesthetic",
    category: "PALETA",
    description: "Wysokokontrastowa estetyka z głębokimi cieniami i akcentami Acid Lime oraz Emerald.",
    videoUrl: "/video/DarkAesthetic.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 13,
    label: "Inertia Drag",
    category: "FIZYKA",
    description: "Symulacja masy i tarcia przy swobodnym obracaniu sfery z wygaszaniem prędkości kątowej.",
    videoUrl: "/video/InteriaDrag.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 14,
    label: "Canvas Rendering",
    category: "WYDAJNOŚĆ",
    description: "Optymalizacja rysowania geometrii wireframe z uwzględnieniem Device Pixel Ratio ekranu.",
    videoUrl: "/video/CanvasRendering.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 15,
    label: "State Separation",
    category: "REACT",
    description: "Czysty podział odpowiedzialności między stanem globalnym nawigacji a widokami szczegółowymi.",
    videoUrl: "/video/StateSeparation.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 16,
    label: "Awwwards Standard",
    category: "INSPIRACJA",
    description: "Nietypowe koncepcje nawigacyjne wyróżniające się spośród klasycznych szablonów stron.",
    videoUrl: "/video/AwwwardsStandard.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 17,
    label: "Clipboard Utilities",
    category: "KOMFORT",
    description: "Jednoklikowe kopiowanie namiarów kontaktowych z natychmiastową informacją zwrotną w interfejsie.",
    videoUrl: "/video/ClipboardUtilities.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 18,
    label: "Event Isolation",
    category: "STABILNOŚĆ",
    description: "Prewencja kolizji zdarzeń dotykowych i propagacji kliknięć między warstwami z-index.",
    videoUrl: "/video/EventIsolation.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 19,
    label: "Spherical Math",
    category: "GEOMETRIA",
    description: "Rozkład punktów w oparciu o równoleżniki i kąty azymutalne dla symetrycznej kompozycji.",
    videoUrl: "/video/SphericalMath.mp4",
    projectUrl: "https://github.com/skladanowski01"
  },
  {
    id: 20,
    label: "Continuous Polish",
    category: "PROCES",
    description: "Ciągła iteracja nad płynnością interakcji, czasem reakcji oraz ergonomią przeglądania.",
    videoUrl: "video/ContinuousPolish.mp4",
    projectUrl: "https://github.com/skladanowski01"
  }
];
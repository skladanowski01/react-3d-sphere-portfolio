export default function Header() {
  return (
    <header className="z-20 flex flex-col items-center justify-center w-full px-4 pt-6 pb-2 text-center pointer-events-none select-none">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-surface border border-theme-border-accent text-theme-accent text-xs font-medium tracking-normal mb-1.5 shadow-[0_0_15px_var(--theme-accent-dim)]">
        <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
        Freelance
      </div>

      <h1 className="text-xl font-black tracking-tight uppercase sm:text-2xl text-theme-text-primary">
        Website designer & Developer
      </h1>
      
      <p className="text-xs text-theme-text-muted font-normal mt-0.5">
        Tworze interaktywne strony internetowe.
      </p>
    </header>
  );
}
import { useState } from 'react';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = 'pawel.skladanowski01@gmail.com';
  const phone = '536528948';
  const currentYear = new Date().getFullYear();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="z-20 flex flex-col items-center justify-between w-full gap-3 px-4 py-3 pb-6 text-xs border-t pointer-events-auto select-none sm:px-6 sm:flex-row border-zinc-800/80 bg-black/80 backdrop-blur-md text-zinc-400">
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-zinc-900 border border-zinc-800 shadow-lg">
        <button
          type="button"
          onClick={handleCopyEmail}
          className={`px-3 py-1 text-[11px] font-medium rounded-full transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'hover:bg-white/10 hover:text-white text-zinc-300'
          }`}
        >
          {copied ? '✓ Skopiowano email' : 'Skopiuj email'}
        </button>

        <span className="text-zinc-600">•</span>

        <a
          href={`mailto:${email}`}
          className="px-2.5 py-1 text-[11px] rounded-full hover:bg-white/10 hover:text-white transition-colors text-zinc-300"
        >
          Napisz
        </a>

        <span className="text-zinc-600">•</span>

        <a
          href={`tel:${phone}`}
          className="px-2.5 py-1 text-[11px] rounded-full hover:bg-white/10 hover:text-white transition-colors text-zinc-300"
        >
          Zadzwoń
        </a>
      </div>

      <div className="text-[11px] tracking-wide uppercase text-zinc-500 order-last sm:order-none">
        © {currentYear} Paweł Składanowski. Wszelkie prawa zastrzeżone.
      </div>

      <div className="flex items-center gap-4 text-[12px]">
        <a
          href="https://github.com/skladanowski01"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-lime-400"
        >
          GitHub
        </a>
        <span className="text-zinc-700">/</span>
        <a
          href="https://www.linkedin.com/in/skladanowski/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-lime-400"
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
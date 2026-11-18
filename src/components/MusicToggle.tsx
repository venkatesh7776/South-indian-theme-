"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAudio } from "./AudioProvider";
import { OPEN_EVENT } from "./OpeningGate";

/** Dolu-drum music control. Both instances share the same audio state. */
export function MusicToggle({ variant = "float" }: { variant?: "float" | "inline" }) {
  const { playing, muted, toggle } = useAudio();
  const on = playing && !muted;
  const label = on ? "Mute music" : "Unmute music";
  // the floating button stays hidden on the opening screen
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (!document.documentElement.classList.contains("gate-closed")) setOpened(true);
    const show = () => setOpened(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  if (variant === "inline")
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        aria-pressed={on}
        className="inline-flex items-center gap-3 rounded-full border border-[var(--gold)] px-5 py-2.5 text-[#fbe9c8] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--turmeric)]"
      >
        <img src="/assets/il-dolu.webp" alt="" className="h-6 w-6 object-contain" />
        <span className="t-caps text-[0.62rem]">{on ? "Music on" : "Music off"}</span>
      </button>
    );

  if (!opened) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={on}
      title={label}
      className="fixed bottom-5 right-5 z-[60] grid h-16 w-16 place-items-center rounded-full border-2 border-[var(--gold-light)] bg-[radial-gradient(circle_at_35%_30%,#fff8e8,#f5dfb4)] shadow-[0_12px_28px_-10px_rgba(125,68,51,0.6)] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--turmeric)] sm:bottom-7 sm:right-7"
    >
      <img src="/assets/il-dolu.webp" alt="" className={`h-10 w-10 object-contain ${on ? "" : "opacity-70 grayscale-[0.3]"}`} />
      {/* sound waves while playing */}
      {on && (
        <svg viewBox="0 0 24 24" className="absolute -right-0.5 top-1 h-6 w-6" aria-hidden>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${8 + i * 4},${8 - i * 2} q${3 + i},${4 + i * 2} 0,${8 + i * 4}`}
              fill="none"
              stroke="var(--kumkum)"
              strokeWidth="1.8"
              strokeLinecap="round"
              style={{ animation: `glow-pulse 1.2s ${i * 0.2}s ease-in-out infinite` }}
            />
          ))}
        </svg>
      )}
      {/* slash when muted */}
      {!on && (
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M16 16 L48 48" stroke="var(--kumkum)" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

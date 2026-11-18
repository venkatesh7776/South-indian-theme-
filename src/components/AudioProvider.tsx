"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type AudioCtx = {
  playing: boolean;
  muted: boolean;
  start: () => void;
  toggle: () => void;
};

const Ctx = createContext<AudioCtx | null>(null);
const KEY = "pellipilupu-muted";
const TARGET_VOL = 0.7;

/** One shared <audio> element for the whole visit — never restarts on navigation. */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    try {
      setMuted(sessionStorage.getItem(KEY) === "1");
    } catch {}
  }, []);

  const fadeTo = (el: HTMLAudioElement, to: number, ms = 1200) => {
    const from = el.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      // rAF timestamps can precede t0 slightly, so clamp both ends
      const k = Math.max(0, Math.min(1, (t - t0) / ms));
      el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // "Open Invitation" is an explicit request for music: always unmute and play.
  const start = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = false;
    setMuted(false);
    try {
      sessionStorage.setItem(KEY, "0");
    } catch {}
    el.volume = 0.05;
    const p = el.play();
    setPlaying(true);
    p.then(() => fadeTo(el, TARGET_VOL, 2200)).catch(() => setPlaying(false)); // blocked: the drum button can start it
  }, []);

  const toggle = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // If playback never started (blocked), the button starts it.
    if (el.paused) {
      el.muted = false;
      setMuted(false);
      try {
        sessionStorage.setItem(KEY, "0");
      } catch {}
      el.volume = 0;
      el.play().then(() => {
        setPlaying(true);
        fadeTo(el, TARGET_VOL);
      });
      return;
    }
    const next = !el.muted;
    el.muted = next;
    setMuted(next);
    try {
      sessionStorage.setItem(KEY, next ? "1" : "0");
    } catch {}
  }, []);

  return (
    <Ctx.Provider value={{ playing, muted, start, toggle }}>
      <audio ref={ref} src="/audio/wedding-music.mp3" loop preload="auto" />
      {children}
    </Ctx.Provider>
  );
}

export function useAudio() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAudio must be used inside AudioProvider");
  return c;
}

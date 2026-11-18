"use client";

import { useEffect, useMemo, useState } from "react";
import { countdown, wedding } from "@/content/wedding";
import { kolamChainTile } from "@/lib/patterns";
import { KolamBand, Muggu } from "../ui";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { Days: Math.floor(s / 86400), Hours: Math.floor((s % 86400) / 3600), Minutes: Math.floor((s % 3600) / 60), Seconds: s % 60 };
}

/** Countdown on maroon, woven with chikku-kolam — like a Telugu invitation card. */
export function Countdown() {
  const target = new Date(wedding.muhurtham).getTime();
  const [now, setNow] = useState<number | null>(null);
  const knot = useMemo(() => kolamChainTile("#f7e9d2"), []);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const left = now === null ? null : target - now;
  const p = parts(left ?? 0);
  const passed = left !== null && left <= 0;
  const muhurthamLabel = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(wedding.muhurtham)) + " IST";

  return (
    <section id="countdown" className="relative overflow-hidden bg-[var(--maroon-band)] text-[#fff3df]">
      <KolamBand fringe="bottom" />

      {/* woven kolam field */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: knot.url, backgroundSize: "56px auto" }} aria-hidden />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center sm:py-32">
        <Muggu className="mb-6 w-16 opacity-90" color="var(--gold-light)" />
        <div className="flex flex-col items-center" data-reveal-lines>
          <p className="sec-eyebrow mb-3" style={{ color: "var(--gold-light)" }}>
            Muhurtham
          </p>
          <h2 className="sec-title text-[2.2rem] sm:text-[3.8rem]" style={{ color: "#fff3df" }}>
            {countdown.title}
          </h2>
          <p className="mt-3 text-[1.1rem] italic text-[#fbe9c8]/90">{countdown.subtitle}</p>
        </div>

        <div className="mt-12 grid w-full max-w-2xl grid-cols-4 gap-2 sm:gap-4" role="timer" aria-live="off">
          {Object.entries(p).map(([k, v]) => (
            <div key={k} data-reveal className="rounded-xl border border-[var(--gold-light)]/70 bg-[#4a1216] py-4 shadow-[inset_0_1px_0_rgba(255,230,190,0.12),0_14px_28px_-16px_rgba(0,0,0,0.7)] sm:py-7">
              <div className="t-display text-[2rem] tabular-nums text-[#fff3df] sm:text-[3.6rem]">{now === null ? "--" : String(v).padStart(2, "0")}</div>
              <div className="t-caps mt-1.5 text-[0.55rem] text-[#f3d99b] sm:text-[0.7rem]">{k}</div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[1.05rem] text-[#fbe9c8]/90">{passed ? "The sacred knot has been tied — thank you for your blessings." : `Muhurtham · ${muhurthamLabel}`}</p>
      </div>

      <KolamBand fringe="top" />
    </section>
  );
}

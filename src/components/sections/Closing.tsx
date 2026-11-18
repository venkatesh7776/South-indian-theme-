"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { closing, couple, wedding } from "@/content/wedding";
import { MusicToggle } from "../MusicToggle";
import { KolamBand, KolamColumn } from "../ui";
import { kolamChainTile } from "@/lib/patterns";

const knot = kolamChainTile("#f7e9d2");

gsap.registerPlugin(ScrollTrigger);

const LINKS = [
  ["The Couple", "#couple"],
  ["Celebrations", "#journey"],
  ["Muhurtham", "#countdown"],
  ["Moments", "#moments"],
  ["Venue", "#location"],
  ["RSVP", "#rsvp"],
];

/** The same gopuram at dusk, then a footer in the style of a Telugu invitation card. */
export function Closing() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".c-gopuram", { yPercent: 22 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".c-scene", start: "top bottom", end: "bottom bottom", scrub: 0.8 } });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} id="closing" className="relative">
      <div className="c-scene relative h-[100svh] overflow-hidden">
        <img src="/assets/sky-dusk-wide.webp" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-x-0 top-0 h-[62%] bg-[linear-gradient(180deg,var(--cream)_0%,var(--cream)_38%,rgba(251,243,226,0.75)_62%,transparent_100%)]" />

        <div className="relative z-10 flex flex-col items-center px-6 pt-24 text-center" data-reveal>
          <p className="sec-eyebrow mb-3">{closing.blessing}</p>
          <h2 className="sec-title">{closing.title}</h2>
          <p className="sec-sub mt-3">{closing.line}</p>
        </div>

        <div className="absolute bottom-0 left-1/2 h-[62%] -translate-x-1/2 sm:h-[68%]">
          <img src="/assets/gopuram-dusk.webp" alt="Srikalahasti Rajagopuram at dusk" className="c-gopuram h-full w-auto max-w-none" loading="lazy" />
        </div>
      </div>

      <KolamBand fringe="bottom" />
      <div className="relative bg-[var(--maroon-band)] text-[#fbe9c8]">
        {/* faint woven kolam inside the footer */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: knot.url, backgroundSize: "56px auto" }} aria-hidden />
        <KolamColumn className="absolute inset-y-0 left-3 hidden w-[34px] opacity-80 md:block" />
        <KolamColumn className="absolute inset-y-0 right-3 hidden w-[34px] opacity-80 md:block" />

        <div className="mx-auto flex max-w-3xl flex-col items-center px-8 py-16 text-center">
          <p className="t-caps text-[0.66rem] text-[var(--gold-light)]">{closing.signoff}</p>
          <p className="t-display mt-3 text-[2.8rem] text-[#fff1d6] sm:text-[3.8rem]">
            {couple.groom.short} &amp; {couple.bride.short}
          </p>
          <p className="t-caps mt-4 text-[0.66rem] text-[var(--gold-light)]">
            {wedding.dateLabel} · {wedding.venue}, {wedding.city.split(",")[0]}
          </p>

          <nav className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3" aria-label="Sections">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} className="t-caps text-[0.62rem] text-[#fbe9c8]/80 transition-colors hover:text-[var(--gold-light)]">
                {label}
              </a>
            ))}
          </nav>

          <div className="mt-10">
            <MusicToggle variant="inline" />
          </div>
          <p className="mt-10 text-[0.9rem] text-[#fbe9c8]/60">{closing.credit}</p>
        </div>
      </div>
      <KolamBand fringe="top" />
    </footer>
  );
}

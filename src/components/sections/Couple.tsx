"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { couple, coupleIntro, opening } from "@/content/wedding";
import { fringeTile, kolamChainTile } from "@/lib/patterns";
import { Photo } from "../ui";

gsap.registerPlugin(ScrollTrigger);

/** Turned brass finial for the top rod. */
function Finial({ side }: { side: "l" | "r" }) {
  return (
    <svg viewBox="0 0 40 30" className={`h-[30px] w-10 shrink-0 ${side === "l" ? "-scale-x-100" : ""}`} aria-hidden>
      <defs>
        <linearGradient id={`fin-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e1a6" />
          <stop offset="0.4" stopColor="#c99a45" />
          <stop offset="1" stopColor="#6e4a14" />
        </linearGradient>
      </defs>
      <rect x="0" y="9" width="7" height="12" rx="2" fill={`url(#fin-${side})`} />
      <circle cx="11" cy="15" r="5" fill={`url(#fin-${side})`} />
      <path d="M15 8 L27 8 Q40 15 27 22 L15 22 Q18 15 15 8Z" fill={`url(#fin-${side})`} />
    </svg>
  );
}

/** Polished rosewood rod with brass finials (the scroll hangs from it). */
function TopRod() {
  return (
    <div className="relative z-20 flex items-center">
      <Finial side="l" />
      <div className="h-[20px] flex-1 rounded-full bg-[linear-gradient(180deg,#9a5a3c_0%,#5e2c1a_45%,#3a170c_100%)] shadow-[0_8px_14px_-6px_rgba(40,15,5,0.7)]" />
      <Finial side="r" />
    </div>
  );
}

/**
 * Section 2 — an illustrated paper scroll that starts unrolling the moment the
 * section enters the screen, then holds open (pinned) with the couple inside.
 */
export function Couple() {
  const root = useRef<HTMLElement>(null);
  const chainH = useMemo(() => kolamChainTile("#f7e9d2"), []);
  const chainV = useMemo(() => kolamChainTile("#f7e9d2", true), []);
  const fringe = useMemo(() => fringeTile("#f7e9d2", true), []);

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const paper = q(".sc-paper")[0] as HTMLElement;
      const build = (trigger: gsap.DOMTarget, start: string, end: string, fadeContent: boolean) => {
        gsap.set(paper, { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(q(".sc-roll"), { y: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger, start, end, scrub: 0.8, invalidateOnRefresh: true },
        });
        tl.to(paper, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7 }, 0).to(q(".sc-roll"), { y: () => paper.offsetHeight, duration: 0.7 }, 0);
        // content appears line by line as the paper passes it — from the first scroll
        if (fadeContent) {
          gsap.set(q(".sc-reveal"), { opacity: 0, y: 14 });
          tl.to(q(".sc-reveal"), { opacity: 1, y: 0, duration: 0.18, stagger: 0.09, ease: "power2.out" }, 0.04);
        }
      };
      const mm = gsap.matchMedia();
      // desktop: starts the moment the section enters, finishes as it pins, then releases
      mm.add("(min-width: 640px)", () => build(el, "top 85%", "bottom bottom", true));
      // mobile: no pin — the paper unrolls as you scroll past it
      mm.add("(max-width: 639px)", () => build(paper, "top 90%", "bottom 80%", false));
      return () => mm.revert();
    }, el);
    return () => ctx.revert();
  }, []);

  const people = [
    { ...couple.groom, label: couple.groom.parentsLabel },
    { ...couple.bride, label: couple.bride.parentsLabel },
  ];

  return (
    <section ref={root} id="couple" className="relative z-[3] py-16 sm:h-[175svh] sm:py-0">
      <div className="flex items-center justify-center sm:sticky sm:top-0 sm:h-[100svh] sm:overflow-hidden">
        <div className="relative w-[min(94vw,880px)]">
          <TopRod />

          {/* paper — unrolls via clip-path */}
          <div className="sc-paper relative z-10 mx-[24px] -mt-[6px] sm:mx-[28px]">
            {/* handmade ivory paper with a little warmth near the rods */}
            <div className="absolute inset-0 bg-[#f8eedb]" style={{ backgroundImage: "url(/assets/paper.webp)", backgroundSize: "520px" }} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(90,50,20,0.22)_0%,transparent_5%,transparent_95%,rgba(90,50,20,0.18)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(90,50,20,0.10),transparent_6%,transparent_94%,rgba(90,50,20,0.10))]" />

            {/* maroon kolam border (reference card style) */}
            <div className="absolute inset-x-0 top-0 h-[46px] bg-[var(--maroon-band)]">
              <div className="h-[30px] bg-repeat-x" style={{ backgroundImage: chainH.url, backgroundSize: "auto 26px", backgroundPosition: "center 3px" }} />
              <div className="h-[16px] bg-repeat-x" style={{ backgroundImage: fringe.url, backgroundSize: "28px 16px" }} />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-[30px] bg-[var(--maroon-band)] bg-repeat-x" style={{ backgroundImage: chainH.url, backgroundSize: "auto 26px", backgroundPosition: "center 2px" }} />
            <div className="absolute bottom-[30px] left-0 top-[46px] w-[30px] bg-[var(--maroon-band)] bg-repeat-y" style={{ backgroundImage: chainV.url, backgroundSize: "26px auto", backgroundPosition: "2px top" }} />
            <div className="absolute bottom-[30px] right-0 top-[46px] w-[30px] bg-[var(--maroon-band)] bg-repeat-y" style={{ backgroundImage: chainV.url, backgroundSize: "26px auto", backgroundPosition: "2px top" }} />

            <div className="relative flex flex-col items-center px-10 pb-10 pt-14 text-center sm:px-16 sm:pb-14 sm:pt-[72px]">
              <div
                className="sc-reveal h-11 w-11 bg-[var(--maroon-band)] sm:h-14 sm:w-14"
                style={{ WebkitMask: "url(/assets/ganesh.webp) center/contain no-repeat", mask: "url(/assets/ganesh.webp) center/contain no-repeat" }}
              />
              <p className="sc-reveal t-caps mt-2 text-[0.6rem] text-[var(--brass)]">{opening.invocation}</p>
              <h2 className="sc-reveal t-display mt-3 text-[2.3rem] text-[var(--maroon-band)] sm:text-[3.4rem]">{coupleIntro.title}</h2>
              <p className="sc-reveal mt-2 text-[1rem] italic text-[var(--ink)]/80 sm:text-[1.1rem]">{coupleIntro.subtitle}</p>

              <div className="mt-8 grid w-full grid-cols-1 gap-12 sm:mt-8 sm:grid-cols-2 sm:gap-10">
                {people.map((p) => (
                  <div key={p.full} className="sc-reveal flex flex-col items-center text-center">
                    <div className="shrink-0 rounded-[14px] border border-[var(--maroon-band)]/60 p-1">
                      <Photo src={p.photo} alt={p.full} className="aspect-[4/5] w-[58vw] max-w-[260px] rounded-[10px] object-[50%_25%] sm:aspect-auto sm:h-[min(26svh,230px)] sm:w-[min(24vw,200px)] sm:max-w-none" eager />
                    </div>
                    <div>
                      <p className="t-display mt-4 text-[1.7rem] leading-tight text-[var(--maroon-band)] sm:text-[2rem]">{p.full}</p>
                      <p className="t-caps mt-2 text-[0.6rem] text-[var(--brass)]">{p.label}</p>
                      <p className="mt-1 text-[1rem] leading-snug text-[var(--ink)] sm:text-[1.05rem]">{p.parents}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* the paper roll rides down as it unrolls */}
          <div className="sc-roll absolute inset-x-0 top-[20px] z-20">
            <TopRod />
          </div>
        </div>
      </div>
    </section>
  );
}

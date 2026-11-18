"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { couple, opening, wedding } from "@/content/wedding";
import { useAudio } from "./AudioProvider";
import { Muggu } from "./ui";
import { kolamChainTile } from "@/lib/patterns";
import MUGGU from "@/lib/muggu-trace.json";

export const OPEN_EVENT = "invitation:open";

/* ── the reference mandala muggu, traced to vectors (tools/trace_muggu.py) ── */
const DOTS = [...MUGGU.dots].sort((a, b) => Math.hypot(a.x - 500, a.y - 500) - Math.hypot(b.x - 500, b.y - 500));
const STROKE = MUGGU.strokeWidth * 0.8;

/**
 * Minimal opening screen. On "Open Invitation": the card fades away, the pulli
 * dots of the mandala muggu appear (rippling out from the centre), then its
 * lines are drawn end to end — every line finishing together — it glows, and
 * the page blooms into the temple scene.
 */
export function OpeningGate() {
  const { start } = useAudio();
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const chainH = useMemo(() => kolamChainTile("#f7e9d2"), []);
  const chainV = useMemo(() => kolamChainTile("#f7e9d2", true), []);

  const open = () => {
    start();
    const finish = () => {
      document.documentElement.classList.remove("gate-closed");
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event(OPEN_EVENT));
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      setGone(true);
      return;
    }
    const svg = svgRef.current!;
    const q = gsap.utils.selector(svg);
    const lines = Array.from(svg.querySelectorAll<SVGPathElement>("path"));
    const lens = lines.map((p) => p.getTotalLength());
    const longest = Math.max(...lens);
    lines.forEach((p, i) => gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }));
    gsap.set(q("circle"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box" });

    const DRAW = 3.2; // seconds for the whole muggu to be drawn
    const tl = gsap
      .timeline({ onComplete: () => setGone(true) })
      .to(content.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" })
      .to(root.current!.querySelectorAll(".gate-frame"), { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2")
      .set(svg, { autoAlpha: 1 })
      // 1. dots first — rippling out from the centre
      .to(q("circle"), { scale: 1, duration: 0.35, stagger: { each: 0.025 }, ease: "back.out(3)" }, "+=0.1")
      .addLabel("draw", "+=0.15");
    // 2. then the curves, drawn end to end; each line paced to its length so all finish together
    lines.forEach((p, i) => {
      const dur = DRAW * Math.pow(lens[i] / longest, 0.35);
      tl.to(p, { strokeDashoffset: 0, duration: dur, ease: "none" }, `draw+=${DRAW - dur}`);
    });
    tl      .to(svg, { filter: "drop-shadow(0 0 8px rgba(233,178,30,0.7)) drop-shadow(0 0 22px rgba(233,178,30,0.35))", scale: 1.04, duration: 0.6, ease: "power2.out" }, "+=0.15")
      .to(bloom.current, { opacity: 1, duration: 0.7, ease: "power2.in" }, "-=0.15")
      .to(svg, { opacity: 0, duration: 0.6 }, "<0.2")
      .add(finish)
      .to(root.current, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, "-=0.1");
  };

  if (gone) return null;

  return (
    <div ref={root} className="fixed inset-0 z-50 overflow-hidden bg-[var(--cream)]" style={{ backgroundImage: "url(/assets/paper.webp)", backgroundSize: "640px" }} role="dialog" aria-label="Wedding invitation">
      {/* during the muggu animation the same kolam row frames the top, left and right too */}
      <div className="gate-frame pointer-events-none absolute inset-x-0 top-0 z-20 h-[30px] bg-[var(--maroon-band)] bg-repeat-x opacity-0" style={{ backgroundImage: chainH.url, backgroundSize: "auto 24px", backgroundPosition: "center 3px" }} aria-hidden />
      <div className="gate-frame pointer-events-none absolute bottom-0 left-0 top-0 z-20 w-[30px] bg-[var(--maroon-band)] bg-repeat-y opacity-0" style={{ backgroundImage: chainV.url, backgroundSize: "24px auto", backgroundPosition: "3px top" }} aria-hidden />
      <div className="gate-frame pointer-events-none absolute bottom-0 right-0 top-0 z-20 w-[30px] bg-[var(--maroon-band)] bg-repeat-y opacity-0" style={{ backgroundImage: chainV.url, backgroundSize: "24px auto", backgroundPosition: "3px top" }} aria-hidden />
      {/* a single row of chikku-kolam along the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[30px] bg-[var(--maroon-band)] bg-repeat-x" style={{ backgroundImage: chainH.url, backgroundSize: "auto 24px", backgroundPosition: "center 3px" }} aria-hidden />

      <div ref={content} className="absolute inset-0">
        {/* straight thoranam on the top edge */}
        <div className="absolute inset-x-0 -top-[4px] h-[clamp(56px,7vw,96px)]" style={{ backgroundImage: "url(/assets/il-thoranam.webp)", backgroundRepeat: "repeat-x", backgroundSize: "auto 100%" }} />

        {/* small muggus arranged in the side margins */}
        {[
          { top: "26%", size: "w-14 sm:w-20", o: "opacity-50" },
          { top: "48%", size: "w-10 sm:w-14", o: "opacity-35" },
          { top: "66%", size: "w-14 sm:w-20", o: "opacity-50" },
        ].map((m, i) => (
          <div key={i} className="pointer-events-none absolute inset-x-[14px] flex justify-between sm:inset-x-[9vw]" style={{ top: m.top }} aria-hidden>
            <Muggu className={`${m.size} ${m.o}`} color={i === 1 ? "var(--rose)" : "var(--gold)"} />
            <Muggu className={`${m.size} ${m.o}`} color={i === 1 ? "var(--rose)" : "var(--gold)"} />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col items-center justify-center px-12 pb-[clamp(60px,8vw,110px)] pt-[clamp(60px,8vw,110px)] text-center">
          <img src="/assets/ganesh.webp" alt="Lord Ganesha" className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
          <p className="t-caps mt-3 text-[0.68rem] text-[var(--brass)]">{opening.invocation}</p>
          <div className="my-5 flex items-center gap-2" aria-hidden>
            <span className="h-px w-12 bg-[var(--gold)]" />
            <Muggu className="w-4" />
            <span className="h-px w-12 bg-[var(--gold)]" />
          </div>
          <p className="t-caps text-[0.66rem] text-[var(--ink)]">You are invited to the wedding of</p>
          <h1 className="mt-4 flex flex-col items-center">
            <span className="t-display text-[2.9rem] sm:text-[4rem]">{couple.groom.short}</span>
            <span className="t-caps my-2 text-[0.75rem] text-[var(--brass)]">weds</span>
            <span className="t-display text-[2.9rem] sm:text-[4rem]">{couple.bride.short}</span>
          </h1>
          <p className="t-caps mt-5 text-[0.7rem] text-[var(--ink)]">{wedding.dateLabel}</p>
          <button type="button" onClick={open} className="btn-primary mt-9">
            {opening.cta}
          </button>
        </div>
      </div>

      {/* the muggu that draws itself */}
      <svg ref={svgRef} viewBox={MUGGU.viewBox} className="invisible absolute left-1/2 top-1/2 h-[min(78vw,62vh)] w-[min(78vw,62vh)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
        <g fill="none" stroke="var(--maroon-band)" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
          {MUGGU.paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {DOTS.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r * 0.9} fill="var(--maroon-band)" />
        ))}
      </svg>

      {/* warm bloom that hands over to the hero */}
      <div ref={bloom} className="pointer-events-none absolute inset-0 opacity-0" style={{ background: "radial-gradient(circle at 50% 50%, #fde9c8 0%, #f6d3ae 45%, #efc39d 100%)" }} />
    </div>
  );
}

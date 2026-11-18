"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { couple, opening, wedding } from "@/content/wedding";
import { useAudio } from "./AudioProvider";
import { Muggu } from "./ui";
import { kolamChainTile } from "@/lib/patterns";

export const OPEN_EVENT = "invitation:open";

/* ── pulli-kolam geometry (viewBox 0 0 200 200) ── */
const C = 100;
const R = 62; // centre → outer (axis) dots
const r = 30; // centre → inner (diagonal) dots
const petal = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  const tip = { x: C + Math.cos(a) * R, y: C + Math.sin(a) * R };
  const w = 15;
  const nx = -Math.sin(a) * w;
  const ny = Math.cos(a) * w;
  const m1 = { x: C + Math.cos(a) * R * 0.5, y: C + Math.sin(a) * R * 0.5 };
  // starts at the centre ring, loops out round the tip and back — one stroke
  const s = { x: C + Math.cos(a) * 9, y: C + Math.sin(a) * 9 };
  return `M${s.x},${s.y} Q${m1.x + nx * 1.6},${m1.y + ny * 1.6} ${tip.x},${tip.y} Q${m1.x - nx * 1.6},${m1.y - ny * 1.6} ${s.x},${s.y}`;
};
const PETALS = [270, 0, 90, 180].map(petal);
const AXIS = [
  [C, C - R],
  [C + R, C],
  [C, C + R],
  [C - R, C],
];
const DIAMOND = AXIS.map((p, i) => {
  const q = AXIS[(i + 1) % 4];
  return `M${p[0]},${p[1]} L${q[0]},${q[1]}`;
});
const RING = `M${C + 9},${C} A9,9 0 1 1 ${C - 9},${C} A9,9 0 1 1 ${C + 9},${C}`;
const DIAG = [
  [C + r, C - r],
  [C + r, C + r],
  [C - r, C + r],
  [C - r, C - r],
];

/**
 * Minimal opening screen. On "Open Invitation" (as in the reference): the card
 * fades away, muggu dots appear one by one, a single line circles the centre,
 * loops out into four petals, joins the outer dots into a diamond, glows —
 * and the page blooms into the temple scene.
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
    svg.querySelectorAll("path").forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    gsap.set(q("circle"), { scale: 0, transformOrigin: "50% 50%", transformBox: "fill-box" });

    gsap
      .timeline({ onComplete: () => setGone(true) })
      .to(content.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" })
      .to(root.current!.querySelectorAll(".gate-frame"), { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.2")
      .set(svg, { autoAlpha: 1 })
      .to(q(".d-c"), { scale: 1, duration: 0.35, ease: "back.out(3)" }, "+=0.15")
      .to(q(".d-o"), { scale: 1, duration: 0.3, stagger: 0.09, ease: "back.out(3)" }, "+=0.05")
      .to(q(".ring"), { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" }, "+=0.1")
      .to(q(".petal"), { strokeDashoffset: 0, duration: 0.42, stagger: 0.36, ease: "power1.inOut" })
      .to(q(".side"), { strokeDashoffset: 0, duration: 0.24, stagger: 0.2, ease: "none" }, "-=0.05")
      .to(svg, { filter: "drop-shadow(0 0 10px rgba(233,178,30,0.95)) drop-shadow(0 0 26px rgba(233,178,30,0.5))", scale: 1.05, duration: 0.6, ease: "power2.out" }, "+=0.1")
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
      <svg ref={svgRef} viewBox="0 0 200 200" className="invisible absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 sm:h-72 sm:w-72" aria-hidden>
        <g fill="none" stroke="var(--gold)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path className="ring" d={RING} />
          {PETALS.map((d, i) => (
            <path key={i} className="petal" d={d} />
          ))}
          {DIAMOND.map((d, i) => (
            <path key={i} className="side" d={d} />
          ))}
        </g>
        <circle className="d-c" cx={C} cy={C} r={2.6} fill="var(--gold)" />
        {[...DIAG, ...AXIS].map(([x, y], i) => (
          <circle key={i} className="d-o" cx={x} cy={y} r={2.6} fill="var(--gold)" />
        ))}
      </svg>

      {/* warm bloom that hands over to the hero */}
      <div ref={bloom} className="pointer-events-none absolute inset-0 opacity-0" style={{ background: "radial-gradient(circle at 50% 50%, #fde9c8 0%, #f6d3ae 45%, #efc39d 100%)" }} />
    </div>
  );
}

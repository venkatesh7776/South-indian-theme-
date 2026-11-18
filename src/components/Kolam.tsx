"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { makeKolam } from "@/lib/kolam";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  cols?: number;
  rows?: number;
  color?: string;
  dotColor?: string;
  strokeWidth?: number;
  className?: string;
  /** rotate 45° into the classic diamond muggu */
  diamond?: boolean;
  /** "scroll" draws when it enters the viewport, "none" renders static */
  draw?: "scroll" | "none";
  duration?: number;
};

/** A chikku muggu: one continuous line woven around a dot grid, drawn like a hand would. */
export function Kolam({
  cols = 3,
  rows = 4,
  color = "var(--maroon)",
  dotColor,
  strokeWidth = 2,
  className = "",
  diamond = false,
  draw = "scroll",
  duration = 2.4,
}: Props) {
  const k = useMemo(() => makeKolam({ cols, rows, cell: 40, loop: 0.42 }), [cols, rows]);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (draw !== "scroll" || !ref.current) return;
    const svg = ref.current;
    const paths = svg.querySelectorAll<SVGPathElement>("path");
    const dots = svg.querySelectorAll<SVGCircleElement>("circle");
    const ctx = gsap.context(() => {
      paths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 85%", once: true } });
      tl.to(dots, { scale: 1, duration: 0.4, stagger: { each: 0.03, from: "center" }, ease: "back.out(2)" });
      tl.to(paths, { strokeDashoffset: 0, duration, ease: "power1.inOut" }, "-=0.1");
    }, svg);
    return () => ctx.revert();
  }, [draw, duration]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${k.width} ${k.height}`}
      className={className}
      style={diamond ? { transform: "rotate(45deg)" } : undefined}
      aria-hidden
    >
      {k.paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {k.dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={strokeWidth * 1.6} fill={dotColor ?? color} />
      ))}
    </svg>
  );
}

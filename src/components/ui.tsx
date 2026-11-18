"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fringeTile, kolamChainTile } from "@/lib/patterns";

gsap.registerPlugin(ScrollTrigger);

/** The hand-drawn chikku muggu, recoloured with any colour. */
export function Muggu({ color = "var(--gold)", className = "", spin = false, style }: { color?: string; className?: string; spin?: boolean; style?: React.CSSProperties }) {
  return <div aria-hidden className={`muggu ${spin ? "spin-slow" : ""} ${className}`} style={{ backgroundColor: color, ...style }} />;
}

export function SectionHeading({ eyebrow, title, sub, light = false }: { eyebrow?: string; title: string; sub?: string; light?: boolean }) {
  return (
    <header className="mx-auto mb-12 flex max-w-3xl flex-col items-center px-5 text-center sm:mb-14" data-reveal-lines>
      {eyebrow && (
        <p className="sec-eyebrow mb-3" style={light ? { color: "var(--gold-light)" } : undefined}>
          {eyebrow}
        </p>
      )}
      <h2 className="sec-title" style={light ? { color: "#fff3df" } : undefined}>
        {title}
      </h2>
      {sub && (
        <p className="sec-sub mt-3" style={light ? { color: "#fbe9c8" } : undefined}>
          {sub}
        </p>
      )}
    </header>
  );
}

export function Ornament({ className = "", color = "var(--gold)" }: { className?: string; color?: string }) {
  return (
    <div className={`my-5 flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span className="h-px w-16" style={{ background: color }} />
      <Muggu className="w-6" color={color} />
      <span className="h-px w-16" style={{ background: color }} />
    </div>
  );
}

/** Maroon border band: scalloped fringe + white chikku-kolam chain (reference card style). */
export function KolamBand({ className = "", fringe = "both" }: { className?: string; fringe?: "both" | "top" | "bottom" | "none" }) {
  const chain = kolamChainTile();
  const down = fringeTile("#f7e9d2", true);
  const up = fringeTile();
  return (
    <div className={`relative bg-[var(--maroon-band)] ${className}`} aria-hidden>
      {(fringe === "both" || fringe === "top") && <div className="h-[18px] bg-repeat-x" style={{ backgroundImage: down.url, backgroundSize: "34px 18px", backgroundPosition: "center top" }} />}
      <div className="border-y border-[#f7e9d2]/70 py-1.5">
        <div className="h-[34px] bg-repeat-x" style={{ backgroundImage: chain.url, backgroundSize: "auto 34px", backgroundPosition: "center" }} />
      </div>
      {(fringe === "both" || fringe === "bottom") && <div className="h-[18px] bg-repeat-x" style={{ backgroundImage: up.url, backgroundSize: "34px 18px", backgroundPosition: "center bottom" }} />}
    </div>
  );
}

/** Vertical kolam chain column (for card/footer sides). */
export function KolamColumn({ className = "", color = "#f7e9d2" }: { className?: string; color?: string }) {
  const chain = kolamChainTile(color, true);
  return <div aria-hidden className={`bg-repeat-y ${className}`} style={{ backgroundImage: chain.url, backgroundSize: "100% auto", backgroundPosition: "center top" }} />;
}

/** @deprecated kept so older imports still compile */
export const TempleStripes = () => <KolamBand />;

/** Photo with graceful fallback while licensed photos are pending. */
export function Photo({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [ok, setOk] = useState(true);
  const ref = useRef<HTMLImageElement>(null);
  // an image can fail before hydration attaches onError — check once mounted
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);
  if (!ok)
    return (
      <div className={`flex flex-col items-center justify-center gap-3 bg-[var(--cream-deep)] text-center ${className}`} role="img" aria-label={`${alt} (photo coming soon)`}>
        <Muggu className="w-16 opacity-60" />
        <span className="t-caps px-3 text-[0.6rem] text-[var(--brass)]">Photo coming soon</span>
      </div>
    );
  return <img ref={ref} src={src} alt={alt} className={`object-cover ${className}`} loading={eager ? "eager" : "lazy"} onError={() => setOk(false)} />;
}

/**
 * Reveal system (runs once per element):
 *  [data-reveal]         — rise + fade, batched so grids stagger naturally
 *  [data-reveal-lines]   — each child rises in turn (section headings)
 *  [data-reveal-img]     — clip-mask wipe while the image settles from a slight zoom
 */
export function Reveals() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(items, { opacity: 0, y: 48 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.15, ease: "power3.out", stagger: 0.12, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-lines]").forEach((el) => {
        const kids = Array.from(el.children);
        gsap.set(kids, { opacity: 0, y: 34 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => gsap.to(kids, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.12 }),
        });
      });

      const imgs = gsap.utils.toArray<HTMLElement>("[data-reveal-img]");
      gsap.set(imgs, { clipPath: "inset(14% 10% 14% 10% round 18px)", opacity: 0.001 });
      imgs.forEach((el) => {
        const inner = el.querySelector("img");
        if (inner) gsap.set(inner, { scale: 1.18 });
      });
      ScrollTrigger.batch(imgs, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { clipPath: "inset(0% 0% 0% 0% round 14px)", opacity: 1, duration: 1.4, ease: "power3.out", stagger: 0.1 });
          batch.forEach((b, i) => {
            const inner = (b as HTMLElement).querySelector("img");
            if (inner) gsap.to(inner, { scale: 1, duration: 1.8, ease: "power3.out", delay: i * 0.1 });
          });
        },
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}

/* ── Talambralu: a shower of turmeric rice ─────────────────────────── */
let canvas: HTMLCanvasElement | null = null;
type Grain = { x: number; y: number; vx: number; vy: number; r: number; spin: number; a: number; life: number; c: string };
const grains: Grain[] = [];
let running = false;

export function riceShower(originX?: number, originY?: number, count = 140) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!canvas) {
    canvas = document.createElement("canvas");
    Object.assign(canvas.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "70" });
    document.body.appendChild(canvas);
  }
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  const ox = originX ?? innerWidth / 2;
  const oy = originY ?? innerHeight * 0.3;
  const colors = ["#E9B21E", "#F2C43A", "#D99A10", "#F6D46A", "#C8102E"];
  for (let i = 0; i < count; i++) {
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
    const sp = 5 + Math.random() * 9;
    grains.push({ x: ox, y: oy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, r: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.3, a: 1, life: 0, c: Math.random() < 0.06 ? colors[4] : colors[(Math.random() * 4) | 0] });
  }
  if (running) return;
  running = true;
  const ctx = canvas.getContext("2d")!;
  const step = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = grains.length - 1; i >= 0; i--) {
      const g = grains[i];
      g.vy += 0.28;
      g.vx *= 0.985;
      g.x += g.vx;
      g.y += g.vy;
      g.r += g.spin;
      g.life++;
      if (g.life > 90) g.a -= 0.03;
      if (g.a <= 0 || g.y > innerHeight + 20) {
        grains.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = g.a;
      ctx.translate(g.x, g.y);
      ctx.rotate(g.r);
      ctx.fillStyle = g.c;
      ctx.beginPath();
      ctx.ellipse(0, 0, 3.4, 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (grains.length) requestAnimationFrame(step);
    else {
      running = false;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  };
  requestAnimationFrame(step);
}

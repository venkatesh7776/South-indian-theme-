"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { couple, wedding } from "@/content/wedding";
import { OPEN_EVENT } from "./OpeningGate";

gsap.registerPlugin(ScrollTrigger);

/** A few hanging strands near the corners only — the centre stays clear. */
const HANGS = [
  { x: "6%", h: "30%", src: "/assets/il-strand-a.webp", d: 0, mobile: true },
  { x: "13%", h: "20%", src: "/assets/il-bell.webp", d: -0.8, bell: true },
  { x: "87%", h: "20%", src: "/assets/il-bell.webp", d: -1.6, bell: true },
  { x: "94%", h: "30%", src: "/assets/il-strand-a.webp", d: -1.1, mobile: true },
];

/**
 * Hero (pinned):
 *  opens on a clear sky — names, a straight thoranam on the top edge, small
 *  banana-leaf clusters in the top corners. Scrolling raises the hills and the
 *  real Srikalahasti gopuram up into view, while the leaves and thoranam ease away.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set(q(".h-gopuram"), { yPercent: 70, opacity: 0 });
        gsap.set(q(".h-names > *"), { y: 140, opacity: 0 });
        gsap.set(q(".h-leaf-l"), { xPercent: -130, yPercent: -10, rotate: -12, opacity: 0 });
        gsap.set(q(".h-leaf-r"), { xPercent: 130, yPercent: -10, rotate: 12, opacity: 0 });
        gsap.set(q(".h-top"), { yPercent: -160, opacity: 0 });
        gsap.set(q(".h-hills"), { yPercent: 35, opacity: 0 });
      }

      const intro = () => {
        if (reduce) return;
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(q(".h-gopuram"), { yPercent: 0, opacity: 1, duration: 1.9, ease: "power3.out" }, 0)
          .to(q(".h-hills"), { yPercent: 0, opacity: 1, duration: 1.8, ease: "power3.out" }, 0.05)
          .to(q(".h-top"), { yPercent: 0, opacity: 1, duration: 1.6, ease: "power3.out" }, 0.45)
          .to(q(".h-leaf-l"), { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, duration: 1.8, ease: "power3.out" }, 0.25)
          .to(q(".h-leaf-r"), { xPercent: 0, yPercent: 0, rotate: 0, opacity: 1, duration: 1.8, ease: "power3.out" }, 0.3)
          .to(q(".h-names > *"), { y: 0, opacity: 1, duration: 1.4, stagger: 0.14, ease: "power3.out" }, 0.6);
      };
      window.addEventListener(OPEN_EVENT, intro, { once: true });
      if (!document.documentElement.classList.contains("gate-closed")) intro();

      if (!reduce) {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.to(q(".h-names"), { yPercent: -30, opacity: 0, duration: 0.8 }, 0.1)
          .to(q(".h-top"), { yPercent: -120, duration: 0.5 }, 0)
          .to(q(".h-leaf-l"), { xPercent: -60, yPercent: -30, duration: 0.7 }, 0)
          .to(q(".h-leaf-r"), { xPercent: 60, yPercent: -30, duration: 0.7 }, 0)
          .to(q(".h-hills"), { y: () => -window.innerHeight * 0.3, duration: 1 }, 0)
          .to(q(".h-rise"), { y: () => -window.innerHeight * 0.56, duration: 1 }, 0)
          .to(q(".h-sky img"), { scale: 1.06, duration: 1 }, 0);
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative z-[2] h-[150svh] sm:h-[180svh]" aria-label="Welcome">
      <div className="sticky top-0 h-[100svh] w-full [overflow-x:clip]">
        {/* clear sky */}
        <div className="h-sky absolute inset-0 overflow-hidden">
          <picture>
            <source media="(max-aspect-ratio: 3/4)" srcSet="/assets/bg-sky-tall.webp" />
            <img src="/assets/bg-sky-wide.webp" alt="" className="h-full w-full object-cover" />
          </picture>
        </div>

        {/* painted clouds drifting across the sky */}
        <div className="h-clouds pointer-events-none absolute inset-x-0 top-0 h-[70svh] overflow-hidden" aria-hidden>
          {[
            { src: "/assets/il-cloud-1.webp", top: "16%", w: "clamp(110px,14vw,230px)", dur: 95, delay: -26, o: 0.5 },
            { src: "/assets/il-cloud-2.webp", top: "8%", w: "clamp(90px,11vw,180px)", dur: 120, delay: -68, o: 0.45 },
            { src: "/assets/il-cloud-3.webp", top: "38%", w: "clamp(70px,8vw,130px)", dur: 80, delay: -33, o: 0.4 },
            { src: "/assets/il-cloud-1.webp", top: "30%", w: "clamp(90px,10vw,170px)", dur: 140, delay: -97, o: 0.35 },
          ].map((c, i) => (
            <img key={i} src={c.src} alt="" className="cloud [filter:sepia(0.45)_saturate(0.7)_brightness(1.06)]" style={{ top: c.top, width: c.w, opacity: c.o, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }} />
          ))}
        </div>

        {/* painted hills — start low, rise on scroll */}
        <div className="h-hills absolute inset-x-0 top-[78svh] h-[52svh] overflow-hidden will-change-transform">
          <img src="/assets/bg-hills-mid.webp" alt="" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--cream)] to-transparent" />
        </div>

        {/* the hero melts into the page within its own bounds (behind the gopuram) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[26svh]"
          style={{
            background: "var(--cream) url(/assets/paper.webp) repeat",
            backgroundSize: "640px",
            WebkitMaskImage: "linear-gradient(to top, #000 22%, rgba(0,0,0,0.75) 50%, transparent 100%)",
            maskImage: "linear-gradient(to top, #000 22%, rgba(0,0,0,0.75) 50%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* names on the open sky */}
        <div className="h-names absolute inset-x-0 top-[24%] z-[1] flex flex-col items-center px-6 text-center sm:top-[22%]">
          <h2 className="flex flex-col items-center">
            <span className="t-display text-[3.4rem] sm:text-[6rem]">{couple.groom.short}</span>
            <span className="t-caps my-2 text-[0.8rem] text-[var(--brass)] sm:my-3 sm:text-[1rem]">weds</span>
            <span className="t-display text-[3.4rem] sm:text-[6rem]">{couple.bride.short}</span>
          </h2>
          <p className="t-caps mt-4 text-[0.72rem] text-[var(--rose-deep)] sm:text-[0.82rem]">{wedding.dateLabel}</p>
        </div>

        {/* the real gopuram — peeks from below, rises with the scroll */}
        <div className="h-rise absolute left-1/2 top-[64svh] z-[2] -translate-x-1/2 will-change-transform sm:top-[60svh]">
          <div className="h-gopuram">
            {/* bottom fade is baked into the image (no live CSS mask — much smoother on phones) */}
            <picture>
              <source media="(max-width: 639px)" srcSet="/assets/gopuram-dawn-fade-m.webp" />
              <img src="/assets/gopuram-dawn-fade.webp" alt="Srikalahasti Rajagopuram" className="h-[88svh] w-auto max-w-none sm:h-[112svh]" fetchPriority="high" />
            </picture>
          </div>
        </div>

        {/* banana leaves tucked into the top corners */}
        <div className="h-leaf-l pointer-events-none absolute -left-[5vw] top-[7svh] z-[4] h-[32svh] will-change-transform sm:-left-[1vw] sm:top-[9svh] sm:h-[54svh]">
          <img src="/assets/il-banana-left.webp" alt="" className="sway-l h-full w-auto max-w-none" />
        </div>
        <div className="h-leaf-r pointer-events-none absolute -right-[5vw] top-[7svh] z-[4] h-[32svh] will-change-transform sm:-right-[1vw] sm:top-[9svh] sm:h-[52svh]">
          <img src="/assets/il-banana-right.webp" alt="" className="sway-r h-full w-auto max-w-none" />
        </div>

        {/* thoranam flush on the top edge + a few corner hangings */}
        <div className="h-top pointer-events-none absolute inset-x-0 top-0 z-[5] h-[45svh]">
          {HANGS.map((s, i) => (
            <div key={i} className={`absolute top-[clamp(30px,4.2vw,64px)] -translate-x-1/2 ${s.mobile ? "" : "hidden sm:block"}`} style={{ left: s.x, height: s.h }}>
              <img src={s.src} alt="" className={`${s.bell ? "bell" : "dangle"} h-full w-auto max-w-none`} style={{ animationDelay: `${s.d}s` }} />
            </div>
          ))}
          <div
            className="absolute inset-x-0 -top-[6px] h-[clamp(56px,6.4vw,96px)] opacity-95"
            style={{ backgroundImage: "url(/assets/il-thoranam.webp)", backgroundRepeat: "repeat-x", backgroundSize: "auto 100%", backgroundPosition: "center top" }}
          />
        </div>

      </div>
    </section>
  );
}

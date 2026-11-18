import { makeKolam } from "./kolam";

/**
 * Repeating border patterns in the style of a Telugu invitation card:
 * white chikku-kolam knots on maroon, plus a scalloped arch fringe.
 * Returned as data-URI SVG tiles for CSS `background-image`.
 */

const enc = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

/** One sikku knot (2×1 dots, a single continuous line) — tiles horizontally into a chain. */
export function kolamChainTile(color = "#f7e9d2", vertical = false) {
  const k = makeKolam({ cols: vertical ? 1 : 2, rows: vertical ? 2 : 1, cell: 16, loop: 0.45 });
  const paths = k.paths.map((d) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round"/>`).join("");
  const dots = k.dots.map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.9" fill="${color}"/>`).join("");
  const w = k.width.toFixed(1);
  const h = k.height.toFixed(1);
  return { url: enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${paths}${dots}</svg>`), w: k.width, h: k.height };
}

/** Scalloped arch fringe with dotted rays (the lace edge on the reference border). */
export function fringeTile(color = "#f7e9d2", flip = false) {
  const w = 44;
  const h = 24;
  const arc = `<path d="M2,${h} A20,20 0 0 1 42,${h}" fill="none" stroke="${color}" stroke-width="1.4"/>`;
  const inner = `<path d="M10,${h} A12,12 0 0 1 34,${h}" fill="none" stroke="${color}" stroke-width="1"/>`;
  const dots = [-60, -30, 0, 30, 60]
    .map((deg) => {
      const a = ((deg - 90) * Math.PI) / 180;
      return `<circle cx="${(22 + Math.cos(a) * 16).toFixed(1)}" cy="${(h + Math.sin(a) * 16).toFixed(1)}" r="1.2" fill="${color}"/>`;
    })
    .join("");
  const centre = `<circle cx="22" cy="${h - 4}" r="2.2" fill="${color}"/>`;
  const g = flip ? `<g transform="translate(0 ${h}) scale(1 -1)">${arc}${inner}${dots}${centre}</g>` : `${arc}${inner}${dots}${centre}`;
  return { url: enc(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${g}</svg>`), w, h };
}

/**
 * Muggu / sikku-kolam generator.
 *
 * A traditional chikku muggu is a single unbroken line that weaves around a
 * grid of dots (chukkalu). We model it as a "mirror curve": the line travels
 * diagonally between dots and bounces off the grid border, looping around the
 * outer dots. With gcd(cols, rows) === 1 the whole pattern is ONE closed line,
 * exactly like the hand-drawn ones — which also makes it perfect for a
 * stroke-draw animation.
 */

export type Pt = { x: number; y: number };

export type Kolam = {
  dots: Pt[];
  paths: string[]; // one SVG path per closed line
  width: number;
  height: number;
};

type Opts = {
  cols: number;
  rows: number;
  cell?: number; // px between dots
  /** extra push of the border bounce points so loops wrap round the dots */
  loop?: number;
  /** cells (by dot index "c,r") that act as internal mirrors to vary the weave */
  mirrorsH?: string[];
  mirrorsV?: string[];
};

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

export function makeKolam({ cols, rows, cell = 40, loop = 0.32, mirrorsH = [], mirrorsV = [] }: Opts): Kolam {
  const pad = cell * 0.9;
  const width = cols * cell + pad * 2;
  const height = rows * cell + pad * 2;

  const dots: Pt[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) dots.push({ x: pad + (c + 0.5) * cell, y: pad + (r + 0.5) * cell });

  // Work in doubled integer units: grid lines at even coords, dots at odd coords.
  const W = cols * 2;
  const H = rows * 2;
  const hSet = new Set(mirrorsH);
  const vSet = new Set(mirrorsV);

  const visited = new Set<string>();
  const paths: string[] = [];

  // Every edge-midpoint state (point + diagonal direction) belongs to exactly one curve.
  const starts: { x: number; y: number; dx: number; dy: number }[] = [];
  for (let x = 0; x <= W; x++)
    for (let y = 0; y <= H; y++) {
      const onV = x % 2 === 0 && y % 2 === 1;
      const onH = x % 2 === 1 && y % 2 === 0;
      if (!onV && !onH) continue;
      for (const dx of [-1, 1]) for (const dy of [-1, 1]) starts.push({ x, y, dx, dy });
    }

  const curves = gcd(cols, rows) + mirrorsH.length + mirrorsV.length; // upper bound guard
  for (const s of starts) {
    const key0 = `${s.x},${s.y},${s.dx},${s.dy}`;
    if (visited.has(key0)) continue;
    // only begin inside the grid moving inward
    const nx = s.x + s.dx;
    const ny = s.y + s.dy;
    if (nx < 0 || nx > W || ny < 0 || ny > H) continue;

    const pts: Pt[] = [];
    let { x, y, dx, dy } = s;
    for (let guard = 0; guard < 20000; guard++) {
      const key = `${x},${y},${dx},${dy}`;
      if (visited.has(key)) break;
      visited.add(key);
      // reverse direction of travel is the same curve — mark it too
      visited.add(`${x},${y},${-dx},${-dy}`);

      // border bounce points get pushed outward to make round loops
      let px = x;
      let py = y;
      if (x === 0) px = -loop * 2;
      if (x === W) px = W + loop * 2;
      if (y === 0) py = -loop * 2;
      if (y === H) py = H + loop * 2;
      pts.push({ x: pad + (px / 2) * cell, y: pad + (py / 2) * cell });

      x += dx;
      y += dy;
      // reflections at border
      if (x === 0 || x === W) dx = -dx;
      if (y === 0 || y === H) dy = -dy;
      // internal mirrors (placed on grid-line midpoints)
      const mk = `${x},${y}`;
      if (hSet.has(mk)) dy = -dy;
      if (vSet.has(mk)) dx = -dx;
    }
    if (pts.length > 2) paths.push(closedSpline(pts));
    if (paths.length > curves + 8) break;
  }

  return { dots, paths, width, height };
}

/** Closed Catmull-Rom → cubic Bézier path, gives the soft hand-drawn loops. */
export function closedSpline(p: Pt[], tension = 0.5): string {
  const n = p.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(p[0].x)},${f(p[0].y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2;
    d += ` C${f(c1x)},${f(c1y)} ${f(c2x)},${f(c2y)} ${f(p2.x)},${f(p2.y)}`;
  }
  return d + "Z";
}

/**
 * Pulli-kolam "flower": centre dot, four lens petals, a diamond frame and
 * eight surrounding dots — the motif used for the opening transition.
 */
export function kolamFlower(size = 200) {
  const c = size / 2;
  const r = size * 0.36;
  const petal = (angle: number) => {
    const a = (angle * Math.PI) / 180;
    const tip = { x: c + Math.cos(a) * r, y: c + Math.sin(a) * r };
    const w = r * 0.32;
    const nx = -Math.sin(a) * w;
    const ny = Math.cos(a) * w;
    const mid = { x: (c + tip.x) / 2, y: (c + tip.y) / 2 };
    return `M${c},${c} Q${mid.x + nx},${mid.y + ny} ${tip.x},${tip.y} Q${mid.x - nx},${mid.y - ny} ${c},${c}Z`;
  };
  const diamond = `M${c},${c - r} L${c + r},${c} L${c},${c + r} L${c - r},${c} Z`;
  const ring = `M${c + r * 0.13},${c} A${r * 0.13},${r * 0.13} 0 1 1 ${c - r * 0.13},${c} A${r * 0.13},${r * 0.13} 0 1 1 ${c + r * 0.13},${c}`;
  const dots: Pt[] = [];
  const d2 = r * 0.62;
  for (const [dx, dy] of [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ])
    dots.push({ x: c + dx * d2 * 0.72, y: c + dy * d2 * 0.72 });
  for (const [dx, dy] of [
    [0, 1.32],
    [0, -1.32],
    [1.32, 0],
    [-1.32, 0],
  ])
    dots.push({ x: c + dx * r, y: c + dy * r });
  dots.push({ x: c, y: c });
  return { size, paths: [petal(0), petal(90), petal(180), petal(270), diamond, ring], dots };
}

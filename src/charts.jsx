import React from "react";

export const C = { navy: "#0f1f3d", mid: "#1a3260", gold: "#c8973a", river: "#1a5f7a", riverSoft: "#9cc3d3", brown: "#8a4b12", green: "#2d6a4f", grey: "#a09080", warn: "#9a3b1a", purple: "#5a3e8c" };

function niceTicks(lo, hi, count = 5) {
  if (!(hi > lo)) return [lo];
  const span = hi - lo, step0 = span / count, mag = Math.pow(10, Math.floor(Math.log10(step0)));
  const err = step0 / mag, step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag;
  const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}
const fmt = v => Math.abs(v) >= 1000 ? v.toLocaleString("en-IN") : +v.toFixed(3) + "";

// Generic 2-D plot. children(sx, sy, inner) draws series.
export function Plot({ w = 640, h = 300, x, y, xLabel, yLabel, xLog, yLog, xTicks, yTicks, children, m = { l: 56, r: 14, t: 12, b: 42 }, onPointer }) {
  const iw = w - m.l - m.r, ih = h - m.t - m.b;
  const tx = v => xLog ? Math.log10(v) : v, ty = v => yLog ? Math.log10(v) : v;
  const sx = v => m.l + (tx(v) - tx(x[0])) / (tx(x[1]) - tx(x[0])) * iw;
  const sy = v => m.t + ih - (ty(v) - ty(y[0])) / (ty(y[1]) - ty(y[0])) * ih;
  const logT = (a, b) => { const o = []; for (let e = Math.floor(Math.log10(a)); e <= Math.ceil(Math.log10(b)); e++) [1, 2, 5].forEach(k => { const v = k * Math.pow(10, e); if (v >= a * 0.999 && v <= b * 1.001) o.push(v); }); return o; };
  const xt = xTicks || (xLog ? logT(x[0], x[1]) : niceTicks(x[0], x[1], Math.max(3, Math.round(iw / 80))));
  const yt = yTicks || (yLog ? logT(y[0], y[1]) : niceTicks(y[0], y[1], 5));
  const ref = React.useRef();
  const handle = e => {
    if (!onPointer) return;
    const r = ref.current.getBoundingClientRect(), px = (e.clientX - r.left) * w / r.width, py = (e.clientY - r.top) * h / r.height;
    const fx = (px - m.l) / iw, fy = (m.t + ih - py) / ih;
    const inv = (f, d, lg) => lg ? Math.pow(10, Math.log10(d[0]) + f * (Math.log10(d[1]) - Math.log10(d[0]))) : d[0] + f * (d[1] - d[0]);
    onPointer(inv(fx, x, xLog), inv(fy, y, yLog), e);
  };
  return (
    <svg ref={ref} viewBox={`0 0 ${w} ${h}`} onPointerMove={handle} onPointerDown={handle} style={{ fontFamily: "DM Sans, sans-serif" }}>
      <rect x={m.l} y={m.t} width={iw} height={ih} fill="#fff" />
      {yt.map(v => <g key={"y" + v}><line x1={m.l} x2={m.l + iw} y1={sy(v)} y2={sy(v)} stroke="#eee8dd" /><text x={m.l - 6} y={sy(v) + 3.5} fontSize="10" textAnchor="end" fill="#5a5048">{fmt(v)}</text></g>)}
      {xt.map(v => <g key={"x" + v}><line x1={sx(v)} x2={sx(v)} y1={m.t + ih} y2={m.t + ih + 4} stroke="#a09080" /><text x={sx(v)} y={m.t + ih + 15} fontSize="10" textAnchor="middle" fill="#5a5048">{fmt(v)}</text></g>)}
      <line x1={m.l} x2={m.l + iw} y1={m.t + ih} y2={m.t + ih} stroke="#a09080" />
      <line x1={m.l} x2={m.l} y1={m.t} y2={m.t + ih} stroke="#a09080" />
      {xLabel && <text x={m.l + iw / 2} y={h - 6} fontSize="11" textAnchor="middle" fill="#1a3260" fontWeight="600">{xLabel}</text>}
      {yLabel && <text transform={`translate(13 ${m.t + ih / 2}) rotate(-90)`} fontSize="11" textAnchor="middle" fill="#1a3260" fontWeight="600">{yLabel}</text>}
      <g>{children(sx, sy, { iw, ih, m })}</g>
    </svg>
  );
}

export const path = (pts, sx, sy) => pts.filter(p => p[1] != null && isFinite(p[1])).map((p, i) => (i ? "L" : "M") + sx(p[0]).toFixed(1) + " " + sy(p[1]).toFixed(1)).join("");

export function Legend({ items }) {
  return <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 11.5, color: "#5a5048", margin: "4px 0 0 56px" }}>
    {items.map(([c, t, dash]) => <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <svg width="20" height="8"><line x1="0" x2="20" y1="4" y2="4" stroke={c} strokeWidth="2.5" strokeDasharray={dash ? "4 3" : ""} /></svg>{t}</span>)}
  </div>;
}

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Plot, path, Legend, C } from "./charts.jsx";
import { ILLOS, FormIcon } from "./illos.jsx";

const f1 = v => (isFinite(v) ? (+v).toFixed(1) : "–");
const f2 = v => (isFinite(v) ? (+v).toFixed(2) : "–");
const f3 = v => (isFinite(v) ? (+v).toFixed(3) : "–");
const big = v => (isFinite(v) ? Math.round(v).toLocaleString("en-IN") : "–");
const sum = a => a.reduce((s, v) => s + v, 0);
const mean = a => sum(a) / a.length;
const sd1 = a => { const m = mean(a); return Math.sqrt(sum(a.map(v => (v - m) ** 2)) / (a.length - 1)); };

function Box({ title, kind = "Interactive", children }) {
  return <div className="wg"><div className="wg-h"><b>{title}</b><span>{kind}</span></div><div className="wg-b">{children}</div></div>;
}
function Kpi({ v, l, tone }) { return <div className={"kpi " + (tone || "")}><div className="v">{v}</div><div className="l">{l}</div></div>; }
function Num({ value, onChange, step = "any", w }) {
  return <input type="number" step={step} value={value} style={w ? { width: w } : null} onChange={e => onChange(e.target.value === "" ? "" : +e.target.value)} />;
}
function Seg({ value, options, onChange }) {
  return <div className="seg">{options.map(([v, l]) => <button key={v} className={v === value ? "on" : ""} onClick={() => onChange(v)}>{l}</button>)}</div>;
}
function useCsv(url) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let live = true;
    fetch(url).then(r => r.text()).then(t => {
      const [h, ...ls] = t.trim().split(/\r?\n/); const k = h.split(",");
      if (live) setRows(ls.map(l => { const v = l.split(","); const o = {}; k.forEach((kk, i) => o[kk] = isNaN(+v[i]) ? v[i] : +v[i]); return o; }));
    }).catch(() => live && setRows([]));
    return () => { live = false; };
  }, [url]);
  return rows;
}

/* ============ S01: water budget ============ */
function WaterBudget() {
  const [mode, setMode] = useState("storm");
  const [s, setS] = useState({ A: 150, P: 105, Q: 1.5, T: 10 });
  const [a, setA] = useState({ A: 11839, Q: 144.4, P: 1.08 });
  const presets = { "Slide Q2 (150 ha)": { A: 150, P: 105, Q: 1.5, T: 10 }, "Example 2 (220 ha)": { A: 220, P: 95, Q: 2.1, T: 8 } };
  const Pv = s.P / 1000 * s.A * 1e4, Rv = s.Q * s.T * 3600, L = Pv - Rv, Cr = Rv / Pv;
  const Rd = a.Q * 365 * 86400 / (a.A * 1e6), ET = a.P - Rd;
  const bar = (parts) => <svg viewBox="0 0 600 46">{(() => { let x = 0; return parts.map(([v, c, t]) => { const w = Math.max(0, v) * 600; const el = <g key={t}><rect x={x} y="6" width={w} height="26" fill={c} /><text x={x + 6} y="24" fontSize="12" fill="#fff">{w > 70 ? t : ""}</text></g>; x += w; return el; }); })()}</svg>;
  return <Box title="Water-budget calculator">
    <div style={{ marginBottom: 10 }}><Seg value={mode} onChange={setMode} options={[["storm", "Single storm"], ["annual", "Annual basin"]]} /></div>
    {mode === "storm" ? <div className="wg-row">
      <div className="wg-col">
        <label className="f">Catchment area: <b>{s.A} ha</b><input type="range" min="10" max="1000" value={s.A} onChange={e => setS({ ...s, A: +e.target.value })} /></label>
        <label className="f">Storm rainfall: <b>{s.P} mm</b><input type="range" min="5" max="250" value={s.P} onChange={e => setS({ ...s, P: +e.target.value })} /></label>
        <label className="f">Average runoff discharge: <b>{s.Q} m³/s</b><input type="range" min="0.1" max="10" step="0.1" value={s.Q} onChange={e => setS({ ...s, Q: +e.target.value })} /></label>
        <label className="f">Runoff duration: <b>{s.T} h</b><input type="range" min="1" max="48" value={s.T} onChange={e => setS({ ...s, T: +e.target.value })} /></label>
        <div className="btn-row">{Object.entries(presets).map(([k, v]) => <button key={k} className="btn ghost" onClick={() => setS(v)}>{k}</button>)}</div>
      </div>
      <div className="wg-col">
        <div className="kpis"><Kpi v={big(Pv)} l="Rain volume m³" /><Kpi v={big(Rv)} l="Runoff volume m³" /></div>
        <div className="kpis"><Kpi v={big(L)} l="Losses m³" tone={L < 0 ? "bad" : ""} /><Kpi v={f3(Cr)} l="Runoff coefficient" tone={Cr > 1 ? "bad" : "good"} /></div>
        {bar([[Math.min(Cr, 1), C.river, "Runoff " + Math.round(Cr * 100) + "%"], [Math.max(0, 1 - Cr), C.gold, "Losses " + Math.round((1 - Cr) * 100) + "%"]])}
        {Cr > 1 && <p className="note" style={{ color: C.warn }}>Runoff exceeds rainfall — impossible for a closed catchment. Check the inputs.</p>}
        <p className="note">Rain volume = P × A; runoff volume = Q̄ × t; losses = difference (infiltration + evaporation + transpiration + storage).</p>
      </div>
    </div> : <div className="wg-row">
      <div className="wg-col">
        <label className="f">Drainage area (km²)<Num value={a.A} onChange={v => setA({ ...a, A: v })} /></label>
        <label className="f">Mean annual flow (m³/s)<Num value={a.Q} onChange={v => setA({ ...a, Q: v })} /></label>
        <label className="f">Mean annual rainfall (m)<Num value={a.P} onChange={v => setA({ ...a, P: v })} /></label>
        <div className="btn-row"><button className="btn ghost" onClick={() => setA({ A: 11839, Q: 144.4, P: 1.08 })}>Slide Q3 (Gandak)</button><button className="btn ghost" onClick={() => setA({ A: 5200, Q: 68, P: 1.15 })}>Example 3</button></div>
      </div>
      <div className="wg-col">
        <div className="kpis"><Kpi v={f3(Rd) + " m"} l="Runoff depth" /><Kpi v={f3(ET) + " m"} l="ET = P − R (ΔS ≈ 0)" tone="good" /><Kpi v={f2(Rd / a.P)} l="Runoff coefficient" /></div>
        {bar([[Rd / a.P, C.river, "Runoff"], [ET / a.P, C.brown, "Evapotranspiration"]])}
        <p className="note">Over a full year ΔS ≈ 0, so annual ET ≈ annual rainfall − annual runoff depth.</p>
      </div>
    </div>}
  </Box>;
}

/* ============ S01: global water ============ */
function GlobalWater() {
  const d = [["Oceans (salt water)", 97.2, "#1a5f7a"], ["Glaciers and ice caps", 2.15, "#9cc3d3"], ["Groundwater", 0.6, "#8a4b12"], ["  of which economically available", 0.3, "#c8973a"], ["Lakes and reservoirs", 0.01, "#2d6a4f"], ["Atmosphere", 0.001, "#a09080"], ["Streams and rivers", 0.0001, "#5a3e8c"]];
  const [scale, setScale] = useState("log");
  const [bucket, setBucket] = useState(100);
  const lx = v => scale === "log" ? (Math.log10(v) + 4.5) / (Math.log10(100) + 4.5) : v / 100;
  return <Box title="Where is the Earth's water?">
    <div className="wg-row" style={{ alignItems: "center", marginBottom: 6 }}>
      <Seg value={scale} onChange={setScale} options={[["linear", "Linear scale"], ["log", "Log scale"]]} />
      <label className="f" style={{ flex: "1 1 220px", margin: 0 }}>If all water on Earth were <b>{bucket} litres</b><input type="range" min="1" max="1000" value={bucket} onChange={e => setBucket(+e.target.value)} /></label>
    </div>
    <table><thead><tr><th>Store</th><th style={{ width: "48%" }}>Share</th><th>%</th><th>Your bucket</th></tr></thead><tbody>
      {d.map(([n, v, c]) => <tr key={n}><td style={{ fontFamily: "DM Sans", whiteSpace: "pre" }}>{n}</td>
        <td><div style={{ background: "#f4f2ee", height: 12, borderRadius: 3 }}><div style={{ width: Math.max(0.5, lx(v) * 100) + "%", height: 12, background: c, borderRadius: 3 }} /></div></td>
        <td>{v}</td><td>{(() => { const L = bucket * v / 100; return L >= 1 ? L.toFixed(2) + " L" : L * 1000 >= 1 ? (L * 1000).toFixed(1) + " mL" : (L * 1e6).toFixed(0) + " µL"; })()}</td></tr>)}
    </tbody></table>
    <p className="note">Of 100 litres, rivers — the water most of our engineering works depend on — hold about a tenth of a millilitre. On a linear scale the small stores vanish; switch to log scale to compare them.</p>
  </Box>;
}

/* ============ S02: forms & types ============ */
const FORMS = [
  ["Rain", "rain", "Drops 0.5–6 mm. Light < 2.5 mm/h, moderate 2.5–7.5 mm/h, heavy > 7.5 mm/h. Larger drops break up while falling."],
  ["Drizzle", "drizzle", "Fine droplets under 0.5 mm falling slowly; intensity usually under 1 mm/h."],
  ["Snow", "snow", "Ice crystals, usually as flakes; density 0.06–0.15 g/cm³. In India, mainly the Himalaya."],
  ["Hail", "hail", "Showery precipitation of irregular ice lumps over about 8 mm, built up in layers inside violent thunderstorms with strong updrafts."],
  ["Glaze", "glaze", "Rain or drizzle that freezes on contact with ground or objects at or below 0 °C, forming an ice coat."],
  ["Dew", "dew", "Water condensing directly on cool surfaces at night. Not counted in rainfall totals."],
  ["Frost", "frost", "Ice crystals formed directly on surfaces below 0 °C."],
];
function Frontal() {
  return <svg viewBox="0 0 300 150"><defs><linearGradient id="cold" x1="0" x2="1"><stop offset="0" stopColor="#9cc3d3" /><stop offset="1" stopColor="#d7e9f0" /></linearGradient></defs>
    <rect width="300" height="150" fill="#fff" /><path d="M0 150 L0 70 Q120 70 300 20 L300 150 Z" fill="url(#cold)" /><path d="M0 70 Q120 70 300 20 L300 0 L0 0Z" fill="#fbe9e1" />
    <text x="40" y="120" fontSize="12" fill="#0f1f3d">cold, dense air</text><text x="20" y="30" fontSize="12" fill="#9a3b1a">warm, moist air</text>
    <path d="M60 55 L180 30" stroke="#9a3b1a" strokeWidth="2" markerEnd="url(#ah)" /><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9a3b1a" /></marker></defs>
    <ellipse cx="210" cy="22" rx="40" ry="12" fill="#cfd6dd" />{[195, 205, 215, 225].map(x => <line key={x} x1={x} y1="34" x2={x - 4} y2="52" stroke="#1a5f7a" />)}
    <text x="150" y="145" fontSize="10" fill="#a09080">front: warm air forced up over cold air</text></svg>;
}
function CyclonePlan() {
  const [hi, setHi] = useState(false);
  return <svg viewBox="0 0 300 150"><rect width="300" height="150" fill="#fff" />
    <g transform="translate(80 75)"><g style={{ animation: "spin 6s linear infinite", transformOrigin: "0 0" }}>{[0, 90, 180, 270].map(a => <path key={a} transform={`rotate(${a})`} d="M0 0 C 20 -10 40 -10 58 6" stroke="#1f6f8f" strokeWidth="5" fill="none" strokeLinecap="round" opacity=".8" />)}</g>
      <circle r="8" fill="#fff" stroke="#0f1f3d" /><text y="62" fontSize="11" textAnchor="middle" fill="#0f1f3d">LOW · air spirals in, rises</text></g>
    <g transform="translate(220 75)">{[0, 90, 180, 270].map(a => <path key={a} transform={`rotate(${a})`} d="M10 0 L50 0" stroke="#8a4b12" strokeWidth="3" markerEnd="url(#cyo)" />)}<circle r="9" fill="#fbe9e1" stroke="#8a4b12" /><text y="62" fontSize="11" textAnchor="middle" fill="#8a4b12">HIGH · air sinks, spreads out</text></g>
    <defs><marker id="cyo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a4b12" /></marker></defs>
    <text x="80" y="14" fontSize="11" textAnchor="middle" fill="#1f6f8f" fontWeight="600">Cyclone (anticlockwise, N. hemisphere)</text><text x="220" y="14" fontSize="11" textAnchor="middle" fill="#8a4b12" fontWeight="600">Anticyclone</text></svg>;
}
function Convective() {
  return <svg viewBox="0 0 300 150"><rect width="300" height="150" fill="#fff" /><rect y="128" width="300" height="22" fill="#c9a878" />
    <circle cx="40" cy="30" r="16" fill="#e8b95a" />{[0, 1, 2].map(i => <path key={i} className="anim-rise" style={{ animationDelay: i * 0.9 + "s" }} d={`M${120 + i * 22} 125 q6 -10 0 -20 q-6 -10 0 -20`} stroke="#c8973a" strokeWidth="2" fill="none" />)}
    <path d="M110 70 C100 40 140 10 170 25 C200 5 240 30 225 60 C250 70 240 92 215 90 L120 90 C95 92 92 72 110 70Z" fill="#dfe6ee" stroke="#9fb0bf" strokeWidth="2" />
    {[135, 155, 175, 195].map((x, i) => <line key={x} className="anim-fall" style={{ animationDelay: i * 0.3 + "s" }} x1={x} y1="95" x2={x - 4} y2="112" stroke="#1f6f8f" strokeWidth="2" />)}
    <text x="150" y="145" fontSize="10.5" textAnchor="middle" fill="#3a332c">heated ground → rising air → towering cloud → short, intense rain</text></svg>;
}
function Orographic() {
  return <svg viewBox="0 0 300 150"><rect width="300" height="150" fill="#fff" /><path d="M0 140 L110 140 L170 40 L230 140 L300 140 L300 150 L0 150Z" fill="#7a9a5a" />
    <path d="M10 110 Q100 105 150 50" stroke="#1a5f7a" strokeWidth="2" fill="none" markerEnd="url(#ab)" /><path d="M185 50 Q220 90 290 112" stroke="#8a4b12" strokeWidth="2" fill="none" markerEnd="url(#ab2)" />
    <defs><marker id="ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1a5f7a" /></marker><marker id="ab2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8a4b12" /></marker></defs>
    <ellipse cx="135" cy="35" rx="40" ry="13" fill="#b9c2cb" />{[115, 125, 135, 145].map(x => <line key={x} x1={x} y1="48" x2={x - 5} y2="80" stroke="#1a5f7a" />)}
    <text x="8" y="100" fontSize="11" fill="#1a5f7a">moist monsoon air</text><text x="58" y="130" fontSize="10" fill="#fff">windward: heavy rain</text><text x="200" y="128" fontSize="10" fill="#fff">leeward: rain shadow</text>
    <text x="195" y="72" fontSize="10" fill="#8a4b12">dry, sinking air</text></svg>;
}
const TYPES = [
  ["Frontal", <Frontal />, "Two air masses of different temperature and density meet. Warm, lighter air is forced up over the cold air along the front and cools to condensation. Cold fronts: short, intense rain; warm fronts: long, moderate rain over wide areas.", "Western disturbances bringing winter rain and snow to north-west India."],
  ["Cyclonic", <CyclonePlan />, "A large low-pressure system; air converges and spirals in — anticlockwise in the northern hemisphere — and rises. Tropical cyclones form over warm seas and bring very heavy rain and storm surge. Anticyclones (highs) have outward, clockwise winds and calm centres.", "Bay of Bengal cyclones striking Odisha and Andhra Pradesh in Oct–Nov."],
  ["Convective", <Convective />, "Local surface heating makes air rise, cool and condense into cumulonimbus clouds. Intense, short, local (about 10 km across).", "Bengaluru's April–May and post-monsoon evening thunderstorms."],
  ["Orographic", <Orographic />, "Moist air forced up a mountain barrier cools and rains on the windward side; descending air on the leeward side is dry — a rain shadow.", "Western Ghats: Agumbe gets several thousand mm while places just east on the plateau get far less."],
];
function PrecipExplorer() {
  const [f, setF] = useState(0); const [t, setT] = useState(3);
  return <Box title="Forms and types of precipitation">
    <div className="sec-title" style={{ marginTop: 0 }}>Forms — click a photo</div>
    <div className="cards">{FORMS.map(([n, k], i) => <button key={n} className={"cardpick" + (i === f ? " on" : "")} onClick={() => setF(i)}><FormIcon k={k} /><div>{n}</div></button>)}</div>
    <div className="detail"><h4>{FORMS[f][0]}</h4>{FORMS[f][2]}</div>
    <div className="sec-title">Types — by what lifts the air</div>
    <Seg value={t} onChange={setT} options={TYPES.map((x, i) => [i, x[0]])} />
    <div className="wg-row" style={{ marginTop: 10 }}>
      <div className="wg-col" style={{ maxWidth: 340 }}><div style={{ border: "1px solid #e8e4dc", borderRadius: 8, overflow: "hidden" }}>{TYPES[t][1]}</div></div>
      <div className="wg-col"><div className="detail" style={{ marginTop: 0 }}><h4>{TYPES[t][0]} precipitation</h4><p>{TYPES[t][2]}</p><p style={{ marginTop: 6 }}><b>Indian example:</b> {TYPES[t][3]}</p></div></div>
    </div>
  </Box>;
}

/* ============ S03: tipping bucket + network ============ */
function TippingBucket() {
  const [I, setI] = useState(30); const [b, setB] = useState(0.25); const [run, setRun] = useState(false);
  const [t, setT] = useState(0); const [fill, setFill] = useState(0); const [tips, setTips] = useState([]); const [side, setSide] = useState(1);
  const SPEED = 60; // 1 real second = 60 simulated seconds
  useEffect(() => {
    if (!run) return; const id = setInterval(() => {
      setT(tt => tt + SPEED / 10);
      setFill(fl => {
        let nf = fl + I / 3600 * SPEED / 10;
        if (nf >= b) { nf -= b; setSide(s => -s); setTips(tp => [...tp.slice(-199), 1]); }
        return nf;
      });
    }, 100); return () => clearInterval(id);
  }, [run, I, b]);
  const reset = () => { setT(0); setFill(0); setTips([]); setRun(false); };
  const depth = tips.length * b, ang = side * 18;
  return <Box title="Tipping-bucket rain gauge — simulator">
    <div className="wg-row">
      <div className="wg-col" style={{ maxWidth: 260 }}>
        <svg viewBox="0 0 220 200"><path d="M70 10 L150 10 L118 60 L102 60Z" fill="#cfd6dd" stroke="#0f1f3d" /><text x="110" y="8" fontSize="9" textAnchor="middle">funnel</text>
          {run && [0, 1, 2].map(k => <circle key={k} cx="110" cy={66 + ((t * 3 + k * 12) % 34)} r="2" fill="#1a5f7a" />)}
          <g transform={`rotate(${ang} 110 120)`}><path d="M50 120 L170 120" stroke="#0f1f3d" strokeWidth="3" /><path d="M55 120 L75 100 L105 100 L105 120Z" fill="#e3f0f4" stroke="#0f1f3d" /><path d="M115 120 L115 100 L145 100 L165 120Z" fill="#e3f0f4" stroke="#0f1f3d" />
            <rect x={side > 0 ? 116 : 76} y={120 - Math.min(1, fill / b) * 20} width="28" height={Math.min(1, fill / b) * 20} fill="#1a5f7a" opacity=".7" /></g>
          <polygon points="104,135 116,135 110,122" fill="#c8973a" /><rect x="60" y="160" width="100" height="26" fill="#f4f2ee" stroke="#a09080" /><text x="110" y="177" fontSize="11" textAnchor="middle">tips: {tips.length}</text></svg>
      </div>
      <div className="wg-col">
        <label className="f">Rain intensity: <b>{I} mm/h</b><input type="range" min="1" max="150" value={I} onChange={e => setI(+e.target.value)} /></label>
        <label className="f">Bucket size: <Seg value={b} onChange={v => { setB(v); reset(); }} options={[[0.2, "0.2 mm"], [0.25, "0.25 mm"], [0.5, "0.5 mm"]]} /></label>
        <div className="btn-row" style={{ margin: "8px 0" }}><button className="btn" onClick={() => setRun(!run)}>{run ? "Pause" : "Start rain"}</button><button className="btn ghost" onClick={reset}>Reset</button></div>
        <div className="kpis"><Kpi v={(t / 60).toFixed(1) + " min"} l="Simulated time" /><Kpi v={depth.toFixed(2) + " mm"} l="Recorded depth" /><Kpi v={t > 0 ? (depth / (t / 3600)).toFixed(1) : "–"} l="Recorded mm/h" /></div>
        <p className="note">Each tip records one bucket-full ({b} mm) with its time. The record is a staircase — the mass curve — and intensity is tips per unit time. In very heavy rain some water is lost while the bucket is tipping, so real gauges under-record.</p>
      </div>
    </div>
  </Box>;
}
function GaugeNetwork() {
  const presets = { "Slide Q1 (cm)": [89, 54, 45, 41, 55], "Example (mm)": [1120, 860, 735, 690, 912, 1040], "TG1–TG3 storm (mm)": [105, 86, 124] };
  const [v, setV] = useState(presets["Slide Q1 (cm)"]); const [e, setE] = useState(10);
  const [area, setArea] = useState(1800); const [terr, setTerr] = useState(520);
  const vals = v.filter(x => x !== "" && isFinite(x)); const m = mean(vals), s = sd1(vals), cv = 100 * s / m, N = (cv / e) ** 2;
  const Nr = Math.ceil(N - 1e-9);
  return <Box title="Optimum number of rain gauges">
    <div className="wg-row">
      <div className="wg-col" style={{ maxWidth: 260 }}>
        <table><thead><tr><th>Gauge</th><th>Rainfall</th><th /></tr></thead><tbody>
          {v.map((x, i) => <tr key={i}><td>{i + 1}</td><td><Num value={x} onChange={nv => setV(v.map((y, j) => j === i ? nv : y))} /></td><td><button className="btn ghost" style={{ padding: "1px 7px" }} onClick={() => setV(v.filter((_, j) => j !== i))}>×</button></td></tr>)}
        </tbody></table>
        <div className="btn-row" style={{ marginTop: 6 }}><button className="btn ghost" onClick={() => setV([...v, Math.round(m || 50)])}>+ gauge</button>{Object.entries(presets).map(([k, p]) => <button key={k} className="btn ghost" onClick={() => setV(p)}>{k}</button>)}</div>
      </div>
      <div className="wg-col">
        <label className="f">Allowable error ε: <b>{e} %</b><input type="range" min="2" max="25" value={e} onChange={x => setE(+x.target.value)} /></label>
        <div className="kpis"><Kpi v={f1(m)} l="Mean P̄" /><Kpi v={f1(s)} l="σ (n−1)" /><Kpi v={f2(cv) + "%"} l="Cv" /></div>
        <div className="kpis"><Kpi v={f2(N)} l="N = (Cv/ε)²" /><Kpi v={Nr} l="Gauges needed" tone="good" /><Kpi v={Math.max(0, Nr - vals.length)} l="Additional gauges" tone={Nr > vals.length ? "bad" : "good"} /></div>
        <div className="sec-title" style={{ fontSize: 15 }}>IS 4987 density check</div>
        <div className="wg-row"><label className="f" style={{ flex: 1 }}>Catchment area (km²)<Num value={area} onChange={setArea} /></label>
          <label className="f" style={{ flex: 1 }}>Terrain<select value={terr} onChange={x => setTerr(+x.target.value)}><option value={520}>Plains — 1 per 520 km²</option><option value={325}>~1000 m elevation — 1 per 260–390 km²</option><option value={130}>Hilly, heavy rain — 1 per 130 km²</option></select></label></div>
        <p className="note">IS 4987: about <b>{Math.ceil(area / terr)}</b> gauges, of which at least <b>{Math.max(1, Math.ceil(0.1 * Math.ceil(area / terr)))}</b> self-recording (10 %).</p>
      </div>
    </div>
  </Box>;
}

/* ============ S04: double mass curve ============ */
const DMC_SLIDE = (() => {
  const yrs = []; for (let y = 1972; y >= 1937; y--) yrs.push(y);
  const X = [188, 185, 310, 295, 208, 287, 183, 304, 228, 216, 224, 203, 284, 295, 206, 269, 241, 284, 223, 173, 282, 218, 246, 284, 493, 320, 274, 322, 437, 389, 305, 320, 328, 308, 302, 414];
  const B = [264, 228, 386, 297, 284, 350, 236, 371, 234, 290, 282, 246, 264, 332, 231, 234, 231, 312, 360, 234, 333, 236, 251, 284, 361, 282, 252, 274, 302, 350, 228, 312, 284, 315, 280, 343];
  return yrs.map((y, i) => ({ year: y, X: X[i], B: B[i] }));
})();
function DoubleMass() {
  const course = useCsv("data/U1_annual_rainfall_1991_2020.csv");
  const [ds, setDs] = useState("slide");
  const rows = useMemo(() => ds === "slide" ? DMC_SLIDE : (course || []).map(r => ({ year: r.year, X: r.X, B: (r.A + r.B + r.C + r.D + r.E) / 5 })), [ds, course]);
  const [k, setK] = useState(23); // break index (number of points in first segment)
  useEffect(() => { setK(ds === "slide" ? 23 : 17); }, [ds]);
  const [fix, setFix] = useState("second");
  if (!rows.length) return <Box title="Double mass curve">Loading data…</Box>;
  let cx = 0, cb = 0; const pts = rows.map(r => { cx += r.X; cb += r.B; return { ...r, cx, cb }; });
  const kk = Math.min(Math.max(k, 3), pts.length - 3);
  const p1 = pts[kk - 1], pe = pts[pts.length - 1];
  const s1 = p1.cx / p1.cb, s2 = (pe.cx - p1.cx) / (pe.cb - p1.cb);
  const factor = fix === "second" ? s1 / s2 : s2 / s1;
  const xm = pe.cb * 1.04, ym = Math.max(pe.cx, pe.cb * Math.max(s1, s2)) * 1.06;
  const breakYear = pts[kk].year;
  const order = ds === "slide" ? "accumulated from 1972 backwards" : "accumulated from 1991 forwards";
  return <Box title="Double mass curve — find the break, correct the record">
    <div className="wg-row" style={{ alignItems: "center", marginBottom: 8 }}>
      <Seg value={ds} onChange={setDs} options={[["slide", "Slide data 1937–1972"], ["course", "Course data 1991–2020"]]} />
      <span className="note" style={{ margin: 0 }}>{order}</span>
    </div>
    <Plot w={660} h={320} x={[0, xm]} y={[0, ym]} xLabel="Cumulative mean rainfall of base stations (mm)" yLabel="Cumulative rainfall at X (mm)">{(sx, sy) => <>
      <path d={path([[0, 0], [xm, xm * s1]], sx, sy)} stroke={C.river} strokeDasharray="5 4" fill="none" />
      <path d={path([[p1.cb, p1.cx], [xm, p1.cx + (xm - p1.cb) * s2]], sx, sy)} stroke={C.brown} strokeDasharray="5 4" fill="none" />
      {pts.map((p, i) => <circle key={p.year} cx={sx(p.cb)} cy={sy(p.cx)} r="3.4" fill={i < kk ? C.river : C.brown}><title>{p.year}: ΣX {p.cx}, ΣB {Math.round(p.cb)}</title></circle>)}
      <circle cx={sx(p1.cb)} cy={sy(p1.cx)} r="7" fill="none" stroke={C.gold} strokeWidth="2" />
      <text x={sx(p1.cb) + 10} y={sy(p1.cx) - 8} fontSize="11" fill={C.navy}>break after {p1.year}</text>
    </>}</Plot>
    <label className="f">Move the break: <b>{p1.year} | {breakYear}</b><input type="range" min="3" max={pts.length - 3} value={kk} onChange={e => setK(+e.target.value)} /></label>
    <div className="wg-row" style={{ alignItems: "center" }}><span className="note" style={{ margin: 0 }}>Treat as correct:</span>
      <Seg value={fix} onChange={setFix} options={[["second", `first segment (${pts[0].year}–${p1.year})`], ["first", `second segment (${breakYear}–${pe.year})`]]} /></div>
    <div className="kpis"><Kpi v={f3(s1)} l={`Slope ${pts[0].year}–${p1.year}`} /><Kpi v={f3(s2)} l={`Slope ${breakYear}–${pe.year}`} /><Kpi v={f3(factor)} l="Correction factor" tone="good" /></div>
    <p className="note">Corrected value = recorded × {fix === "second" ? "Ma/Mc = slope(first)/slope(second)" : "slope(second)/slope(first)"}, applied to the {fix === "second" ? "second" : "first"} segment. Slide the break until both segments look straight — that is the year the station changed.</p>
    <details className="sol"><summary>Corrected record (table)</summary><div style={{ maxHeight: 260, overflow: "auto" }}><table><thead><tr><th>Year</th><th>X recorded</th><th>X corrected</th></tr></thead><tbody>
      {pts.map((p, i) => { const corr = (fix === "second" ? i >= kk : i < kk) ? p.X * factor : p.X; return <tr key={p.year}><td>{p.year}</td><td>{p.X}</td><td style={{ color: corr !== p.X ? C.warn : null }}>{Math.round(corr)}</td></tr>; })}
    </tbody></table></div></details>
  </Box>;
}

/* ============ S05: Thiessen ============ */
const CATCH = [[0, 0], [2.2, -0.6], [4.6, -0.2], [6.8, 0.9], [8.1, 2.8], [8.4, 5.0], [7.3, 6.9], [5.6, 7.8], [3.4, 7.6], [1.7, 6.4], [0.4, 4.6], [-0.5, 2.4]];
const areaOf = p => Math.abs(p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0)) / 2;
function clipHalf(poly, a, b) { // keep points closer to a than b
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, nx = b[0] - a[0], ny = b[1] - a[1];
  const f = p => (p[0] - mx) * nx + (p[1] - my) * ny; const out = [];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i], Q = poly[(i + 1) % poly.length], fp = f(P), fq = f(Q);
    if (fp <= 0) out.push(P);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
  }
  return out;
}
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
function Thiessen() {
  const init = [{ n: "TG1", p: [4.0, 3.6], P: 105 }, { n: "TG2", p: [1.6, 1.4], P: 86 }, { n: "TG3", p: [6.9, 5.9], P: 124 }, { n: "TG4", p: [9.6, 0.8], P: 71 }];
  const [g, setG] = useState(init); const [drag, setDrag] = useState(null);
  const W = 520, H = 440, X0 = -2, X1 = 11, Y0 = -2, Y1 = 9.5;
  const sx = x => (x - X0) / (X1 - X0) * W, sy = y => H - (y - Y0) / (Y1 - Y0) * H;
  const ref = useRef();
  const A = areaOf(CATCH);
  const cells = g.map((gi, i) => { let poly = CATCH; g.forEach((gj, j) => { if (j !== i && poly.length) poly = clipHalf(poly, gi.p, gj.p); }); return poly; });
  const areas = cells.map(c => c.length > 2 ? areaOf(c) : 0);
  const map = sum(g.map((gi, i) => gi.P * areas[i] / A));
  const ins = g.filter(gi => inside(gi.p, CATCH)); const ar = ins.length ? mean(ins.map(x => x.P)) : NaN;
  const cols = ["#d7e9f0", "#e4f1ea", "#f7ebdd", "#eee8f7", "#fbe9e1", "#fff3c4"];
  const move = e => { if (drag == null) return; const r = ref.current.getBoundingClientRect(); const x = X0 + (e.clientX - r.left) / r.width * (X1 - X0), y = Y0 + (1 - (e.clientY - r.top) / r.height) * (Y1 - Y0); setG(g.map((gi, i) => i === drag ? { ...gi, p: [Math.max(X0, Math.min(X1, x)), Math.max(Y0, Math.min(Y1, y))] } : gi)); };
  return <Box title="Thiessen polygons — drag the gauges">
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "1 1 340px" }}>
        <svg ref={ref} viewBox={`0 0 ${W} ${H}`} onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)} style={{ background: "#fbfaf7", borderRadius: 6, border: "1px solid #e8e4dc", cursor: drag != null ? "grabbing" : "default" }}>
          {cells.map((c, i) => c.length > 2 && <polygon key={i} points={c.map(p => sx(p[0]) + "," + sy(p[1])).join(" ")} fill={cols[i % 6]} stroke="#a09080" strokeDasharray="4 3" />)}
          <polygon points={CATCH.map(p => sx(p[0]) + "," + sy(p[1])).join(" ")} fill="none" stroke={C.river} strokeWidth="2.5" />
          {cells.map((c, i) => { if (c.length < 3) return null; const cx = mean(c.map(p => p[0])), cy = mean(c.map(p => p[1])); return <text key={"t" + i} x={sx(cx)} y={sy(cy) + 22} fontSize="11" textAnchor="middle" fill="#5a5048">{f1(areas[i])} km²</text>; })}
          {g.map((gi, i) => <g key={gi.n} onPointerDown={e => { e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); setDrag(i); }} style={{ cursor: "grab" }}>
            <circle cx={sx(gi.p[0])} cy={sy(gi.p[1])} r="14" fill="transparent" /><polygon points={`${sx(gi.p[0])},${sy(gi.p[1]) - 9} ${sx(gi.p[0]) - 8},${sy(gi.p[1]) + 6} ${sx(gi.p[0]) + 8},${sy(gi.p[1]) + 6}`} fill={C.navy} />
            <text x={sx(gi.p[0]) + 10} y={sy(gi.p[1]) - 6} fontSize="12" fontWeight="700" fill={C.navy}>{gi.n}</text></g>)}
          <text x="8" y={H - 8} fontSize="10" fill="#a09080">Teaching catchment, {f1(A)} km² · 1 grid unit = 1 km</text>
        </svg>
      </div>
      <div className="wg-col" style={{ flex: "1 1 240px" }}>
        <table><thead><tr><th>Gauge</th><th>P (mm)</th><th>Area km²</th><th>Weight</th></tr></thead><tbody>
          {g.map((gi, i) => <tr key={gi.n}><td>{gi.n}{inside(gi.p, CATCH) ? "" : " (out)"}</td><td><Num w={56} value={gi.P} onChange={v => setG(g.map((x, j) => j === i ? { ...x, P: v } : x))} /></td><td>{f2(areas[i])}</td><td>{f3(areas[i] / A)}</td></tr>)}
        </tbody></table>
        <div className="kpis"><Kpi v={f1(map) + " mm"} l="Thiessen mean" tone="good" /><Kpi v={f1(ar) + " mm"} l={`Arithmetic (${ins.length} inside)`} /></div>
        <div className="btn-row"><button className="btn ghost" onClick={() => g.length < 6 && setG([...g, { n: "TG" + (g.length + 1), p: [3 + g.length * 0.7, 5], P: 100 }])}>+ gauge</button><button className="btn ghost" onClick={() => setG(init)}>Reset</button></div>
        <p className="note">Drag a gauge across the boundary and watch its weight. A gauge outside the catchment can still carry weight; a gauge squeezed between neighbours loses it.</p>
      </div>
    </div>
  </Box>;
}

/* ============ S06: missing data ============ */
function MissingData() {
  const presets = {
    "Slide Q1 (station C)": { Nx: 93.5, rows: [["A", 9.7, 100.3], ["B", 8.3, 109.5], ["D", 11.7, 125.7], ["E", 8.0, 117.5]] },
    "Example 1": { Nx: 1010, rows: [["1", 68, 1080], ["2", 55, 920], ["3", 82, 1250]] },
    "TG3 activity": { Nx: 1120, rows: [["TG1", 105, 960], ["TG2", 86, 845], ["TG4", 71, 790]] },
  };
  const [s, setS] = useState(presets["Slide Q1 (station C)"]);
  const lo = 0.9 * s.Nx, hi = 1.1 * s.Nx; const out = s.rows.filter(r => r[2] < lo || r[2] > hi);
  const ar = mean(s.rows.map(r => r[1])), nr = s.Nx / s.rows.length * sum(s.rows.map(r => r[1] / r[2]));
  const useNR = out.length > 0;
  return <Box title="Missing rainfall — which method, and what estimate?">
    <div className="btn-row" style={{ marginBottom: 8 }}>{Object.entries(presets).map(([k, p]) => <button key={k} className="btn ghost" onClick={() => setS(p)}>{k}</button>)}</div>
    <div className="wg-row">
      <div className="wg-col">
        <label className="f">Normal annual rainfall at missing station, Nₓ<Num value={s.Nx} onChange={v => setS({ ...s, Nx: v })} /></label>
        <table><thead><tr><th>Index station</th><th>Pᵢ</th><th>Nᵢ</th><th>within ±10 %?</th></tr></thead><tbody>
          {s.rows.map((r, i) => <tr key={i}><td>{r[0]}</td>{[1, 2].map(c => <td key={c}><Num value={r[c]} onChange={v => setS({ ...s, rows: s.rows.map((x, j) => j === i ? x.map((y, q) => q === c ? v : y) : x) })} /></td>)}<td style={{ color: r[2] < lo || r[2] > hi ? C.warn : C.green }}>{r[2] < lo || r[2] > hi ? "no" : "yes"}</td></tr>)}
        </tbody></table>
      </div>
      <div className="wg-col">
        <p className="note">±10 % band of Nₓ: <b>{f2(lo)}</b> to <b>{f2(hi)}</b></p>
        <div className="kpis"><Kpi v={f2(ar)} l="Arithmetic average" tone={!useNR ? "good" : ""} /><Kpi v={f2(nr)} l="Normal ratio" tone={useNR ? "good" : ""} /></div>
        <div className="detail">{useNR ? <>Station{out.length > 1 ? "s" : ""} <b>{out.map(r => r[0]).join(", ")}</b> lie{out.length > 1 ? "" : "s"} outside the band → use the <b>normal ratio method</b>: Pₓ = (Nₓ/M) Σ(Pᵢ/Nᵢ) = <b>{f2(nr)}</b>.</> : <>All index normals lie within ±10 % → the <b>arithmetic average</b> is acceptable: Pₓ = <b>{f2(ar)}</b>.</>}</div>
      </div>
    </div>
  </Box>;
}

/* ============ S07: storm explorer + moving average ============ */
function StormExplorer() {
  const [inc, setInc] = useState([2, 4, 7, 12, 18, 26, 14, 9, 6, 4, 2, 1]); const dt = 0.5;
  const [d, setD] = useState(2);
  const cum = inc.reduce((a, v) => [...a, (a[a.length - 1] || 0) + v], []);
  let best = -1, bi = 0; for (let i = 0; i + d <= inc.length; i++) { const s = sum(inc.slice(i, i + d)); if (s > best) { best = s; bi = i; } }
  const T = inc.length * dt, tot = sum(inc);
  const tab = [1, 2, 4, 6, inc.length].filter((x, i, a) => x <= inc.length && a.indexOf(x) === i).map(k => { let b = 0; for (let i = 0; i + k <= inc.length; i++) b = Math.max(b, sum(inc.slice(i, i + k))); return [k * dt, b, b / (k * dt)]; });
  return <Box title="Hyetograph and mass curve — find the most intense burst">
    <div className="wg-row">
      <div className="wg-col"><Plot w={360} h={230} x={[0, T]} y={[0, Math.max(...inc) / dt * 1.15]} xLabel="Time (h)" yLabel="Intensity (mm/h)">{(sx, sy) => inc.map((v, i) => <rect key={i} x={sx(i * dt) + 1} width={sx(dt) - sx(0) - 2} y={sy(v / dt)} height={sy(0) - sy(v / dt)} fill={i >= bi && i < bi + d ? C.gold : C.river} />)}</Plot></div>
      <div className="wg-col"><Plot w={360} h={230} x={[0, T]} y={[0, tot * 1.08]} xLabel="Time (h)" yLabel="Cumulative (mm)">{(sx, sy) => <>
        <rect x={sx(bi * dt)} width={sx((bi + d) * dt) - sx(bi * dt)} y={sy(tot * 1.08)} height={sy(0) - sy(tot * 1.08)} fill={C.gold} opacity=".15" />
        <path d={path([[0, 0], ...cum.map((v, i) => [(i + 1) * dt, v])], sx, sy)} stroke={C.brown} strokeWidth="2.2" fill="none" />
        {cum.map((v, i) => <circle key={i} cx={sx((i + 1) * dt)} cy={sy(v)} r="2.6" fill={C.brown} />)}</>}</Plot></div>
    </div>
    <label className="f">Window duration: <b>{d * dt} h</b> → maximum depth <b>{best} mm</b> ({bi * dt}–{(bi + d) * dt} h), intensity <b>{f1(best / (d * dt))} mm/h</b><input type="range" min="1" max={inc.length} value={d} onChange={e => setD(+e.target.value)} /></label>
    <div className="wg-row">
      <div className="wg-col"><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{inc.map((v, i) => <Num key={i} w={48} value={v} onChange={nv => setInc(inc.map((x, j) => j === i ? (+nv || 0) : x))} />)}</div><p className="note">30-minute depths (mm) — edit them to make your own storm.</p></div>
      <div className="wg-col"><table><thead><tr><th>Duration (h)</th><th>Max depth (mm)</th><th>Max intensity (mm/h)</th></tr></thead><tbody>{tab.map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{f1(r[2])}</td></tr>)}</tbody></table></div>
    </div>
  </Box>;
}
const MA_SLIDE = [676, 578, 95, 462, 472, 699, 479, 431, 493, 503, 415, 531, 504, 828, 679, 1244, 999, 573, 596, 375, 635, 497, 386, 438, 568, 356, 685, 825, 426, 612].map((v, i) => ({ year: 1950 + i, P: v }));
function MovingAverage() {
  const course = useCsv("data/U1_annual_rainfall_1991_2020.csv");
  const [ds, setDs] = useState("slide"); const [m, setM] = useState(3); const [pc, setPc] = useState(80);
  const rows = ds === "slide" ? MA_SLIDE : (course || []).map(r => ({ year: r.year, P: r.A }));
  if (!rows.length) return <Box title="Moving average">Loading…</Box>;
  const mu = mean(rows.map(r => r.P)), th = mu * pc / 100, k = (m - 1) / 2;
  const ma = rows.map((r, i) => i - k < 0 || i + k >= rows.length ? null : mean(rows.slice(i - k, i + k + 1).map(x => x.P)));
  const low = rows.filter(r => r.P < th).map(r => r.year), above = rows.filter(r => r.P > mu).length;
  const y0 = rows[0].year, y1 = rows[rows.length - 1].year, ym = Math.max(...rows.map(r => r.P)) * 1.1;
  return <Box title="Annual rainfall — moving average and dry years">
    <div className="wg-row" style={{ alignItems: "center", marginBottom: 6 }}>
      <Seg value={ds} onChange={setDs} options={[["slide", "Slide data 1950–1979"], ["course", "Course station A 1991–2020"]]} />
      <Seg value={m} onChange={setM} options={[[3, "3-yr"], [5, "5-yr"], [7, "7-yr"]]} />
    </div>
    <Plot w={680} h={280} xFmt={v => String(v)} x={[y0 - 1, y1 + 1]} y={[0, ym]} xLabel="Year" yLabel="Annual rainfall (mm)">{(sx, sy) => <>
      {rows.map(r => <rect key={r.year} x={sx(r.year - 0.4)} width={sx(0.8) - sx(0)} y={sy(r.P)} height={sy(0) - sy(r.P)} fill={r.P < th ? "#f0b9a5" : "#c9dbe3"}><title>{r.year}: {r.P} mm</title></rect>)}
      <line x1={sx(y0 - 1)} x2={sx(y1 + 1)} y1={sy(mu)} y2={sy(mu)} stroke={C.grey} strokeDasharray="3 3" />
      <line x1={sx(y0 - 1)} x2={sx(y1 + 1)} y1={sy(th)} y2={sy(th)} stroke={C.warn} strokeDasharray="6 3" />
      <path d={path(rows.map((r, i) => [r.year, ma[i]]), sx, sy)} stroke={C.navy} strokeWidth="2.4" fill="none" /></>}</Plot>
    <Legend items={[[C.navy, m + "-year moving average"], [C.grey, "mean " + f1(mu) + " mm", 1], [C.warn, pc + " % of mean = " + f1(th) + " mm", 1]]} />
    <label className="f" style={{ marginTop: 10 }}>Dry-year threshold: <b>{pc} % of mean</b><input type="range" min="50" max="100" value={pc} onChange={e => setPc(+e.target.value)} /></label>
    <div className="kpis"><Kpi v={low.length} l={`Years below ${pc}% of mean`} tone="bad" /><Kpi v={above} l="Years above mean" /></div>
    <p className="note">Below threshold: {low.join(", ") || "none"}.{ds === "slide" && " (The textbook table prints 162 for 1979 in the last moving-mean sum; the annual value is 612, which gives the printed 621.0.)"}</p>
  </Box>;
}

/* ============ S08: risk, Weibull, IDF ============ */
function RiskCalc() {
  const [T, setT] = useState(50); const [n, setN] = useState(20); const [R, setR] = useState(10);
  const p = 1 / T, risk = 1 - (1 - p) ** n, Treq = 1 / (1 - Math.pow(1 - R / 100, 1 / n));
  const fact = k => k <= 1 ? 1 : k * fact(k - 1);
  const binom = r => fact(n) / (fact(n - r) * fact(r)) * p ** r * (1 - p) ** (n - r);
  const pts = []; for (let yr = 1; yr <= 100; yr++) pts.push([yr, 1 - (1 - p) ** yr]);
  return <Box title="Return period, risk and reliability">
    <div className="wg-row">
      <div className="wg-col">
        <label className="f">Return period T: <b>{T} years</b> (P = {f3(p)})<input type="range" min="2" max="500" value={T} onChange={e => setT(+e.target.value)} /></label>
        <label className="f">Design life n: <b>{n} years</b><input type="range" min="1" max="100" value={n} onChange={e => setN(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={(risk * 100).toFixed(1) + "%"} l="Risk: at least once in n yrs" tone="bad" /><Kpi v={((1 - risk) * 100).toFixed(1) + "%"} l="Reliability" tone="good" /></div>
        <table><thead><tr><th>Occurs exactly r times</th>{[0, 1, 2, 3].map(r => <th key={r}>r={r}</th>)}</tr></thead><tbody><tr><td>Probability</td>{[0, 1, 2, 3].map(r => <td key={r}>{f3(binom(r))}</td>)}</tr></tbody></table>
        <label className="f" style={{ marginTop: 10 }}>Acceptable risk over the design life: <b>{R} %</b> → design for <b>T = {Math.round(Treq)} years</b><input type="range" min="1" max="50" value={R} onChange={e => setR(+e.target.value)} /></label>
      </div>
      <div className="wg-col"><Plot w={360} h={250} x={[1, 100]} y={[0, 1]} xLabel="Years of exposure" yLabel="Risk">{(sx, sy) => <>
        <path d={path(pts, sx, sy)} stroke={C.warn} strokeWidth="2.2" fill="none" />
        <line x1={sx(Math.min(n, 100))} x2={sx(Math.min(n, 100))} y1={sy(0)} y2={sy(risk)} stroke={C.navy} strokeDasharray="4 3" /><circle cx={sx(Math.min(n, 100))} cy={sy(risk)} r="4" fill={C.navy} /></>}</Plot>
        <p className="note">Even a "50-year" storm has about a one-in-three chance of occurring during a 20-year design life.</p></div>
    </div>
  </Box>;
}
function WeibullIDF() {
  const data = useCsv("data/U1_annual_max_1day_1991_2020.csv");
  const [txt, setTxt] = useState("98, 142, 76, 118, 105, 163, 88, 127, 111, 94");
  useEffect(() => { }, []);
  const vals = txt.split(/[\s,;]+/).map(Number).filter(v => isFinite(v) && v > 0);
  const srt = [...vals].sort((a, b) => b - a), N = srt.length, rows = srt.map((v, i) => [i + 1, v, (N + 1) / (i + 1), (i + 1) / (N + 1)]);
  const [K, setK] = useState(6.93), [x, setX] = useState(0.189), [a, setA] = useState(0.5), [nn, setNn] = useState(0.878);
  const [Tq, setTq] = useState(25), [Dq, setDq] = useState(1);
  const i = (T, D) => K * T ** x / (D + a) ** nn;
  const Ds = []; for (let D = 0.1; D <= 24; D *= 1.15) Ds.push(D);
  const cols = [[2, "#9cc3d3"], [10, C.river], [25, C.gold], [100, C.brown]];
  return <Box title="Plotting position and IDF curves">
    <div className="sec-title" style={{ marginTop: 0 }}>Weibull plotting position</div>
    <div className="wg-row">
      <div className="wg-col"><label className="f">Annual maxima (any units, comma-separated)<textarea rows="3" style={{ width: "100%", fontFamily: "DM Mono", fontSize: 12, padding: 6, border: "1px solid #e8e4dc", borderRadius: 4 }} value={txt} onChange={e => setTxt(e.target.value)} /></label>
        <div className="btn-row"><button className="btn ghost" onClick={() => setTxt("98, 142, 76, 118, 105, 163, 88, 127, 111, 94")}>Example (10 yrs)</button>{data && <button className="btn ghost" onClick={() => setTxt(data.map(r => r.max_1day_mm).join(", "))}>Course station X (30 yrs)</button>}</div>
        <div style={{ maxHeight: 200, overflow: "auto", marginTop: 8 }}><table><thead><tr><th>m</th><th>Value</th><th>T = (N+1)/m</th><th>P = m/(N+1)</th></tr></thead><tbody>{rows.map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{f2(r[2])}</td><td>{f3(r[3])}</td></tr>)}</tbody></table></div></div>
      <div className="wg-col">{N > 1 && <Plot w={360} h={250} xLog x={[1, Math.max(10, (N + 1) * 1.2)]} y={[Math.min(...srt) * 0.9, Math.max(...srt) * 1.08]} xLabel="Return period T (yr, log)" yLabel="Annual maximum">{(sx, sy) => rows.map(r => <circle key={r[0]} cx={sx(r[2])} cy={sy(r[1])} r="3.5" fill={C.river} />)}</Plot>}</div>
    </div>
    <div className="sec-title">IDF curves: i = K·Tˣ / (D + a)ⁿ</div>
    <div className="wg-row">
      <div className="wg-col" style={{ maxWidth: 280 }}>
        {[["K", K, setK], ["x", x, setX], ["a", a, setA], ["n", nn, setNn]].map(([l, v, s]) => <label key={l} className="f" style={{ display: "flex", gap: 8, alignItems: "center" }}><b style={{ width: 16 }}>{l}</b><Num value={v} onChange={s} /></label>)}
        <p className="note">Defaults are illustrative constants. Replace them with your station's published values (T1 tabulates many Indian stations).</p>
        <label className="f">T = <b>{Tq} yr</b><input type="range" min="2" max="100" value={Tq} onChange={e => setTq(+e.target.value)} /></label>
        <label className="f">D = <b>{Dq} h</b><input type="range" min="0.25" max="24" step="0.25" value={Dq} onChange={e => setDq(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={f2(i(Tq, Dq)) + " cm/h"} l="Intensity" /><Kpi v={f1(i(Tq, Dq) * Dq * 10) + " mm"} l="Depth" tone="good" /></div>
      </div>
      <div className="wg-col"><Plot w={420} h={300} xLog yLog x={[0.1, 24]} y={[0.1, 30]} xLabel="Duration D (h)" yLabel="Intensity (cm/h)">{(sx, sy) => <>
        {cols.map(([T, c]) => <path key={T} d={path(Ds.map(D => [D, i(T, D)]), sx, sy)} stroke={c} strokeWidth="2" fill="none" />)}
        <circle cx={sx(Dq)} cy={sy(i(Tq, Dq))} r="5" fill={C.navy} /></>}</Plot>
        <Legend items={cols.map(([T, c]) => [c, "T = " + T + " yr"])} /></div>
    </div>
  </Box>;
}

/* ============ S09: D8 flow direction ============ */
const DEM = (() => {
  const R = 9, Cc = 9, bump = [0, 2, 1, 3, 0, 2, 1, 0, 3, 1, 2, 0, 1, 3, 2, 0, 1, 2, 3, 1, 0, 2, 1, 3, 0, 1, 2];
  const z = []; for (let r = 0; r < R; r++) { z.push([]); for (let c = 0; c < Cc; c++) { let v = 20 + 5 * (R - 1 - r) + 6 * Math.abs(c - 4) + bump[(r * 7 + c * 3) % bump.length]; if (c === 1 && r < 5) v -= 7; if (c === 2 && r >= 4 && r <= 6) v -= 4; z[r].push(v); } }
  z[8][4] = 10; return z;
})();
function D8() {
  const R = DEM.length, Cn = DEM[0].length, nb = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const dir = useMemo(() => DEM.map((row, r) => row.map((z, c) => { let best = 0, bd = null; nb.forEach(([dr, dc]) => { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= R || cc >= Cn) return; const s = (z - DEM[rr][cc]) / Math.hypot(dr, dc); if (s > best) { best = s; bd = [rr, cc]; } }); return bd; })), []);
  const acc = useMemo(() => { const a = DEM.map(r => r.map(() => 1)); const cells = []; DEM.forEach((row, r) => row.forEach((z, c) => cells.push([z, r, c]))); cells.sort((p, q) => q[0] - p[0]).forEach(([, r, c]) => { const d = dir[r][c]; if (d) a[d[0]][d[1]] += a[r][c]; }); return a; }, [dir]);
  const [sel, setSel] = useState(null); const [outlet, setOutlet] = useState(null); const [mode, setMode] = useState("trace"); const [th, setTh] = useState(6); const [show, setShow] = useState("elev");
  const trail = []; if (sel) { let p = sel, k = 0; while (p && k++ < 100) { trail.push(p); p = dir[p[0]][p[1]]; } }
  const shed = new Set(); if (outlet) DEM.forEach((row, r) => row.forEach((_, c) => { let p = [r, c], k = 0; while (p && k++ < 100) { if (p[0] === outlet[0] && p[1] === outlet[1]) { shed.add(r + "," + c); break; } p = dir[p[0]][p[1]]; } }));
  const S = 46, zmin = Math.min(...DEM.flat()), zmax = Math.max(...DEM.flat()), amax = Math.max(...acc.flat());
  const shade = (r, c) => show === "elev" ? `hsl(${100 - 70 * (DEM[r][c] - zmin) / (zmax - zmin)},${35}%,${78 - 30 * (DEM[r][c] - zmin) / (zmax - zmin)}%)` : `hsl(200,60%,${95 - 55 * Math.log(acc[r][c]) / Math.log(amax)}%)`;
  return <Box title="D8 flow direction on a tiny DEM">
    <div className="wg-row" style={{ alignItems: "center", marginBottom: 8 }}>
      <Seg value={mode} onChange={setMode} options={[["trace", "Click: trace flow path"], ["outlet", "Click: set outlet → watershed"]]} />
      <Seg value={show} onChange={setShow} options={[["elev", "Elevation"], ["acc", "Flow accumulation"]]} />
    </div>
    <div className="wg-row">
      <div className="wg-col" style={{ flex: "0 1 430px" }}>
        <svg viewBox={`0 0 ${Cn * S} ${R * S}`}>
          {DEM.map((row, r) => row.map((z, c) => { const st = acc[r][c] >= th, inShed = shed.has(r + "," + c), d = dir[r][c];
            return <g key={r + "-" + c} onClick={() => mode === "trace" ? setSel([r, c]) : setOutlet([r, c])} style={{ cursor: "pointer" }}>
              <rect x={c * S} y={r * S} width={S} height={S} fill={shade(r, c)} stroke="#fff" />
              {inShed && <rect x={c * S + 2} y={r * S + 2} width={S - 4} height={S - 4} fill="none" stroke={C.gold} strokeWidth="3" />}
              {st && <rect x={c * S + S / 2 - 5} y={r * S + S / 2 - 5} width="10" height="10" rx="5" fill="#1a5f7a" />}
              <text x={c * S + 4} y={r * S + 12} fontSize="10" fill="#333">{show === "elev" ? z : acc[r][c]}</text>
              {d && <line x1={c * S + S / 2} y1={r * S + S / 2} x2={c * S + S / 2 + (d[1] - c) * S * 0.36} y2={r * S + S / 2 + (d[0] - r) * S * 0.36} stroke="#0f1f3d" strokeWidth="1.3" markerEnd="url(#d8a)" />}
            </g>; }))}
          <defs><marker id="d8a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0f1f3d" /></marker></defs>
          {trail.length > 1 && <path d={trail.map((p, i) => (i ? "L" : "M") + (p[1] * S + S / 2) + " " + (p[0] * S + S / 2)).join("")} stroke={C.warn} strokeWidth="4" fill="none" opacity=".8" />}
        </svg>
      </div>
      <div className="wg-col">
        <label className="f">Stream threshold: cells with accumulation ≥ <b>{th}</b><input type="range" min="2" max="40" value={th} onChange={e => setTh(+e.target.value)} /></label>
        <div className="kpis"><Kpi v={outlet ? shed.size : "–"} l="Watershed cells" tone="good" /><Kpi v={outlet ? acc[outlet[0]][outlet[1]] : "–"} l="Accumulation at outlet" /></div>
        <p className="note">Each arrow points to the steepest downhill neighbour (of 8). Accumulation counts the cells draining through each cell. Blue dots mark "streams" above the threshold — lower it and the network grows. Set the outlet on the bottom-centre cell to get the whole catchment; set it on a tributary to get a sub-catchment. The number of watershed cells always equals the accumulation at the outlet.</p>
        <button className="btn ghost" onClick={() => { setSel(null); setOutlet(null); }}>Clear</button>
      </div>
    </div>
  </Box>;
}

/* ============ Unit II Widgets ============ */

/* Horton curve fitter & infiltration capacity */
function HortonFit() {
  const [f0, setF0] = useState(60);
  const [fc, setFc] = useState(10);
  const [kh, setKh] = useState(1.2);
  const [intensity, setIntensity] = useState(35);
  const [tMax, setTMax] = useState(4);

  const ptsF = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax;
    const ft = fc + (f0 - fc) * Math.exp(-kh * t);
    ptsF.push([t, ft]);
  }

  let tp = null;
  if (intensity > fc && intensity < f0) {
    tp = -Math.log((intensity - fc) / (f0 - fc)) / kh;
  } else if (intensity >= f0) {
    tp = 0;
  }

  const f1hr = fc + (f0 - fc) * Math.exp(-kh * 1);
  const Ftotal = fc * tMax + ((f0 - fc) / kh) * (1 - Math.exp(-kh * tMax));

  return (
    <Box title="Horton's infiltration model & curve fitter">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <Plot
            w={460}
            h={250}
            x={[0, tMax]}
            y={[0, Math.max(f0 * 1.15, intensity * 1.15, 60)]}
            xLabel="Time t (hours)"
            yLabel="Infiltration capacity f(t) & Rain i (mm/h)"
          >
            {(sx, sy) => (
              <>
                <line
                  x1={sx(0)}
                  x2={sx(tMax)}
                  y1={sy(intensity)}
                  y2={sy(intensity)}
                  stroke={C.river}
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
                <path
                  d={path(ptsF, sx, sy)}
                  fill="none"
                  stroke={C.green}
                  strokeWidth="3"
                />
                {tp !== null && tp >= 0 && tp <= tMax && (
                  <g>
                    <line
                      x1={sx(tp)}
                      x2={sx(tp)}
                      y1={sy(0)}
                      y2={sy(intensity)}
                      stroke={C.warn}
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle cx={sx(tp)} cy={sy(intensity)} r="5" fill={C.warn} />
                    <text
                      x={sx(tp) + 6}
                      y={sy(intensity) - 6}
                      fontSize="10"
                      fill={C.warn}
                      fontWeight="600"
                    >
                      tp = {tp.toFixed(2)} h
                    </text>
                  </g>
                )}
              </>
            )}
          </Plot>
          <Legend
            items={[
              [C.green, "Infiltration capacity f(t)"],
              [C.river, `Rain intensity i = ${intensity} mm/h`, true],
              [C.warn, "Ponding start (tp)"]
            ]}
          />
        </div>
        <div className="wg-col">
          <label className="f">
            Initial capacity f0: <b>{f0} mm/h</b>
            <input
              type="range"
              min="20"
              max="150"
              step="5"
              value={f0}
              onChange={e => setF0(+e.target.value)}
            />
          </label>
          <label className="f">
            Final constant capacity fc: <b>{fc} mm/h</b>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={fc}
              onChange={e => setFc(+e.target.value)}
            />
          </label>
          <label className="f">
            Decay constant kh: <b>{kh.toFixed(2)} h⁻¹</b>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={kh}
              onChange={e => setKh(+e.target.value)}
            />
          </label>
          <label className="f">
            Rainfall intensity i: <b>{intensity} mm/h</b>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={intensity}
              onChange={e => setIntensity(+e.target.value)}
            />
          </label>
          <div className="kpis">
            <Kpi v={f1hr.toFixed(1) + " mm/h"} l="Rate at t = 1 hr" />
            <Kpi v={Ftotal.toFixed(1) + " mm"} l={`Total F(${tMax}h)`} />
            <Kpi
              v={tp !== null ? tp.toFixed(2) + " h" : "No runoff (i ≤ fc)"}
              l="Ponding time tp"
              tone={tp !== null ? "good" : ""}
            />
          </div>
          <p className="note">
            When rainfall intensity $i$ exceeds infiltration capacity $f(t)$ after $t_p$, surface ponding and runoff begin. The area under $f(t)$ represents total infiltration depth.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* phi-index & W-index finder on a storm hyetograph */
function PhiIndex() {
  const [rain] = useState([12, 28, 48, 36, 22, 10]);
  const [phi, setPhi] = useState(20);
  const [ia, setIa] = useState(5);

  const totalP = sum(rain);
  const excess = rain.map(p => Math.max(0, p - phi));
  const totalR = sum(excess);
  const te = rain.filter(p => p > phi).length;
  const totalLoss = totalP - totalR;
  const tr = rain.length;
  const wIndex = Math.max(0, (totalP - totalR - ia) / tr);

  const maxBar = Math.max(...rain, phi, 50);

  return (
    <Box title="φ-index and W-index finder on a storm hyetograph">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 360px" }}>
          <svg viewBox="0 0 460 250" style={{ background: "#fff", border: "1px solid #e8e4dc", borderRadius: 6 }}>
            {[0, 10, 20, 30, 40, 50].map(yVal => {
              const y = 210 - (yVal / maxBar) * 180;
              return (
                <g key={yVal}>
                  <line x1="45" x2="440" y1={y} y2={y} stroke="#eee" />
                  <text x="38" y={y + 4} fontSize="10" textAnchor="end" fill="#777">{yVal}</text>
                </g>
              );
            })}
            {rain.map((val, i) => {
              const bw = 46;
              const x = 60 + i * 62;
              const barH = (val / maxBar) * 180;
              const phiH = Math.min(barH, (phi / maxBar) * 180);
              const excH = Math.max(0, barH - phiH);

              return (
                <g key={i}>
                  <rect x={x} y={210 - phiH} width={bw} height={phiH} fill="#2d6a4f" opacity="0.8" rx="2" />
                  {excH > 0 && (
                    <rect x={x} y={210 - barH} width={bw} height={excH} fill="#1a5f7a" rx="2" />
                  )}
                  <text x={x + bw / 2} y={210 - barH - 6} fontSize="11" textAnchor="middle" fontWeight="600" fill="#0f1f3d">
                    {val}
                  </text>
                  <text x={x + bw / 2} y="226" fontSize="11" textAnchor="middle" fill="#555">
                    H{i + 1}
                  </text>
                </g>
              );
            })}
            {(() => {
              const yPhi = 210 - (phi / maxBar) * 180;
              return (
                <g>
                  <line x1="45" x2="440" y1={yPhi} y2={yPhi} stroke="#c8973a" strokeWidth="2.5" strokeDasharray="5 3" />
                  <text x="435" y={yPhi - 5} fontSize="11" textAnchor="end" fill="#c8973a" fontWeight="700">
                    φ = {phi} mm/h
                  </text>
                </g>
              );
            })()}
            <text x="18" y="110" transform="rotate(-90 18 110)" fontSize="11" fill="#1a3260" fontWeight="600" textAnchor="middle">Rainfall intensity (mm/h)</text>
          </svg>
          <Legend
            items={[
              ["#1a5f7a", "Rainfall excess (Direct runoff)"],
              ["#2d6a4f", "Infiltration loss (≤ φ)"],
              ["#c8973a", "φ-index line", true]
            ]}
          />
        </div>
        <div className="wg-col">
          <label className="f">
            φ-index threshold: <b>{phi} mm/h</b>
            <input type="range" min="0" max="45" step="1" value={phi} onChange={e => setPhi(+e.target.value)} />
          </label>
          <label className="f">
            Initial abstraction Ia (for W-index): <b>{ia} mm</b>
            <input type="range" min="0" max="25" step="1" value={ia} onChange={e => setIa(+e.target.value)} />
          </label>
          <div className="kpis">
            <Kpi v={totalP + " mm"} l="Total storm P" />
            <Kpi v={totalR + " mm"} l="Direct runoff R" tone={totalR > 0 ? "good" : ""} />
            <Kpi v={totalLoss + " mm"} l="Total losses" />
            <Kpi v={te + " h"} l="Effective duration te" />
            <Kpi v={wIndex.toFixed(2) + " mm/h"} l="W-index" />
          </div>
          <p className="note">
            The <b>φ-index</b> is the constant infiltration rate above which rainfall depth equals runoff depth ($R$). The <b>W-index</b> accounts for initial abstraction ($I_a$) averaged over the entire storm duration ($t_r$).
          </p>
        </div>
      </div>
    </Box>
  );
}

/* SCS-CN Calculator */
function ScsCn() {
  const [cn, setCn] = useState(75);
  const [p, setP] = useState(100);
  const [lambda, setLambda] = useState(0.2);

  const S = 25400 / cn - 254;
  const Ia = lambda * S;
  const Q = p > Ia ? Math.pow(p - Ia, 2) / (p - Ia + S) : 0;
  const Cr = p > 0 ? Q / p : 0;

  const cn1 = cn / (2.281 - 0.01281 * cn);
  const cn3 = cn / (0.427 + 0.00573 * cn);

  const pVals = [10, 25, 50, 75, 100, 125, 150, 200];
  const qCurve = pVals.map(pv => [pv, pv > Ia ? Math.pow(pv - Ia, 2) / (pv - Ia + S) : 0]);

  return (
    <Box title="SCS Curve Number (CN) runoff calculator">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <Plot
            w={460}
            h={240}
            x={[0, 200]}
            y={[0, 180]}
            xLabel="Storm rainfall P (mm)"
            yLabel="Direct runoff Q (mm)"
          >
            {(sx, sy) => (
              <>
                <line x1={sx(0)} y1={sy(0)} x2={sx(180)} y2={sy(180)} stroke="#ccc" strokeDasharray="3 3" />
                <path d={path(qCurve, sx, sy)} fill="none" stroke={C.river} strokeWidth="3" />
                <circle cx={sx(p)} cy={sy(Q)} r="6" fill={C.gold} stroke="#fff" strokeWidth="2" />
                <text x={sx(p) + 8} y={sy(Q) + 4} fontSize="11" fill={C.navy} fontWeight="700">
                  Q = {Q.toFixed(1)} mm
                </text>
              </>
            )}
          </Plot>
          <Legend
            items={[
              [C.river, `Runoff curve (CN = ${cn})`],
              [C.gold, `Current event: P = ${p} mm, Q = ${Q.toFixed(1)} mm`],
              ["#ccc", "100% runoff line (Q = P)", true]
            ]}
          />
        </div>
        <div className="wg-col">
          <label className="f">
            Curve Number CN (AMC-II): <b>{cn}</b>
            <input type="range" min="40" max="98" step="1" value={cn} onChange={e => setCn(+e.target.value)} />
          </label>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {[["Group A (Forest/Sand)", 55], ["Group B (Agricultural)", 70], ["Group C (Clay Loam)", 80], ["Group D / Urban", 90]].map(([lbl, val]) => (
              <button key={lbl} className="btn ghost" style={{ fontSize: 11, padding: "3px 8px" }} onClick={() => setCn(val)}>
                {lbl}
              </button>
            ))}
          </div>
          <label className="f">
            Storm rainfall P: <b>{p} mm</b>
            <input type="range" min="10" max="250" step="5" value={p} onChange={e => setP(+e.target.value)} />
          </label>
          <label className="f">
            Abstraction ratio λ: <b>{lambda}</b>
            <div className="seg" style={{ display: "flex", marginTop: 4 }}>
              {[0.1, 0.2, 0.3].map(v => (
                <button key={v} className={lambda === v ? "on" : ""} onClick={() => setLambda(v)}>
                  λ = {v} {v === 0.2 ? "(SCS standard)" : "(Indian watersheds)"}
                </button>
              ))}
            </div>
          </label>
          <div className="kpis">
            <Kpi v={S.toFixed(1) + " mm"} l="Max retention S" />
            <Kpi v={Ia.toFixed(1) + " mm"} l="Initial abstraction Ia" />
            <Kpi v={Q.toFixed(1) + " mm"} l="Runoff depth Q" tone="good" />
            <Kpi v={(Cr * 100).toFixed(1) + " %"} l="Runoff coeff Q/P" />
          </div>
          <p className="note">
            Equivalent CN values for antecedent moisture: <b>AMC-I (Dry):</b> {cn1.toFixed(0)} · <b>AMC-III (Wet):</b> {cn3.toFixed(0)}.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* Penman & Blaney-Criddle ET Calculator */
function PenCalc() {
  const [method, setMethod] = useState("penman");
  const [temp, setTemp] = useState(28);
  const [rh, setRh] = useState(65);
  const [u2, setU2] = useState(120);
  const [hn, setHn] = useState(5.2);
  const [pPct, setPPct] = useState(8.5);
  const [kCrop, setKCrop] = useState(0.85);

  const ew = 4.584 * Math.exp((17.27 * temp) / (temp + 237.3));
  const ea = ew * (rh / 100);
  const slopeA = (4098 * ew) / Math.pow(temp + 237.3, 2);
  const gamma = 0.49;
  const Ea = 0.35 * (1 + u2 / 160) * (ew - ea);
  const petPenman = (slopeA * hn + Ea * gamma) / (slopeA + gamma);

  const tF = 1.8 * temp + 32; // Blaney-Criddle (T1 form) needs temperature in °F
  const petBCMonthly = 2.54 * kCrop * (pPct * tF / 100) * 10;
  const petBCDaily = petBCMonthly / 30;

  return (
    <Box title="Evapotranspiration calculator (Penman & Blaney-Criddle)">
      <div style={{ marginBottom: 12 }}>
        <Seg value={method} onChange={setMethod} options={[["penman", "Penman combination method"], ["bc", "Blaney-Criddle method"]]} />
      </div>
      {method === "penman" ? (
        <div className="wg-row">
          <div className="wg-col">
            <label className="f">Mean temperature: <b>{temp} °C</b>
              <input type="range" min="10" max="42" step="1" value={temp} onChange={e => setTemp(+e.target.value)} />
            </label>
            <label className="f">Relative humidity RH: <b>{rh} %</b>
              <input type="range" min="20" max="95" step="1" value={rh} onChange={e => setRh(+e.target.value)} />
            </label>
            <label className="f">Wind speed at 2m: <b>{u2} km/day</b> ({(u2 / 24).toFixed(1)} km/h)
              <input type="range" min="30" max="350" step="10" value={u2} onChange={e => setU2(+e.target.value)} />
            </label>
            <label className="f">Net radiation Hn: <b>{hn} mm/day</b>
              <input type="range" min="2.0" max="8.0" step="0.2" value={hn} onChange={e => setHn(+e.target.value)} />
            </label>
          </div>
          <div className="wg-col">
            <div className="kpis">
              <Kpi v={petPenman.toFixed(2) + " mm/day"} l="Penman PET" tone="good" />
              <Kpi v={(petPenman * 30).toFixed(0) + " mm"} l="Monthly PET (30 d)" />
              <Kpi v={ew.toFixed(2) + " mm Hg"} l="Sat. vapour press. ew" />
              <Kpi v={ea.toFixed(2) + " mm Hg"} l="Actual vapour press. ea" />
              <Kpi v={Ea.toFixed(2) + " mm/day"} l="Aerodynamic term Ea" />
            </div>
            <p className="note">
              Penman combines the energy-budget term (A·Hn) with the mass-transfer aerodynamic term (Ea·γ). At higher temperatures, the radiation slope A dominates over the psychrometric constant γ.
            </p>
          </div>
        </div>
      ) : (
        <div className="wg-row">
          <div className="wg-col">
            <label className="f">Mean temperature t: <b>{temp} °C</b>
              <input type="range" min="10" max="42" step="1" value={temp} onChange={e => setTemp(+e.target.value)} />
            </label>
            <label className="f">Monthly daytime percentage p: <b>{pPct} %</b>
              <input type="range" min="6.5" max="11.0" step="0.1" value={pPct} onChange={e => setPPct(+e.target.value)} />
            </label>
            <label className="f">Crop growth coefficient k: <b>{kCrop}</b>
              <input type="range" min="0.4" max="1.3" step="0.05" value={kCrop} onChange={e => setKCrop(+e.target.value)} />
            </label>
          </div>
          <div className="wg-col">
            <div className="kpis">
              <Kpi v={petBCDaily.toFixed(2) + " mm/day"} l="Daily ET (approx)" tone="good" />
              <Kpi v={petBCMonthly.toFixed(1) + " mm/mo"} l="Monthly crop ET" />
            </div>
            <p className="note">
              The empirical Blaney-Criddle formula estimates monthly consumptive use: E_T = 2.54 · K · p · T_f / 100 cm/month, with T_f in °F (here {tF.toFixed(1)} °F), widely used for irrigation water scheduling where radiation and humidity data are unavailable.
            </p>
          </div>
        </div>
      )}
    </Box>
  );
}


/* ============ S10: where does the rain go ============ */
function Abstractions() {
  const [v, setV] = useState({ P: 40, T: 4, Ci: 1.0, K: 3, E: 0.1, f: 6, Sd: 4 });
  const set = k => e => setV({ ...v, [k]: +e.target.value });
  const intc = Math.min(v.P, v.Ci + v.K * v.E * v.T);
  const net = v.P - intc;
  const infl = Math.min(net, v.f * v.T);
  const exc = net - infl;
  const dep = Math.min(exc, v.Sd);
  const ro = exc - dep;
  const parts = [[intc, C.green, "Interception"], [infl, C.brown, "Infiltration"], [dep, C.gold, "Depression"], [ro, C.river, "Runoff"]];
  let x = 0;
  const sl = (k, l, min, max, st, u) => <label className="f">{l}: <b>{v[k]} {u}</b><input type="range" min={min} max={max} step={st} value={v[k]} onChange={set(k)} /></label>;
  return <Box title="Where does a storm's rain go?">
    <div className="wg-row">
      <div className="wg-col">
        {sl("P", "Storm rainfall P", 2, 150, 1, "mm")}
        {sl("T", "Storm duration t", 1, 24, 1, "h")}
        {sl("Ci", "Interception storage Sᵢ", 0, 2.5, 0.25, "mm")}
        {sl("K", "Leaf-area ratio Kᵢ", 0, 8, 0.5, "")}
        {sl("f", "Infiltration rate f", 0, 30, 0.5, "mm/h")}
        {sl("Sd", "Depression storage S_d", 0, 15, 0.5, "mm")}
        <div className="btn-row">
          <button className="btn ghost" onClick={() => setV({ ...v, Ci: 1.0, K: 3, f: 6, Sd: 4 })}>Forest on loam</button>
          <button className="btn ghost" onClick={() => setV({ ...v, Ci: 0.25, K: 0.5, f: 1, Sd: 1.5 })}>Paved city</button>
          <button className="btn ghost" onClick={() => setV({ ...v, Ci: 0.5, K: 1, f: 15, Sd: 5 })}>Grass on sand</button>
        </div>
      </div>
      <div className="wg-col">
        <svg viewBox="0 0 600 46">{parts.map(([d, c, t]) => { const w = v.P > 0 ? d / v.P * 600 : 0; const el = <g key={t}><rect x={x} y="6" width={w} height="30" fill={c} /><text x={x + 5} y="26" fontSize="12" fill="#fff">{w > 80 ? t : ""}</text></g>; x += w; return el; })}</svg>
        <div className="kpis">{parts.map(([d, , t]) => <Kpi key={t} v={f1(d) + " mm"} l={t + " (" + (v.P > 0 ? Math.round(d / v.P * 100) : 0) + "%)"} tone={t === "Runoff" ? "good" : ""} />)}</div>
        <p className="note">Order used: interception first (Horton, Iᵢ = Sᵢ + Kᵢ·E·t with E = {v.E} mm/h), then infiltration at the rate f for the whole storm, then the excess fills depressions; what is left runs off. Real catchments overlap these steps — HEC-HMS keeps the same order: canopy → surface → loss method → transform.</p>
      </div>
    </div>
  </Box>;
}

/* ============ S10: Dalton's law ============ */
const esMm = t => 4.584 * Math.exp(17.27 * t / (t + 237.3)); // saturation vapour pressure, mm Hg (Tetens)
function Dalton() {
  const [v, setV] = useState({ tw: 25, ta: 30, rh: 50, c: 0.4 });
  const set = k => e => setV({ ...v, [k]: +e.target.value });
  const ew = esMm(v.tw), ea = v.rh / 100 * esMm(v.ta), d = ew - ea, E = v.c * d;
  const ts = Array.from({ length: 41 }, (_, i) => i);
  return <Box title="Dalton's law: E = C (e_w − e_a)">
    <div className="wg-row">
      <div className="wg-col">
        <label className="f">Water-surface temperature: <b>{v.tw} °C</b><input type="range" min="0" max="40" value={v.tw} onChange={set("tw")} /></label>
        <label className="f">Air temperature: <b>{v.ta} °C</b><input type="range" min="0" max="45" value={v.ta} onChange={set("ta")} /></label>
        <label className="f">Relative humidity: <b>{v.rh} %</b><input type="range" min="5" max="100" value={v.rh} onChange={set("rh")} /></label>
        <label className="f">Coefficient C (wind, site): <b>{v.c} mm/day per mm Hg</b><input type="range" min="0.1" max="1" step="0.02" value={v.c} onChange={set("c")} /></label>
        <div className="kpis"><Kpi v={f2(ew)} l="e_w (mm Hg)" /><Kpi v={f2(ea)} l="e_a (mm Hg)" /><Kpi v={f2(d)} l="Deficit e_w − e_a" tone={d < 0 ? "bad" : ""} /><Kpi v={f2(E) + " mm/d"} l={d < 0 ? "Condensation" : "Evaporation"} tone={d < 0 ? "bad" : "good"} /></div>
        {d < 0 && <p className="note" style={{ color: C.warn }}>e_a &gt; e_w: the air holds more vapour than the water surface can — net flux is downwards (dew / condensation), not evaporation.</p>}
      </div>
      <div className="wg-col">
        <Plot w={520} h={300} x={[0, 40]} y={[0, 60]} xLabel="Temperature (°C)" yLabel="Vapour pressure (mm Hg)">{(sx, sy) => <g>
          <path d={path(ts.map(t => [t, esMm(t)]), sx, sy)} fill="none" stroke={C.river} strokeWidth="2.5" />
          {v.ta <= 40 && <line x1={sx(v.ta)} x2={sx(v.ta)} y1={sy(Math.min(60, esMm(v.ta)))} y2={sy(ea)} stroke={C.gold} strokeDasharray="4 3" />}
          {v.tw <= 40 && <circle cx={sx(v.tw)} cy={sy(ew)} r="6" fill={C.river} />}
          {v.ta <= 40 && <circle cx={sx(v.ta)} cy={sy(ea)} r="6" fill={C.gold} />}
          {v.tw <= 40 && <text x={sx(v.tw) - 8} y={sy(ew) - 9} fontSize="11" textAnchor="end" fill={C.river}>water e_w</text>}
          {v.ta <= 40 && <text x={sx(v.ta) + 8} y={sy(ea) + 14} fontSize="11" fill="#8a6d1d">air e_a</text>}
        </g>}</Plot>
        <p className="note">The curve is the saturation vapour pressure. The water surface sits <i>on</i> the curve at its own temperature; the air sits below the curve at its own temperature, lowered by its relative humidity (dashed line). The difference in height between the two dots, e_w − e_a, drives evaporation.</p>
      </div>
    </div>
  </Box>;
}

export const WIDGETS = {
  abstractions: Abstractions,
  dalton: Dalton,
  ...ILLOS,
  waterbudget: WaterBudget,
  globalwater: GlobalWater,
  precip: PrecipExplorer,
  tipping: TippingBucket,
  network: GaugeNetwork,
  dmc: DoubleMass,
  thiessen: Thiessen,
  missing: MissingData,
  storm: StormExplorer,
  movavg: MovingAverage,
  risk: RiskCalc,
  idf: WeibullIDF,
  d8: D8,
  hortonfit: HortonFit,
  phiindex: PhiIndex,
  scscn: ScsCn,
  pencalc: PenCalc
};

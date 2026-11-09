const fs = require('fs');

const codeToAdd = `
/* ============ S16: Runoff Pathways Explorer ============ */
function RunoffPathways() {
  const [rainRate, setRainRate] = useState("mod");
  const [landCover, setLandCover] = useState("forest");

  // Physics parameters based on cover
  const covers = {
    forest: { name: "Forested Mountain Slope", fc: 35, baseK: 0.85, interK: 0.65, col: "#15803d" },
    agri: { name: "Agricultural Terraced Loam", fc: 14, baseK: 0.50, interK: 0.35, col: "#ca8a04" },
    urban: { name: "Urbanized / Paved Catchment", fc: 3, baseK: 0.15, interK: 0.10, col: "#b91c1c" }
  };
  const rates = {
    light: { name: "Light Drizzle (4 mm/h)", i: 4, rainLines: 15 },
    mod: { name: "Moderate Steady Rain (18 mm/h)", i: 18, rainLines: 35 },
    heavy: { name: "Severe Monsoon Storm (50 mm/h)", i: 50, rainLines: 70 }
  };

  const c = covers[landCover];
  const r = rates[rainRate];

  // Runoff partitioning
  const overland = Math.max(0, r.i - c.fc);
  const infiltrated = Math.min(r.i, c.fc);
  const interflow = infiltrated * c.interK;
  const percolation = infiltrated * (1 - c.interK) * c.baseK;
  const deepLoss = Math.max(0, infiltrated - interflow - percolation);
  const total = overland + interflow + percolation + deepLoss;

  const pctO = total > 0 ? Math.round((overland / total) * 100) : 0;
  const pctI = total > 0 ? Math.round((interflow / total) * 100) : 0;
  const pctB = total > 0 ? Math.round((percolation / total) * 100) : 0;
  const pctD = Math.max(0, 100 - pctO - pctI - pctB);

  return (
    <Box title="Catchment Runoff Pathways & Water Partitioning" kind="Visual Simulation">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Rainfall Intensity:</span>
          <Seg value={rainRate} onChange={setRainRate} options={[
            ["light", "Light (4 mm/h)"],
            ["mod", "Moderate (18 mm/h)"],
            ["heavy", "Heavy (50 mm/h)"]
          ]} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Land Cover & Soil:</span>
          <Seg value={landCover} onChange={setLandCover} options={[
            ["forest", "Forest (Loamy)"],
            ["agri", "Agriculture (Loam)"],
            ["urban", "Urban / Compacted"]
          ]} />
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 500 240" style={{ width: "100%", background: "#f0fdf4", borderRadius: 6, border: "1px solid #cbd5e1" }}>
            <defs>
              <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78350f" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#451a03" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="gwGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect x="0" y="0" width="500" height="70" fill="#e0f2fe" />
            <path d="M 20,25 Q 40,10 65,22 Q 90,8 115,25 Q 130,22 135,32 L 15,32 Z" fill="#94a3b8" />
            <path d="M 120,20 Q 145,5 175,18 Q 205,5 235,22 L 115,28 Z" fill="#64748b" />
            <path d="M 260,22 Q 285,8 315,20 Q 345,6 375,24 L 255,28 Z" fill="#94a3b8" />

            {/* Rain Streaks */}
            {Array.from({ length: Math.min(50, r.rainLines) }).map((_, idx) => {
              const rx = 20 + (idx * 470) / r.rainLines;
              return <line key={idx} x1={rx} y1={35} x2={rx - 10} y2={65} stroke="#0284c7" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.6" />;
            })}

            {/* Hillside Ground Profile */}
            <path d="M 0,90 Q 180,105 340,140 L 370,165 L 430,165 L 450,145 L 500,145 L 500,240 L 0,240 Z" fill="url(#soilGrad)" />

            {/* Vegetation / Urban Layer */}
            {landCover === "forest" && (
              <g fill="#15803d">
                <path d="M 30,88 L 40,65 L 50,88 Z M 65,90 L 78,60 L 90,90 Z M 120,95 L 132,68 L 145,95 Z M 190,105 L 205,75 L 220,105 Z M 260,118 L 275,85 L 290,118 Z" />
              </g>
            )}
            {landCover === "agri" && (
              <g stroke="#ca8a04" strokeWidth="2">
                <line x1="30" y1="88" x2="100" y2="92" />
                <line x1="110" y1="96" x2="180" y2="104" />
                <line x1="190" y1="108" x2="260" y2="120" />
                <line x1="270" y1="125" x2="330" y2="140" />
              </g>
            )}
            {landCover === "urban" && (
              <g fill="#64748b" stroke="#334155">
                <rect x="50" y="68" width="30" height="20" />
                <rect x="130" y="78" width="35" height="22" />
                <rect x="220" y="92" width="40" height="24" />
              </g>
            )}

            {/* Stream Channel */}
            <polygon points="360,150 370,165 430,165 440,150" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <text x="382" y="160" fontSize="9" fill="#0369a1" fontWeight="bold">River Outlet</text>

            {/* Water Table / Aquifer */}
            <path d="M 0,160 Q 200,175 370,165 L 430,165 Q 460,168 500,170 L 500,240 L 0,240 Z" fill="url(#gwGrad)" />
            <text x="15" y="180" fontSize="9" fill="#bae6fd">Phreatic Water Table (Unconfined Aquifer)</text>

            {/* Flow Arrow Overlays */}
            {/* 1. Overland Flow */}
            {overland > 0 && (
              <g stroke="#2563eb" strokeWidth="2.5" fill="none">
                <path d="M 60,86 Q 200,102 360,148" markerEnd="url(#arr)" strokeDasharray="4,2" />
                <text x="170" y="86" fontSize="10" fill="#1d4ed8" fontWeight="bold">Surface Runoff (Overland Flow: {pctO}%)</text>
              </g>
            )}

            {/* 2. Subsurface Interflow */}
            <g stroke="#f59e0b" strokeWidth="2" fill="none">
              <path d="M 80,115 Q 220,135 365,158" strokeDasharray="3,2" />
              <text x="180" y="132" fontSize="9" fill="#d97706" fontWeight="bold">Interflow (Through Macropores: {pctI}%)</text>
            </g>

            {/* 3. Deep Percolation & Baseflow */}
            <g stroke="#0284c7" strokeWidth="2" fill="none">
              <path d="M 120,140 L 120,185 Q 240,210 375,170" strokeDasharray="2,2" />
              <text x="140" y="215" fontSize="9" fill="#0369a1" fontWeight="bold">Baseflow (Groundwater Seepage: {pctB}%)</text>
            </g>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={pctO + "%"} l="Overland Flow" tone={pctO > 40 ? "bad" : "good"} />
            <Kpi v={pctI + "%"} l="Subsurface Interflow" tone="warn" />
            <Kpi v={pctB + "%"} l="Groundwater Baseflow" tone="good" />
            <Kpi v={f1(r.i) + " mm/h"} l="Rainfall Rate vs Capacity (" + c.fc + " mm/h)" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Hydrologic Partitioning:</b> In natural forest catchments, high infiltration capacity sustains dry-weather baseflow. In urbanized basins, impervious surfaces force {pctO}% of rain into destructive overland storm runoff.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S18: HEC-HMS Loss Model Calibration ============ */
function HmsCalibrator() {
  const [ia, setIa] = useState(15);
  const [fc, setFc] = useState(2.2);

  // Observed benchmark (from S18 Worked Example 1)
  // Storm: P = 85 mm in 10h, Catchment Area = 75 km2, Observed Volume = 3.60 MCM, Observed Peak = 125 m3/s
  const A = 75; // km2
  const P = 85; // mm
  const T = 10; // h
  const V_obs = 3.60; // MCM

  // Calculate simulated
  const effectiveRain = Math.max(0, P - ia - fc * T);
  const V_sim = (effectiveRain * A * 1000) / 1e6; // MCM
  const volErrPct = ((V_sim - V_obs) / V_obs) * 100;
  
  // Synthetic NSE curve based on parameter distance
  const dist = Math.sqrt(Math.pow((ia - 15) / 10, 2) + Math.pow((fc - 2.2) / 1.5, 2));
  const nse = Math.max(-0.5, 0.98 - dist * 0.45);

  // Hydrograph curves
  const obsHydro = [5, 12, 38, 85, 125, 110, 75, 45, 26, 14, 8, 5];
  const scale = V_sim / V_obs;
  const simHydro = obsHydro.map((q, idx) => {
    if (idx === 0) return 5;
    return Math.max(5, Math.round(5 + (q - 5) * scale * (1 - (fc - 2.2) * 0.08)));
  });

  return (
    <Box title="HEC-HMS Loss Model Calibration Workbench" kind="Interactive Model">
      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 240px" }}>
          <label className="f">Initial Abstraction Ia: <b>{ia} mm</b>
            <input type="range" min="0" max="30" step="1" value={ia} onChange={e => setIa(+e.target.value)} />
          </label>
          <label className="f">Constant Loss Rate fc: <b>{f2(fc)} mm/h</b>
            <input type="range" min="0.5" max="5.0" step="0.1" value={fc} onChange={e => setFc(+e.target.value)} />
          </label>
          <div className="btn-row" style={{ marginTop: 8 }}>
            <button className="btn ghost" onClick={() => { setIa(15); setFc(2.2); }}>Reset to Best Fit (Ia=15, fc=2.2)</button>
            <button className="btn ghost" onClick={() => { setIa(5); setFc(4.0); }}>Over-Loss Case</button>
          </div>
        </div>

        <div className="wg-col" style={{ flex: "1 1 280px" }}>
          <div className="kpis">
            <Kpi v={f2(V_sim) + " MCM"} l="Simulated Volume (Obs: 3.60)" tone={Math.abs(volErrPct) < 5 ? "good" : "bad"} />
            <Kpi v={(volErrPct >= 0 ? "+" : "") + f1(volErrPct) + "%"} l="Volume Error" tone={Math.abs(volErrPct) < 5 ? "good" : "bad"} />
            <Kpi v={f2(nse)} l="Nash-Sutcliffe (NSE)" tone={nse > 0.8 ? "good" : nse > 0.5 ? "warn" : "bad"} />
          </div>
          <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 4, background: nse > 0.9 ? "#ecfdf5" : "#fff1f2", color: nse > 0.9 ? "#065f46" : "#9f1239", fontSize: 12, fontWeight: "bold" }}>
            {nse > 0.9 ? "✓ Calibrated! Model satisfies CWC & USACE verification criteria." : "⚠ Mismatch: Adjust Ia and fc to match the gauge hydrograph volume."}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <svg viewBox="0 0 500 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
          {/* Grid lines */}
          {[40, 80, 120, 160].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
          <line x1="40" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="160" stroke="#64748b" strokeWidth="1.5" />

          {/* Axes labels */}
          <text x="25" y="25" fontSize="9" fill="#64748b">m³/s</text>
          <text x="450" y="174" fontSize="9" fill="#64748b">Hours</text>

          {/* Observed Path */}
          <path d={obsHydro.map((q, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 38} \${160 - (q / 140) * 135}\`).join(" ")}
            fill="none" stroke="#1e3a8a" strokeWidth="3" />

          {/* Simulated Path */}
          <path d={simHydro.map((q, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 38} \${160 - (q / 140) * 135}\`).join(" ")}
            fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeDasharray="5,3" />

          {/* Legend */}
          <circle cx="280" cy="25" r="4" fill="#1e3a8a" />
          <text x="290" y="28" fontSize="10" fill="#1e3a8a" fontWeight="bold">Observed Streamflow (Gauge)</text>
          <circle cx="280" cy="40" r="4" fill="#06b6d4" />
          <text x="290" y="43" fontSize="10" fill="#06b6d4" fontWeight="bold">HEC-HMS Simulated (Ia={ia}, fc={fc})</text>
        </svg>
      </div>
    </Box>
  );
}

/* ============ S19: Flood Hydrograph Anatomy ============ */
function HydroAnatomy() {
  const [qp, setQp] = useState(120);
  const [tp, setTp] = useState(8);
  const [kr, setKr] = useState(0.96);
  const [baseflow, setBaseflow] = useState(15);
  const [scale, setScale] = useState("lin");

  // Attenuation coefficient
  const a = -Math.log(kr); // 1/h
  const aSec = a / 3600;

  // Generate hydrograph points (0 to 36 hours)
  const pts = [];
  for (let t = 0; t <= 36; t += 1) {
    let q = baseflow;
    if (t < tp) {
      // Rising limb (quadratic concentration)
      q = baseflow + (qp - baseflow) * Math.pow(t / tp, 2.2);
    } else if (t === tp) {
      q = qp;
    } else {
      // Falling limb from crest through inflection point
      const dt = t - tp;
      if (dt <= 3) {
        // Crest to inflection
        q = qp - (qp - baseflow) * 0.15 * (dt / 3);
      } else {
        // Pure groundwater recession: Q = Q_inf * Kr^(t - t_inf)
        const q_inf = qp - (qp - baseflow) * 0.15;
        q = baseflow + (q_inf - baseflow) * Math.pow(kr, dt - 3);
      }
    }
    pts.push({ t, q });
  }

  // Storage remaining at t = 24h
  const q24 = pts.find(p => p.t === 24)?.q || 45;
  const storageMCM = ((q24 - baseflow) / aSec) / 1e6;

  return (
    <Box title="Flood Hydrograph Anatomy & Barnes Recession Analyzer" kind="Interactive Anatomy">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Peak Discharge Qp: <b>{qp} m³/s</b>
            <input type="range" min="50" max="180" step="5" value={qp} onChange={e => setQp(+e.target.value)} />
          </label>
          <label className="f">Time to Peak tp: <b>{tp} hours</b>
            <input type="range" min="4" max="14" step="1" value={tp} onChange={e => setTp(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Recession Factor Kr: <b>{f3(kr)} /h</b>
            <input type="range" min="0.88" max="0.985" step="0.005" value={kr} onChange={e => setKr(+e.target.value)} />
          </label>
          <div style={{ marginTop: 10 }}>
            <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Plot Scaling:</span>
            <Seg value={scale} onChange={setScale} options={[["lin", "Linear (Q vs t)"], ["log", "Semilog (ln Q vs t)"]]} />
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 220" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Baseflow shaded band */}
            {scale === "lin" && (
              <polygon points={\`40,\${180 - (baseflow / 200) * 160} 480,\${180 - (baseflow / 200) * 160} 480,180 40,180\`} fill="#fef3c7" opacity="0.6" />
            )}

            {/* Hydrograph Curve */}
            {scale === "lin" ? (
              <g>
                <path d={pts.map((p, i) => \`\${i === 0 ? "M" : "L"} \${40 + p.t * 12} \${180 - (p.q / 200) * 160}\`).join(" ")}
                  fill="none" stroke="#2563eb" strokeWidth="2.5" />
                
                {/* Annotations */}
                <circle cx={40 + tp * 12} cy={180 - (qp / 200) * 160} r="5" fill="#dc2626" />
                <text x={45 + tp * 12} y={170 - (qp / 200) * 160} fontSize="10" fill="#dc2626" fontWeight="bold">Peak Qp ({qp} m³/s)</text>

                {/* Inflection Point */}
                <circle cx={40 + (tp + 3) * 12} cy={180 - (pts[tp + 3].q / 200) * 160} r="4" fill="#d97706" />
                <text x={48 + (tp + 3) * 12} y={165 - (pts[tp + 3].q / 200) * 160} fontSize="9" fill="#d97706" fontWeight="bold">Pi: Inflection Point</text>
                <text x={48 + (tp + 3) * 12} y={176 - (pts[tp + 3].q / 200) * 160} fontSize="8" fill="#475569">(End of surface runoff)</text>

                {/* Recession curve note */}
                <text x="310" y="115" fontSize="9" fill="#0284c7" fontWeight="bold">Recession: Qt = Q0·Kr^t</text>
                <text x="310" y="127" fontSize="8" fill="#64748b">Kr = {f3(kr)}, a = {f3(a)} /h</text>
              </g>
            ) : (
              <g>
                {/* Semilog straight line */}
                <path d={pts.slice(tp + 2).map((p, i) => \`\${i === 0 ? "M" : "L"} \${40 + p.t * 12} \${180 - (Math.log(p.q) / Math.log(200)) * 160}\`).join(" ")}
                  fill="none" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4,2" />
                <path d={pts.map((p, i) => \`\${i === 0 ? "M" : "L"} \${40 + p.t * 12} \${180 - (Math.log(p.q) / Math.log(200)) * 160}\`).join(" ")}
                  fill="none" stroke="#2563eb" strokeWidth="2" />
                <text x="240" y="60" fontSize="10" fill="#0284c7" fontWeight="bold">Semilog Line Slope = -a = ln(Kr)</text>
              </g>
            )}

            {/* Axes */}
            <line x1="40" y1="180" x2="480" y2="180" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="180" stroke="#64748b" strokeWidth="1.5" />
            <text x="20" y="25" fontSize="9" fill="#64748b">{scale === "lin" ? "Q (m³/s)" : "ln(Q)"}</text>
            <text x="450" y="195" fontSize="9" fill="#64748b">Time (h)</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f3(a) + " /h"} l="Attenuation Coeff (a = -ln Kr)" tone="good" />
            <Kpi v={f2(storageMCM) + " MCM"} l="Groundwater Storage at t=24h (S=Q/a)" tone="good" />
            <Kpi v={f1(Math.log(2) / a) + " h"} l="Discharge Half-Life (ln2 / a)" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Recession Physics:</b> Beyond the inflection point $P_i$, surface inflow ceases completely. The streamflow drops purely as a linear reservoir discharging groundwater storage: $S_t = Q_t / a$.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S21: Sherman Unit Hydrograph Principles ============ */
function UhPrinciples() {
  const [r1, setR1] = useState(1.0); // cm
  const [r2, setR2] = useState(0.0); // cm
  const [mode, setMode] = useState("single");

  // Base 1-cm 4-hour Unit Hydrograph ordinates (every 2 hours)
  const baseUH = [0, 8, 24, 45, 60, 48, 32, 18, 9, 3, 0];
  const tVals = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  // Pulse 1 DRH ordinates
  const q1 = baseUH.map(u => u * r1);

  // Pulse 2 DRH ordinates (lagged by 4 hours = 2 time steps)
  const q2 = tVals.map((t, idx) => {
    if (idx < 2) return 0;
    return baseUH[idx - 2] * (mode === "multi" ? r2 : 0);
  });

  // Total DRH ordinates
  const qTotal = q1.map((v, i) => v + q2[i]);
  const maxQ = Math.max(...qTotal);

  return (
    <Box title="Sherman's Unit Hydrograph Principles Workbench" kind="Interactive Theory">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Pulse 1 Effective Rain R1: <b>{f1(r1)} cm</b>
            <input type="range" min="0.5" max="3.0" step="0.1" value={r1} onChange={e => setR1(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Operation Mode:</span>
          <Seg value={mode} onChange={setMode} options={[
            ["single", "Proportionality (Single Storm)"],
            ["multi", "Superposition (2 Pulses)"]
          ]} />
          {mode === "multi" && (
            <label className="f" style={{ marginTop: 6 }}>Pulse 2 Rain R2 (Lag = 4h): <b>{f1(r2)} cm</b>
              <input type="range" min="0.0" max="2.5" step="0.1" value={r2} onChange={e => setR2(+e.target.value)} />
            </label>
          )}
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 160].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="40" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="160" stroke="#64748b" strokeWidth="1.5" />

            {/* Base 1-cm UH reference (dashed gold) */}
            <path d={baseUH.map((u, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 40} \${160 - (u / 150) * 135}\`).join(" ")}
              fill="none" stroke="#ca8a04" strokeWidth="1.8" strokeDasharray="3,3" />

            {/* Pulse 1 DRH */}
            <path d={q1.map((v, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 40} \${160 - (v / 150) * 135}\`).join(" ")}
              fill="none" stroke="#2563eb" strokeWidth="2.5" />

            {/* Pulse 2 DRH */}
            {mode === "multi" && r2 > 0 && (
              <path d={q2.map((v, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 40} \${160 - (v / 150) * 135}\`).join(" ")}
                fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4,2" />
            )}

            {/* Total Combined */}
            {mode === "multi" && r2 > 0 && (
              <path d={qTotal.map((v, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 40} \${160 - (v / 150) * 135}\`).join(" ")}
                fill="none" stroke="#7c3aed" strokeWidth="3" />
            )}

            {/* Legend */}
            <line x1="60" y1="25" x2="80" y2="25" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="85" y="28" fontSize="9" fill="#ca8a04">1-cm UH Baseline</text>

            <line x1="180" y1="25" x2="200" y2="25" stroke="#2563eb" strokeWidth="2.5" />
            <text x="205" y="28" fontSize="9" fill="#2563eb">Pulse 1 DRH ({r1} cm)</text>

            {mode === "multi" && r2 > 0 && (
              <g>
                <line x1="310" y1="25" x2="330" y2="25" stroke="#7c3aed" strokeWidth="3" />
                <text x="335" y="28" fontSize="9" fill="#7c3aed" fontWeight="bold">Composite DRH = Q1 + Q2</text>
              </g>
            )}

            <text x="450" y="174" fontSize="9" fill="#64748b">Hours</text>
            <text x="20" y="25" fontSize="9" fill="#64748b">m³/s</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(maxQ) + " m³/s"} l="Peak Direct Runoff" tone="good" />
            <Kpi v={f1(r1 * 60) + " m³/s"} l="Pulse 1 Peak (R1 × Up)" />
            <Kpi v={f1(r1 + (mode === "multi" ? r2 : 0)) + " cm"} l="Total Effective Rainfall" tone="warn" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Sherman's Postulates:</b>
            <br />1. <i>Linear Proportionality:</i> Doubling rainfall excess exactly doubles every hydrograph ordinate.
            <br />2. <i>Superposition:</i> Successive storm hydrographs add directly without hydraulic cross-interaction.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S23: S-Curve & Duration Conversion ============ */
function ScurveTool() {
  const [numUhs, setNumUhs] = useState(5);
  const [targetD, setTargetD] = useState(2); // hours

  // Base 4-hour UH (A = 120 km2)
  const baseD = 4;
  const uh4 = [0, 15, 45, 70, 50, 30, 15, 5, 0]; // steps of 2h
  const A = 120; // km2
  const Se = (2.778 * A) / baseD; // Equilibrium discharge m3/s = 83.34 m3/s

  // Compute S-curve ordinates at steps of 2 hours up to 36 hours
  const tSteps = 18;
  const sCurve = [];
  for (let step = 0; step <= tSteps; step++) {
    const t = step * 2;
    let sVal = 0;
    for (let k = 0; k < numUhs; k++) {
      const lagT = k * baseD;
      const relStep = Math.round((t - lagT) / 2);
      if (relStep >= 0 && relStep < uh4.length) {
        sVal += uh4[relStep];
      } else if (relStep >= uh4.length) {
        // after time base, contribution is 0
      }
    }
    sCurve.push({ t, s: Math.min(Se, sVal) });
  }

  // Derive new D'-hour UH
  // U_D'(t) = (baseD / targetD) * [S(t) - S(t - targetD)]
  const derivedUH = sCurve.map(pt => {
    const lagPt = sCurve.find(p => p.t === pt.t - targetD);
    const deltaS = pt.s - (lagPt ? lagPt.s : 0);
    const u = (baseD / targetD) * Math.max(0, deltaS);
    return { t: pt.t, u };
  });

  const maxDerived = Math.max(...derivedUH.map(d => d.u));

  return (
    <Box title="S-Curve Hydrograph & Duration Conversion Workbench" kind="Interactive Workbench">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Lagged 4-h UHs Added: <b>{numUhs} UHs</b>
            <input type="range" min="1" max="8" step="1" value={numUhs} onChange={e => setNumUhs(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Target Duration D':</span>
          <Seg value={String(targetD)} onChange={v => setTargetD(+v)} options={[
            ["2", "D' = 2 h (Shorter)"],
            ["6", "D' = 6 h (Longer)"],
            ["8", "D' = 8 h (Double)"]
          ]} />
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 210" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Equilibrium asymptote */}
            <line x1="40" y1={170 - (Se / 110) * 140} x2="480" y2={170 - (Se / 110) * 140} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,4" />
            <text x="320" y={165 - (Se / 110) * 140} fontSize="9" fill="#dc2626" fontWeight="bold">Equilibrium Se = {f1(Se)} m³/s</text>

            {/* S-curve path */}
            <path d={sCurve.map((p, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 24} \${170 - (p.s / 110) * 140}\`).join(" ")}
              fill="none" stroke="#ea580c" strokeWidth="3" />

            {/* Derived D'-hour UH */}
            <path d={derivedUH.map((p, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 24} \${170 - (p.u / 110) * 140}\`).join(" ")}
              fill="none" stroke="#2563eb" strokeWidth="2.5" />

            {/* Base 4h UH reference */}
            <path d={uh4.map((u, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 24} \${170 - (u / 110) * 140}\`).join(" ")}
              fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />

            {/* Axes */}
            <line x1="40" y1="170" x2="480" y2="170" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#64748b" strokeWidth="1.5" />
            <text x="20" y="25" fontSize="9" fill="#64748b">m³/s</text>
            <text x="450" y="184" fontSize="9" fill="#64748b">Time (h)</text>

            {/* Legend */}
            <line x1="60" y1="25" x2="80" y2="25" stroke="#ea580c" strokeWidth="3" />
            <text x="85" y="28" fontSize="9" fill="#ea580c" fontWeight="bold">S-Curve S(t)</text>
            <line x1="170" y1="25" x2="190" y2="25" stroke="#2563eb" strokeWidth="2.5" />
            <text x="195" y="28" fontSize="9" fill="#2563eb" fontWeight="bold">Derived {targetD}-h UH (Peak={f1(maxDerived)})</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(Se) + " m³/s"} l="Equilibrium Se (2.778 A/D)" tone="warn" />
            <Kpi v={f1(maxDerived) + " m³/s"} l={"Derived " + targetD + "-h UH Peak"} tone="good" />
            <Kpi v={targetD < baseD ? "Sharper & Higher" : "Flatter & Lower"} l="Duration Effect" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Duration Principle:</b> Converting a $4\text{ h}$ UH to a shorter $2\text{ h}$ storm increases peak discharge by concentrating rainfall into a tighter window, whereas expanding to $6\text{ h}$ or $8\text{ h}$ attenuates the peak.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S25: Clark IUH & Time-Area Routing ============ */
function ClarkIuh() {
  const [tc, setTc] = useState(10); // time of concentration hours
  const [kStorage, setKStorage] = useState(4); // linear reservoir K hours
  const [shape, setShape] = useState("pear");

  // Time-area histogram (isochrones)
  const dt = 1; // hour
  const steps = Math.round(tc / dt);
  const areas = [];
  for (let i = 1; i <= steps; i++) {
    const fraction = i / steps;
    let w = 1.0;
    if (shape === "pear") w = Math.sin(fraction * Math.PI);
    if (shape === "elongated") w = 0.5 + 0.5 * Math.sin(fraction * Math.PI * 0.7);
    if (shape === "fan") w = Math.pow(fraction, 0.6) * Math.cos(fraction * 0.8);
    areas.push(Math.max(0.1, w));
  }
  const totalA = areas.reduce((s, v) => s + v, 0);
  const normA = areas.map(v => (v / totalA) * 100); // % area per isochrone

  // Linear reservoir routing: O2 = c0*I2 + c1*I1 + c2*O1
  const c0 = dt / (2 * kStorage + dt);
  const c1 = c0;
  const c2 = (2 * kStorage - dt) / (2 * kStorage + dt);

  const iuh = [];
  let prevO = 0;
  let prevI = 0;
  for (let t = 0; t <= tc + 15; t += dt) {
    const currI = t <= tc && t > 0 ? normA[t - 1] : 0;
    const currO = c0 * currI + c1 * prevI + c2 * prevO;
    iuh.push({ t, i: currI, o: currO });
    prevI = currI;
    prevO = currO;
  }

  const maxI = Math.max(...iuh.map(p => p.i));
  const maxO = Math.max(...iuh.map(p => p.o));

  return (
    <Box title="Clark IUH & Time-Area Routing Workbench" kind="Interactive Model">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Time of Concentration tc: <b>{tc} hours</b>
            <input type="range" min="6" max="16" step="1" value={tc} onChange={e => setTc(+e.target.value)} />
          </label>
          <label className="f">Storage Coefficient K: <b>{kStorage} hours</b>
            <input type="range" min="2" max="8" step="0.5" value={kStorage} onChange={e => setKStorage(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Catchment Morphology:</span>
          <Seg value={shape} onChange={setShape} options={[
            ["pear", "Pear / Standard"],
            ["elongated", "Elongated Valley"],
            ["fan", "Fan-Shaped Basin"]
          ]} />
          <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
            Routing coefficients: <i>c0 = c1 = {f3(c0)}, c2 = {f3(c2)}</i>
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 160].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="40" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="160" stroke="#64748b" strokeWidth="1.5" />

            {/* Time-area translation bar chart */}
            {iuh.filter(p => p.i > 0).map((p, idx) => {
              const x = 40 + p.t * 16;
              const h = (p.i / maxI) * 100;
              return <rect key={idx} x={x - 6} y={160 - h} width="12" height={h} fill="#cbd5e1" stroke="#94a3b8" />;
            })}

            {/* Routed Clark IUH curve */}
            <path d={iuh.map((p, i) => \`\${i === 0 ? "M" : "L"} \${40 + p.t * 16} \${160 - (p.o / maxI) * 100}\`).join(" ")}
              fill="none" stroke="#2563eb" strokeWidth="3" />

            {/* Labels */}
            <text x="70" y="30" fontSize="9" fill="#64748b">Grey Bars: Translation Time-Area Histogram (Pure Lag)</text>
            <text x="70" y="44" fontSize="9" fill="#2563eb" fontWeight="bold">Blue Curve: Clark IUH (After Linear Reservoir Routing S = K·O)</text>
            <text x="450" y="174" fontSize="9" fill="#64748b">Hours</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(maxO) + "%"} l="IUH Peak Discharge" tone="good" />
            <Kpi v={f1(0.5 * tc + kStorage) + " h"} l="Approx Basin Lag (0.5 tc + K)" />
            <Kpi v={f1(((maxI - maxO) / maxI) * 100) + "%"} l="Channel Attenuation" tone="warn" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Clark's Two-Stage Process:</b>
            <br />1. <i>Translation:</i> Travel time from isochrones without damping.
            <br />2. <i>Attenuation:</i> Storage routing through a single linear reservoir $S = K O$.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S26: Muskingum Channel Flood Routing ============ */
function MuskingumRoute() {
  const [K, setK] = useState(12); // hours
  const [x, setX] = useState(0.2); // weighting factor
  const dt = 4; // hours

  // Muskingum coefficients
  const denom = 2 * K * (1 - x) + dt;
  const c0 = (dt - 2 * K * x) / denom;
  const c1 = (dt + 2 * K * x) / denom;
  const c2 = (2 * K * (1 - x) - dt) / denom;

  // Inflow flood wave
  const inflow = [20, 35, 75, 140, 200, 175, 120, 70, 45, 30, 22, 20];
  const outflow = [20];
  for (let i = 1; i < inflow.length; i++) {
    const o = c0 * inflow[i] + c1 * inflow[i - 1] + c2 * outflow[i - 1];
    outflow.push(Math.max(15, o));
  }

  const peakIn = Math.max(...inflow);
  const peakOut = Math.max(...outflow);
  const attenuation = ((peakIn - peakOut) / peakIn) * 100;
  const tPeakIn = inflow.indexOf(peakIn) * dt;
  const tPeakOut = outflow.indexOf(peakOut) * dt;
  const lag = tPeakOut - tPeakIn;

  return (
    <Box title="Muskingum River Reach Flood Routing Simulator" kind="Interactive Physics">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Reach Travel Time K: <b>{K} hours</b>
            <input type="range" min="6" max="24" step="2" value={K} onChange={e => setK(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Wedge Storage Weight x: <b>{f2(x)}</b>
            <input type="range" min="0.0" max="0.45" step="0.05" value={x} onChange={e => setX(+e.target.value)} />
          </label>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
            {x === 0 ? "x = 0: Pure reservoir storage (maximum attenuation)" : x === 0.2 ? "x = 0.2: Standard natural river channel" : "x ≈ 0.4: Steep channel (mostly translation)"}
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 160].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="40" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="160" stroke="#64748b" strokeWidth="1.5" />

            {/* Inflow Hydrograph */}
            <path d={inflow.map((q, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 38} \${160 - (q / 220) * 140}\`).join(" ")}
              fill="none" stroke="#dc2626" strokeWidth="2.5" />

            {/* Outflow Hydrograph */}
            <path d={outflow.map((q, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 38} \${160 - (q / 220) * 140}\`).join(" ")}
              fill="none" stroke="#2563eb" strokeWidth="3" />

            {/* Legend */}
            <line x1="60" y1="25" x2="80" y2="25" stroke="#dc2626" strokeWidth="2.5" />
            <text x="85" y="28" fontSize="9" fill="#dc2626" fontWeight="bold">Inflow Hydrograph I(t) (Peak = {peakIn} m³/s)</text>
            <line x1="280" y1="25" x2="300" y2="25" stroke="#2563eb" strokeWidth="3" />
            <text x="305" y="28" fontSize="9" fill="#2563eb" fontWeight="bold">Routed Outflow O(t) (Peak = {f1(peakOut)} m³/s)</text>

            <text x="450" y="174" fontSize="9" fill="#64748b">Hours</text>
            <text x="20" y="25" fontSize="9" fill="#64748b">m³/s</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(attenuation) + "%"} l="Flood Peak Attenuation" tone="good" />
            <Kpi v={lag + " h"} l="Wave Translation Lag" tone="warn" />
            <Kpi v={f2(c0) + ", " + f2(c1) + ", " + f2(c2)} l="Coeffs C0, C1, C2 (Sum=1)" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Storage Hysteresis:</b> Storage $S = K[x I + (1-x)O]$ accounts for both prism storage (outflow-controlled) and wedge storage (inflow surge). Notice how increasing reach travel time $K$ flattens the flood wave.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S27: Modified Puls Reservoir Routing ============ */
function PulsRoute() {
  const [crestLen, setCrestLen] = useState(40); // m
  const [peakInflow, setPeakInflow] = useState(400); // m3/s

  const dt = 3600; // 1 hr in seconds
  // Synthetic inflow flood series
  const inflow = [50, 110, 240, 400, 360, 280, 190, 110, 70, 50].map(v => (v / 400) * peakInflow);

  // Reservoir characteristics: A = 2.0 km2 = 2e6 m2
  // Spillway rating: Q = 2.0 * L * H^1.5
  // Storage: S = A * H -> 2S/dt + Q
  const outflow = [inflow[0]];
  const heads = [Math.pow(inflow[0] / (2.0 * crestLen), 2 / 3)];

  for (let i = 1; i < inflow.length; i++) {
    const I1 = inflow[i - 1];
    const I2 = inflow[i];
    const O1 = outflow[i - 1];
    const H1 = heads[i - 1];
    const S1 = 2e6 * H1;
    const rhs = (I1 + I2) + (2 * S1 / dt - O1);

    // Iterative solution for H2 and O2
    let H2 = H1;
    for (let iter = 0; iter < 10; iter++) {
      const O2 = 2.0 * crestLen * Math.pow(Math.max(0, H2), 1.5);
      const S2 = 2e6 * H2;
      const func = (2 * S2 / dt + O2) - rhs;
      const dfunc = (2 * 2e6 / dt) + 3.0 * crestLen * Math.sqrt(Math.max(0.01, H2));
      H2 = Math.max(0, H2 - func / dfunc);
    }
    const O2 = 2.0 * crestLen * Math.pow(Math.max(0, H2), 1.5);
    outflow.push(O2);
    heads.push(H2);
  }

  const maxOut = Math.max(...outflow);
  const maxHead = Math.max(...heads);
  const damping = ((peakInflow - maxOut) / peakInflow) * 100;

  return (
    <Box title="Modified Puls Reservoir Routing Simulator" kind="Interactive Reservoir">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Spillway Crest Length L: <b>{crestLen} m</b>
            <input type="range" min="20" max="80" step="5" value={crestLen} onChange={e => setCrestLen(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Peak Flood Inflow: <b>{peakInflow} m³/s</b>
            <input type="range" min="250" max="600" step="25" value={peakInflow} onChange={e => setPeakInflow(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 160].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="40" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="160" stroke="#64748b" strokeWidth="1.5" />

            {/* Inflow */}
            <path d={inflow.map((q, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 45} \${160 - (q / 600) * 140}\`).join(" ")}
              fill="none" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="4,2" />

            {/* Outflow */}
            <path d={outflow.map((q, i) => \`\${i === 0 ? "M" : "L"} \${40 + i * 45} \${160 - (q / 600) * 140}\`).join(" ")}
              fill="none" stroke="#0891b2" strokeWidth="3" />

            {/* Spillway intersection indicator */}
            <circle cx={40 + outflow.indexOf(maxOut) * 45} cy={160 - (maxOut / 600) * 140} r="5" fill="#0891b2" />

            {/* Legend */}
            <line x1="60" y1="25" x2="80" y2="25" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,2" />
            <text x="85" y="28" fontSize="9" fill="#dc2626">Inflow Flood Hydrograph I(t)</text>
            <line x1="240" y1="25" x2="260" y2="25" stroke="#0891b2" strokeWidth="3" />
            <text x="265" y="28" fontSize="9" fill="#0891b2" fontWeight="bold">Spillway Outflow O(t) (Peak = {f1(maxOut)} m³/s)</text>

            <text x="450" y="174" fontSize="9" fill="#64748b">Hours</text>
            <text x="20" y="25" fontSize="9" fill="#64748b">m³/s</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(damping) + "%"} l="Peak Flood Damping" tone="good" />
            <Kpi v={f2(maxHead) + " m"} l="Max Surcharge Head Hmax" tone="warn" />
            <Kpi v={f2(maxHead * 2.0) + " MCM"} l="Surcharge Storage Engaged" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Modified Puls Principle:</b> The outflow hydrograph reaches its maximum exactly where it intersects the falling inflow hydrograph — representing the instant of peak reservoir storage.
          </p>
        </div>
      </div>
    </Box>
  );
}
`;

// Insert into src/widgets.jsx
let widgetsCode = fs.readFileSync('src/widgets.jsx', 'utf8');

if (!widgetsCode.includes('function RunoffPathways()')) {
  // Insert before export const WIDGETS
  widgetsCode = widgetsCode.replace('export const WIDGETS = {', codeToAdd + '\nexport const WIDGETS = {');
}

// Add to WIDGETS object
const mapEntries = `  "runoff-pathways": RunoffPathways,
  runoffpathways: RunoffPathways,
  "hms-calibrator": HmsCalibrator,
  hmscalibrator: HmsCalibrator,
  "hydro-anatomy": HydroAnatomy,
  hydroanatomy: HydroAnatomy,
  "uh-principles": UhPrinciples,
  uhprinciples: UhPrinciples,
  "scurve-tool": ScurveTool,
  scurvetool: ScurveTool,
  "clark-iuh": ClarkIuh,
  clarkiuh: ClarkIuh,
  "muskingum-route": MuskingumRoute,
  muskingumroute: MuskingumRoute,
  "puls-route": PulsRoute,
  pulsroute: PulsRoute,
`;

if (!widgetsCode.includes('"runoff-pathways": RunoffPathways')) {
  widgetsCode = widgetsCode.replace('export const WIDGETS = {', 'export const WIDGETS = {\n' + mapEntries);
}

fs.writeFileSync('src/widgets.jsx', widgetsCode, 'utf8');
console.log('✓ Successfully added Unit 2 & Unit 3 widgets to src/widgets.jsx');

const fs = require('fs');

const hydroGenesisCode = `
/* ============ S19: Hydrograph Genesis Side-by-Side Simulation ============ */
function HydroGenesis() {
  const [tSim, setTSim] = useState(0); // time in hours (0 to 24)
  const [playing, setPlaying] = useState(false);
  const [rainRate, setRainRate] = useState(25); // mm/h

  // Timer loop for simulation
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTSim(prev => {
        if (prev >= 24) {
          setPlaying(false);
          return 24;
        }
        return +(prev + 0.5).toFixed(1);
      });
    }, 150);
    return () => clearInterval(interval);
  }, [playing]);

  // Catchment parameters
  // Time of concentration tc = 8 hours
  // Storm duration tr = 4 hours (from t=1h to t=5h)
  const baseflow = 12;
  const tc = 8;
  const tp = 7;
  const qp = baseflow + (rainRate / 25) * 95;

  // Calculate discharge Q at any time t
  const getQ = t => {
    if (t < 1) return baseflow;
    if (t <= tp) {
      // Rising limb
      return baseflow + (qp - baseflow) * Math.pow((t - 1) / (tp - 1), 2.2);
    }
    if (t <= tp + 2) {
      // Crest segment
      return qp - (t - tp) * 3;
    }
    // Recession limb (exponential decay)
    const dt = t - (tp + 2);
    return baseflow + (qp - baseflow - 6) * Math.pow(0.85, dt);
  };

  const currQ = getQ(tSim);

  // Generate hydrograph points from 0 to 24h
  const hydroPts = [];
  for (let t = 0; t <= 24; t += 0.5) {
    hydroPts.push({ t, q: getQ(t) });
  }

  // Active catchment zones contributing at tSim
  // Zone 1 (near outlet): travel time 0-3h
  // Zone 2 (mid basin): travel time 3-6h
  // Zone 3 (upper headwaters): travel time 6-8h
  const rainActive = tSim >= 1 && tSim <= 5;
  const zone1Active = tSim >= 1 && tSim <= 8;
  const zone2Active = tSim >= 3 && tSim <= 12;
  const zone3Active = tSim >= 6 && tSim <= 15;

  let statusText = "Pre-storm Baseflow: Only groundwater sustains dry-weather streamflow.";
  let statusTone = "#64748b";
  if (rainActive && tSim < 3) {
    statusText = "Rainfall Inception: Overland flow from near-outlet area (Zone 1) reaches stream gauge.";
    statusTone = "#0284c7";
  } else if (tSim >= 3 && tSim < tp) {
    statusText = "Concentration (Rising Limb): Water from Zone 1 and Zone 2 arriving simultaneously.";
    statusTone = "#2563eb";
  } else if (Math.abs(tSim - tp) <= 0.8) {
    statusText = "Peak Discharge Qp: Entire catchment (Zones 1, 2, 3) contributing at outlet (t ≈ tc).";
    statusTone = "#dc2626";
  } else if (tSim > tp && tSim <= 15) {
    statusText = "Recession (Falling Limb): Rain stopped; surface detention and channel storage draining.";
    statusTone = "#ea580c";
  } else if (tSim > 15) {
    statusText = "Baseflow Depletion: Direct surface runoff ended; pure groundwater seepage decay.";
    statusTone = "#16a34a";
  }

  return (
    <Box title="Genesis of a Flood Hydrograph: Catchment Drainage & Outlet Response" kind="Dynamic Simulation">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button className="btn" style={{ minWidth: 80 }} onClick={() => setPlaying(!playing)}>
            {playing ? "⏸ Pause" : tSim >= 24 ? "↻ Replay" : "▶ Play"}
          </button>
          <button className="btn ghost" onClick={() => { setPlaying(false); setTSim(0); }}>Reset</button>
        </div>

        <div style={{ flex: 1 }}>
          <label className="f" style={{ margin: 0 }}>Simulation Time: <b>t = {f1(tSim)} hours</b>
            <input type="range" min="0" max="24" step="0.5" value={tSim} onChange={e => { setPlaying(false); setTSim(+e.target.value); }} />
          </label>
        </div>

        <div style={{ width: 140 }}>
          <label className="f" style={{ margin: 0 }}>Storm Rain: <b>{rainRate} mm/h</b>
            <input type="range" min="10" max="40" step="5" value={rainRate} onChange={e => setRainRate(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        {/* Left Panel: Catchment Map */}
        <div className="wg-col" style={{ flex: "1 1 250px" }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#334155", marginBottom: 4 }}>
            Catchment Drainage Zones (Travel Time to Outlet)
          </div>
          <svg viewBox="0 0 250 200" style={{ width: "100%", background: "#f1f5f9", borderRadius: 6, border: "1px solid #cbd5e1" }}>
            {/* Catchment Outline */}
            <path d="M 30,100 C 30,30 120,20 200,30 C 235,35 240,165 190,175 C 120,185 30,170 30,100 Z"
              fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />

            {/* Zone 3 (Upper Basin, travel time 6-8h) */}
            <path d="M 150,25 C 190,30 235,35 240,100 C 235,165 180,175 150,175 C 170,120 170,60 150,25 Z"
              fill={zone3Active ? "#fef08a" : "#f8fafc"} opacity={zone3Active ? 0.75 : 0.4} stroke="#ca8a04" strokeDasharray="3,2" />
            <text x="180" y="55" fontSize="8" fill="#854d0e" fontWeight="bold">Zone 3 (6-8h)</text>

            {/* Zone 2 (Mid Basin, travel time 3-6h) */}
            <path d="M 90,40 C 120,30 150,25 150,175 C 120,175 90,160 90,160 C 110,120 110,80 90,40 Z"
              fill={zone2Active ? "#bae6fd" : "#f8fafc"} opacity={zone2Active ? 0.8 : 0.4} stroke="#0284c7" strokeDasharray="3,2" />
            <text x="100" y="75" fontSize="8" fill="#0369a1" fontWeight="bold">Zone 2 (3-6h)</text>

            {/* Zone 1 (Near Outlet, travel time 0-3h) */}
            <path d="M 30,100 C 30,30 90,40 90,160 C 50,150 30,130 30,100 Z"
              fill={zone1Active ? "#bbf7d0" : "#f8fafc"} opacity={zone1Active ? 0.85 : 0.4} stroke="#16a34a" strokeDasharray="3,2" />
            <text x="35" y="115" fontSize="8" fill="#15803d" fontWeight="bold">Zone 1 (0-3h)</text>

            {/* Stream Network */}
            <path d="M 220,100 Q 150,105 30,100" fill="none" stroke="#0284c7" strokeWidth="3" />
            <path d="M 180,60 Q 150,85 120,102" fill="none" stroke="#0284c7" strokeWidth="2" />
            <path d="M 180,140 Q 150,115 120,102" fill="none" stroke="#0284c7" strokeWidth="2" />

            {/* Dynamic Water Flow Lines on Streams */}
            {(zone1Active || zone2Active || zone3Active) && (
              <path d="M 220,100 Q 150,105 30,100" fill="none" stroke="#bae6fd" strokeWidth="2" className="anim-flow" />
            )}

            {/* Active Rain Animation */}
            {rainActive && (
              <g>
                <text x="70" y="22" fontSize="9" fill="#0284c7" fontWeight="bold">🌧 Storm Rain Active (1h–5h)</text>
                {Array.from({ length: 15 }).map((_, i) => (
                  <line key={i} className="anim-fall"
                    style={{ animationDelay: ((i * 0.1) % 1.2) + "s" }}
                    x1={50 + i * 11} y1={25} x2={46 + i * 11} y2={42}
                    stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
                ))}
              </g>
            )}

            {/* Stream Gauging Outlet Station */}
            <circle cx="30" cy="100" r="6" fill="#dc2626" />
            <circle cx="30" cy="100" r="10" fill="none" stroke="#dc2626" strokeWidth="1.5" className="anim-rise" />
            <text x="8" y="90" fontSize="8" fill="#dc2626" fontWeight="bold">Stream Gauge</text>
            <text x="8" y="125" fontSize="8" fill="#334155" fontWeight="bold">Q = {Math.round(currQ)} m³/s</text>
          </svg>
        </div>

        {/* Right Panel: Hydrograph Drawn at Outlet */}
        <div className="wg-col" style={{ flex: "1 1 270px" }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#334155", marginBottom: 4 }}>
            Discharge Hydrograph Recorded at Outlet Q(t)
          </div>
          <svg viewBox="0 0 270 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 160].map(y => <line key={y} x1="35" y1={y} x2="255" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="35" y1="160" x2="255" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="35" y1="20" x2="35" y2="160" stroke="#64748b" strokeWidth="1.5" />

            {/* Baseflow shaded band */}
            <rect x="35" y={160 - (baseflow / 120) * 135} width="220" height={(baseflow / 120) * 135} fill="#fef3c7" opacity="0.6" />
            <text x="180" y="152" fontSize="8" fill="#ca8a04">Baseflow</text>

            {/* Full Hydrograph Ghost Line */}
            <path d={hydroPts.map((p, i) => \`\${i === 0 ? "M" : "L"} \${35 + (p.t / 24) * 220} \${160 - (p.q / 120) * 135}\`).join(" ")}
              fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3,2" />

            {/* Active Traced Hydrograph Path up to tSim */}
            <path d={hydroPts.filter(p => p.t <= tSim).map((p, i) => \`\${i === 0 ? "M" : "L"} \${35 + (p.t / 24) * 220} \${160 - (p.q / 120) * 135}\`).join(" ")}
              fill="none" stroke="#2563eb" strokeWidth="3" />

            {/* Shaded Direct Runoff under active curve */}
            {tSim > 1 && (
              <path d={\`M \${35 + (1 / 24) * 220},\${160 - (baseflow / 120) * 135} \` +
                hydroPts.filter(p => p.t >= 1 && p.t <= tSim).map(p => \`L \${35 + (p.t / 24) * 220} \${160 - (p.q / 120) * 135}\`).join(" ") +
                \` L \${35 + (tSim / 24) * 220},\${160 - (baseflow / 120) * 135} Z\`}
                fill="#38bdf8" opacity="0.35" />
            )}

            {/* Current Tracer Dot */}
            <circle cx={35 + (tSim / 24) * 220} cy={160 - (currQ / 120) * 135} r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />

            {/* Time Marker Vertical Line */}
            <line x1={35 + (tSim / 24) * 220} y1="20" x2={35 + (tSim / 24) * 220} y2="160" stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" />

            {/* Axes Labels */}
            <text x="15" y="25" fontSize="8" fill="#64748b">m³/s</text>
            <text x="235" y="174" fontSize="8" fill="#64748b">Hours</text>
            <text x="35 + (tp/24)*220" y="32" fontSize="8" fill="#dc2626" fontWeight="bold">Peak Qp ({Math.round(qp)} m³/s)</text>
          </svg>
        </div>
      </div>

      {/* Dynamic Status Callout */}
      <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 5, background: "#f8fafc", borderLeft: \`4px solid \${statusTone}\`, fontSize: 12 }}>
        <b>Current Drainage Mechanism:</b> {statusText}
      </div>
    </Box>
  );
}

/* ============ S19: Catchment Shape & Invariance Workbench ============ */
function CatchmentShapeEffect() {
  const [shape, setShape] = useState("fan");
  const [rainCm, setRainCm] = useState(1.0); // cm of excess rain
  const [normalize, setNormalize] = useState(false);

  // Hydrograph parameters for each shape (Area = 100 km2 for all)
  const shapes = {
    fan: {
      name: "Fan-Shaped / Compact Basin",
      desc: "Tributaries of nearly equal length converge rapidly near the outlet. Runoff from all sub-basins arrives simultaneously, causing a high, sharp, flashy peak.",
      qp1: 110, tp: 5, tb: 14,
      pts: [0, 15, 65, 110, 80, 48, 28, 16, 8, 3, 0]
    },
    elongated: {
      name: "Elongated / Narrow Basin",
      desc: "Long main valley with short lateral feeders. Flow from upper reaches arrives long after lower reaches have drained, yielding a low, broad, attenuated peak.",
      qp1: 52, tp: 9, tb: 22,
      pts: [0, 6, 18, 32, 45, 52, 44, 34, 24, 15, 8, 3, 0]
    },
    fern: {
      name: "Fern-Shaped / Branched Basin",
      desc: "Trunk stream with regularly spaced alternating lateral branches. Tributaries discharge successively along the stem, producing an extended crest.",
      qp1: 75, tp: 7, tb: 18,
      pts: [0, 10, 35, 68, 75, 62, 45, 30, 18, 8, 2, 0]
    },
    parallel: {
      name: "Parallel Streams Basin",
      desc: "Two distinct sub-basins draining parallel valleys and uniting just upstream of the gauge. Produces compound crests or twin peaks.",
      qp1: 85, tp: 6, tb: 20,
      pts: [0, 12, 48, 85, 70, 78, 55, 35, 20, 10, 3, 0]
    }
  };

  const curr = shapes[shape];
  const scale = normalize ? 1.0 : rainCm;

  return (
    <Box title="Catchment Morphology & Sherman's Linearity Principles" kind="Interactive Comparator">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Select Catchment Morphology:</span>
          <Seg value={shape} onChange={setShape} options={[
            ["fan", "1. Fan-Shaped"],
            ["elongated", "2. Elongated"],
            ["fern", "3. Fern-Shaped"],
            ["parallel", "4. Parallel Streams"]
          ]} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="f" style={{ margin: 0 }}>Effective Storm Rainfall R: <b>{f1(rainCm)} cm</b>
            <input type="range" min="0.5" max="3.5" step="0.5" value={rainCm} onChange={e => setRainCm(+e.target.value)} />
          </label>
          <div style={{ marginTop: 6, display: "flex", gap: 10, alignItems: "center" }}>
            <label style={{ fontSize: 11, fontWeight: "bold", color: "#2563eb", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <input type="checkbox" checked={normalize} onChange={e => setNormalize(e.target.checked)} />
              Normalize by Rainfall (Q / R)
            </label>
            <span style={{ fontSize: 10, color: "#64748b" }}>{normalize ? "Curves collapse onto 1-cm Unit Hydrograph!" : "Scales directly with R"}</span>
          </div>
        </div>
      </div>

      <div className="wg-row">
        {/* Left: Shape Graphic */}
        <div className="wg-col" style={{ flex: "1 1 240px" }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#334155", marginBottom: 4 }}>
            Catchment Drainage Topology
          </div>
          <svg viewBox="0 0 240 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #cbd5e1" }}>
            {shape === "fan" && (
              <g>
                <circle cx="120" cy="85" r="60" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                <path d="M 70,50 L 120,135 M 120,30 L 120,135 M 170,50 L 120,135" stroke="#0284c7" strokeWidth="2.5" />
                <circle cx="120" cy="135" r="5" fill="#dc2626" />
                <text x="100" y="152" fontSize="9" fill="#dc2626" fontWeight="bold">Outlet</text>
              </g>
            )}
            {shape === "elongated" && (
              <g>
                <rect x="30" y="65" width="180" height="50" rx="25" fill="#fef3c7" stroke="#ca8a04" strokeWidth="2" />
                <line x1="200" y1="90" x2="45" y2="90" stroke="#0284c7" strokeWidth="3" />
                <line x1="160" y1="75" x2="140" y2="90" stroke="#0284c7" strokeWidth="1.5" />
                <line x1="120" y1="105" x2="100" y2="90" stroke="#0284c7" strokeWidth="1.5" />
                <circle cx="45" cy="90" r="5" fill="#dc2626" />
                <text x="35" y="115" fontSize="9" fill="#dc2626" fontWeight="bold">Outlet</text>
              </g>
            )}
            {shape === "fern" && (
              <g>
                <path d="M 40,90 Q 120,40 200,70 Q 210,110 120,135 Z" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
                <line x1="190" y1="85" x2="50" y2="95" stroke="#0284c7" strokeWidth="3" />
                <line x1="150" y1="65" x2="130" y2="90" stroke="#0284c7" strokeWidth="1.5" />
                <line x1="150" y1="115" x2="130" y2="90" stroke="#0284c7" strokeWidth="1.5" />
                <line x1="100" y1="65" x2="80" y2="93" stroke="#0284c7" strokeWidth="1.5" />
                <circle cx="50" cy="95" r="5" fill="#dc2626" />
                <text x="35" y="115" fontSize="9" fill="#dc2626" fontWeight="bold">Outlet</text>
              </g>
            )}
            {shape === "parallel" && (
              <g>
                <path d="M 40,95 Q 120,30 200,45 L 200,145 Q 120,160 40,95 Z" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" />
                <line x1="190" y1="60" x2="50" y2="95" stroke="#0284c7" strokeWidth="2.5" />
                <line x1="190" y1="130" x2="50" y2="95" stroke="#0284c7" strokeWidth="2.5" />
                <circle cx="50" cy="95" r="5" fill="#dc2626" />
                <text x="35" y="115" fontSize="9" fill="#dc2626" fontWeight="bold">Outlet</text>
              </g>
            )}
            <text x="15" y="20" fontSize="8" fill="#475569">Catchment Area = 100 km² (Identical)</text>
          </svg>
        </div>

        {/* Right: Hydrograph Comparison */}
        <div className="wg-col" style={{ flex: "1 1 280px" }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#334155", marginBottom: 4 }}>
            Resulting Direct Runoff Hydrographs {normalize ? "(Normalized: Q / R = 1-cm UH)" : "(Scaled: Q = R × UH)"}
          </div>
          <svg viewBox="0 0 280 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 150].map(y => <line key={y} x1="35" y1={y} x2="265" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="35" y1="150" x2="265" y2="150" stroke="#64748b" strokeWidth="1.5" />
            <line x1="35" y1="20" x2="35" y2="150" stroke="#64748b" strokeWidth="1.5" />

            {/* Invariant Reference Shapes in background */}
            {!normalize && Object.entries(shapes).map(([sKey, sData]) => {
              if (sKey === shape) return null;
              return (
                <path key={sKey} d={sData.pts.map((q, idx) => \`\${idx === 0 ? "M" : "L"} \${35 + idx * 18} \${150 - ((q * scale) / 380) * 125}\`).join(" ")}
                  fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="2,2" />
              );
            })}

            {/* Active Selected Hydrograph */}
            <path d={curr.pts.map((q, idx) => \`\${idx === 0 ? "M" : "L"} \${35 + idx * 18} \${150 - ((q * scale) / 380) * 125}\`).join(" ")}
              fill="none" stroke="#2563eb" strokeWidth="3" />

            {/* Peak Marker */}
            <circle cx={35 + (curr.tp / 2) * 18} cy={150 - ((curr.qp1 * scale) / 380) * 125} r="5" fill="#dc2626" />
            <text x={45 + (curr.tp / 2) * 18} y={145 - ((curr.qp1 * scale) / 380) * 125} fontSize="9" fill="#dc2626" fontWeight="bold">
              Peak = {Math.round(curr.qp1 * scale)} m³/s
            </text>

            <text x="15" y="25" fontSize="8" fill="#64748b">{normalize ? "q (m³/s/cm)" : "Q (m³/s)"}</text>
            <text x="245" y="165" fontSize="8" fill="#64748b">Hours</text>
          </svg>
        </div>
      </div>

      <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 11, color: "#166534" }}>
        <b>{curr.name}:</b> {curr.desc}
        <br />
        <b>Sherman's Principle:</b> Notice that changing rainfall from 0.5 cm to 3.5 cm <i>scales every ordinate up or down</i> without shifting the time to peak ($t_p = {curr.tp}\text{ h}$) or time base ($t_b = {curr.tb}\text{ h}$).
      </div>
    </Box>
  );
}
`;

// Inject into src/widgets.jsx before export const WIDGETS
let widgetsCode = fs.readFileSync('src/widgets.jsx', 'utf8');

// Fix raw $ in HydroAnatomy note
widgetsCode = widgetsCode.replace(
  'Beyond the inflection point $P_i$, surface inflow ceases completely. The streamflow drops purely as a linear reservoir discharging groundwater storage: $S_t = Q_t / a$.',
  'Beyond the inflection point Pi, surface inflow ceases completely. The streamflow drops purely as a linear reservoir discharging groundwater storage: St = Qt / a.'
);

if (!widgetsCode.includes('function HydroGenesis()')) {
  widgetsCode = widgetsCode.replace('export const WIDGETS = {', hydroGenesisCode + '\nexport const WIDGETS = {');
}

const mapEntries = `  "hydro-genesis": HydroGenesis,
  hydrogenesis: HydroGenesis,
  "catchment-shape-effect": CatchmentShapeEffect,
  catchmentshapeeffect: CatchmentShapeEffect,
`;

if (!widgetsCode.includes('"hydro-genesis": HydroGenesis')) {
  widgetsCode = widgetsCode.replace('export const WIDGETS = {', 'export const WIDGETS = {\n' + mapEntries);
}

fs.writeFileSync('src/widgets.jsx', widgetsCode, 'utf8');
console.log('✓ Added HydroGenesis and CatchmentShapeEffect to src/widgets.jsx');

// Now update sessions/S19.md to place both widgets before HydroAnatomy
let s19 = fs.readFileSync('sessions/S19.md', 'utf8');

const s19Intro = `## 1. How a Hydrograph is Formed: Catchment to Outlet

A streamflow hydrograph is the continuous graphical record of discharge ($Q$ vs $t$) passing through a catchment outlet. The hydrograph is formed by the dynamic routing and concentration of precipitation as it travels across different travel-time zones (isochrones) of the drainage basin.

::widget[hydro-genesis]

## 2. Catchment Morphology & Shape Invariance

The physiography and planform shape of a drainage basin exert a profound control on the geometry of its flood hydrograph. Compact shapes concentrate runoff quickly, whereas elongated basins spread runoff over a longer time base.

Crucially, **the shape of the hydrograph is a fixed physical signature of the catchment**: changing storm rainfall depth simply scales the hydrograph ordinates up or down in direct proportion, while the time to peak ($t_p$) and time base ($t_b$) remain invariant.

::widget[catchment-shape-effect]

## 3. Anatomy of a Flood Hydrograph

The direct runoff hydrograph reflects the interplay between surface concentration, crest storage equilibrium, and exponential groundwater depletion:

::widget[hydro-anatomy]`;

if (!s19.includes('hydro-genesis')) {
  s19 = s19.replace(/## 1\. Anatomy of a Flood Hydrograph[\s\S]*?::widget\[hydro-anatomy\]/, s19Intro);
  // Also fix section numbers in S19
  s19 = s19.replace('## 2. Characteristic Time Parameters', '## 4. Characteristic Time Parameters');
  s19 = s19.replace('## 3. Mathematical Analysis of the Recession Curve', '## 5. Mathematical Analysis of the Recession Curve');
  s19 = s19.replace('## 4. Worked Numerical Examples', '## 6. Worked Numerical Examples');
  fs.writeFileSync('sessions/S19.md', s19, 'utf8');
  console.log('✓ Successfully embedded hydro-genesis and catchment-shape-effect into sessions/S19.md');
}

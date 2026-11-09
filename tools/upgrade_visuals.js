const fs = require('fs');

// 1. New widgets code: AetPetCurve, PhiConcept, KcGrowthCurve, and upgraded RunoffPathways
const newComponents = `
/* ============ S14: AET vs PET vs Soil Moisture Curve ============ */
function AetPetCurve() {
  const [moisture, setMoisture] = useState(42); // %
  const [pet, setPet] = useState(6.0); // mm/day

  const pwp = 15; // Permanent wilting point %
  const fc = 50;  // Field capacity %
  const sat = 85; // Saturation %

  let aet = 0;
  let regime = "";
  if (moisture <= pwp) {
    aet = 0;
    regime = "Below Wilting Point (Stomata Closed, Plants Wilted)";
  } else if (moisture < fc) {
    aet = pet * ((moisture - pwp) / (fc - pwp));
    regime = "Soil-Moisture Limited (AET < PET, Stomata Partially Throttled)";
  } else {
    aet = pet;
    regime = "Atmosphere Limited (AET = PET, Maximum Unrestricted Transpiration)";
  }

  return (
    <Box title="AET vs PET & Soil Moisture Dynamics" kind="Interactive Physiology">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Available Soil Moisture θ: <b>{moisture}%</b>
            <input type="range" min="5" max="95" step="1" value={moisture} onChange={e => setMoisture(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Potential Evapotranspiration (PET): <b>{f1(pet)} mm/day</b>
            <input type="range" min="2.0" max="10.0" step="0.5" value={pet} onChange={e => setPet(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Zones shading */}
            <rect x="50" y="20" width={(pwp / 100) * 420} height="140" fill="#fee2e2" opacity="0.5" />
            <rect x={50 + (pwp / 100) * 420} y="20" width={((fc - pwp) / 100) * 420} height="140" fill="#fef3c7" opacity="0.5" />
            <rect x={50 + (fc / 100) * 420} y="20" width={((100 - fc) / 100) * 420} height="140" fill="#dcfce7" opacity="0.5" />

            {/* Threshold Vertical Lines */}
            <line x1={50 + (pwp / 100) * 420} y1="20" x2={50 + (pwp / 100) * 420} y2="160" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x={50 + (pwp / 100) * 420 - 15} y="175" fontSize="9" fill="#dc2626" fontWeight="bold">PWP (15%)</text>

            <line x1={50 + (fc / 100) * 420} y1="20" x2={50 + (fc / 100) * 420} y2="160" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x={50 + (fc / 100) * 420 - 10} y="175" fontSize="9" fill="#16a34a" fontWeight="bold">FC (50%)</text>

            <line x1={50 + (sat / 100) * 420} y1="20" x2={50 + (sat / 100) * 420} y2="160" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x={50 + (sat / 100) * 420 - 12} y="175" fontSize="9" fill="#0284c7" fontWeight="bold">Sat (85%)</text>

            {/* PET Horizontal Dashed Line */}
            <line x1="50" y1={160 - (pet / 10) * 125} x2="470" y2={160 - (pet / 10) * 125} stroke="#ea580c" strokeWidth="2" strokeDasharray="4,2" />
            <text x="55" y={155 - (pet / 10) * 125} fontSize="9" fill="#ea580c" fontWeight="bold">PET = {f1(pet)} mm/d (Atmospheric Demand)</text>

            {/* AET Curve */}
            <path d={\`M 50,160 L \${50 + (pwp / 100) * 420},160 L \${50 + (fc / 100) * 420},\${160 - (pet / 10) * 125} L 470,\${160 - (pet / 10) * 125}\`}
              fill="none" stroke="#2563eb" strokeWidth="3" />

            {/* Current Moisture Operating Point */}
            <circle cx={50 + (moisture / 100) * 420} cy={160 - (aet / 10) * 125} r="6" fill="#2563eb" stroke="#fff" strokeWidth="2" />

            {/* Animated Vapor Wisps when Transpiring */}
            {aet > 0 && Array.from({ length: 4 }).map((_, i) => (
              <circle key={i} className="anim-rise" cx={50 + (moisture / 100) * 420 + (i - 1.5) * 8} cy={150 - (aet / 10) * 125} r="2.5" fill="#38bdf8" style={{ animationDelay: (i * 0.4) + "s" }} />
            ))}

            {/* Axes */}
            <line x1="50" y1="160" x2="470" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="50" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <text x="20" y="25" fontSize="9" fill="#64748b">ET (mm/d)</text>
            <text x="430" y="190" fontSize="9" fill="#64748b">Moisture θ</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f2(aet) + " mm/d"} l="Actual ET (AET)" tone={aet >= pet ? "good" : aet > 0 ? "warn" : "bad"} />
            <Kpi v={f1(pet) + " mm/d"} l="Potential ET (PET)" />
            <Kpi v={f2(aet / Math.max(0.1, pet))} l="AET / PET Ratio" />
          </div>
          <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 4, background: moisture < pwp ? "#fef2f2" : moisture >= fc ? "#f0fdf4" : "#fefce8", fontSize: 11, color: "#1e293b", border: "1px solid #e2e8f0" }}>
            <b>Physiological State:</b> {regime}
          </div>
        </div>
      </div>
    </Box>
  );
}

/* ============ S13: Phi-Index Hyetograph Explorer ============ */
function PhiConcept() {
  const [phi, setPhi] = useState(25); // mm/h
  const rainPulses = [15, 38, 65, 45, 28, 12]; // mm/h for 6 1-hour intervals

  // Calculate excess and losses
  const excess = rainPulses.map(p => Math.max(0, p - phi));
  const totalRain = rainPulses.reduce((s, v) => s + v, 0);
  const totalExcess = excess.reduce((s, v) => s + v, 0);
  const totalLoss = totalRain - totalExcess;
  const effectiveHours = rainPulses.filter(p => p > phi).length;

  return (
    <Box title="φ-Index Hyetograph & Rainfall Excess Partitioning" kind="Interactive Hyetograph">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Infiltration φ-Index: <b>{phi} mm/h</b>
            <input type="range" min="10" max="55" step="1" value={phi} onChange={e => setPhi(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: "#475569" }}>
            Rain pulses above φ produce <b>Direct Runoff</b>; rainfall below φ is absorbed as <b>Infiltration Loss</b>.
          </span>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 160].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="40" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="160" stroke="#64748b" strokeWidth="1.5" />

            {/* Rainfall Hyetograph Bars */}
            {rainPulses.map((p, idx) => {
              const x = 60 + idx * 65;
              const barH = (p / 75) * 135;
              const lossH = Math.min(barH, (phi / 75) * 135);
              const excessH = Math.max(0, barH - lossH);

              return (
                <g key={idx}>
                  {/* Loss portion (lower, brown) */}
                  <rect x={x} y={160 - lossH} width="50" height={lossH} fill="#b48e5c" stroke="#7a5634" />

                  {/* Excess portion (upper, blue animated) */}
                  {excessH > 0 && (
                    <g>
                      <rect x={x} y={160 - barH} width="50" height={excessH} fill="#0284c7" stroke="#0369a1" />
                      <line x1={x} y1={160 - barH + 4} x2={x + 50} y2={160 - barH + 4} stroke="#bae6fd" strokeWidth="2" className="anim-flow" />
                    </g>
                  )}

                  {/* Hourly label */}
                  <text x={x + 16} y="175" fontSize="9" fill="#64748b">{idx + 1}h</text>
                  <text x={x + 12} y={150 - barH} fontSize="9" fill="#1e293b" fontWeight="bold">{p}mm</text>
                </g>
              );
            })}

            {/* φ-Index Cut Line */}
            <line x1="40" y1={160 - (phi / 75) * 135} x2="480" y2={160 - (phi / 75) * 135} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="4,2" />
            <g transform={\`translate(380, \${150 - (phi / 75) * 135})\`}>
              <rect x="-6" y="-10" width="90" height="18" rx="4" fill="rgba(220,38,38,0.9)" />
              <text x="2" y="2" fontSize="9" fill="#fff" fontWeight="bold">φ = {phi} mm/h</text>
            </g>

            {/* Legend */}
            <rect x="50" y="25" width="12" height="10" fill="#0284c7" />
            <text x="68" y="34" fontSize="9" fill="#0369a1" fontWeight="bold">Rainfall Excess (DRO)</text>

            <rect x="180" y="25" width="12" height="10" fill="#b48e5c" />
            <text x="198" y="34" fontSize="9" fill="#7a5634" fontWeight="bold">Infiltration Abstractions</text>

            <text x="20" y="25" fontSize="9" fill="#64748b">mm/h</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={totalExcess + " mm"} l="Direct Runoff Excess (R)" tone="good" />
            <Kpi v={totalLoss + " mm"} l="Infiltration Losses (L)" tone="warn" />
            <Kpi v={effectiveHours + " hours"} l="Effective Storm Duration (te)" />
            <Kpi v={f2(totalExcess / totalRain)} l="Runoff Coefficient (R/P)" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Governing Equation:</b> $R = \\sum (P_i - \\phi)\\Delta t$ for all $P_i &gt; \\phi$. The $\\phi$-index is defined as the constant infiltration rate above which rainfall is converted entirely to surface runoff.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S15: Crop Coefficient Kc Growth Stages ============ */
function KcGrowthCurve() {
  const [day, setDay] = useState(65); // day in 120-day crop cycle
  const [et0, setEt0] = useState(5.0); // mm/day

  // 4 FAO-56 Growth Stages: Initial (0-20), Development (20-55), Mid-Season (55-95), Late Season (95-120)
  const kc_ini = 0.45;
  const kc_mid = 1.15;
  const kc_end = 0.60;

  let kc = kc_ini;
  let stageName = "Stage 1: Initial Growth";
  let stageDesc = "Soil surface mostly bare, evaporation dominates.";

  if (day <= 20) {
    kc = kc_ini;
    stageName = "Stage 1: Initial Growth (0-20 d)";
    stageDesc = "Germination and emergence. Low transpiration, evaporation dominates.";
  } else if (day <= 55) {
    kc = kc_ini + (kc_mid - kc_ini) * ((day - 20) / 35);
    stageName = "Stage 2: Crop Development (20-55 d)";
    stageDesc = "Rapid vegetative foliage growth and canopy closure. Transpiration surges.";
  } else if (day <= 95) {
    kc = kc_mid;
    stageName = "Stage 3: Mid-Season Peak (55-95 d)";
    stageDesc = "Full canopy flowering and grain/fruit filling. Peak water requirement.";
  } else {
    kc = kc_mid - (kc_mid - kc_end) * ((day - 95) / 25);
    stageName = "Stage 4: Late Season Senescence (95-120 d)";
    stageDesc = "Leaves yellow and dry out. Water consumption drops until harvest.";
  }

  const etc = kc * et0;

  return (
    <Box title="FAO-56 Crop Coefficient (Kc) & Seasonal Water Demand" kind="Interactive Agronomy">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Crop Growth Day: <b>Day {day} of 120</b>
            <input type="range" min="0" max="120" step="1" value={day} onChange={e => setDay(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Reference Evapotranspiration ET0: <b>{f1(et0)} mm/day</b>
            <input type="range" min="2.0" max="8.0" step="0.5" value={et0} onChange={e => setEt0(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* 4 Stage Background Bands */}
            <rect x="50" y="20" width={(20 / 120) * 420} height="140" fill="#fef3c7" opacity="0.4" />
            <rect x={50 + (20 / 120) * 420} y="20" width={(35 / 120) * 420} height="140" fill="#dbeafe" opacity="0.4" />
            <rect x={50 + (55 / 120) * 420} y="20" width={(40 / 120) * 420} height="140" fill="#dcfce7" opacity="0.4" />
            <rect x={50 + (95 / 120) * 420} y="20" width={(25 / 120) * 420} height="140" fill="#fed7aa" opacity="0.4" />

            {/* Stage Dividers */}
            {[20, 55, 95].map(d => (
              <line key={d} x1={50 + (d / 120) * 420} y1="20" x2={50 + (d / 120) * 420} y2="160" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
            ))}

            {/* Stage Names on top */}
            <text x="65" y="32" fontSize="8" fill="#ca8a04" fontWeight="bold">Stage 1: Ini</text>
            <text x="145" y="32" fontSize="8" fill="#2563eb" fontWeight="bold">Stage 2: Dev</text>
            <text x="270" y="32" fontSize="8" fill="#16a34a" fontWeight="bold">Stage 3: Mid-Season</text>
            <text x="405" y="32" fontSize="8" fill="#ea580c" fontWeight="bold">Stage 4: Late</text>

            {/* FAO Kc Curve */}
            <path d={\`M 50,\${160 - (kc_ini / 1.4) * 130} L \${50 + (20 / 120) * 420},\${160 - (kc_ini / 1.4) * 130} L \${50 + (55 / 120) * 420},\${160 - (kc_mid / 1.4) * 130} L \${50 + (95 / 120) * 420},\${160 - (kc_mid / 1.4) * 130} L 470,\${160 - (kc_end / 1.4) * 130}\`}
              fill="none" stroke="#16a34a" strokeWidth="3" />

            {/* Current Day Tracer Marker */}
            <line x1={50 + (day / 120) * 420} y1="20" x2={50 + (day / 120) * 420} y2="160" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
            <circle cx={50 + (day / 120) * 420} cy={160 - (kc / 1.4) * 130} r="6" fill="#dc2626" stroke="#fff" strokeWidth="2" />

            {/* Animated plant icon growing */}
            <g transform={\`translate(\${50 + (day / 120) * 420}, 160)\`}>
              <circle cx="0" cy={-12 - Math.min(22, (day / 120) * 22)} r={4 + (day / 120) * 10} fill="#22c55e" opacity="0.85" />
              <line x1="0" y1="0" x2="0" y2={-10 - (day / 120) * 20} stroke="#15803d" strokeWidth="2.5" />
            </g>

            {/* Axes */}
            <line x1="50" y1="160" x2="470" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="50" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <text x="20" y="25" fontSize="9" fill="#64748b">Kc</text>
            <text x="430" y="174" fontSize="9" fill="#64748b">Growth Days</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f2(kc)} l="Current Crop Coeff (Kc)" tone="good" />
            <Kpi v={f2(etc) + " mm/d"} l="Crop Water Need (ETc = Kc × ET0)" tone="warn" />
            <Kpi v={"Day " + day} l="Phenological Age" />
          </div>
          <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 4, background: "#f0fdf4", fontSize: 11, color: "#166534", border: "1px solid #bbf7d0" }}>
            <b>{stageName}:</b> {stageDesc}
          </div>
        </div>
      </div>
    </Box>
  );
}
`;

// Insert into src/widgets.jsx
let widgetsCode = fs.readFileSync('src/widgets.jsx', 'utf8');

// Replace RunoffPathways with enhanced animated version
const oldRunoffStart = widgetsCode.indexOf('function RunoffPathways()');
const oldRunoffEnd = widgetsCode.indexOf('/* ============ S18: HEC-HMS Loss Model Calibration ============ */');

const upgradedRunoffPathways = `/* ============ S16: Runoff Pathways Explorer (Enhanced Animated) ============ */
function RunoffPathways() {
  const [rainRate, setRainRate] = useState("mod");
  const [landCover, setLandCover] = useState("forest");

  const covers = {
    forest: { name: "Forested Mountain Slope", fc: 35, baseK: 0.85, interK: 0.65, col: "#15803d" },
    agri: { name: "Agricultural Terraced Loam", fc: 14, baseK: 0.50, interK: 0.35, col: "#ca8a04" },
    urban: { name: "Urbanized / Paved Catchment", fc: 3, baseK: 0.15, interK: 0.10, col: "#b91c1c" }
  };
  const rates = {
    light: { name: "Light Drizzle (4 mm/h)", i: 4, rainLines: 20 },
    mod: { name: "Moderate Steady Rain (18 mm/h)", i: 18, rainLines: 40 },
    heavy: { name: "Severe Monsoon Storm (50 mm/h)", i: 50, rainLines: 70 }
  };

  const c = covers[landCover];
  const r = rates[rainRate];

  const overland = Math.max(0, r.i - c.fc);
  const infiltrated = Math.min(r.i, c.fc);
  const interflow = infiltrated * c.interK;
  const percolation = infiltrated * (1 - c.interK) * c.baseK;
  const deepLoss = Math.max(0, infiltrated - interflow - percolation);
  const total = overland + interflow + percolation + deepLoss;

  const pctO = total > 0 ? Math.round((overland / total) * 100) : 0;
  const pctI = total > 0 ? Math.round((interflow / total) * 100) : 0;
  const pctB = total > 0 ? Math.round((percolation / total) * 100) : 0;

  return (
    <Box title="Catchment Runoff Pathways & Water Partitioning" kind="Animated Physical Simulation">
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
              <linearGradient id="soilGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78350f" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#451a03" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="gwGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect x="0" y="0" width="500" height="70" fill="#e0f2fe" />
            <path d="M 20,25 Q 40,10 65,22 Q 90,8 115,25 Q 130,22 135,32 L 15,32 Z" fill="#94a3b8" />
            <path d="M 120,20 Q 145,5 175,18 Q 205,5 235,22 L 115,28 Z" fill="#64748b" />
            <path d="M 260,22 Q 285,8 315,20 Q 345,6 375,24 L 255,28 Z" fill="#94a3b8" />

            {/* Animated Falling Rain Drops */}
            {Array.from({ length: Math.min(45, r.rainLines) }).map((_, idx) => {
              const rx = 20 + (idx * 460) / r.rainLines;
              return (
                <line key={idx} className="anim-fall"
                  style={{ animationDelay: ((idx * 0.07) % 1.4) + "s" }}
                  x1={rx} y1={35} x2={rx - 4} y2={56}
                  stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
              );
            })}

            {/* Hillside Ground Profile */}
            <path d="M 0,90 Q 180,105 340,140 L 370,165 L 430,165 L 450,145 L 500,145 L 500,240 L 0,240 Z" fill="url(#soilGrad2)" />

            {/* Vegetation Layer */}
            {landCover === "forest" && (
              <g fill="#15803d">
                <path d="M 30,88 L 40,65 L 50,88 Z M 65,90 L 78,60 L 90,90 Z M 120,95 L 132,68 L 145,95 Z M 190,105 L 205,75 L 220,105 Z M 260,118 L 275,85 L 290,118 Z" />
              </g>
            )}
            {landCover === "agri" && (
              <g stroke="#ca8a04" strokeWidth="2.5">
                <line x1="30" y1="88" x2="100" y2="92" />
                <line x1="110" y1="96" x2="180" y2="104" />
                <line x1="190" y1="108" x2="260" y2="120" />
                <line x1="270" y1="125" x2="330" y2="140" />
              </g>
            )}
            {landCover === "urban" && (
              <g fill="#64748b" stroke="#334155">
                <rect x="50" y="68" width="30" height="20" rx="2" />
                <rect x="130" y="78" width="35" height="22" rx="2" />
                <rect x="220" y="92" width="40" height="24" rx="2" />
              </g>
            )}

            {/* Stream Channel with Animated Water Surface */}
            <polygon points="360,150 370,165 430,165 440,150" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
            <line x1="372" y1="158" x2="428" y2="158" stroke="#bae6fd" strokeWidth="2" className="anim-flow" />
            <text x="382" y="163" fontSize="8" fill="#0369a1" fontWeight="bold">River Outlet</text>

            {/* Water Table / Aquifer */}
            <path d="M 0,160 Q 200,175 370,165 L 430,165 Q 460,168 500,170 L 500,240 L 0,240 Z" fill="url(#gwGrad2)" />
            <text x="15" y="180" fontSize="8" fill="#bae6fd">Phreatic Water Table</text>

            {/* Animated Overland Flow with Pill Badge */}
            {overland > 0 && (
              <g>
                <path d="M 60,86 Q 200,102 360,148" stroke="#2563eb" strokeWidth="3" fill="none" className="anim-flow" />
                <g transform="translate(140, 70)">
                  <rect x="-4" y="-10" width="180" height="15" rx="3" fill="rgba(255,255,255,0.9)" stroke="#2563eb" strokeWidth="1" />
                  <text x="4" y="1" fontSize="9" fill="#1d4ed8" fontWeight="bold">Surface Overland Flow ({pctO}%)</text>
                </g>
              </g>
            )}

            {/* Animated Interflow through Macropores with Pill Badge */}
            <g>
              <path d="M 80,115 Q 220,135 365,158" stroke="#f59e0b" strokeWidth="2.5" fill="none" className="anim-flow" />
              <g transform="translate(150, 115)">
                <rect x="-4" y="-10" width="165" height="15" rx="3" fill="rgba(255,255,255,0.9)" stroke="#d97706" strokeWidth="1" />
                <text x="4" y="1" fontSize="9" fill="#b45309" fontWeight="bold">Subsurface Interflow ({pctI}%)</text>
              </g>
            </g>

            {/* Animated Baseflow with Pill Badge */}
            <g>
              <path d="M 120,145 L 120,190 Q 240,210 375,170" stroke="#0284c7" strokeWidth="2.5" fill="none" className="anim-flow" />
              <g transform="translate(130, 205)">
                <rect x="-4" y="-10" width="180" height="15" rx="3" fill="rgba(255,255,255,0.9)" stroke="#0284c7" strokeWidth="1" />
                <text x="4" y="1" fontSize="9" fill="#0369a1" fontWeight="bold">Groundwater Baseflow ({pctB}%)</text>
              </g>
            </g>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={pctO + "%"} l="Overland Flow" tone={pctO > 40 ? "bad" : "good"} />
            <Kpi v={pctI + "%"} l="Subsurface Interflow" tone="warn" />
            <Kpi v={pctB + "%"} l="Groundwater Baseflow" tone="good" />
            <Kpi v={f1(r.i) + " mm/h"} l={"Rainfall Rate vs Capacity (" + c.fc + " mm/h)"} />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Hydrologic Partitioning:</b> In natural forest catchments, high infiltration capacity sustains dry-weather baseflow. In urbanized basins, impervious surfaces force {pctO}% of rain into destructive overland storm runoff.
          </p>
        </div>
      </div>
    </Box>
  );
}
`;

if (oldRunoffStart !== -1 && oldRunoffEnd !== -1) {
  widgetsCode = widgetsCode.slice(0, oldRunoffStart) + upgradedRunoffPathways + '\n' + widgetsCode.slice(oldRunoffEnd);
}

// Append new components before export const WIDGETS
widgetsCode = widgetsCode.replace('export const WIDGETS = {', newComponents + '\nexport const WIDGETS = {');

// Register in WIDGETS
const extraMapEntries = `  "aet-pet-curve": AetPetCurve,
  aetpetcurve: AetPetCurve,
  "phi-concept": PhiConcept,
  phiconcept: PhiConcept,
  "kc-growth-curve": KcGrowthCurve,
  kcgrowthcurve: KcGrowthCurve,
`;

widgetsCode = widgetsCode.replace('export const WIDGETS = {', 'export const WIDGETS = {\n' + extraMapEntries);

fs.writeFileSync('src/widgets.jsx', widgetsCode, 'utf8');
console.log('✓ Successfully injected upgraded RunoffPathways, AetPetCurve, PhiConcept, KcGrowthCurve into src/widgets.jsx');

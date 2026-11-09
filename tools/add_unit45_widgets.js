const fs = require('fs');

const codeToAdd = `
/* ============ S28 & S29: Rational Formula & Tc Workbench ============ */
function RationalCalc() {
  const [areaHa, setAreaHa] = useState(45); // ha
  const [cType, setCType] = useState("urban"); // runoff coeff
  const [lengthKm, setLengthKm] = useState(1.2); // km
  const [fallM, setFallM] = useState(18); // m

  const cCoeffs = {
    forest: { name: "Forested / Parks (C = 0.20)", c: 0.20 },
    suburban: { name: "Suburban Residential (C = 0.45)", c: 0.45 },
    urban: { name: "Dense Urban / Commercial (C = 0.80)", c: 0.80 },
    paved: { name: "Concrete & Roofs (C = 0.90)", c: 0.90 }
  };
  const Cval = cCoeffs[cType].c;

  // Slope S = H / (1000 * L)
  const slope = fallM / (1000 * lengthKm);
  // Kirpich formula: tc in minutes = 0.01947 * L^0.77 * S^(-0.385) where L in m
  const Lmeters = lengthKm * 1000;
  const tcMin = Math.max(5, 0.01947 * Math.pow(Lmeters, 0.77) * Math.pow(slope, -0.385));
  const tcHours = tcMin / 60;

  // Design rainfall intensity from 25-yr Bengaluru IDF: I = 900 / (tcMin + 15)^0.8 (mm/h)
  const intensity = 950 / Math.pow(tcMin + 14, 0.78);

  // Rational peak flow: Qp = (C * I * A) / 360 (m3/s) where A in ha, I in mm/h
  const Qp = (Cval * intensity * areaHa) / 360;

  return (
    <Box title="Rational Method & Time of Concentration Workbench" kind="Interactive Design">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Catchment Area: <b>{areaHa} ha</b>
            <input type="range" min="5" max="150" step="5" value={areaHa} onChange={e => setAreaHa(+e.target.value)} />
          </label>
          <label className="f">Flow Path Length L: <b>{f2(lengthKm)} km</b>
            <input type="range" min="0.3" max="4.0" step="0.1" value={lengthKm} onChange={e => setLengthKm(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Basin Elevation Fall H: <b>{fallM} m</b>
            <input type="range" min="2" max="60" step="2" value={fallM} onChange={e => setFallM(+e.target.value)} />
          </label>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Land Use & Soil:</span>
            <Seg value={cType} onChange={setCType} options={[
              ["forest", "Forest (0.2)"],
              ["suburban", "Suburban (0.45)"],
              ["urban", "Urban (0.8)"],
              ["paved", "Paved (0.9)"]
            ]} />
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 190" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Catchment boundary polygon */}
            <path d="M 40,95 Q 120,30 260,35 Q 380,40 460,95 Q 380,155 240,150 Q 120,150 40,95 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />

            {/* Isochrone contours */}
            <path d="M 140,55 Q 155,95 140,135" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
            <path d="M 240,42 Q 260,95 240,146" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
            <path d="M 350,52 Q 370,95 350,138" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Main Drainage Channel */}
            <path d="M 60,95 Q 200,98 460,95" fill="none" stroke="#0284c7" strokeWidth="4" />
            <polygon points="460,90 480,95 460,100" fill="#0284c7" />

            <circle cx="60" cy="95" r="5" fill="#dc2626" />
            <text x="45" y="80" fontSize="9" fill="#dc2626" fontWeight="bold">Most Remote Point</text>
            <text x="45" y="115" fontSize="8" fill="#475569">Fall = {fallM} m</text>

            <text x="420" y="80" fontSize="10" fill="#0284c7" fontWeight="bold">Outlet</text>
            <text x="390" y="125" fontSize="11" fill="#0369a1" fontWeight="bold">Qp = {f2(Qp)} m³/s</text>

            {/* Travel time arrow */}
            <text x="210" y="88" fontSize="9" fill="#0f172a" fontWeight="bold">Channel L = {f2(lengthKm)} km (Slope = {f3(slope * 100)}%)</text>
            <text x="210" y="115" fontSize="9" fill="#0284c7">Kirpich tc = {f1(tcMin)} min ({f2(tcHours)} h)</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f2(Qp) + " m³/s"} l="Rational Peak Qp = CIA/360" tone="good" />
            <Kpi v={f1(tcMin) + " min"} l="Time of Concentration (tc)" tone="warn" />
            <Kpi v={f1(intensity) + " mm/h"} l="Design Rain Intensity I(tc)" />
            <Kpi v={f2(Cval)} l="Runoff Coefficient C" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Kirpich & Rational Logic:</b> The design storm duration equals the catchment time of concentration $t_c$. When the entire watershed contributes simultaneously, peak runoff $Q_p$ occurs.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S30: Indian Empirical Flood Formulae ============ */
function EmpiricalFloods() {
  const [area, setArea] = useState(250); // km2
  const [cD, setCD] = useState(11.5); // Dicken's C (6 to 30)
  const [cR, setCR] = useState(8.5); // Ryves' C (6.8 to 15)

  // 1. Dicken's Formula (North & Central India): Qp = C_D * A^(3/4)
  const qDicken = cD * Math.pow(area, 0.75);

  // 2. Ryves' Formula (Peninsular India / Tamil Nadu): Qp = C_R * A^(2/3)
  const qRyves = cR * Math.pow(area, 2 / 3);

  // 3. Inglis' Formula (Western Ghats & Maharashtra): Qp = 124 * A / sqrt(A + 10.4)
  const qInglis = (124 * area) / Math.sqrt(area + 10.4);

  // 4. Nawab Jung Bahadur (Hyderabad Deccan): Qp = C * A^(0.92 - 1/14 log A)
  const qNawab = 50 * Math.pow(area, 0.92 - (1 / 14) * Math.log10(area));

  return (
    <Box title="Comparative Indian Empirical Flood Formulae" kind="Interactive Comparator">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Catchment Area A: <b>{area} km²</b>
            <input type="range" min="20" max="1500" step="20" value={area} onChange={e => setArea(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Dicken's CD (North/Central): <b>{f1(cD)}</b>
            <input type="range" min="6" max="25" step="0.5" value={cD} onChange={e => setCD(+e.target.value)} />
          </label>
          <label className="f">Ryves' CR (Peninsular/TN): <b>{f1(cR)}</b>
            <input type="range" min="6.8" max="15" step="0.5" value={cR} onChange={e => setCR(+e.target.value)} />
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

            {/* Comparative Bars */}
            <g>
              {/* Inglis */}
              <rect x="70" y={160 - (qInglis / 4000) * 135} width="55" height={(qInglis / 4000) * 135} fill="#dc2626" rx="3" />
              <text x="75" y={150 - (qInglis / 4000) * 135} fontSize="9" fill="#dc2626" fontWeight="bold">{big(qInglis)}</text>
              <text x="75" y="175" fontSize="9" fill="#475569" fontWeight="bold">Inglis (W. Ghats)</text>

              {/* Dicken */}
              <rect x="175" y={160 - (qDicken / 4000) * 135} width="55" height={(qDicken / 4000) * 135} fill="#2563eb" rx="3" />
              <text x="180" y={150 - (qDicken / 4000) * 135} fontSize="9" fill="#2563eb" fontWeight="bold">{big(qDicken)}</text>
              <text x="175" y="175" fontSize="9" fill="#475569" fontWeight="bold">Dicken's (Central)</text>

              {/* Ryves */}
              <rect x="280" y={160 - (qRyves / 4000) * 135} width="55" height={(qRyves / 4000) * 135} fill="#0891b2" rx="3" />
              <text x="285" y={150 - (qRyves / 4000) * 135} fontSize="9" fill="#0891b2" fontWeight="bold">{big(qRyves)}</text>
              <text x="280" y="175" fontSize="9" fill="#475569" fontWeight="bold">Ryves' (Peninsular)</text>

              {/* Nawab Jung */}
              <rect x="385" y={160 - (qNawab / 4000) * 135} width="55" height={(qNawab / 4000) * 135} fill="#7c3aed" rx="3" />
              <text x="390" y={150 - (qNawab / 4000) * 135} fontSize="9" fill="#7c3aed" fontWeight="bold">{big(qNawab)}</text>
              <text x="385" y="175" fontSize="9" fill="#475569" fontWeight="bold">Nawab Jung (Deccan)</text>
            </g>

            <text x="20" y="25" fontSize="9" fill="#64748b">m³/s</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={big(qInglis) + " m³/s"} l="Inglis Peak (Western Ghats)" tone="bad" />
            <Kpi v={big(qDicken) + " m³/s"} l="Dicken's Peak (North India)" tone="good" />
            <Kpi v={big(qRyves) + " m³/s"} l="Ryves' Peak (South India)" tone="warn" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Regional Contrast:</b> The Inglis formula yields the highest peak discharges because the steep, orographic Western Ghats catchments generate intense runoff surges compared to gentler peninsular plains.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S33: ADCP Acoustic Doppler Current Profiler ============ */
function AdcpProfiler() {
  const [boatSpeed, setBoatSpeed] = useState(0.8); // m/s
  const [surfaceVel, setSurfaceVel] = useState(1.6); // m/s
  const [riverDepth, setRiverDepth] = useState(4.5); // m

  // Acoustic parameters: 4 transducer beams at 20 deg
  const beamAngleDeg = 20;
  const f0 = 1200; // kHz
  const soundSpeed = 1480; // m/s

  // Doppler shift: delta_f = 2 * f0 * (v * cos theta) / c
  const thetaRad = (beamAngleDeg * Math.PI) / 180;
  const deltaF = (2 * f0 * 1000 * (surfaceVel * Math.cos(thetaRad))) / soundSpeed;

  // Integrated discharge for 50m wide channel (trapezoidal)
  const channelWidth = 50;
  const area = 0.5 * (channelWidth + channelWidth * 0.7) * riverDepth;
  const meanVel = 0.85 * surfaceVel;
  const totalQ = area * meanVel;

  return (
    <Box title="ADCP Acoustic Doppler Velocity Profiler" kind="Interactive Instrument">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Surface Water Velocity: <b>{f2(surfaceVel)} m/s</b>
            <input type="range" min="0.4" max="3.5" step="0.1" value={surfaceVel} onChange={e => setSurfaceVel(+e.target.value)} />
          </label>
          <label className="f">River Depth: <b>{f1(riverDepth)} m</b>
            <input type="range" min="2.0" max="8.0" step="0.5" value={riverDepth} onChange={e => setRiverDepth(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">ADCP Catamaran Boat Speed: <b>{f2(boatSpeed)} m/s</b>
            <input type="range" min="0.2" max="2.0" step="0.1" value={boatSpeed} onChange={e => setBoatSpeed(+e.target.value)} />
          </label>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
            Transducer frequency: <b>1200 kHz</b> · 4-beam Janus convex geometry (20° inclination).
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f0f9ff", borderRadius: 6, border: "1px solid #bae6fd" }}>
            {/* Riverbed profile */}
            <path d="M 40,50 Q 80,160 260,170 Q 440,160 480,50 L 480,200 L 40,200 Z" fill="#78350f" opacity="0.85" />
            <text x="230" y="190" fontSize="9" fill="#fef08a" fontWeight="bold">River Bed (Rough Boundary Layer)</text>

            {/* Water Column */}
            <path d="M 40,50 Q 80,160 260,170 Q 440,160 480,50 Z" fill="#38bdf8" opacity="0.35" />

            {/* ADCP Boat / Catamaran */}
            <g transform="translate(240, 42)">
              <rect x="-25" y="-10" width="50" height="12" rx="4" fill="#ea580c" stroke="#9a3412" strokeWidth="1.5" />
              <rect x="-10" y="-18" width="20" height="9" fill="#f8fafc" stroke="#475569" />
              <text x="-15" y="-2" fontSize="8" fill="#fff" fontWeight="bold">ADCP</text>

              {/* 4 Acoustic Beams */}
              <line x1="-15" y1="2" x2="-80" y2="105" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
              <line x1="15" y1="2" x2="80" y2="105" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,2" />
              <line x1="-5" y1="2" x2="-25" y2="115" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
              <line x1="5" y1="2" x2="25" y2="115" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" />
            </g>

            {/* Vertical Velocity Profile Arrows */}
            {[0.2, 0.4, 0.6, 0.8].map((depthRatio, idx) => {
              const y = 50 + depthRatio * 115;
              const vRatio = Math.pow(1 - depthRatio * 0.7, 0.25);
              const vLen = surfaceVel * vRatio * 45;
              return (
                <g key={idx} stroke="#1e40af" strokeWidth="2" fill="#1e40af">
                  <line x1="330" y1={y} x2={330 + vLen} y2={y} />
                  <polygon points={\`\${330 + vLen}, \${y - 3} \${336 + vLen}, \${y} \${330 + vLen}, \${y + 3}\`} />
                  <text x="345" y={y - 4} fontSize="8" fill="#1e3a8a">v={f2(surfaceVel * vRatio)} m/s</text>
                </g>
              );
            })}

            <text x="320" y="40" fontSize="9" fill="#1e40af" fontWeight="bold">Velocity Profile (Doppler Shift)</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(totalQ) + " m³/s"} l="Integrated Total Discharge Q" tone="good" />
            <Kpi v={f1(deltaF) + " Hz"} l="Doppler Shift Δf" tone="warn" />
            <Kpi v={f2(meanVel) + " m/s"} l="Mean Stream Velocity (0.85 Vs)" />
            <Kpi v={f1(area) + " m²"} l="Gauged Cross-Section Area" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Doppler Principle:</b> Sound pulses reflect off suspended sediment particles. The Doppler frequency shift $\Delta f$ measures particle velocity relative to the moving boat, automating river discharge gauging without anchors.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S34: Statistical Flood Frequency Distributions ============ */
function ProbDistLab() {
  const [dist, setDist] = useState("gumbel");
  const [meanQ, setMeanQ] = useState(1200); // m3/s
  const [cv, setCv] = useState(0.35); // coeff of variation
  const [returnT, setReturnT] = useState(50); // years

  const sigma = meanQ * cv;
  const pExceed = 1 / returnT;
  const pNonExceed = 1 - pExceed;

  // Frequency Factor KT calculation
  let KT = 0;
  if (dist === "normal") {
    // approx z for 1 - p
    KT = returnT === 10 ? 1.282 : returnT === 25 ? 1.751 : returnT === 50 ? 2.054 : 2.326;
  } else if (dist === "gumbel") {
    // Gumbel KT = -(sqrt(6)/pi) * [0.5772 + ln(ln(T/(T-1)))]
    const yT = -Math.log(-Math.log(1 - 1 / returnT));
    KT = (yT - 0.5772) / (Math.PI / Math.sqrt(6));
  } else if (dist === "lognormal") {
    KT = (returnT === 50 ? 2.35 : returnT === 100 ? 2.85 : 1.95);
  }

  const floodQT = meanQ + KT * sigma;

  return (
    <Box title="Flood Frequency Distributions & Return Period Sandbox" kind="Statistical Simulator">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Probability Model:</span>
          <Seg value={dist} onChange={setDist} options={[
            ["gumbel", "Gumbel EV-I (Extreme Value)"],
            ["lognormal", "Log-Normal (Skewed)"],
            ["normal", "Standard Normal (Gaussian)"]
          ]} />
          <label className="f" style={{ marginTop: 6 }}>Mean Annual Flood: <b>{meanQ} m³/s</b>
            <input type="range" min="400" max="2500" step="100" value={meanQ} onChange={e => setMeanQ(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Coefficient of Variation (Cv = σ/μ): <b>{f2(cv)}</b>
            <input type="range" min="0.15" max="0.65" step="0.05" value={cv} onChange={e => setCv(+e.target.value)} />
          </label>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Design Return Period T:</span>
            <Seg value={String(returnT)} onChange={v => setReturnT(+v)} options={[
              ["10", "T = 10 yr"],
              ["25", "T = 25 yr"],
              ["50", "T = 50 yr"],
              ["100", "T = 100 yr"]
            ]} />
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 190" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 160].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="40" y1="160" x2="480" y2="160" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="160" stroke="#64748b" strokeWidth="1.5" />

            {/* Bell/Skewed PDF curve */}
            <path d={Array.from({ length: 41 }).map((_, i) => {
              const xNorm = (i - 20) / 6;
              const yVal = Math.exp(-0.5 * xNorm * xNorm);
              const xPos = 40 + i * 11;
              const yPos = 160 - yVal * 125;
              return \`\${i === 0 ? "M" : "L"} \${xPos} \${yPos}\`;
            }).join(" ")} fill="none" stroke="#2563eb" strokeWidth="2.5" />

            {/* QT Exceedance Cut */}
            <line x1="380" y1="30" x2="380" y2="160" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
            <text x="315" y="25" fontSize="10" fill="#dc2626" fontWeight="bold">QT ({returnT}-yr) = {big(floodQT)} m³/s</text>

            {/* Shaded Tail Area (Exceedance Probability 1/T) */}
            <path d="M 380,160 L 380,120 Q 420,150 480,160 Z" fill="#fca5a5" opacity="0.6" />
            <text x="390" y="145" fontSize="9" fill="#991b1b" fontWeight="bold">Tail: P(Q ≥ QT) = {f3(pExceed)}</text>

            <text x="230" y="174" fontSize="9" fill="#64748b">Discharge Q (m³/s)</text>
            <text x="20" y="25" fontSize="9" fill="#64748b">f(Q)</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={big(floodQT) + " m³/s"} l={"Design " + returnT + "-Year Flood QT"} tone="good" />
            <Kpi v={f2(KT)} l="Frequency Factor (KT)" tone="warn" />
            <Kpi v={f1(pExceed * 100) + "%"} l="Annual Exceedance Prob (1/T)" />
            <Kpi v={big(sigma) + " m³/s"} l="Std Deviation (σ = Cv × μ)" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Frequency Factor:</b> Chow formulated general flood frequency as $Q_T = \bar{Q} + K_T \cdot \sigma$. For heavy-tailed hydrological extremes in India, Gumbel and Log-Pearson distributions prevent underestimating flood risk.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S36: Regional Flood Frequency Bench ============ */
function RegionalFloodBench() {
  const [zone, setZone] = useState("cauvery");
  const [area, setArea] = useState(420); // km2
  const [tRet, setTRet] = useState(25); // yr

  const zones = {
    cauvery: { name: "Sub-Zone 3b (Cauvery Basin)", c: 8.2, exp: 0.72, ratios: { 10: 1.45, 25: 1.82, 50: 2.15, 100: 2.50 } },
    ganga: { name: "Sub-Zone 1g (Upper Gangetic Plain)", c: 6.5, exp: 0.76, ratios: { 10: 1.55, 25: 1.95, 50: 2.30, 100: 2.72 } },
    godavari: { name: "Sub-Zone 5 (Godavari Basin)", c: 9.4, exp: 0.68, ratios: { 10: 1.50, 25: 1.88, 50: 2.22, 100: 2.60 } }
  };

  const z = zones[zone];
  const qBar = z.c * Math.pow(area, z.exp);
  const growthRatio = z.ratios[tRet];
  const designQ = qBar * growthRatio;

  return (
    <Box title="CWC Regional Flood Frequency & Index Flood Workbench" kind="Regional Model">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>CWC Hydro-Meteorological Sub-Zone:</span>
          <Seg value={zone} onChange={setZone} options={[
            ["cauvery", "Sub-Zone 3b (Cauvery)"],
            ["ganga", "Sub-Zone 1g (Ganga)"],
            ["godavari", "Sub-Zone 5 (Godavari)"]
          ]} />
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Catchment Area A: <b>{area} km²</b>
            <input type="range" min="50" max="2500" step="50" value={area} onChange={e => setArea(+e.target.value)} />
          </label>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Return Period T:</span>
            <Seg value={String(tRet)} onChange={v => setTRet(+v)} options={[
              ["10", "10-yr"],
              ["25", "25-yr"],
              ["50", "50-yr"],
              ["100", "100-yr"]
            ]} />
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Grid */}
            {[40, 80, 120, 150].map(y => <line key={y} x1="40" y1={y} x2="480" y2={y} stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="40" y1="150" x2="480" y2="150" stroke="#64748b" strokeWidth="1.5" />
            <line x1="40" y1="20" x2="40" y2="150" stroke="#64748b" strokeWidth="1.5" />

            {/* Growth Curve */}
            {Object.entries(z.ratios).map(([t, r], idx, arr) => {
              const x = 70 + idx * 110;
              const y = 150 - (r / 3.0) * 125;
              return (
                <g key={t}>
                  {idx > 0 && (
                    <line x1={70 + (idx - 1) * 110} y1={150 - (arr[idx - 1][1] / 3.0) * 125} x2={x} y2={y} stroke="#0284c7" strokeWidth="2.5" />
                  )}
                  <circle cx={x} cy={y} r={t == tRet ? "6" : "4"} fill={t == tRet ? "#dc2626" : "#0284c7"} />
                  <text x={x - 12} y={y - 10} fontSize="9" fill={t == tRet ? "#dc2626" : "#0369a1"} fontWeight="bold">r={f2(r)}</text>
                  <text x={x - 12} y="165" fontSize="9" fill="#64748b">T={t} yr</text>
                </g>
              );
            })}

            <text x="250" y="30" fontSize="10" fill="#0284c7" fontWeight="bold">Regional Non-Dimensional Growth Curve (QT / Q̄)</text>
            <text x="20" y="25" fontSize="9" fill="#64748b">QT / Q̄</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={big(designQ) + " m³/s"} l={"Design Flood QT (" + tRet + "-yr)"} tone="good" />
            <Kpi v={big(qBar) + " m³/s"} l="Mean Annual Flood (Q̄ = c A^b)" tone="warn" />
            <Kpi v={f2(growthRatio)} l="Regional Growth Factor (QT / Q̄)" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Index Flood Method:</b> Used by CWC for ungauged Indian catchments. The mean annual flood $\bar{Q}$ is scaled by a non-dimensional regional growth curve calibrated across similar hydrologic sub-zones.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S37: Hydraulic Risk & Reliability Matrix ============ */
function RiskMatrix() {
  const [returnT, setReturnT] = useState(50); // yr
  const [serviceLife, setServiceLife] = useState(25); // yr

  // Annual exceedance probability P = 1 / T
  const p = 1 / returnT;
  // Hydrologic Risk: R = 1 - (1 - P)^n
  const risk = 1 - Math.pow(1 - p, serviceLife);
  const reliability = 1 - risk;

  return (
    <Box title="Hydraulic Risk & Reliability Matrix" kind="Risk Workbench">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Design Flood Return Period T: <b>{returnT} years</b>
            <input type="range" min="5" max="200" step="5" value={returnT} onChange={e => setReturnT(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Expected Structure Design Life n: <b>{serviceLife} years</b>
            <input type="range" min="5" max="75" step="5" value={serviceLife} onChange={e => setServiceLife(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Split Visual Bar: Risk vs Reliability */}
            <rect x="50" y="45" width={380 * risk} height="35" fill="#dc2626" rx="3" />
            <rect x={50 + 380 * risk} y="45" width={380 * reliability} height="35" fill="#16a34a" rx="3" />

            <text x="55" y="66" fontSize="11" fill="#fff" fontWeight="bold">{f1(risk * 100)}% Failure Risk</text>
            <text x={Math.min(380, 60 + 380 * risk)} y="66" fontSize="11" fill="#fff" fontWeight="bold">{f1(reliability * 100)}% Reliability</text>

            {/* Risk comparison table markers */}
            <g transform="translate(50, 110)">
              <text x="0" y="0" fontSize="10" fill="#475569" fontWeight="bold">IS:5477 Structural Risk Benchmarks:</text>
              <text x="0" y="18" fontSize="9" fill={risk < 0.1 ? "#16a34a" : "#dc2626"}>• Major Dam Spillways: Risk must be &lt; 1% (T = 1,000 to PMF)</text>
              <text x="0" y="32" fontSize="9" fill={risk < 0.25 ? "#16a34a" : "#ca8a04"}>• Highway Bridges & Barrages: Risk &lt; 20% (T = 50 to 100 yr)</text>
              <text x="0" y="46" fontSize="9" fill="#475569">• Road Culverts & Storm Drains: Risk &lt; 40% (T = 10 to 25 yr)</text>
            </g>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(risk * 100) + "%"} l="Hydrologic Risk R = 1 - (1 - 1/T)^n" tone={risk > 0.4 ? "bad" : risk > 0.2 ? "warn" : "good"} />
            <Kpi v={f1(reliability * 100) + "%"} l="Lifetime Reliability (Re)" tone={reliability > 0.8 ? "good" : "bad"} />
            <Kpi v={f2(p * 100) + "%"} l="Annual Exceedance Prob (1/T)" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>The 50-Year Fallacy:</b> Designing a 50-year bridge for a 50-year flood does NOT mean safety. The probability that the 50-year flood will occur at least once during its 50-year life is $R = 1 - (1 - 1/50)^{50} = \mathbf{63.6\%}$!
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S39: Aquifer Hydrostratigraphy Cutaway ============ */
function AquiferTypes() {
  const [selectedWell, setSelectedWell] = useState("confined");

  return (
    <Box title="Aquifer Hydrostratigraphy & Artesian Well Cutaway" kind="Interactive Cutaway">
      <div className="wg-row" style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569", marginRight: 8 }}>Select Borewell to Inspect:</span>
        <Seg value={selectedWell} onChange={setSelectedWell} options={[
          ["unconfined", "1. Shallow Unconfined Well"],
          ["perched", "2. Perched Aquifer Well"],
          ["confined", "3. Flowing Artesian Well"]
        ]} />
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 230" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #cbd5e1" }}>
            <defs>
              <linearGradient id="clayGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Topography Surface */}
            <path d="M 0,55 Q 180,75 360,110 L 520,135 L 520,230 L 0,230 Z" fill="#fef3c7" opacity="0.6" />

            {/* Perched Aquifer Lens */}
            <path d="M 80,85 Q 140,82 180,88 L 175,98 Q 135,94 85,98 Z" fill="url(#clayGrad)" />
            <path d="M 85,82 Q 135,76 175,82 L 180,88 Q 140,82 80,85 Z" fill="#38bdf8" opacity="0.7" />
            <text x="95" y="76" fontSize="8" fill="#0369a1" fontWeight="bold">Perched Water</text>

            {/* Main Unconfined Phreatic Water Table */}
            <path d="M 0,95 Q 180,115 360,135 L 520,150" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" fill="none" />
            <text x="15" y="90" fontSize="9" fill="#0284c7" fontWeight="bold">∇ Water Table (Phreatic Surface)</text>

            {/* Confining Clay Layer (Aquitard) */}
            <path d="M 0,135 Q 200,150 520,165 L 520,185 Q 200,170 0,155 Z" fill="url(#clayGrad)" />
            <text x="210" y="162" fontSize="9" fill="#f8fafc" fontWeight="bold">Impervious Confining Bed (Aquitard / Clay)</text>

            {/* Confined Aquifer */}
            <path d="M 0,155 Q 200,170 520,185 L 520,230 L 0,230 Z" fill="#bae6fd" opacity="0.8" />
            <text x="15" y="210" fontSize="10" fill="#0369a1" fontWeight="bold">Confined (Artesian) Sandstone Aquifer</text>

            {/* Artesian Piezometric Surface (Pressure Head above ground on the right) */}
            <line x1="0" y1="50" x2="520" y2="105" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="320" y="95" fontSize="8" fill="#dc2626" fontWeight="bold">Piezometric Surface (Artesian Head)</text>

            {/* Well 1: Shallow Unconfined */}
            <rect x="250" y="85" width="6" height="45" fill="#334155" />
            <rect x="251" y="115" width="4" height="15" fill="#0284c7" />

            {/* Well 2: Perched */}
            <rect x="130" y="65" width="6" height="26" fill="#334155" />

            {/* Well 3: Confined Artesian Well */}
            <rect x="420" y="115" width="7" height="95" fill="#334155" />
            <rect x="421" y="115" width="5" height="95" fill="#0284c7" />
            {/* Artesian fountain if piezometric head is above ground! */}
            <path d="M 423,115 Q 418,95 423,85 Q 428,95 423,115" fill="#38bdf8" stroke="#0284c7" />
            <text x="405" y="80" fontSize="8" fill="#dc2626" fontWeight="bold">Free Flowing!</text>

            {/* Highlighting */}
            {selectedWell === "unconfined" && <circle cx="253" cy="115" r="16" fill="none" stroke="#2563eb" strokeWidth="2" />}
            {selectedWell === "perched" && <circle cx="133" cy="80" r="16" fill="none" stroke="#2563eb" strokeWidth="2" />}
            {selectedWell === "confined" && <circle cx="423" cy="115" r="18" fill="none" stroke="#dc2626" strokeWidth="2" />}
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={selectedWell === "confined" ? "Flowing Artesian" : selectedWell === "perched" ? "Ephemeral Perched" : "Gravity Water Table"} l="Selected Aquifer Regime" tone="good" />
            <Kpi v={selectedWell === "confined" ? "S ≈ 10⁻⁴ (Elastic)" : "Sy ≈ 0.15 (Specific Yield)"} l="Storage Mechanism" tone="warn" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            {selectedWell === "confined"
              ? "Confined Aquifer: Pressurized between aquitards. When the piezometric surface rises above ground elevation, water flows naturally without a pump (flowing artesian well)."
              : selectedWell === "perched"
              ? "Perched Aquifer: A local lens of low-permeability clay holds a false, isolated water table above the regional groundwater reservoir."
              : "Unconfined Aquifer: Upper boundary is the phreatic water table at atmospheric pressure. Yield comes from gravity drainage of pores (Specific Yield Sy)."}
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S40: Theis Well Function & Drawdown Cone ============ */
function TheisWell() {
  const [Q_lpm, setQ_lpm] = useState(1200); // L/min
  const [T_m2d, setT_m2d] = useState(240); // m2/day
  const [storativity, setStorativity] = useState(0.0005); // confined
  const [timeDays, setTimeDays] = useState(5); // days

  const Q_m3s = (Q_lpm / 1000) / 60;
  const T_m2s = T_m2d / 86400;
  const t_sec = timeDays * 86400;

  // Theis Well function W(u) approximation
  const theisW = u => {
    if (u <= 0) return 10;
    if (u > 5) return 0;
    if (u < 1) {
      return -0.5772 - Math.log(u) + u - (u * u) / 4 + (u * u * u) / 18;
    }
    return (Math.exp(-u) / u) * ((u * u + a1 * u + a2) / (u * u + b1 * u + b2));
  };
  const a1 = 0.4361836, a2 = 0.0001, b1 = 1.0, b2 = 1.0;

  // Drawdown at radial distances r
  const rVals = [1, 5, 15, 30, 60, 100, 180, 300];
  const profile = rVals.map(r => {
    const u = (r * r * storativity) / (4 * T_m2s * t_sec);
    const Wu = theisW(u);
    const s = (Q_m3s / (4 * Math.PI * T_m2s)) * Math.max(0, Wu);
    return { r, s };
  });

  const sw = profile[0].s; // wellbore drawdown
  const sObs = profile[3].s; // drawdown at 30m

  return (
    <Box title="Theis Non-Equilibrium Well Function Simulator" kind="Transient Physics">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Pumping Rate Q: <b>{Q_lpm} L/min</b> ({f3(Q_m3s)} m³/s)
            <input type="range" min="300" max="3000" step="100" value={Q_lpm} onChange={e => setQ_lpm(+e.target.value)} />
          </label>
          <label className="f">Transmissivity T: <b>{T_m2d} m²/day</b>
            <input type="range" min="60" max="600" step="20" value={T_m2d} onChange={e => setT_m2d(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Pumping Duration: <b>{timeDays} days</b>
            <input type="range" min="1" max="30" step="1" value={timeDays} onChange={e => setTimeDays(+e.target.value)} />
          </label>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Aquifer Storativity:</span>
            <Seg value={String(storativity)} onChange={v => setStorativity(+v)} options={[
              ["0.0001", "Confined (10⁻⁴)"],
              ["0.0005", "Confined (5×10⁻⁴)"],
              ["0.1", "Unconfined (0.1)"]
            ]} />
          </div>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 200" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Pumping Well Centerline */}
            <line x1="260" y1="20" x2="260" y2="180" stroke="#334155" strokeWidth="4" />
            <text x="245" y="16" fontSize="9" fill="#334155" fontWeight="bold">Well (Q)</text>

            {/* Static Water Level */}
            <line x1="40" y1="40" x2="480" y2="40" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" />
            <text x="45" y="34" fontSize="8" fill="#0284c7">Static Piezometric Level (s = 0)</text>

            {/* Drawdown Cone Profile (Symmetric) */}
            <path d={profile.map((p, idx) => {
              const xRight = 260 + (p.r / 300) * 210;
              const y = 40 + Math.min(130, (p.s / 12) * 120);
              return \`\${idx === 0 ? "M" : "L"} \${xRight} \${y}\`;
            }).join(" ")} fill="none" stroke="#dc2626" strokeWidth="2.5" />

            <path d={profile.map((p, idx) => {
              const xLeft = 260 - (p.r / 300) * 210;
              const y = 40 + Math.min(130, (p.s / 12) * 120);
              return \`\${idx === 0 ? "M" : "L"} \${xLeft} \${y}\`;
            }).join(" ")} fill="none" stroke="#dc2626" strokeWidth="2.5" />

            {/* Shaded cone */}
            <text x="270" y={40 + (sw / 12) * 110} fontSize="10" fill="#dc2626" fontWeight="bold">sw = {f2(sw)} m</text>
            <text x="340" y="100" fontSize="9" fill="#0284c7">s(30m) = {f2(sObs)} m</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f2(sw) + " m"} l="Wellbore Drawdown (sw)" tone="bad" />
            <Kpi v={f2(sObs) + " m"} l="Observation Well Drawdown (30m)" tone="warn" />
            <Kpi v={f2(T_m2d) + " m²/d"} l="Transmissivity T" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Theis Non-Equilibrium Equation:</b> $s = \\frac{Q}{4\\pi T} W(u)$. Unsteady cone of depression expands continuously outward with time $t$. In low-storativity confined aquifers, the cone expands rapidly.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S41: Cooper-Jacob Semilog Solver ============ */
function CooperJacob() {
  const [deltaS, setDeltaS] = useState(1.85); // m per log cycle
  const [t0, setT0] = useState(4.2); // minutes
  const [Q_m3h, setQ_m3h] = useState(60); // m3/h
  const r = 25; // m distance to observation well

  const Q_m3s = Q_m3h / 3600;
  // Transmissivity T = 2.303 Q / (4 pi deltaS)
  const T_m2s = (2.303 * Q_m3s) / (4 * Math.PI * deltaS);
  const T_m2d = T_m2s * 86400;

  // Storativity S = 2.25 T t0 / r^2 where t0 in seconds
  const t0_sec = t0 * 60;
  const S_val = (2.25 * T_m2s * t0_sec) / (r * r);

  return (
    <Box title="Cooper-Jacob Semilog Straight-Line Solver" kind="Pumping Test Analysis">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Drawdown per Log Cycle Δs: <b>{f2(deltaS)} m</b>
            <input type="range" min="0.5" max="4.0" step="0.05" value={deltaS} onChange={e => setDeltaS(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Zero Drawdown Intercept t0: <b>{f1(t0)} min</b>
            <input type="range" min="1.0" max="15.0" step="0.2" value={t0} onChange={e => setT0(+e.target.value)} />
          </label>
          <label className="f">Pumping Rate Q: <b>{Q_m3h} m³/h</b>
            <input type="range" min="20" max="150" step="5" value={Q_m3h} onChange={e => setQ_m3h(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 180" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Log Grid Lines */}
            {[100, 200, 300, 400].map(x => <line key={x} x1={x} y1="20" x2={x} y2="150" stroke="#e2e8f0" strokeWidth="1" />)}
            <line x1="50" y1="150" x2="480" y2="150" stroke="#64748b" strokeWidth="1.5" />
            <line x1="50" y1="20" x2="50" y2="150" stroke="#64748b" strokeWidth="1.5" />

            {/* Straight line fit */}
            <line x1="120" y1="150" x2="460" y2="40" stroke="#2563eb" strokeWidth="3" />

            {/* Zero intercept point */}
            <circle cx="120" cy="150" r="5" fill="#dc2626" />
            <text x="110" y="165" fontSize="9" fill="#dc2626" fontWeight="bold">t0 = {f1(t0)} min</text>

            {/* Delta s bracket */}
            <line x1="300" y1="92" x2="300" y2="35" stroke="#ea580c" strokeWidth="2" strokeDasharray="2,2" />
            <text x="310" y="65" fontSize="10" fill="#ea580c" fontWeight="bold">Δs = {f2(deltaS)} m / cycle</text>

            <text x="230" y="174" fontSize="9" fill="#64748b">Log Time t (min)</text>
            <text x="15" y="25" fontSize="9" fill="#64748b">s (m)</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f1(T_m2d) + " m²/d"} l="Transmissivity T = 2.303 Q / 4πΔs" tone="good" />
            <Kpi v={S_val.toExponential(2)} l="Storativity S = 2.25 T t0 / r²" tone="warn" />
            <Kpi v={S_val < 0.005 ? "Confined Aquifer" : "Unconfined Aquifer"} l="Regime Classification" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Cooper-Jacob Validity:</b> Valid when $u = \\frac{r^2 S}{4 T t} &lt; 0.05$. Plotting drawdown against $\\log_{10}(t)$ yields a straight line whose slope gives Transmissivity and intercept gives Storativity.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S42: Thiem & Dupuit Steady Radial Flow ============ */
function SteadyWell() {
  const [aquiferType, setAquiferType] = useState("confined");
  const [Q_lpm, setQ_lpm] = useState(1500); // L/min
  const [K_md, setK_md] = useState(15); // m/d permeability
  const [thickH, setThickH] = useState(20); // m

  const Q_m3s = (Q_lpm / 1000) / 60;
  const K_m2s = K_md / 86400;
  const r1 = 15; // m
  const r2 = 60; // m

  // Confined: Thiem equation: s1 - s2 = Q / (2 pi T) * ln(r2/r1)
  const T_conf = K_m2s * thickH;
  const deltaS_conf = (Q_m3s / (2 * Math.PI * T_conf)) * Math.log(r2 / r1);

  // Unconfined: Dupuit equation: h2^2 - h1^2 = Q / (pi K) * ln(r2/r1)
  const h2 = thickH;
  const h1_sq = Math.max(1, h2 * h2 - (Q_m3s / (Math.PI * K_m2s)) * Math.log(r2 / r1));
  const h1 = Math.sqrt(h1_sq);
  const deltaS_unconf = h2 - h1;

  const deltaS = aquiferType === "confined" ? deltaS_conf : deltaS_unconf;

  return (
    <Box title="Thiem & Dupuit Steady Radial Flow Workbench" kind="Steady Well Hydraulics">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#475569" }}>Aquifer Boundary Condition:</span>
          <Seg value={aquiferType} onChange={setAquiferType} options={[
            ["confined", "Confined (Thiem Equation)"],
            ["unconfined", "Unconfined (Dupuit-Forchheimer)"]
          ]} />
          <label className="f" style={{ marginTop: 6 }}>Pumping Rate Q: <b>{Q_lpm} L/min</b>
            <input type="range" min="400" max="3000" step="100" value={Q_lpm} onChange={e => setQ_lpm(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Hydraulic Conductivity K: <b>{K_md} m/day</b>
            <input type="range" min="2" max="50" step="2" value={K_md} onChange={e => setK_md(+e.target.value)} />
          </label>
          <label className="f">Aquifer Thickness H: <b>{thickH} m</b>
            <input type="range" min="10" max="40" step="2" value={thickH} onChange={e => setThickH(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 190" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Pumping Well */}
            <rect x="256" y="20" width="8" height="150" fill="#334155" />
            <text x="245" y="16" fontSize="9" fill="#334155" fontWeight="bold">Well (Q)</text>

            {/* Two Observation Piezometers */}
            {/* Piezo 1 at r1=15m */}
            <rect x="290" y="35" width="4" height="135" fill="#64748b" />
            <text x="282" y="30" fontSize="8" fill="#64748b">P1 (r₁)</text>

            {/* Piezo 2 at r2=60m */}
            <rect x="380" y="35" width="4" height="135" fill="#64748b" />
            <text x="372" y="30" fontSize="8" fill="#64748b">P2 (r₂)</text>

            {/* Drawdown curve */}
            <path d={\`M 264,120 Q 300,75 380,48 L 480,40\`} fill="none" stroke="#0284c7" strokeWidth="2.5" />
            <path d={\`M 256,120 Q 220,75 140,48 L 40,40\`} fill="none" stroke="#0284c7" strokeWidth="2.5" />

            {/* Head difference indicator */}
            <line x1="290" y1="80" x2="380" y2="80" stroke="#ea580c" strokeWidth="1" strokeDasharray="3,2" />
            <text x="315" y="75" fontSize="9" fill="#ea580c" fontWeight="bold">Δh = {f2(deltaS)} m</text>

            <text x="210" y="180" fontSize="9" fill="#64748b">Radial Distance r (m)</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f2(deltaS) + " m"} l="Head Difference (h₂ - h₁)" tone="good" />
            <Kpi v={f1(K_md * thickH) + " m²/d"} l="Aquifer Transmissivity (T = KH)" />
            <Kpi v={aquiferType === "confined" ? "Logarithmic" : "Parabolic (Dupuit)"} l="Phreatic Curve Form" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Thiem vs Dupuit:</b> In confined aquifers, thickness $b$ remains constant, resulting in logarithmic drawdown. In unconfined aquifers, saturated thickness decreases toward the wellbore, producing steeper curvature.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S43: Well Interference Simulator ============ */
function WellInterference() {
  const [spacingB, setSpacingB] = useState(120); // m
  const [q1, setQ1] = useState(1200); // L/min
  const [q2, setQ2] = useState(1200); // L/min

  // Combined drawdown at midpoint between wells
  // s_mid = s1(B/2) + s2(B/2)
  const T = 200 / 86400; // m2/s
  const r_mid = spacingB / 2;
  const R_inf = 400; // radius of influence m

  const s1_mid = ((q1 / 60000) / (2 * Math.PI * T)) * Math.log(R_inf / Math.max(5, r_mid));
  const s2_mid = ((q2 / 60000) / (2 * Math.PI * T)) * Math.log(R_inf / Math.max(5, r_mid));
  const total_mid = Math.max(0, s1_mid + s2_mid);

  return (
    <Box title="Well Interference & Drawdown Superposition Workbench" kind="Interference Simulator">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Well Separation Distance B: <b>{spacingB} m</b>
            <input type="range" min="30" max="300" step="10" value={spacingB} onChange={e => setSpacingB(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Well 1 Discharge Q1: <b>{q1} L/min</b>
            <input type="range" min="400" max="2500" step="100" value={q1} onChange={e => setQ1(+e.target.value)} />
          </label>
          <label className="f">Well 2 Discharge Q2: <b>{q2} L/min</b>
            <input type="range" min="0" max="2500" step="100" value={q2} onChange={e => setQ2(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 190" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Well 1 at x = 180 */}
            <line x1="180" y1="20" x2="180" y2="160" stroke="#334155" strokeWidth="4" />
            <text x="165" y="16" fontSize="9" fill="#334155" fontWeight="bold">Well 1</text>

            {/* Well 2 at x = 180 + spacing */}
            <line x1={180 + (spacingB / 300) * 180} y1="20" x2={180 + (spacingB / 300) * 180} y2="160" stroke="#334155" strokeWidth="4" />
            <text x={170 + (spacingB / 300) * 180} y="16" fontSize="9" fill="#334155" fontWeight="bold">Well 2</text>

            {/* Static water line */}
            <line x1="40" y1="35" x2="480" y2="35" stroke="#0284c7" strokeWidth="1" strokeDasharray="3,3" />

            {/* Superposed Cone of Depression */}
            <path d={\`M 40,35 Q 120,40 180,135 Q \${180 + (spacingB / 600) * 180},\${65 + (total_mid / 6) * 60} \${180 + (spacingB / 300) * 180},135 Q 400,40 480,35\`}
              fill="none" stroke="#dc2626" strokeWidth="2.5" />

            {/* Midpoint marker */}
            <circle cx={180 + (spacingB / 600) * 180} cy={65 + (total_mid / 6) * 60} r="4" fill="#dc2626" />
            <text x={150 + (spacingB / 600) * 180} y={85 + (total_mid / 6) * 60} fontSize="9" fill="#dc2626" fontWeight="bold">Midpoint s = {f2(total_mid)} m</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f2(total_mid) + " m"} l="Midpoint Drawdown s = s₁ + s₂" tone={total_mid > 3 ? "bad" : "good"} />
            <Kpi v={spacingB < 80 ? "Severe Interference" : "Safe Spacing"} l="Well Field Interference" tone={spacingB < 80 ? "bad" : "good"} />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Principle of Superposition:</b> Drawdown cones overlap when wells are placed closer than their radius of influence ($B &lt; 2R$). This causes excessive pumping lift and increased operating costs.
          </p>
        </div>
      </div>
    </Box>
  );
}

/* ============ S44: Open Well Recuperation Test ============ */
function RecupTest() {
  const [wellDiam, setWellDiam] = useState(4.0); // m
  const [s1, setS1] = useState(2.8); // initial depression head m
  const [s2, setS2] = useState(1.2); // residual depression head m
  const [recupTimeMin, setRecupTimeMin] = useState(90); // minutes

  // Cross sectional area of well
  const A = (Math.PI / 4) * wellDiam * wellDiam; // m2

  // Slichter's specific capacity per unit area C/A = (2.303 / T) * log10(s1 / s2) in 1/h
  const T_hr = recupTimeMin / 60;
  const specificCapacityPerArea = (2.303 / T_hr) * Math.log10(s1 / Math.max(0.05, s2)); // 1/h

  // Safe continuous yield for working depression head H = 2.0 m
  const workingH = 2.0; // m
  const safeQ_m3h = specificCapacityPerArea * A * workingH;
  const safeQ_lpm = (safeQ_m3h * 1000) / 60;

  return (
    <Box title="Open Well Recuperation Test (Slichter's Method)" kind="Field Test Analyzer">
      <div className="wg-row" style={{ marginBottom: 8, gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label className="f">Well Diameter D: <b>{f1(wellDiam)} m</b> (Area: {f1(A)} m²)
            <input type="range" min="2.0" max="8.0" step="0.5" value={wellDiam} onChange={e => setWellDiam(+e.target.value)} />
          </label>
          <label className="f">Initial Depression Head s1: <b>{f2(s1)} m</b>
            <input type="range" min="1.0" max="4.5" step="0.1" value={s1} onChange={e => setS1(+e.target.value)} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <label className="f">Residual Head s2: <b>{f2(s2)} m</b>
            <input type="range" min="0.3" max="2.5" step="0.1" value={s2} onChange={e => setS2(+e.target.value)} />
          </label>
          <label className="f">Recuperation Duration T: <b>{recupTimeMin} min</b>
            <input type="range" min="30" max="180" step="10" value={recupTimeMin} onChange={e => setRecupTimeMin(+e.target.value)} />
          </label>
        </div>
      </div>

      <div className="wg-row">
        <div className="wg-col" style={{ flex: "1 1 340px" }}>
          <svg viewBox="0 0 520 190" style={{ width: "100%", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
            {/* Open Well Dug Shaft */}
            <rect x="180" y="20" width="160" height="150" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />

            {/* Static Water Level */}
            <line x1="100" y1="40" x2="420" y2="40" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />
            <text x="110" y="35" fontSize="8" fill="#0284c7">Static Groundwater Table</text>

            {/* Initial Pumping Level (s1 depression) */}
            <line x1="180" y1={40 + s1 * 25} x2="340" y2={40 + s1 * 25} stroke="#dc2626" strokeWidth="2" strokeDasharray="4,2" />
            <text x="350" y={44 + s1 * 25} fontSize="8" fill="#dc2626">Level at stop of pump (s₁={f1(s1)}m)</text>

            {/* Recuperated Level (s2 depression) */}
            <line x1="180" y1={40 + s2 * 25} x2="340" y2={40 + s2 * 25} stroke="#16a34a" strokeWidth="2.5" />
            <text x="350" y={44 + s2 * 25} fontSize="8" fill="#16a34a" fontWeight="bold">Recuperated Level after {recupTimeMin}m (s₂={f1(s2)}m)</text>

            {/* Water Inflow Arrows from bottom */}
            <g stroke="#0284c7" strokeWidth="2" fill="#0284c7">
              <line x1="220" y1="165" x2="220" y2="140" />
              <polygon points="217,140 220,132 223,140" />
              <line x1="260" y1="165" x2="260" y2="140" />
              <polygon points="257,140 260,132 263,140" />
              <line x1="300" y1="165" x2="300" y2="140" />
              <polygon points="297,140 300,132 303,140" />
            </g>
            <text x="210" y="165" fontSize="8" fill="#0284c7">Seepage from Aquifer Base</text>
          </svg>
        </div>

        <div className="wg-col" style={{ flex: "1 1 180px" }}>
          <div className="kpis">
            <Kpi v={f2(specificCapacityPerArea) + " /h"} l="Specific Capacity C/A = (2.303/T)log(s1/s2)" tone="good" />
            <Kpi v={f1(safeQ_m3h) + " m³/h"} l="Safe Yield at H=2m (Q = C/A × A × H)" tone="warn" />
            <Kpi v={f1(safeQ_lpm) + " L/min"} l="Continuous Discharge Rate" />
          </div>
          <p className="note" style={{ marginTop: 6, fontSize: 11 }}>
            <b>Slichter's Recuperation Formula:</b> $C/A = \\frac{2.303}{T} \\log_{10}\\left(\\frac{s_1}{s_2}\\right)$. Independent of well dimensions, $C/A$ directly characterizes the permeability of the surrounding aquifer sand and rock strata.
          </p>
        </div>
      </div>
    </Box>
  );
}
`;

// Insert into src/widgets.jsx
let widgetsCode = fs.readFileSync('src/widgets.jsx', 'utf8');

if (!widgetsCode.includes('function RationalCalc()')) {
  widgetsCode = widgetsCode.replace('export const WIDGETS = {', codeToAdd + '\nexport const WIDGETS = {');
}

// Add to WIDGETS object
const mapEntries = `  "rational-calc": RationalCalc,
  rationalcalc: RationalCalc,
  "empirical-floods": EmpiricalFloods,
  empiricalfloods: EmpiricalFloods,
  "adcp-profiler": AdcpProfiler,
  adcpprofiler: AdcpProfiler,
  "prob-dist-lab": ProbDistLab,
  probdistlab: ProbDistLab,
  "regional-flood-bench": RegionalFloodBench,
  regionalfloodbench: RegionalFloodBench,
  "risk-matrix": RiskMatrix,
  riskmatrix: RiskMatrix,
  "aquifer-types": AquiferTypes,
  aquifertypes: AquiferTypes,
  "theis-well": TheisWell,
  theiswell: TheisWell,
  "cooper-jacob": CooperJacob,
  cooperjacob: CooperJacob,
  "steady-well": SteadyWell,
  steadywell: SteadyWell,
  "well-interference": WellInterference,
  wellinterference: WellInterference,
  "recup-test": RecupTest,
  recuptest: RecupTest,
`;

if (!widgetsCode.includes('"rational-calc": RationalCalc')) {
  widgetsCode = widgetsCode.replace('export const WIDGETS = {', 'export const WIDGETS = {\n' + mapEntries);
}

fs.writeFileSync('src/widgets.jsx', widgetsCode, 'utf8');
console.log('✓ Successfully added Unit 4 & Unit 5 widgets to src/widgets.jsx');

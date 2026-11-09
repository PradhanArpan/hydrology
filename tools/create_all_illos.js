const fs = require('fs');

const illosToAdd = `
/* ================= CE633 Visual Replacement Illustrations ================= */

export function UhDerivationDiag() {
  return (
    <Illo title="Unit Hydrograph Concept: 1-cm Rainfall Excess to Direct Runoff" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <rect x="50" y="25" width="40" height="60" fill="#0284c7" stroke="#0369a1" />
        <text x="56" y="58" fontSize="10" fill="#fff" fontWeight="bold">1.0 cm</text>
        <text x="45" y="105" fontSize="9" fill="#0369a1" fontWeight="bold">D-h Excess Rain</text>

        <path d="M 120,55 L 180,55" stroke="#64748b" strokeWidth="2" markerEnd="url(#arr)" strokeDasharray="3,2" />
        <text x="130" y="45" fontSize="9" fill="#64748b">Transform</text>

        {/* DRH Curve */}
        <path d="M 200,120 Q 250,20 290,120 L 350,120" fill="none" stroke="#2563eb" strokeWidth="3" />
        <line x1="200" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <circle cx="245" cy="48" r="4" fill="#dc2626" />
        <text x="255" y="45" fontSize="10" fill="#dc2626" fontWeight="bold">Peak Qp = Up</text>
        <text x="260" y="135" fontSize="9" fill="#64748b">Time Base tb</text>
        <text x="360" y="60" fontSize="9" fill="#2563eb" fontWeight="bold">Direct Runoff Hydrograph</text>
        <text x="360" y="75" fontSize="8" fill="#475569">Runoff Volume = 1 cm × Catchment Area</text>
      </svg>
    </Illo>
  );
}

export function ScurveConcept() {
  return (
    <Illo title="S-Curve Equilibrium Concept: Continuous Rainfall Inflow" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Asymptote */}
        <line x1="40" y1="35" x2="460" y2="35" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" />
        <text x="260" y="30" fontSize="9" fill="#dc2626" fontWeight="bold">Equilibrium Discharge Qe = 2.778 A / D (m³/s)</text>

        {/* Stacked UHs */}
        <path d="M 50,120 Q 80,60 110,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
        <path d="M 80,120 Q 110,60 140,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
        <path d="M 110,120 Q 140,60 170,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />
        <path d="M 140,120 Q 170,60 200,120" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2,2" />

        {/* S-Curve */}
        <path d="M 50,120 Q 120,45 220,35 L 460,35" fill="none" stroke="#ea580c" strokeWidth="3" />
        <line x1="40" y1="120" x2="460" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <text x="140" y="55" fontSize="10" fill="#ea580c" fontWeight="bold">Cumulative S-Curve</text>
        <text x="400" y="135" fontSize="9" fill="#64748b">Time (h)</text>
      </svg>
    </Illo>
  );
}

export function DimHydrograph() {
  return (
    <Illo title="SCS Dimensionless Unit Hydrograph (q/qp vs t/tp)" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Curvilinear curve */}
        <path d="M 50,120 Q 130,20 180,20 Q 230,20 380,120" fill="none" stroke="#2563eb" strokeWidth="3" />
        <circle cx="150" cy="20" r="4" fill="#dc2626" />
        <text x="160" y="24" fontSize="9" fill="#dc2626" fontWeight="bold">Peak (1.0, 1.0)</text>

        {/* Equivalent Triangle */}
        <polygon points="50,120 150,20 380,120" fill="none" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="270" y="55" fontSize="9" fill="#ca8a04" fontWeight="bold">SCS Equivalent Triangle</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">q/qp</text>
        <text x="410" y="135" fontSize="9" fill="#64748b">t/tp</text>
      </svg>
    </Illo>
  );
}

export function CascadeRoute() {
  return (
    <Illo title="Nash's Conceptual Cascade of Linear Reservoirs" kind="Schematic">
      <svg viewBox="0 0 500 120" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <g transform="translate(30, 35)">
          <text x="-15" y="25" fontSize="9" fill="#2563eb" fontWeight="bold">Inflow I(t)</text>
          <line x1="40" y1="20" x2="65" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="70" y="0" width="70" height="40" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <text x="78" y="24" fontSize="9" fill="#1e40af" fontWeight="bold">Reservoir 1 (K)</text>
          <line x1="140" y1="20" x2="165" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="170" y="0" width="70" height="40" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <text x="178" y="24" fontSize="9" fill="#1e40af" fontWeight="bold">Reservoir 2 (K)</text>
          <line x1="240" y1="20" x2="265" y2="20" stroke="#2563eb" strokeWidth="2" strokeDasharray="2,2" />

          <text x="275" y="24" fontSize="12" fill="#64748b">•••</text>
          <line x1="295" y1="20" x2="315" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />

          <rect x="320" y="0" width="70" height="40" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.5" />
          <text x="328" y="24" fontSize="9" fill="#1e40af" fontWeight="bold">Reservoir n (K)</text>
          <line x1="390" y1="20" x2="420" y2="20" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" />
          <text x="425" y="25" fontSize="9" fill="#2563eb" fontWeight="bold">Outflow Q(t)</text>
        </g>
      </svg>
    </Illo>
  );
}

export function WedgeStorage() {
  return (
    <Illo title="Prism and Wedge Storage Components in Channel Reach" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* River Bed */}
        <line x1="40" y1="120" x2="460" y2="120" stroke="#78350f" strokeWidth="4" />
        <text x="40" y="135" fontSize="8" fill="#78350f" fontWeight="bold">River Channel Bed</text>

        {/* Prism storage (outflow controlled, rectangular) */}
        <polygon points="60,65 440,65 440,120 60,120" fill="#bae6fd" opacity="0.6" stroke="#0284c7" strokeWidth="1.5" />
        <text x="210" y="95" fontSize="9" fill="#0369a1" fontWeight="bold">Prism Storage = K · O</text>

        {/* Wedge storage (inflow surge, triangular) */}
        <polygon points="60,30 440,65 60,65" fill="#fde047" opacity="0.6" stroke="#ca8a04" strokeWidth="1.5" />
        <text x="120" y="52" fontSize="9" fill="#854d0e" fontWeight="bold">Wedge Storage = K · x · (I - O)</text>

        {/* Water Flow Arrows */}
        <line x1="20" y1="30" x2="55" y2="30" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="10" y="24" fontSize="9" fill="#2563eb" fontWeight="bold">Inflow I</text>
        <line x1="445" y1="65" x2="480" y2="65" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="445" y="58" fontSize="9" fill="#2563eb" fontWeight="bold">Outflow O</text>
      </svg>
    </Illo>
  );
}

export function BridgePier() {
  return (
    <Illo title="River Gauging Station & Bridge Cross-Section" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Bridge Deck */}
        <rect x="30" y="20" width="440" height="15" fill="#64748b" stroke="#334155" />
        <text x="220" y="31" fontSize="9" fill="#fff" fontWeight="bold">Bridge Deck</text>

        {/* Piers */}
        <rect x="140" y="35" width="20" height="90" fill="#94a3b8" stroke="#475569" />
        <rect x="340" y="35" width="20" height="90" fill="#94a3b8" stroke="#475569" />

        {/* Water Body */}
        <path d="M 40,75 Q 250,70 460,75 L 460,125 L 40,125 Z" fill="#38bdf8" opacity="0.5" />
        <line x1="40" y1="75" x2="460" y2="75" stroke="#0284c7" strokeWidth="2" className="anim-flow" />

        {/* Staff Gauge attached to pier */}
        <rect x="160" y="45" width="6" height="70" fill="#fef08a" stroke="#ca8a04" />
        <text x="170" y="65" fontSize="8" fill="#ca8a04" fontWeight="bold">Staff Gauge</text>

        {/* Cableway / Crane */}
        <line x1="330" y1="35" x2="330" y2="90" stroke="#334155" strokeWidth="1.5" />
        <circle cx="330" cy="90" r="5" fill="#dc2626" />
        <text x="260" y="95" fontSize="8" fill="#dc2626" fontWeight="bold">Current Meter Sinker</text>
      </svg>
    </Illo>
  );
}

export function VelocityProfile() {
  return (
    <Illo title="Vertical Velocity Profile & Current Meter Sampling Depths" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="60" y1="25" x2="440" y2="25" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />
        <text x="70" y="20" fontSize="8" fill="#0284c7">Water Surface (y = d)</text>

        <line x1="60" y1="125" x2="440" y2="125" stroke="#78350f" strokeWidth="3" />
        <text x="70" y="137" fontSize="8" fill="#78350f">Channel Bed (y = 0)</text>

        {/* Velocity Parabolic Profile */}
        <path d="M 120,125 Q 260,120 280,35 L 275,25" fill="none" stroke="#2563eb" strokeWidth="3" />
        <text x="285" y="30" fontSize="9" fill="#2563eb" fontWeight="bold">Surface Velocity vs</text>

        {/* Sampling Points */}
        <circle cx="270" cy="45" r="4" fill="#dc2626" />
        <text x="280" y="49" fontSize="8" fill="#dc2626" fontWeight="bold">0.2d (v0.2)</text>

        <circle cx="235" cy="85" r="4" fill="#16a34a" />
        <text x="245" y="89" fontSize="8" fill="#16a34a" fontWeight="bold">0.6d (v0.6 ≈ v_mean)</text>

        <circle cx="185" cy="105" r="4" fill="#dc2626" />
        <text x="195" y="109" fontSize="8" fill="#dc2626" fontWeight="bold">0.8d (v0.8)</text>

        <text x="350" y="80" fontSize="9" fill="#475569">Two-point average:</text>
        <text x="350" y="95" fontSize="10" fill="#0f172a" fontWeight="bold">v_mean = (v0.2 + v0.8) / 2</text>
      </svg>
    </Illo>
  );
}

export function MidSection() {
  return (
    <Illo title="Mid-Section Method for Stream Discharge Gauging" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* River Bed Profile */}
        <path d="M 40,40 Q 120,125 250,130 Q 380,125 460,40 Z" fill="#38bdf8" opacity="0.3" stroke="#0284c7" />

        {/* Vertical Panels */}
        {[130, 200, 270, 340].map((x, idx) => (
          <g key={x}>
            <line x1={x} y1="40" x2={x} y2="125" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,2" />
            <rect x={x - 20} y="40" width="40" height="80" fill="none" stroke="#2563eb" strokeWidth="1" strokeDasharray="2,2" />
            <text x={x - 6} y="32" fontSize="9" fill="#1e293b" fontWeight="bold">x{idx + 1}</text>
          </g>
        ))}

        <text x="180" y="145" fontSize="9" fill="#0f172a" fontWeight="bold">Panel Width W = (x_{'{i+1}'} - x_{'{i-1}'}) / 2</text>
      </svg>
    </Illo>
  );
}

export function SlopeArea() {
  return (
    <Illo title="Slope-Area Method: High Water Marks & Energy Slope" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Ground */}
        <line x1="40" y1="120" x2="460" y2="140" stroke="#78350f" strokeWidth="4" />

        {/* Water Surface */}
        <line x1="60" y1="55" x2="440" y2="90" stroke="#0284c7" strokeWidth="2.5" />
        <text x="180" y="65" fontSize="9" fill="#0284c7" fontWeight="bold">Water Surface Slope S_w</text>

        {/* Section 1 */}
        <line x1="100" y1="35" x2="100" y2="125" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
        <text x="80" y="30" fontSize="9" fill="#dc2626" fontWeight="bold">Section 1 (A1)</text>

        {/* Section 2 */}
        <line x1="400" y1="65" x2="400" y2="137" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,3" />
        <text x="380" y="60" fontSize="9" fill="#dc2626" fontWeight="bold">Section 2 (A2)</text>

        {/* Head Loss Indicator */}
        <line x1="100" y1="45" x2="400" y2="45" stroke="#64748b" strokeWidth="1" strokeDasharray="2,2" />
        <line x1="400" y1="45" x2="400" y2="85" stroke="#16a34a" strokeWidth="2" />
        <text x="408" y="70" fontSize="9" fill="#16a34a" fontWeight="bold">Head Loss h_f</text>

        <text x="180" y="115" fontSize="9" fill="#475569">Manning: Q = (1/n) · A · R^(2/3) · Sf^(1/2)</text>
      </svg>
    </Illo>
  );
}

export function RatingControls() {
  return (
    <Illo title="Stage-Discharge Rating Curve: Section Control vs Channel Control" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Curve with break in slope */}
        <path d="M 50,120 Q 120,95 180,80 Q 280,60 420,25" fill="none" stroke="#2563eb" strokeWidth="3" />

        <circle cx="180" cy="80" r="5" fill="#dc2626" />
        <text x="190" y="85" fontSize="9" fill="#dc2626" fontWeight="bold">Transition Level</text>

        <text x="90" y="110" fontSize="8" fill="#ca8a04" fontWeight="bold">Section Control (Rock Riffle, Weir)</text>
        <text x="270" y="45" fontSize="8" fill="#0284c7" fontWeight="bold">Channel Control (Channel Roughness & Floodplain)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Stage G</text>
        <text x="420" y="135" fontSize="9" fill="#64748b">Discharge Q</text>
      </svg>
    </Illo>
  );
}

export function LoopRatingDiag() {
  return (
    <Illo title="Jones Formula Hysteresis Loop in Unsteady Flood Flow" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Normal Steady Rating Curve */}
        <path d="M 50,120 Q 220,70 420,30" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="320" y="65" fontSize="8" fill="#64748b">Steady Rating Q_norm</text>

        {/* Hysteresis Loop */}
        <path d="M 50,120 Q 200,45 360,25 Q 440,30 420,30 Q 300,85 50,120 Z" fill="#dbeafe" opacity="0.4" stroke="#2563eb" strokeWidth="2.5" />

        {/* Rising limb marker */}
        <text x="210" y="40" fontSize="9" fill="#dc2626" fontWeight="bold">Rising Limb (dh/dt &gt; 0, Higher Q)</text>
        {/* Falling limb marker */}
        <text x="220" y="100" fontSize="9" fill="#16a34a" fontWeight="bold">Falling Limb (dh/dt &lt; 0, Lower Q)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Stage G</text>
        <text x="420" y="135" fontSize="9" fill="#64748b">Discharge Q</text>
      </svg>
    </Illo>
  );
}

export function DilutionGauging() {
  return (
    <Illo title="Chemical Dilution Gauging & Tracer Mass Balance" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Stream */}
        <path d="M 40,40 Q 250,55 460,40 L 460,105 Q 250,120 40,105 Z" fill="#38bdf8" opacity="0.4" />
        <line x1="40" y1="72" x2="460" y2="72" stroke="#0284c7" strokeWidth="2" className="anim-flow" />

        {/* Injection Point */}
        <circle cx="90" cy="50" r="5" fill="#dc2626" />
        <line x1="90" y1="20" x2="90" y2="45" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arr)" />
        <text x="60" y="15" fontSize="9" fill="#dc2626" fontWeight="bold">Tracer Injection (q, C1)</text>

        {/* Mixing zone */}
        <text x="180" y="65" fontSize="8" fill="#475569">Mixing Length L &gt; 10 W</text>

        {/* Sampling Station */}
        <circle cx="390" cy="90" r="5" fill="#16a34a" />
        <line x1="390" y1="95" x2="390" y2="125" stroke="#16a34a" strokeWidth="2" />
        <text x="350" y="135" fontSize="9" fill="#16a34a" fontWeight="bold">Sampling (C2)</text>

        <text x="200" y="100" fontSize="9" fill="#0f172a" fontWeight="bold">Q = q · (C1 - C2) / (C2 - C0)</text>
      </svg>
    </Illo>
  );
}

export function ReservoirSediment() {
  return (
    <Illo title="Reservoir Sedimentation Dynamics (Delta, Foreset, Bottomset Beds)" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Valley Bottom & Dam */}
        <line x1="40" y1="80" x2="420" y2="135" stroke="#78350f" strokeWidth="3" />
        <polygon points="420,135 440,40 460,135" fill="#64748b" stroke="#334155" />
        <text x="430" y="32" fontSize="9" fill="#334155" fontWeight="bold">Dam</text>

        {/* Water Pool */}
        <polygon points="120,55 440,55 420,135 120,85" fill="#38bdf8" opacity="0.35" />
        <line x1="120" y1="55" x2="440" y2="55" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="220" y="50" fontSize="8" fill="#0284c7">Full Reservoir Level (FRL)</text>

        {/* Sediment Layers */}
        {/* Topset */}
        <polygon points="40,80 180,85 170,95 40,90" fill="#ca8a04" opacity="0.8" />
        <text x="60" y="75" fontSize="8" fill="#854d0e" fontWeight="bold">Topset Bed (Coarse Gravel)</text>

        {/* Foreset */}
        <polygon points="180,85 270,115 250,125 170,95" fill="#eab308" opacity="0.8" />
        <text x="200" y="105" fontSize="8" fill="#713f12" fontWeight="bold">Foreset Bed (Sand)</text>

        {/* Bottomset */}
        <polygon points="270,115 420,135 420,130 250,125" fill="#a16207" opacity="0.8" />
        <text x="310" y="125" fontSize="8" fill="#fff" fontWeight="bold">Bottomset (Silt/Clay)</text>
      </svg>
    </Illo>
  );
}

export function SoilMoistureZones() {
  return (
    <Illo title="Subsurface Hydrologic Strata: Unsaturated Vadose Zone to Groundwater" kind="Schematic">
      <svg viewBox="0 0 500 160" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* 1. Soil Water Zone */}
        <rect x="50" y="20" width="400" height="30" fill="#d97706" opacity="0.3" stroke="#b45309" />
        <text x="60" y="38" fontSize="9" fill="#b45309" fontWeight="bold">1. Soil Water Zone (Transpiration by Plant Roots, Pellicular Moisture)</text>

        {/* 2. Intermediate Vadose Zone */}
        <rect x="50" y="50" width="400" height="35" fill="#fde047" opacity="0.3" stroke="#ca8a04" />
        <text x="60" y="70" fontSize="9" fill="#854d0e" fontWeight="bold">2. Intermediate Zone (Gravitational Infiltration to Water Table)</text>

        {/* 3. Capillary Fringe */}
        <rect x="50" y="85" width="400" height="20" fill="#38bdf8" opacity="0.4" stroke="#0284c7" strokeDasharray="3,2" />
        <text x="60" y="98" fontSize="9" fill="#0369a1" fontWeight="bold">3. Capillary Fringe (Sub-atmospheric Suction Lift Above Table)</text>

        {/* 4. Saturated Zone */}
        <rect x="50" y="105" width="400" height="40" fill="#0284c7" opacity="0.6" stroke="#0369a1" />
        <text x="60" y="128" fontSize="9" fill="#fff" fontWeight="bold">4. Saturated Groundwater Zone (Phreatic Aquifer, Positive Pressure)</text>

        {/* Water Table Symbol */}
        <line x1="45" y1="105" x2="455" y2="105" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,2" />
        <text x="360" y="102" fontSize="9" fill="#dc2626" fontWeight="bold">∇ Water Table</text>
      </svg>
    </Illo>
  );
}

export function DarcyExperiment() {
  return (
    <Illo title="Virtual Darcy Sand Permeameter Column" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Permeameter Cylinder */}
        <rect x="180" y="45" width="160" height="50" fill="#e2e8f0" stroke="#334155" strokeWidth="2" />
        <rect x="200" y="47" width="120" height="46" fill="#ca8a04" opacity="0.5" />
        <text x="220" y="73" fontSize="9" fill="#713f12" fontWeight="bold">Sand Sample (Area A, Length L)</text>

        {/* Piezometer 1 */}
        <line x1="220" y1="45" x2="220" y2="15" stroke="#0284c7" strokeWidth="2" />
        <rect x="216" y="25" width="8" height="20" fill="#38bdf8" />
        <text x="210" y="12" fontSize="8" fill="#0284c7" fontWeight="bold">h1</text>

        {/* Piezometer 2 */}
        <line x1="300" y1="45" x2="300" y2="15" stroke="#0284c7" strokeWidth="2" />
        <rect x="296" y="35" width="8" height="10" fill="#38bdf8" />
        <text x="290" y="12" fontSize="8" fill="#0284c7" fontWeight="bold">h2</text>

        {/* Head difference */}
        <line x1="230" y1="25" x2="290" y2="25" stroke="#dc2626" strokeWidth="1" strokeDasharray="2,2" />
        <text x="245" y="22" fontSize="8" fill="#dc2626" fontWeight="bold">Δh = h1 - h2</text>

        {/* Inflow and Outflow */}
        <line x1="140" y1="70" x2="175" y2="70" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="145" y="62" fontSize="9" fill="#0284c7" fontWeight="bold">Q In</text>
        <line x1="345" y1="70" x2="380" y2="70" stroke="#0284c7" strokeWidth="3" markerEnd="url(#arr)" />
        <text x="350" y="62" fontSize="9" fill="#0284c7" fontWeight="bold">Q Out</text>

        <text x="170" y="125" fontSize="9" fill="#0f172a" fontWeight="bold">Darcy's Law: Q = K · A · (Δh / L)</text>
      </svg>
    </Illo>
  );
}

export function AquiferCross() {
  return (
    <Illo title="Confined vs Unconfined Aquifer Cross-Section" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Unconfined section on left */}
        <rect x="40" y="25" width="200" height="100" fill="#bae6fd" opacity="0.4" stroke="#0284c7" />
        <line x1="40" y1="55" x2="240" y2="55" stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />
        <text x="50" y="48" fontSize="8" fill="#0284c7" fontWeight="bold">∇ Water Table (Atmospheric)</text>
        <text x="50" y="85" fontSize="9" fill="#0369a1" fontWeight="bold">Unconfined Aquifer</text>

        {/* Confined section on right */}
        <rect x="260" y="25" width="200" height="20" fill="#64748b" opacity="0.6" stroke="#334155" />
        <text x="270" y="38" fontSize="8" fill="#fff" fontWeight="bold">Upper Confining Bed (Aquitard)</text>
        <rect x="260" y="45" width="200" height="60" fill="#38bdf8" opacity="0.5" stroke="#0284c7" />
        <text x="270" y="78" fontSize="9" fill="#0369a1" fontWeight="bold">Confined (Artesian) Aquifer</text>
        <rect x="260" y="105" width="200" height="20" fill="#64748b" opacity="0.6" stroke="#334155" />
        <text x="270" y="118" fontSize="8" fill="#fff" fontWeight="bold">Lower Confining Bed</text>

        {/* Piezometric line */}
        <line x1="260" y1="18" x2="460" y2="18" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,2" />
        <text x="280" y="14" fontSize="8" fill="#dc2626" fontWeight="bold">Piezometric Pressure Surface</text>
      </svg>
    </Illo>
  );
}

export function StratifiedAquifer() {
  return (
    <Illo title="Stratified Aquifer Permeabilities (Parallel Kx vs Perpendicular Kz)" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Layer 1 */}
        <rect x="50" y="20" width="250" height="30" fill="#ca8a04" opacity="0.5" stroke="#854d0e" />
        <text x="60" y="38" fontSize="8" fill="#713f12" fontWeight="bold">Layer 1: b1 = 4m, K1 = 15 m/d</text>

        {/* Layer 2 */}
        <rect x="50" y="50" width="250" height="25" fill="#94a3b8" opacity="0.6" stroke="#475569" />
        <text x="60" y="66" fontSize="8" fill="#1e293b" fontWeight="bold">Layer 2: b2 = 3m, K2 = 2 m/d</text>

        {/* Layer 3 */}
        <rect x="50" y="75" width="250" height="35" fill="#38bdf8" opacity="0.5" stroke="#0284c7" />
        <text x="60" y="96" fontSize="8" fill="#0369a1" fontWeight="bold">Layer 3: b3 = 5m, K3 = 25 m/d</text>

        {/* Formula callouts */}
        <g transform="translate(320, 35)">
          <text x="0" y="0" fontSize="9" fill="#0f172a" fontWeight="bold">Parallel Flow:</text>
          <text x="0" y="14" fontSize="9" fill="#2563eb">K_x = Σ(Ki·bi) / Σbi</text>
          <text x="0" y="45" fontSize="9" fill="#0f172a" fontWeight="bold">Perpendicular Flow:</text>
          <text x="0" y="59" fontSize="9" fill="#ea580c">K_z = Σbi / Σ(bi/Ki)</text>
        </g>
      </svg>
    </Illo>
  );
}

export function ConeDepression() {
  return (
    <Illo title="Pumping Well Cone of Depression and Radius of Influence" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="35" x2="450" y2="35" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4,2" />
        <text x="60" y="30" fontSize="8" fill="#0284c7">Static Piezometric Level (s = 0)</text>

        {/* Pumping Well */}
        <line x1="250" y1="15" x2="250" y2="135" stroke="#334155" strokeWidth="4" />
        <text x="235" y="12" fontSize="9" fill="#334155" fontWeight="bold">Well (Q)</text>

        {/* Cone of Depression */}
        <path d="M 50,35 Q 210,40 250,115 Q 290,40 450,35" fill="none" stroke="#dc2626" strokeWidth="2.5" />

        {/* Radius of Influence */}
        <line x1="50" y1="135" x2="250" y2="135" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
        <text x="120" y="130" fontSize="8" fill="#64748b" fontWeight="bold">Radius of Influence R</text>

        <text x="260" y="110" fontSize="9" fill="#dc2626" fontWeight="bold">Wellbore Drawdown sw</text>
      </svg>
    </Illo>
  );
}

export function ObservationCone() {
  return (
    <Illo title="Pumping Test with Multiple Observation Wells" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="35" x2="450" y2="35" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,2" />

        {/* Pumping Well */}
        <line x1="120" y1="20" x2="120" y2="125" stroke="#334155" strokeWidth="4" />
        <text x="105" y="15" fontSize="9" fill="#334155" fontWeight="bold">Pump (Q)</text>

        {/* Observation Well 1 */}
        <line x1="220" y1="35" x2="220" y2="125" stroke="#64748b" strokeWidth="2" />
        <text x="210" y="28" fontSize="8" fill="#64748b">Obs 1 (r1)</text>

        {/* Observation Well 2 */}
        <line x1="350" y1="35" x2="350" y2="125" stroke="#64748b" strokeWidth="2" />
        <text x="340" y="28" fontSize="8" fill="#64748b">Obs 2 (r2)</text>

        {/* Drawdown Curve */}
        <path d="M 120,110 Q 180,60 220,55 Q 300,42 350,38 L 450,35" fill="none" stroke="#2563eb" strokeWidth="2.5" />
      </svg>
    </Illo>
  );
}

export function SanitaryWell() {
  return (
    <Illo title="Borewell Engineering Anatomy: Sanitary Seal, Screen, & Filter Pack" kind="Schematic">
      <svg viewBox="0 0 500 150" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Concrete Seal */}
        <rect x="210" y="20" width="80" height="25" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
        <text x="215" y="36" fontSize="8" fill="#fff" fontWeight="bold">Concrete Seal</text>

        {/* Well Casing Pipe */}
        <rect x="235" y="45" width="30" height="50" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
        <text x="275" y="70" fontSize="8" fill="#475569">Impervious Casing</text>

        {/* Slotted Screen */}
        <rect x="235" y="95" width="30" height="40" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" strokeDasharray="3,2" />
        <text x="275" y="115" fontSize="8" fill="#ea580c" fontWeight="bold">Slotted Well Screen</text>

        {/* Gravel Pack */}
        <rect x="220" y="95" width="15" height="40" fill="#ca8a04" opacity="0.6" />
        <rect x="265" y="95" width="15" height="40" fill="#ca8a04" opacity="0.6" />
        <text x="145" y="115" fontSize="8" fill="#854d0e">Gravel Filter Pack</text>
      </svg>
    </Illo>
  );
}

export function DrawdownTime() {
  return (
    <Illo title="Time-Drawdown Curve on Semilog Scale" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Straight line on semilog */}
        <line x1="100" y1="120" x2="420" y2="30" stroke="#2563eb" strokeWidth="2.5" />
        <circle cx="100" cy="120" r="4" fill="#dc2626" />
        <text x="95" y="135" fontSize="9" fill="#dc2626" fontWeight="bold">t0 (s=0)</text>

        <text x="220" y="65" fontSize="9" fill="#2563eb" fontWeight="bold">Slope = Δs per log cycle</text>
        <text x="20" y="25" fontSize="9" fill="#64748b">s (m)</text>
        <text x="410" y="135" fontSize="9" fill="#64748b">log(t)</text>
      </svg>
    </Illo>
  );
}

export function WellSpacing() {
  return (
    <Illo title="Well Interference Superposition: Combined Drawdown" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="30" x2="450" y2="30" stroke="#0284c7" strokeWidth="1" strokeDasharray="3,2" />

        {/* Well 1 */}
        <line x1="180" y1="20" x2="180" y2="115" stroke="#334155" strokeWidth="3" />
        <text x="165" y="15" fontSize="8" fill="#334155" fontWeight="bold">Well 1</text>

        {/* Well 2 */}
        <line x1="320" y1="20" x2="320" y2="115" stroke="#334155" strokeWidth="3" />
        <text x="315" y="15" fontSize="8" fill="#334155" fontWeight="bold">Well 2</text>

        {/* Combined Interference Curve */}
        <path d="M 60,30 Q 130,35 180,95 Q 250,55 320,95 Q 370,35 440,30" fill="none" stroke="#dc2626" strokeWidth="2.5" />
        <text x="225" y="75" fontSize="8" fill="#dc2626" fontWeight="bold">Superposed s = s1 + s2</text>
      </svg>
    </Illo>
  );
}

export function WellLosses() {
  return (
    <Illo title="Jacob's Total Drawdown Breakdown: Aquifer Loss vs Well Loss" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="60" y1="120" x2="440" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="60" y1="20" x2="60" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Total Drawdown Curve sw = BQ + CQ^2 */}
        <path d="M 60,120 Q 200,85 400,25" fill="none" stroke="#dc2626" strokeWidth="3" />
        {/* Linear Aquifer Loss BQ */}
        <line x1="60" y1="120" x2="400" y2="55" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,2" />

        <text x="220" y="85" fontSize="8" fill="#2563eb">Laminar Aquifer Loss (B·Q)</text>
        <text x="280" y="40" fontSize="8" fill="#dc2626" fontWeight="bold">Turbulent Well Entrance Loss (C·Q²)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Drawdown sw</text>
        <text x="400" y="135" fontSize="9" fill="#64748b">Discharge Q</text>
      </svg>
    </Illo>
  );
}

export function RecupDiagram() {
  return (
    <Illo title="Open Well Recuperation Test: Depression Head Recovery" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        <line x1="50" y1="120" x2="450" y2="120" stroke="#64748b" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="50" y2="120" stroke="#64748b" strokeWidth="1.5" />

        {/* Exponential recovery curve */}
        <path d="M 80,30 Q 150,85 420,115" fill="none" stroke="#16a34a" strokeWidth="3" />

        <circle cx="80" cy="30" r="4" fill="#dc2626" />
        <text x="90" y="35" fontSize="9" fill="#dc2626" fontWeight="bold">Pump Stops: s1 (Initial Depression)</text>

        <circle cx="280" cy="95" r="4" fill="#ca8a04" />
        <text x="290" y="90" fontSize="9" fill="#ca8a04" fontWeight="bold">After Time T: s2 (Residual Depression)</text>

        <text x="20" y="25" fontSize="9" fill="#64748b">Head s</text>
        <text x="410" y="135" fontSize="9" fill="#64748b">Time T (min)</text>
      </svg>
    </Illo>
  );
}

export function RwhSchematic() {
  return (
    <Illo title="Complete Rooftop Rainwater Harvesting Engineering Schematic" kind="Schematic">
      <svg viewBox="0 0 500 140" style={{ width: "100%", background: "#f8fafc", borderRadius: 6 }}>
        {/* Roof */}
        <polygon points="30,70 120,40 120,75 30,105" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
        <text x="45" y="75" fontSize="8" fill="#1e293b" fontWeight="bold">Roof Catchment</text>

        {/* Gutter & Pipe */}
        <line x1="120" y1="75" x2="160" y2="75" stroke="#0284c7" strokeWidth="2.5" />
        <line x1="160" y1="75" x2="160" y2="105" stroke="#0284c7" strokeWidth="2.5" />

        {/* First Flush */}
        <rect x="155" y="105" width="10" height="25" fill="#fed7aa" stroke="#ea580c" />
        <text x="135" y="138" fontSize="7" fill="#ea580c">First Flush</text>

        {/* Filter */}
        <rect x="190" y="65" width="25" height="30" fill="#ca8a04" opacity="0.6" stroke="#854d0e" />
        <text x="185" y="60" fontSize="7" fill="#854d0e">Sand Filter</text>
        <line x1="160" y1="85" x2="190" y2="85" stroke="#0284c7" strokeWidth="2" />

        {/* Storage Tank */}
        <rect x="240" y="65" width="65" height="45" rx="3" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
        <text x="248" y="90" fontSize="9" fill="#1e40af" fontWeight="bold">Storage Sump</text>

        {/* Recharge Well */}
        <line x1="305" y1="80" x2="350" y2="80" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="2,2" />
        <rect x="350" y="70" width="30" height="55" fill="#fef08a" stroke="#ca8a04" strokeDasharray="3,2" />
        <text x="340" y="138" fontSize="8" fill="#ca8a04" fontWeight="bold">Recharge Well</text>
      </svg>
    </Illo>
  );
}
`;

// Append to src/illos.jsx
let illosCode = fs.readFileSync('src/illos.jsx', 'utf8');

if (!illosCode.includes('function UhDerivationDiag()')) {
  // Insert before export const ILLOS
  illosCode = illosCode.replace('export const ILLOS = {', illosToAdd + '\nexport const ILLOS = {');
}

// Map entries for ILLOS
const illoMapEntries = `  "uh-derivation-diag": UhDerivationDiag,
  uhderivationdiag: UhDerivationDiag,
  "scurve-concept": ScurveConcept,
  scurveconcept: ScurveConcept,
  "dim-hydrograph": DimHydrograph,
  dimhydrograph: DimHydrograph,
  "cascade-route": CascadeRoute,
  cascaderoute: CascadeRoute,
  "wedge-storage": WedgeStorage,
  wedgestorage: WedgeStorage,
  "bridge-pier": BridgePier,
  bridgepier: BridgePier,
  "velocity-profile": VelocityProfile,
  velocityprofile: VelocityProfile,
  "mid-section": MidSection,
  midsection: MidSection,
  "slope-area": SlopeArea,
  slopearea: SlopeArea,
  "rating-controls": RatingControls,
  ratingcontrols: RatingControls,
  "loop-rating-diag": LoopRatingDiag,
  loopratingdiag: LoopRatingDiag,
  "dilution-gauging": DilutionGauging,
  dilutiongauging: DilutionGauging,
  "reservoir-sediment": ReservoirSediment,
  reservoirsediment: ReservoirSediment,
  "soil-moisture-zones": SoilMoistureZones,
  soilmoisturezones: SoilMoistureZones,
  "darcy-experiment": DarcyExperiment,
  darcyexperiment: DarcyExperiment,
  "aquifer-cross": AquiferCross,
  aquifercross: AquiferCross,
  "stratified-aquifer": StratifiedAquifer,
  stratifiedaquifer: StratifiedAquifer,
  "cone-depression": ConeDepression,
  conedepression: ConeDepression,
  "observation-cone": ObservationCone,
  observationcone: ObservationCone,
  "sanitary-well": SanitaryWell,
  sanitarywell: SanitaryWell,
  "drawdown-time": DrawdownTime,
  drawdowntime: DrawdownTime,
  "well-spacing": WellSpacing,
  wellspacing: WellSpacing,
  "well-losses": WellLosses,
  welllosses: WellLosses,
  "recup-diagram": RecupDiagram,
  recupdiagram: RecupDiagram,
  "rwh-schematic": RwhSchematic,
  rwhschematic: RwhSchematic,
`;

if (!illosCode.includes('"uh-derivation-diag": UhDerivationDiag')) {
  illosCode = illosCode.replace('export const ILLOS = {', 'export const ILLOS = {\n' + illoMapEntries);
}

fs.writeFileSync('src/illos.jsx', illosCode, 'utf8');
console.log('✓ Successfully added all 25 SVG illustrations into src/illos.jsx');

// Now replace all 25 ASCII diagram code blocks in sessions/*.md
const replacements = [
  { file: 'sessions/S21.md', regex: /```[\s\S]*?Excess Rainfall[\s\S]*?```/, tag: '::widget[uh-derivation-diag]' },
  { file: 'sessions/S23.md', regex: /```[\s\S]*?Equilibrium Discharge Q_e[\s\S]*?```/, tag: '::widget[scurve-concept]' },
  { file: 'sessions/S25.md', regex: /```[\s\S]*?Discharge Ratio q\/q_p[\s\S]*?```/, tag: '::widget[dim-hydrograph]' },
  { file: 'sessions/S26.md', regex: /```[\s\S]*?Reservoir 1[\s\S]*?```/, tag: '::widget[cascade-route]' },
  { file: 'sessions/S27.md', regex: /```[\s\S]*?Wedge Storage[\s\S]*?```/, tag: '::widget[wedge-storage]' },
  { file: 'sessions/S28.md', regex: /```[\s\S]*?Bridge Pier[\s\S]*?```/, tag: '::widget[bridge-pier]' },
  { file: 'sessions/S29.md', regex: /```[\s\S]*?Water Surface[\s\S]*?```/, tag: '::widget[velocity-profile]' },
  { file: 'sessions/S29.md', regex: /```[\s\S]*?Station:[\s\S]*?```/, tag: '::widget[mid-section]' },
  { file: 'sessions/S30.md', regex: /```[\s\S]*?Section 1[\s\S]*?```/, tag: '::widget[slope-area]' },
  { file: 'sessions/S31.md', regex: /```[\s\S]*?Channel control[\s\S]*?```/, tag: '::widget[rating-controls]' },
  { file: 'sessions/S32.md', regex: /```[\s\S]*?Peak Stage[\s\S]*?```/, tag: '::widget[loop-rating-diag]' },
  { file: 'sessions/S33.md', regex: /```[\s\S]*?Injection Point[\s\S]*?```/, tag: '::widget[dilution-gauging]' },
  { file: 'sessions/S36.md', regex: /```[\s\S]*?Reservoir Inflow[\s\S]*?```/, tag: '::widget[reservoir-sediment]' },
  { file: 'sessions/S37.md', regex: /```[\s\S]*?Ground Surface[\s\S]*?```/, tag: '::widget[soil-moisture-zones]' },
  { file: 'sessions/S38.md', regex: /```[\s\S]*?Piezometer 1[\s\S]*?```/, tag: '::widget[darcy-experiment]' },
  { file: 'sessions/S39.md', regex: /```[\s\S]*?Confined Aquifer:[\s\S]*?```/, tag: '::widget[aquifer-cross]' },
  { file: 'sessions/S39.md', regex: /```[\s\S]*?Layer 1: Thickness[\s\S]*?```/, tag: '::widget[stratified-aquifer]' },
  { file: 'sessions/S40.md', regex: /```[\s\S]*?Radius of Influence \(R\)[\s\S]*?```/, tag: '::widget[cone-depression]' },
  { file: 'sessions/S41.md', regex: /```[\s\S]*?Radius of Influence \(R\)[\s\S]*?```/, tag: '::widget[observation-cone]' },
  { file: 'sessions/S41.md', regex: /```[\s\S]*?Concrete Sanitary Seal[\s\S]*?```/, tag: '::widget[sanitary-well]' },
  { file: 'sessions/S42.md', regex: /```[\s\S]*?Drawdown vs Time[\s\S]*?```/, tag: '::widget[drawdown-time]' },
  { file: 'sessions/S43.md', regex: /```[\s\S]*?Slope = Delta s[\s\S]*?```/, tag: '::widget[well-spacing]' },
  { file: 'sessions/S44.md', regex: /```[\s\S]*?Turbulent Well Loss[\s\S]*?```/, tag: '::widget[well-losses]' },
  { file: 'sessions/S44.md', regex: /```[\s\S]*?Static Water Level[\s\S]*?```/, tag: '::widget[recup-diagram]' },
  { file: 'sessions/S45.md', regex: /```[\s\S]*?Roof Catchment Area[\s\S]*?```/, tag: '::widget[rwh-schematic]' }
];

let replacedCount = 0;
for (const r of replacements) {
  let content = fs.readFileSync(r.file, 'utf8');
  if (r.regex.test(content)) {
    content = content.replace(r.regex, r.tag);
    fs.writeFileSync(r.file, content, 'utf8');
    replacedCount++;
    console.log('✓ Replaced ASCII block in ' + r.file + ' with ' + r.tag);
  }
}

console.log('Total ASCII blocks cleanly replaced: ' + replacedCount);

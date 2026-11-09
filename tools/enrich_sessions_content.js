const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(__dirname, '..', 'sessions');

function update(id, fn) {
  const p = path.join(sessionsDir, `${id}.md`);
  const orig = fs.readFileSync(p, 'utf8');
  const updated = fn(orig);
  fs.writeFileSync(p, updated, 'utf8');
  console.log(`Enriched ${id}.md`);
}

// S02: Add Doppler Radar & Satellite Rain
update('S02', text => {
  if (text.includes('Doppler Weather Radar')) return text;
  const section = `\n### 4. Modern Precipitation Measurement: Radar & Satellite

1. **Doppler Weather Radar (DWR) Network:**
   The India Meteorological Department (IMD) operates dual-polarization S-band and X-band Doppler radars across major coastal, metropolitan, and Himalayan stations (e.g. Bengaluru, Chennai, Mumbai, Agartala). Radars emit microwave pulses and record backscattered radar reflectivity factor ($Z$ in $\\text{mm}^6\\text{/m}^3$), estimating rainfall rate ($R$) via the empirical Marshall-Palmer power law:
   $$Z = a R^b \\quad (\\text{typically } Z = 200 R^{1.6})$$
   DWR provides instantaneous spatial rainfall estimates over a $250\\text{--}400\\text{ km}$ radius with high temporal resolution ($10\\text{--}15\\text{ minutes}$), proving indispensable for urban flash-flood early warning.

2. **Satellite-Based Precipitation Products:**
   For ungauged river basins in the Himalayas and northeast India, hydrologists rely on gridded satellite rainfall:
   - **ISRO INSAT-3D / 3DR (HEM / IMSRA):** Geostationary thermal infrared and water-vapor channel estimates every 15 minutes.
   - **NASA/JAXA GPM (IMERG):** Multi-satellite merged precipitation analysis at $0.1^\circ \\times 0.1^\circ$ (approx. $10\\text{ km}$) every 30 minutes.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S16: Add Environmental Flows & CWC Guidelines
update('S16', text => {
  if (text.includes('Environmental Flows')) return text;
  const section = `\n### 4. Environmental Flows (E-Flows) & CWC Guidelines

Hydraulic infrastructure planning cannot merely extract all dependable flow ($Q_{75}$). Under the Central Water Commission (CWC) National Water Policy and National Green Tribunal (NGT) directives:
1. **Low-Flow Season (Dec–Mar):** Minimum continuous release of $20\\%$ of the average monthly dry-season flow must be maintained downstream of barrages and dams.
2. **Monsoon Season (Jun–Sep):** A minimum of $30\\%$ of high monsoon flows must pass through to maintain sediment flushing and river geomorphology.
3. **Flow Duration Metrics:**
   - $Q_{50}$: Median catchment yield used for hydropower firm-power sizing.
   - $Q_{75}$: Dependable annual flow standard for minor and major irrigation project design.
   - $Q_{90}\\text{--}Q_{95}$: Critical baseflow threshold representing environmental life-support for riverine ecosystems.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S20: Add Peninsular Hard Rock vs Alluvial Baseflow
update('S20', text => {
  if (text.includes('Peninsular Hard-Rock Basins')) return text;
  const section = `\n### 4. Regional Hydrology: Hard Rock vs Alluvial Catchments

Baseflow recession behavior across India is strongly stratified by geological formation:
- **Indo-Gangetic Alluvial Plain:** Deep unconfined sand/gravel aquifers store enormous volumes of groundwater with low recession slope ($K_r \\approx 0.98\\text{--}0.99$), sustaining perennial river flows across the dry winter and summer months.
- **Peninsular Hard-Rock Shield (Deccan Basalt & South Indian Granites):** Catchments in Karnataka, Tamil Nadu, and Maharashtra are dominated by crystalline rock with shallow weathered saprolite zones ($5\\text{--}20\\text{ m}$). Transmissivity drops rapidly with depth; baseflow recedes quickly ($K_r \\approx 0.85\\text{--}0.92$), turning tributary streams ephemeral or intermittent within 4–8 weeks after the monsoon ceases.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S24: Add CWC Regional Snyder Constants Table
update('S24', text => {
  if (text.includes('CWC Regional Snyder Coefficients')) return text;
  const section = `\n### 3. CWC Regional Snyder Coefficients for Indian Basins

The Central Water Commission (CWC) has calibrated Snyder's parameters across 26 hydrometeorological sub-zones of India:

| CWC Sub-Zone | Geographic Basin Region | $C_t$ (Lag Factor) | $C_p$ (Peak Factor) |
|---|---|---|---|
| **Zone 3(a)** | Southern Peninsular (Karnataka / Tamil Nadu) | $1.35\\text{--}1.65$ | $0.62\\text{--}0.70$ |
| **Zone 3(b)** | Krishna & Godavari Hard-Rock Basins | $1.40\\text{--}1.80$ | $0.55\\text{--}0.65$ |
| **Zone 1(c)** | Upper Indo-Gangetic Plains | $1.80\\text{--}2.20$ | $0.45\\text{--}0.58$ |
| **Zone 5(a)** | Western Ghats High-Gradient Catchments | $0.95\\text{--}1.25$ | $0.70\\text{--}0.82$ |
| **Zone 7(a)** | Brahmaputra Alluvial Basin | $1.50\\text{--}1.90$ | $0.50\\text{--}0.62$ |

*Observation:* Steep Western Ghats streams have low $C_t$ (flashy rapid response) and high $C_p$ (tall acute flood peaks), whereas flat Gangetic plains have higher $C_t$ and lower $C_p$ due to prolonged valley storage.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S27: Add Cauvery KRS-Mettur Routing Context
update('S27', text => {
  if (text.includes('Cauvery Basin Case Study')) return text;
  const section = `\n### 4. Real-World Case Study: Flood Wave Attenuation on the Cauvery

Between **Krishna Raja Sagara (KRS) Dam** (near Mysuru, Karnataka) and **Mettur Dam** (Tamil Nadu), a river distance of approximately $180\\text{ km}$:
1. During the intense August 2018 and August 2019 monsoon surges, inflows exceeding $2800\\text{ m}^3\\text{/s}$ ($100{,}000\\text{ cusecs}$) were released from KRS spillways.
2. The flood wave propagates downstream with an average travel time $K \\approx 24\\text{ to } 28\\text{ hours}$.
3. Natural channel storage and valley flooding attenuate the peak flood discharge by approximately $15\\text{--}22\\%$, giving downstream disaster management authorities in Tamil Nadu over 24 hours of lead time to evacuate floodplains and operate Mettur spillway gates safely.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S31: Add CWC Biligundlu Interstate Gauging Case Study
update('S31', text => {
  if (text.includes('CWC Biligundlu Interstate Gauging')) return text;
  const section = `\n### 4. Case Study: CWC Biligundlu Interstate Gauging Station

The **Biligundlu gauging station** on the Cauvery river (located near the Karnataka–Tamil Nadu border in Dharmapuri district) is one of the most critical hydrometric stations in India:
1. It is operated directly by the **Central Water Commission (CWC)** as an independent neutral monitoring post for the Cauvery Water Management Authority (CWMA).
2. The station utilizes a combined sectional staff gauge, bubbler pressure sensor, and an overhead cableway equipped with Columbus sounding weights ($50\\text{--}100\\text{ kg}$) and Ott propeller current meters for high-velocity monsoon gauging.
3. The calibrated rating curve at Biligundlu converts real-time stage telemetry into daily discharge data, determining whether monthly inter-state water allocations mandated by the Supreme Court of India have been fulfilled.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S35: Add IS:5477 Dam Safety Return Period Standards
update('S35', text => {
  if (text.includes('IS:5477 Design Flood Criteria')) return text;
  const section = `\n### 4. Indian Standards (IS:5477) Design Flood Criteria

The Bureau of Indian Standards (BIS) and Central Water Commission prescribe strict design flood return periods based on the risk and potential loss of life:

| Hydraulic Structure Classification | Storage Capacity ($S$) or Gross Head ($H$) | Design Flood Standard |
|---|---|---|
| **Small Dams / Minor Weirs** | $S < 10\\text{ MCM}$ or $H < 12\\text{ m}$ | **100-Year Flood ($Q_{100}$)** |
| **Intermediate Dams / Barrages** | $10 \\le S \\le 60\\text{ MCM}$ or $12 \\le H \\le 30\\text{ m}$ | **Standard Project Flood (SPF)** (~500-year equivalent) |
| **Major Dams (e.g. Bhakra, Sardar Sarovar)** | $S > 60\\text{ MCM}$ or $H > 30\\text{ m}$ | **Probable Maximum Flood (PMF)** (or 10,000-year flood) |
| **National Highway Bridges (IRC:5)** | Span $> 60\\text{ m}$ | **100-Year Flood** with $1.5\\text{ m}$ freeboard |
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S38: Add Hard-Rock vs Alluvium Hydrogeology
update('S38', text => {
  if (text.includes('Hydrogeological Provinces of India')) return text;
  const section = `\n### 4. Hydrogeological Provinces of India

Groundwater hydraulic parameters in India fall into two dramatically different regimes:

1. **Indo-Gangetic & Coastal Alluvium ($> 30\\%$ of landmass):**
   - High hydraulic conductivity ($K = 20\\text{--}80\\text{ m/day}$), high porosity ($n \\approx 30\\text{--}40\\%$) and high specific yield ($S_y \\approx 15\\text{--}25\\%$).
   - High-yield tube wells yielding $50\\text{--}150\\text{ m}^3\\text{/hour}$ for deep tubewell irrigation in Punjab, Haryana, UP, and Bihar.

2. **Peninsular Crystalline Shield & Deccan Traps ($> 65\\%$ of landmass):**
   - Massive granite, gneiss, charnockite, and basalt. Groundwater is restricted to secondary porosity: weathered saprolite zone ($5\\text{--}25\\text{ m}$) and deeper interconnected sheet fractures and lineaments.
   - Low hydraulic conductivity ($K = 0.1\\text{--}5.0\\text{ m/day}$), low storage ($S_y \\approx 1\\text{--}5\\%$).
   - Borewells frequently drilled to depths of $150\\text{--}400\\text{ meters}$ with low individual yields ($1\\text{--}5\\text{ m}^3\\text{/hour}$), highly vulnerable to rapid seasonal over-extraction.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

// S45: Add Bengaluru Lake Cascade & CGWB Guidelines
update('S45', text => {
  if (text.includes('Bengaluru Kere Cascade System')) return text;
  const section = `\n### 4. Urban Water Heritage: The Bengaluru Kere Cascade System

Bengaluru, perched on a peninsular ridge at $920\\text{ m MSL}$ with no major perennial river flowing through the city, historically relied on an ingenious 16th-century interconnected tank (Kere) cascade engineered by Kempe Gowda:
1. **Cascade Hydraulics:** Tanks were constructed along four natural watershed valleys (Hebbal, Vrishabhavathi, Koramangala, and Challaghatta).
2. **Flood Attenuation & Spill:** When an upstream lake filled to its maximum water level (MWL), excess water spilled over stone weirs into stone-lined canals (**Raja Kaluves**), feeding the next downstream lake in the chain.
3. **Managed Aquifer Recharge:** The cascading water bodies maintained high groundwater levels in open shallow wells across the plateau throughout the dry season.
4. **Modern Lessons:** Encroachment of Raja Kaluves and lake beds by real-estate development has severed cascade connectivity, converting moderate monsoon storms into devastating urban flash floods. Restoring cascade hydraulic connectivity is recognized by BBMP and civil engineers as the only sustainable flood mitigation strategy.
\n`;
  return text.replace('<!--tab:In class-->', section + '\n<!--tab:In class-->');
});

console.log('All enrichment sections applied successfully.');

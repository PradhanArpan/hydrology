const fs = require('fs');

// 1. S16.md
let s16 = fs.readFileSync('sessions/S16.md', 'utf8');
// Replace ASCII diagram in S16
s16 = s16.replace(/```[\s\S]*?Precipitation \(P\)[\s\S]*?```/, '::widget[runoff-pathways]');
if (!s16.includes('runoff-pathways')) {
  s16 = s16.replace('## Runoff components', '## Runoff components\n\n::widget[runoff-pathways]');
}
if (!s16.includes('fdc-explorer')) {
  s16 = s16.replace('## Catchment yield and dependable flow', '## Catchment yield and dependable flow\n\n::widget[fdc-explorer]');
}
fs.writeFileSync('sessions/S16.md', s16, 'utf8');
console.log('✓ S16 updated with runoff-pathways and fdc-explorer');

// 2. S18.md
let s18 = fs.readFileSync('sessions/S18.md', 'utf8');
s18 = s18.replace(/```[\s\S]*?Historical Storm Rain[\s\S]*?```/, '::widget[hms-calibrator]');
if (!s18.includes('hms-calibrator')) {
  s18 = s18.replace('## Model calibration and verification', '## Model calibration and verification\n\n::widget[hms-calibrator]');
}
fs.writeFileSync('sessions/S18.md', s18, 'utf8');
console.log('✓ S18 updated with hms-calibrator');

// 3. S19.md
let s19 = fs.readFileSync('sessions/S19.md', 'utf8');
s19 = s19.replace(/```[\s\S]*?Discharge Q[\s\S]*?```/, '::widget[hydro-anatomy]');
if (!s19.includes('hydro-anatomy')) {
  s19 = s19.replace('## 1. Anatomy of a Flood Hydrograph', '## 1. Anatomy of a Flood Hydrograph\n\n::widget[hydro-anatomy]');
}
fs.writeFileSync('sessions/S19.md', s19, 'utf8');
console.log('✓ S19 updated with hydro-anatomy');

// 4. S21.md
let s21 = fs.readFileSync('sessions/S21.md', 'utf8');
if (!s21.includes('uh-principles')) {
  if (s21.includes('## 2. Fundamental Assumptions of Sherman')) {
    s21 = s21.replace('## 2. Fundamental Assumptions of Sherman', '## 2. Fundamental Assumptions of Sherman\n\n::widget[uh-principles]');
  } else {
    s21 = s21.replace('## In-Class Activities', '::widget[uh-principles]\n\n## In-Class Activities');
  }
}
fs.writeFileSync('sessions/S21.md', s21, 'utf8');
console.log('✓ S21 updated with uh-principles');

// 5. S23.md
let s23 = fs.readFileSync('sessions/S23.md', 'utf8');
if (!s23.includes('scurve-tool')) {
  if (s23.includes('## 1. The S-Curve Concept')) {
    s23 = s23.replace('## 1. The S-Curve Concept', '## 1. The S-Curve Concept\n\n::widget[scurve-tool]');
  } else {
    s23 = s23.replace('## In-Class Activities', '::widget[scurve-tool]\n\n## In-Class Activities');
  }
}
fs.writeFileSync('sessions/S23.md', s23, 'utf8');
console.log('✓ S23 updated with scurve-tool');

// 6. S25.md
let s25 = fs.readFileSync('sessions/S25.md', 'utf8');
if (!s25.includes('clark-iuh')) {
  if (s25.includes("## 2. Clark's Method for IUH Derivation") || s25.includes("## 2. Clark")) {
    s25 = s25.replace(/## 2\. Clark[^\n]+/, '$&\n\n::widget[clark-iuh]');
  } else {
    s25 = s25.replace('## In-Class Activities', '::widget[clark-iuh]\n\n## In-Class Activities');
  }
}
fs.writeFileSync('sessions/S25.md', s25, 'utf8');
console.log('✓ S25 updated with clark-iuh');

// 7. S26.md
let s26 = fs.readFileSync('sessions/S26.md', 'utf8');
if (!s26.includes('muskingum-route')) {
  if (s26.includes('## 2. The Muskingum Routing Method') || s26.includes('## 2. The Muskingum')) {
    s26 = s26.replace(/## 2\. The Muskingum[^\n]+/, '$&\n\n::widget[muskingum-route]');
  } else {
    s26 = s26.replace('## In-Class Activities', '::widget[muskingum-route]\n\n## In-Class Activities');
  }
}
fs.writeFileSync('sessions/S26.md', s26, 'utf8');
console.log('✓ S26 updated with muskingum-route');

// 8. S27.md
let s27 = fs.readFileSync('sessions/S27.md', 'utf8');
if (!s27.includes('puls-route')) {
  if (s27.includes('## 2. The Modified Puls Method') || s27.includes('## 2. The Modified Puls')) {
    s27 = s27.replace(/## 2\. The Modified Puls[^\n]+/, '$&\n\n::widget[puls-route]');
  } else {
    s27 = s27.replace('## In-Class Activities', '::widget[puls-route]\n\n## In-Class Activities');
  }
}
fs.writeFileSync('sessions/S27.md', s27, 'utf8');
console.log('✓ S27 updated with puls-route');

const fs = require('fs');

// S13.md: Replace ASCII phi-index block
let s13 = fs.readFileSync('sessions/S13.md', 'utf8');
s13 = s13.replace(/```[\s\S]*?Rainfall \(mm\/h\)[\s\S]*?```/, '::widget[phi-concept]');
fs.writeFileSync('sessions/S13.md', s13, 'utf8');
console.log('✓ Replaced ASCII block in S13 with ::widget[phi-concept]');

// S14.md: Replace ASCII AET/PET block
let s14 = fs.readFileSync('sessions/S14.md', 'utf8');
s14 = s14.replace(/```[\s\S]*?ET Rate[\s\S]*?```/, '::widget[aet-pet-curve]');
fs.writeFileSync('sessions/S14.md', s14, 'utf8');
console.log('✓ Replaced ASCII block in S14 with ::widget[aet-pet-curve]');

// S15.md: Replace ASCII Kc stage block
let s15 = fs.readFileSync('sessions/S15.md', 'utf8');
s15 = s15.replace(/```[\s\S]*?Kc Factor[\s\S]*?```/, '::widget[kc-growth-curve]');
fs.writeFileSync('sessions/S15.md', s15, 'utf8');
console.log('✓ Replaced ASCII block in S15 with ::widget[kc-growth-curve]');

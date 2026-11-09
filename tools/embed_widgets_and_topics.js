const fs = require('fs');
const path = require('path');

const sessionsDir = path.join(__dirname, '..', 'sessions');

function updateSession(id, modifier) {
  const filePath = path.join(sessionsDir, `${id}.md`);
  let text = fs.readFileSync(filePath, 'utf8');
  text = modifier(text);
  fs.writeFileSync(filePath, text, 'utf8');
  console.log(`Updated ${id}.md`);
}

// S14: Embed cropet-calc
updateSession('S14', t => {
  if (t.includes('::widget[cropet-calc]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[cropet-calc]\n\n## In-Class Activities & Verification');
});

// S16: Embed fdc-explorer
updateSession('S16', t => {
  if (t.includes('::widget[fdc-explorer]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[fdc-explorer]\n\n## In-Class Activities & Verification');
});

// S20: Embed baseflow-tool
updateSession('S20', t => {
  if (t.includes('::widget[baseflow-tool]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[baseflow-tool]\n\n## In-Class Activities & Verification');
});

// S22: Embed convolution-matrix
updateSession('S22', t => {
  if (t.includes('::widget[convolution-matrix]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[convolution-matrix]\n\n## In-Class Activities & Verification');
});

// S24: Embed snyder-synth
updateSession('S24', t => {
  if (t.includes('::widget[snyder-synth]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[snyder-synth]\n\n## In-Class Activities & Verification');
});

// S31: Embed rating-curve-lab
updateSession('S31', t => {
  if (t.includes('::widget[rating-curve-lab]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[rating-curve-lab]\n\n## In-Class Activities & Verification');
});

// S32: Embed loop-rating
updateSession('S32', t => {
  if (t.includes('::widget[loop-rating]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[loop-rating]\n\n## In-Class Activities & Verification');
});

// S35: Embed gumbel-bench
updateSession('S35', t => {
  if (t.includes('::widget[gumbel-bench]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[gumbel-bench]\n\n## In-Class Activities & Verification');
});

// S38: Embed darcy-tube
updateSession('S38', t => {
  if (t.includes('::widget[darcy-tube]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[darcy-tube]\n\n## In-Class Activities & Verification');
});

// S45: Embed rwh-designer
updateSession('S45', t => {
  if (t.includes('::widget[rwh-designer]')) return t;
  return t.replace('## In-Class Activities & Verification', '::widget[rwh-designer]\n\n## In-Class Activities & Verification');
});

console.log('All 10 widgets embedded into session files.');

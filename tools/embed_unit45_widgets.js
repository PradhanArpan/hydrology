const fs = require('fs');

function embedWidget(file, targetSection, widgetTag) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes(widgetTag)) return;

  // Try regex on targetSection
  const re = new RegExp(targetSection, 'i');
  if (re.test(content)) {
    content = content.replace(re, '$&\n\n' + widgetTag);
  } else if (content.includes('## In-Class Activities')) {
    content = content.replace('## In-Class Activities', widgetTag + '\n\n## In-Class Activities');
  } else {
    content = content.replace('<!--tab:In class-->', widgetTag + '\n\n<!--tab:In class-->');
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log('✓ Embedded ' + widgetTag + ' in ' + file);
}

embedWidget('sessions/S28.md', '## 1. The Rational Formula', '::widget[rational-calc]');
embedWidget('sessions/S29.md', '## 1. Kirpich Formula', '::widget[rational-calc]');
embedWidget('sessions/S30.md', '## 1. Dickens Formula', '::widget[empirical-floods]');
embedWidget('sessions/S33.md', '## 1. Ultrasonic Method', '::widget[adcp-profiler]');
embedWidget('sessions/S34.md', '## 1. Hydrologic Frequency Analysis', '::widget[prob-dist-lab]');
embedWidget('sessions/S36.md', '## 1. Regional Flood Frequency Curves', '::widget[regional-flood-bench]');
embedWidget('sessions/S37.md', '## 1. Risk and Reliability in Design', '::widget[risk-matrix]');
embedWidget('sessions/S39.md', '## 1. Aquifers and Their Types', '::widget[aquifer-types]');
embedWidget('sessions/S40.md', '## 1. Theis Solution', '::widget[theis-well]');
embedWidget('sessions/S41.md', '## 1. Cooper-Jacob Method', '::widget[cooper-jacob]');
embedWidget('sessions/S42.md', '## 1. Steady Flow in Confined Aquifers', '::widget[steady-well]');
embedWidget('sessions/S43.md', '## 1. Principle of Superposition', '::widget[well-interference]');
embedWidget('sessions/S44.md', '## 1. Pumping and Recuperation Tests', '::widget[recup-test]');

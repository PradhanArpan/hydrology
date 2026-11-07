const fs = require('fs');
const path = require('path');

const sessionsFile = path.join(__dirname, '..', 'sessions.json');
const data = JSON.parse(fs.readFileSync(sessionsFile, 'utf8'));

// Enable and set ready all sessions
data.sessions.forEach(s => {
  s.enabled = true;
  s.ready = true;
});

// Enable all labs
data.labs.forEach(l => {
  l.enabled = true;
});

fs.writeFileSync(sessionsFile, JSON.stringify(data, null, 2) + '\n', 'utf8');

console.log(`Updated ${data.sessions.length} sessions (all enabled & ready) and ${data.labs.length} labs (all enabled).`);

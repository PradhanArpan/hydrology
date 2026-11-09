const fs = require('fs');

const files = fs.readdirSync('sessions').filter(f => f.endsWith('.md'));
files.sort();
const asciiFiles = [];

for (const f of files) {
  const content = fs.readFileSync('sessions/' + f, 'utf8');
  const lines = content.split('\n');
  let inCode = false;
  let codeType = '';
  let codeLines = [];
  let startIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeType = line.trim().slice(3);
        codeLines = [];
        startIdx = i;
      } else {
        inCode = false;
        const block = codeLines.join('\n');
        if (!['quiz', 'check', 'json', 'python', 'bash'].includes(codeType)) {
          if (block.includes('|') || block.includes('-->') || block.includes('+--') || block.includes('^')) {
            asciiFiles.push({ file: f, start: startIdx + 1, end: i + 1, snippet: block.slice(0, 100).replace(/\n/g, ' ') });
          }
        }
      }
    } else if (inCode) {
      codeLines.push(line);
    }
  }
}

console.log('Found ' + asciiFiles.length + ' ASCII diagram blocks:');
asciiFiles.forEach(a => console.log(a.file + ' (lines ' + a.start + '-' + a.end + '): ' + a.snippet));

const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const m = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
const t = JSON.parse(m[1]);

// Search for font URLs
const fontLines = t.split('\n').filter(l => l.includes('url('));
console.log('Font URL lines:', fontLines.length);
fontLines.forEach(l => console.log(l.trim().substring(0, 200)));

// Search for \u002F
const idx = t.indexOf('\\u002F');
console.log('\n\\u002F found:', idx !== -1, idx);

// Search for problematic characters
const idx2 = t.indexOf('\u002F');
console.log('Actual / found:', idx2 !== -1);

// Check for unescaped control chars inside string values
let inString = false;
let escape = false;
let issues = [];
for (let i = 0; i < t.length; i++) {
  const ch = t[i];
  const cp = t.codePointAt(i);
  if (escape) { escape = false; continue; }
  if (ch === '\\') { escape = true; continue; }
  if (ch === '"') { inString = !inString; continue; }
  if (inString && cp < 0x20) {
    issues.push({ pos: i, cp, hex: '0x' + cp.toString(16), context: t.slice(Math.max(0,i-10), i+10) });
  }
}
console.log('\nControl chars inside string values:', issues.length);
issues.forEach(is => console.log(JSON.stringify(is)));

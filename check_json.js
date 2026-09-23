const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const match = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (!match) { console.log('No template found'); process.exit(1); }
try {
  JSON.parse(match[1]);
  console.log('JSON is valid');
} catch(e) {
  console.log('JSON error:', e.message);
  const raw = match[1];
  const pos = parseInt((e.message.match(/position (\d+)/) || [])[1] || '0');
  const start = Math.max(0, pos - 50);
  const end = Math.min(raw.length, pos + 50);
  const segment = raw.slice(start, end);
  console.log('Near position', pos, ':');
  for (let i = 0; i < segment.length; i++) {
    const ch = segment[i];
    const cp = segment.codePointAt(i);
    if (cp < 32 || cp > 126) {
      console.log('  BAD CHAR at offset', i, '(abs pos ' + (start+i) + '): code=' + cp + ' hex=0x' + cp.toString(16));
    }
  }
  console.log('Context:', JSON.stringify(segment));
}

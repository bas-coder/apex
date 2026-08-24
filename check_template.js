const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
console.log('File size:', c.length);
const m = c.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (m) {
  console.log('Template raw length:', m[1].length);
  const parsed = JSON.parse(m[1]);
  console.log('Parsed template length:', parsed.length);
  let bad = [];
  for (let i = 0; i < parsed.length; i++) {
    const cp = parsed.codePointAt(i);
    if (cp < 32 || cp > 65535) bad.push({ pos: i, cp: cp, hex: '0x' + cp.toString(16) });
  }
  console.log('Bad chars in template:', bad.length);
  bad.forEach(b => console.log(JSON.stringify(b)));
} else {
  console.log('No template found');
}

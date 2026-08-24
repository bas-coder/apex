const fs = require('fs');
const buf = fs.readFileSync('index.html');

console.log('File size:', buf.length, 'bytes');

// Check the raw bytes around position 9203
const start = Math.max(0, 9203 - 20);
const end = Math.min(buf.length, 9203 + 20);
for (let i = start; i < end; i++) {
  const b = buf[i];
  const marker = i === 9203 ? ' <<<<' : '';
  const ch = (b >= 32 && b < 127) ? String.fromCharCode(b) : '?';
  if (i === 9203 || (i >= 9198 && i <= 9208)) {
    console.log(`  byte[${i}]: 0x${b.toString(16).padStart(2,'0')} (${b}) '${ch}'${marker}`);
  }
}

// Search for actual control chars in the entire file (0x00-0x1F except tab, LF, CR)
let ctrlChars = [];
for (let i = 0; i < buf.length; i++) {
  const b = buf[i];
  if (b < 0x09 || (b > 0x09 && b < 0x0A) || (b > 0x0A && b < 0x0D) || (b > 0x0D && b < 0x20)) {
    ctrlChars.push({ pos: i, byte: b, hex: '0x' + b.toString(16) });
  }
}

console.log('\nControl characters (0x00-0x1F except \\t\\n\\r):', ctrlChars.length);
if (ctrlChars.length > 0) {
  ctrlChars.forEach(c => {
    // Show what's around it
    const s = Math.max(0, c.pos - 30);
    const e = Math.min(buf.length, c.pos + 30);
    const context = buf.slice(s, e).toString('utf8');
    console.log(`  pos=${c.pos} byte=${c.hex} | context: ${JSON.stringify(context)}`);
  });
}

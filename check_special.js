const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const m = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
const rawJson = m[1];

// Check for zero-width chars, BOM, and non-ASCII in the raw JSON
let special = [];
for (let i = 0; i < rawJson.length; i++) {
  const cp = rawJson.codePointAt(i);
  // Flag: non-ASCII, zero-width, BOM, RTL/LTR marks, etc.
  if (cp > 127 || cp === 0xFEFF || cp === 0x200B || cp === 0x200C || cp === 0x200D || cp === 0x2060 || cp === 0x00A0) {
    special.push({ pos: i, cp, hex: '0x' + cp.toString(16) });
  }
}
console.log('Non-ASCII / special chars in raw template JSON:', special.length);
special.forEach(s => console.log(JSON.stringify(s)));

// Check the MANIFEST too - the error position 9203 is more likely in the manifest
const mm = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const rawManifest = mm[1].trim();
let manifestSpecial = [];
for (let i = 0; i < rawManifest.length; i++) {
  const cp = rawManifest.codePointAt(i);
  if (cp > 127 || cp === 0xFEFF || cp === 0x200B || cp === 0x200C || cp === 0x200D || cp === 0x2060 || cp === 0x00A0) {
    manifestSpecial.push({ pos: i, cp, hex: '0x' + cp.toString(16) });
  }
}
console.log('\nNon-ASCII / special chars in raw manifest JSON:', manifestSpecial.length);
manifestSpecial.forEach(s => console.log(JSON.stringify(s)));

// Let's also check if the file has Windows line endings vs Unix
const crlf = (content.match(/\r\n/g) || []).length;
const lf = (content.match(/\n/g) || []).length - crlf;
console.log('\nCRLF count:', crlf, 'LF count:', lf);

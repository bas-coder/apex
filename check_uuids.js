const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Extract template
const templateMatch = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
const templateParsed = JSON.parse(templateMatch[1]);

// Extract manifest
const manifestMatch = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
const manifestParsed = JSON.parse(manifestMatch[1]);

// Extract page_order
const pageOrderMatch = content.match(/<script type="__bundler\/page_order">([\s\S]*?)<\/script>/);
const pageOrder = JSON.parse(pageOrderMatch[1]);

// Check that all UUIDs in the template are in the manifest
const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
const templateUuids = [...new Set(templateParsed.match(uuidRegex) || [])];
const manifestUuids = Object.keys(manifestParsed);

console.log('Template UUIDs:', templateUuids.length);
console.log('Manifest UUIDs:', manifestUuids.length);

const missingInManifest = templateUuids.filter(u => !manifestParsed[u]);
const missingInTemplate = manifestUuids.filter(u => !pageOrder.includes(u) && !templateUuids.includes(u));

console.log('Missing in manifest:', missingInManifest);
console.log('Extra in manifest (not in template, not in page_order):', missingInTemplate);

// Check for any non-ASCII chars in the re-encoded template
const reencoded = JSON.stringify(templateParsed);
let nonAscii = [];
for (let i = 0; i < reencoded.length; i++) {
  const cp = reencoded.codePointAt(i);
  if (cp > 127) nonAscii.push({ pos: i, cp, hex: '0x' + cp.toString(16), ch: String.fromCodePoint(cp) });
}
console.log('\nNon-ASCII chars in re-encoded template:', nonAscii.length);
nonAscii.forEach(n => console.log(JSON.stringify(n)));

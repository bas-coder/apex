const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Check manifest
const manifestMatch = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (manifestMatch) {
  try {
    JSON.parse(manifestMatch[1]);
    console.log('Manifest JSON is valid');
  } catch(e) {
    console.log('MANIFEST JSON error:', e.message);
    const raw = manifestMatch[1];
    const pos = parseInt((e.message.match(/position (\d+)/) || [])[1] || '0');
    const start = Math.max(0, pos - 30);
    const end = Math.min(raw.length, pos + 30);
    console.log('Near position', pos, ':', JSON.stringify(raw.slice(start, end)));
  }
}

// Check template
const templateMatch = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (templateMatch) {
  try {
    JSON.parse(templateMatch[1]);
    console.log('Template JSON is valid');
  } catch(e) {
    console.log('TEMPLATE JSON error:', e.message);
    const raw = templateMatch[1];
    const pos = parseInt((e.message.match(/position (\d+)/) || [])[1] || '0');
    const start = Math.max(0, pos - 30);
    const end = Math.min(raw.length, pos + 30);
    const segment = raw.slice(start, end);
    console.log('Near position', pos, ':');
    for (let i = 0; i < segment.length; i++) {
      const cp = segment.codePointAt(i);
      if (cp < 32 || (cp > 126 && cp < 160) || cp > 65535) {
        console.log('  BAD CHAR at offset', i, '(abs pos ' + (start+i) + '): code=' + cp + ' hex=0x' + cp.toString(16) + ' name=' + JSON.stringify(String.fromCodePoint(cp)));
      }
    }
    console.log('Context:', JSON.stringify(segment));
  }
}

// Check ext_resources
const extMatch = content.match(/<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/);
if (extMatch) {
  try {
    JSON.parse(extMatch[1]);
    console.log('Ext_resources JSON is valid');
  } catch(e) {
    console.log('EXT_RESOURCES JSON error:', e.message);
  }
}

// Check page_order
const pageMatch = content.match(/<script type="__bundler\/page_order">([\s\S]*?)<\/script>/);
if (pageMatch) {
  try {
    JSON.parse(pageMatch[1]);
    console.log('Page_order JSON is valid');
  } catch(e) {
    console.log('PAGE_ORDER JSON error:', e.message);
  }
}

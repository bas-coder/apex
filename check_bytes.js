const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Check the raw file bytes around position 9203 in the template JSON
const templateMatch = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (templateMatch) {
  const raw = templateMatch[1];
  console.log('Raw template string length:', raw.length);
  
  // Check ALL characters that might be control chars
  let issues = [];
  for (let i = 0; i < raw.length; i++) {
    const cp = raw.codePointAt(i);
    // Control chars: 0x00-0x1F except 0x09 (tab), 0x0A (LF), 0x0D (CR)
    // Also flag any chars > 0xFFFF (surrogate pairs)
    if (cp < 0x09 || (cp > 0x09 && cp < 0x0A) || (cp > 0x0A && cp < 0x0D) || (cp > 0x0D && cp < 0x20) || cp > 0xFFFF) {
      issues.push({ pos: i, cp, hex: '0x' + cp.toString(16) });
    }
  }
  
  if (issues.length > 0) {
    console.log('\nProblematic control chars found:', issues.length);
    issues.forEach(is => {
      console.log(`  pos=${is.pos}: cp=${is.cp} hex=${is.hex} char=${JSON.stringify(String.fromCodePoint(is.cp))}`);
      // Show context
      const s = Math.max(0, is.pos - 20);
      const e = Math.min(raw.length, is.pos + 20);
      console.log('    context:', JSON.stringify(raw.slice(s, e)));
    });
  } else {
    console.log('\nNo problematic control chars found in template');
  }
  
  // Also check for \u0000-\u001F unescaped in the raw JSON
  // Valid JSON escapes: \" \\ \/ \b \f \n \r \t \uXXXX
  let rawIssues = [];
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    const cp = raw.codePointAt(i);
    // Inside a JSON string value (after opening quote), control chars must be escaped
    // But we need to track if we're inside a string
  }
}

// Check the manifest raw bytes around position 9203
const manifestMatch = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (manifestMatch) {
  const raw = manifestMatch[1].trim();
  let issues = [];
  for (let i = 0; i < raw.length; i++) {
    const cp = raw.codePointAt(i);
    if (cp < 0x09 || (cp > 0x09 && cp < 0x0A) || (cp > 0x0A && cp < 0x0D) || (cp > 0x0D && cp < 0x20) || cp > 0xFFFF) {
      issues.push({ pos: i, cp, hex: '0x' + cp.toString(16) });
    }
  }
  
  if (issues.length > 0) {
    console.log('\nManifest problematic control chars:', issues.length);
    issues.forEach(is => {
      console.log(`  pos=${is.pos}: cp=${is.cp} hex=${is.hex}`);
      const s = Math.max(0, is.pos - 20);
      const e = Math.min(raw.length, is.pos + 20);
      console.log('    context:', JSON.stringify(raw.slice(s, e)));
    });
  } else {
    console.log('\nNo problematic control chars found in manifest');
  }
}

// Check ext_resources too
const extMatch = content.match(/<script type="__bundler\/ext_resources">([\s\S]*?)<\/script>/);
if (extMatch) {
  let issues = [];
  for (let i = 0; i < extMatch[1].length; i++) {
    const cp = extMatch[1].codePointAt(i);
    if (cp < 0x09 || (cp > 0x09 && cp < 0x0A) || (cp > 0x0A && cp < 0x0D) || (cp > 0x0D && cp < 0x20) || cp > 0xFFFF) {
      issues.push({ pos: i, cp, hex: '0x' + cp.toString(16) });
    }
  }
  console.log('\nExt_resources control chars:', issues.length);
}

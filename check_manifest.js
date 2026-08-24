const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Check manifest around the error position
const manifestMatch = content.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (manifestMatch) {
  const raw = manifestMatch[1].trim();
  console.log('Manifest raw length:', raw.length);
  
  // The error says position 9203 in the JSON
  // Show raw chars around that position
  const pos = 9203;
  const start = Math.max(0, pos - 30);
  const end = Math.min(raw.length, pos + 30);
  
  console.log('\nChars around position', pos, ':');
  for (let i = start; i < end; i++) {
    const ch = raw[i];
    const cp = raw.codePointAt(i);
    const marker = i === pos ? ' <<<< ERROR HERE' : '';
    const isSpecial = cp < 32 || cp > 126;
    if (isSpecial || i === pos || (i >= pos - 5 && i <= pos + 5)) {
      console.log(`  pos=${i}: char=${JSON.stringify(ch)} cp=${cp} hex=0x${cp.toString(16)}${marker}`);
    }
  }
  
  // Also try parsing from different parts to isolate
  // Split at the data boundaries and try parsing
  const manifestObj = JSON.parse(raw);
  const keys = Object.keys(manifestObj);
  console.log('\nManifest keys:', keys.length);
  
  for (const key of keys) {
    const entry = manifestObj[key];
    if (entry.data) {
      // Check if the base64 data is valid
      try {
        atob(entry.data);
      } catch(e) {
        console.log(`\nBad base64 in key ${key}:`, e.message);
        // Find the problematic part
        const dataPos = parseInt((e.message.match(/position (\d+)/) || [])[1] || '0');
        if (dataPos > 0) {
          console.log('  Around data pos:', dataPos, entry.data.slice(Math.max(0,dataPos-10), dataPos+10));
        }
      }
    }
  }
}

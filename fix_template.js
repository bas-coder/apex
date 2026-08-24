const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Extract the raw template string
const match = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (!match) { console.error('No template found'); process.exit(1); }

const rawJson = match[1];
const parsed = JSON.parse(rawJson);

// Re-encode with proper JSON escaping
const reencoded = JSON.stringify(parsed);

const newTag = '<script type="__bundler/template">' + reencoded + '</script>';
const newContent = content.replace(
  /<script type="__bundler\/template">[\s\S]*?<\/script>/,
  newTag
);

fs.writeFileSync('index.html', newContent, 'utf8');
console.log('Fixed template encoding in index.html');
console.log('Old length:', rawJson.length, '-> New length:', reencoded.length);

const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const match = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (match) {
    fs.writeFileSync('template.html', match[1]);
}

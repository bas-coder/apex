const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('<script type="__bundler/template">');
if (idx === -1) {
    console.error("Could not find script tag in index.html");
    process.exit(1);
}

const prefix = content.slice(0, idx);
const templateStr = fs.readFileSync('ApeX Hero.dc.html', 'utf8');

// Escape ALL closing tags in the JSON string to prevent live-server from injecting code inside the JSON string
const escapedJsonStr = JSON.stringify(templateStr).replace(/<\//g, '<\\u002F');

const finalContent = prefix + '<script type="__bundler/template">' + escapedJsonStr + '</script>\n</body>\n</html>';

fs.writeFileSync('index.html', finalContent);
console.log('Successfully repaired with full closing tag escaping!');

const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const idx = content.indexOf('<script type="__bundler/template">');
if (idx === -1) {
    console.error("Could not find script tag in index.html");
    process.exit(1);
}

const prefix = content.slice(0, idx);
const templateStr = fs.readFileSync('ApeX Hero.dc.html', 'utf8');

// Escape every "<" so the HTML parser and live-server cannot see </script> or </body>
// inside the JSON payload. JSON.parse restores them.
const escapedJsonStr = JSON.stringify(templateStr).replace(/</g, "\\u003c");

const finalContent = prefix + '<script type="__bundler/template">' + escapedJsonStr + '</script>\n</body>\n</html>';

fs.writeFileSync('index.html', finalContent);
console.log('Successfully repaired with fix.js');

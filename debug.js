const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const match = content.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (!match) {
    console.log("No match found!");
    process.exit(1);
}

const jsonStr = match[1];
console.log("Extracted substring length:", jsonStr.length);
console.log("First 200 chars:", jsonStr.slice(0, 200));
console.log("Last 200 chars:", jsonStr.slice(-200));

try {
    JSON.parse(jsonStr);
    console.log("Parse SUCCESS");
} catch (e) {
    console.log("Parse ERROR:", e.message);
    
    // Dump around the error position
    const posMatch = e.message.match(/position (\d+)/);
    if (posMatch) {
       const pos = parseInt(posMatch[1], 10);
       console.log("Error context:", jsonStr.slice(pos - 20, pos + 20));
    }
}

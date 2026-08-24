const fs = require('fs');
let indexContent = fs.readFileSync('index.html', 'utf8');

const match = indexContent.match(/<script type="__bundler\/template">([\s\S]*?)<\/script>/);
if (!match) {
    console.error("Template not found in index.html");
    process.exit(1);
}

let templateStr = JSON.parse(match[1]);

// 1. Add video tag
templateStr = templateStr.replace(
    '<div style="position:absolute;inset:0;overflow:hidden">',
    `<div style="position:absolute;inset:0;overflow:hidden">
    <video ref="{{ videoRef }}" src="assets/lion.mp4" muted playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;opacity:0.35;"></video>`
);

// 2. Add videoRef creation
templateStr = templateStr.replace(
    'this.scrollerRef = React.createRef();',
    `this.scrollerRef = React.createRef();
    this.videoRef = React.createRef();`
);

// 3. Add raf loop in componentDidMount
templateStr = templateStr.replace(
    'el.addEventListener(\'touchend\', this._onTouchEnd);\n    apply();',
    `el.addEventListener('touchend', this._onTouchEnd);
    apply();
    
    this._raf = null;
    this._videoCurrentTime = 0;
    const tick = () => {
      if (this.videoRef.current && this.videoRef.current.duration) {
        const vid = this.videoRef.current;
        const target = this.state.progress * vid.duration;
        this._videoCurrentTime += (target - this._videoCurrentTime) * 0.15;
        if (Math.abs(vid.currentTime - this._videoCurrentTime) > 0.01) {
            vid.currentTime = this._videoCurrentTime;
        }
      }
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);`
);

// 4. cleanup raf in componentWillUnmount
templateStr = templateStr.replace(
    'el.removeEventListener(\'touchend\', this._onTouchEnd);',
    `el.removeEventListener('touchend', this._onTouchEnd);
    if (this._raf) cancelAnimationFrame(this._raf);`
);

// 5. return videoRef in renderVals
templateStr = templateStr.replace(
    'return { chars, scrollerRef: this.scrollerRef };',
    'return { chars, scrollerRef: this.scrollerRef, videoRef: this.videoRef };'
);

const newTag = `<script type="__bundler/template">${JSON.stringify(templateStr)}</script>`;

indexContent = indexContent.replace(/<script type="__bundler\/template">([\s\S]*?)<\/script>/, newTag);

fs.writeFileSync('index.html', indexContent);
console.log("Successfully patched index.html");

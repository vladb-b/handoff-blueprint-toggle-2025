const fs = require('fs');
const path = require('path');

const tokensPath = path.resolve(__dirname, '..', 'design', 'tokens.json');
const outPath = path.resolve(__dirname, '..', 'src', 'styles', 'tokens.css');

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

const color = tokens.color || {};
const neutral = color.neutral || {};
const green = color.green || {};

const radius = tokens.radius || {};
const motion = tokens.motion || {};
const shadow = tokens.shadow || {};

const lines = [];

lines.push(':root {');
lines.push('  /* Surface + text */');
lines.push('  --color-surface: ' + (neutral["900"] || "#141414") + ';');
lines.push('  --color-surface-elevated: #1e1e1e;');
lines.push('  --color-text-primary: #f5f5f5;');
lines.push('  --color-text-muted: #a3a3a3;');
lines.push('');
lines.push('  /* Toggle track + thumb (mapped from design/tokens.json) */');
lines.push('  --color-toggle-track-off: ' + (neutral["700"] || "#2A2A2A") + ';');
lines.push('  --color-toggle-track-on: ' + (green["500"] || "#10B981") + ';');
lines.push('  --color-toggle-thumb: ' + (neutral["0"] || "#FFFFFF") + ';');
lines.push('  --color-toggle-focus-outline: ' + (green["300"] || "#6EE7B7") + ';');
lines.push('');
lines.push('  /* Radius + motion */');
lines.push('  --radius-full: ' + (radius["full"] || "9999px") + ';');
lines.push('  --motion-toggle: ' + (motion["fast"] || "120ms") + ';');
lines.push('  --shadow-elevated: ' + (shadow["elevated"] || "0 8px 18px rgba(0, 0, 0, 0.35)") + ';');
lines.push('}');

fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf-8');
console.log('Generated', path.relative(process.cwd(), outPath), 'from design/tokens.json');

const fs = require('fs');
const path = require('path');

const tokensPath = path.resolve(__dirname, '..', 'design', 'tokens.json');
const outPath = path.resolve(__dirname, '..', 'src', 'styles', 'tokens.css');

let tokens;
try {
  const tokensData = fs.readFileSync(tokensPath, 'utf-8');
  tokens = JSON.parse(tokensData);
  
  // Validate tokens structure
  if (!tokens || typeof tokens !== 'object') {
    throw new Error('Invalid tokens.json: must be an object');
  }
} catch (error) {
  console.error('Error reading or parsing tokens.json:', error.message);
  process.exit(1);
}

// Safely access token values with validation
function safeGet(obj, key, defaultVal) {
  if (obj && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, key)) {
    const val = obj[key];
    // Ensure value is safe (string or object for nested access)
    if (typeof val === 'string' || typeof val === 'object') {
      return val;
    }
  }
  return defaultVal;
}

// Sanitize CSS values to prevent injection
function sanitizeCssValue(value) {
  if (typeof value !== 'string') {
    return '';
  }
  // Block script-like patterns and HTML tags while allowing legitimate CSS syntax
  // This allows CSS functions like calc(), var(), rgba(), but blocks <script>, </style>, etc.
  if (/<script|<\/script|<style|<\/style|javascript:|on\w+=/i.test(value)) {
    console.warn('Warning: Potentially unsafe CSS value blocked:', value);
    return '';
  }
  return value;
}

const color = safeGet(tokens, 'color', {});
const neutral = safeGet(color, 'neutral', {});
const green = safeGet(color, 'green', {});

const radius = safeGet(tokens, 'radius', {});
const motion = safeGet(tokens, 'motion', {});
const shadow = safeGet(tokens, 'shadow', {});

const lines = [];

lines.push(':root {');
lines.push('  /* Surface + text */');
lines.push('  --color-surface: ' + sanitizeCssValue(safeGet(neutral, "900", "#141414")) + ';');
lines.push('  --color-surface-elevated: #1e1e1e;');
lines.push('  --color-text-primary: #f5f5f5;');
lines.push('  --color-text-muted: #a3a3a3;');
lines.push('');
lines.push('  /* Toggle track + thumb (mapped from design/tokens.json) */');
lines.push('  --color-toggle-track-off: ' + sanitizeCssValue(safeGet(neutral, "700", "#2A2A2A")) + ';');
lines.push('  --color-toggle-track-on: ' + sanitizeCssValue(safeGet(green, "500", "#10B981")) + ';');
lines.push('  --color-toggle-thumb: ' + sanitizeCssValue(safeGet(neutral, "0", "#FFFFFF")) + ';');
lines.push('  --color-toggle-focus-outline: ' + sanitizeCssValue(safeGet(green, "300", "#6EE7B7")) + ';');
lines.push('');
lines.push('  /* Radius + motion */');
lines.push('  --radius-full: ' + sanitizeCssValue(safeGet(radius, "full", "9999px")) + ';');
lines.push('  --motion-toggle: ' + sanitizeCssValue(safeGet(motion, "fast", "120ms")) + ';');
lines.push('  --shadow-elevated: ' + sanitizeCssValue(safeGet(shadow, "elevated", "0 8px 18px rgba(0, 0, 0, 0.35)")) + ';');
lines.push('}');

fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf-8');
console.log('Generated', path.relative(process.cwd(), outPath), 'from design/tokens.json');

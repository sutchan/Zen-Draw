const fs = require('fs');
const t = fs.readFileSync('app/locales/types.ts', 'utf8');
const m = t.match(/"[a-zA-Z_]+"/g);
const keys = [...new Set(m.map(s => s.slice(1, -1)))];
console.log('count', keys.length);

const fs = require('fs');
const path = require('path');

const assetUsage = new Map();

function scanDir(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(file)) {
        scanDir(full);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.html', '.css', '.cjs', '.json'].includes(ext)) {
        const content = fs.readFileSync(full, 'utf8');
        const regex = /\/assets\/[a-zA-Z0-9_\-\.\/]+/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          let clean = match[0].replace(/['",;\)]+$/, '');
          if (!assetUsage.has(clean)) {
            assetUsage.set(clean, new Set());
          }
          assetUsage.get(clean).add(path.relative('.', full).replace(/\\/g, '/'));
        }
      }
    }
  });
}

scanDir('.');

console.log('--- ALL ASSETS REFERENCED IN PROJECT ---');
const sorted = Array.from(assetUsage.entries()).sort((a,b) => a[0].localeCompare(b[0]));
sorted.forEach(([asset, files]) => {
  const exists = fs.existsSync(path.join('public', asset.replace(/^\//, '')));
  console.log(`${asset} [Exists on disk: ${exists}]`);
  files.forEach(f => console.log('    <-', f));
});

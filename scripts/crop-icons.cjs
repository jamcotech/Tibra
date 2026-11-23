const Jimp = require('jimp').Jimp;
const path = require('path');

async function run() {
  const src = 'public/assets/benefits-icons/icon-grid.png';
  const outDir = 'public/assets/benefits-icons';

  const img = await Jimp.read(src);
  const W = img.bitmap.width;
  const H = img.bitmap.height;
  console.log(`Grid size: ${W}x${H}`);

  const cols = 4;
  const rows = 2;
  const cellW = Math.floor(W / cols);
  const cellH = Math.floor(H / rows);
  const pad = 20;

  const icons = [
    { name: 'b1_joint_discomfort.png', col: 0, row: 0 },
    { name: 'b2_muscle_ease.png',      col: 1, row: 0 },
    { name: 'b3_daily_mobility.png',   col: 2, row: 0 },
    { name: 'b4_joint_support.png',    col: 3, row: 0 },
    { name: 'b5_inflammation.png',     col: 0, row: 1 },
    { name: 'b6_flexibility.png',      col: 1, row: 1 },
  ];

  for (const icon of icons) {
    const x = icon.col * cellW + pad;
    const y = icon.row * cellH + pad;
    const w = cellW - pad * 2;
    const h = cellH - pad * 2;

    const cropped = img.clone().crop({ x, y, w, h });
    const outPath = path.join(outDir, icon.name);
    await cropped.write(outPath);
    console.log(`✓ ${icon.name} (${w}x${h}) -> ${outPath}`);
  }
  console.log('Done!');
}

run().catch(console.error);

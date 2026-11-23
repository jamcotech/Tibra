import Jimp from 'jimp';
import path from 'path';

const src = 'public/assets/benefits-icons/icon-grid.png';
const outDir = 'public/assets/benefits-icons';

// The grid image is 1323×886 with 4 cols × 2 rows
// Each cell is approx 330×443 with small gaps (~15px)
const img = await Jimp.read(src);
const W = img.bitmap.width;
const H = img.bitmap.height;

const cols = 4;
const rows = 2;
const cellW = Math.floor(W / cols);
const cellH = Math.floor(H / rows);
const pad = 18; // inner padding to trim border

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
  await cropped.write(path.join(outDir, icon.name));
  console.log(`✓ ${icon.name} (${w}x${h})`);
}

console.log('All icons cropped!');

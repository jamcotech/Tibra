const { Jimp } = require('jimp');
const path = require('path');

async function run() {
  const src = 'public/assets/ritual/3 step.png';
  const outDir = 'public/assets/ritual';

  // Ensure file exists in assets
  const fs = require('fs');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const sourceFile = 'Video/3 step.png';
  fs.copyFileSync(sourceFile, src);
  console.log('Copied 3 step.png to assets');

  const img = await Jimp.read(src);
  const W = img.bitmap.width;
  const H = img.bitmap.height;
  console.log(`Dimensions: ${W}x${H}`);

  // It contains 3 icons horizontally:
  // 1: Dropper dispensing golden oil
  // 2: Warm hands rubbing oil
  // 3: Knee joint circular massage
  const colW = Math.floor(W / 3);

  const steps = [
    { name: 'step1-dispense-3d.png', col: 0 },
    { name: 'step2-warm-3d.png', col: 1 },
    { name: 'step3-massage-3d.png', col: 2 }
  ];

  for (const s of steps) {
    const x = s.col * colW;
    const y = 0;
    const w = colW;
    const h = H;

    const cropped = img.clone().crop({ x, y, w, h });
    const outPath = path.join(outDir, s.name);
    await cropped.write(outPath);
    console.log(`Saved ${s.name} (${w}x${h})`);
  }
}

run().catch(console.error);

const { Jimp } = require('jimp');
const path = require('path');

async function run() {
  const src = 'public/assets/benefits-icons/icon-grid-v2.png';
  const outDir = 'public/assets/benefits-icons';

  const img = await Jimp.read(src);
  const W = img.bitmap.width; // 1774
  const H = img.bitmap.height; // 887

  // Total grid has 4 columns and 2 rows.
  // Let's measure exact bounds for each icon by providing accurate coordinates with safe margins:
  // Row 0: y: 10, h: 430
  // Row 1: y: 445, h: 435

  // Col 0 (Knee joint): x: 20 to 450 (w: 430)
  // Col 1 (Muscle ease): in previous crop, elbow on left was x: 443 + 10 = 453, but leaf is around 890!
  // So muscle ease should span from x: 450 to 910! (w: 460)
  // Col 2 (Running person): x: 915 to 1360! (w: 445)
  // Col 3 (Shield leaf): x: 1360 to 1750 (w: 390)

  // Row 1:
  // Col 0 (Flame): x: 20 to 450
  // Col 1 (Stretching person): x: 450 to 890

  const definitions = [
    { name: 'c1_joint_discomfort.png', x: 25, y: 15, w: 425, h: 420 },
    { name: 'c2_muscle_ease.png',      x: 460, y: 15, w: 455, h: 420 }, // wide enough to cover full arm & elbow!
    { name: 'c3_daily_mobility.png',   x: 920, y: 15, w: 445, h: 420 }, // wide enough to cover running person hands & motion lines!
    { name: 'c4_joint_support.png',    x: 1370, y: 15, w: 380, h: 420 },
    { name: 'c5_inflammation.png',     x: 25, y: 455, w: 435, h: 425 },
    { name: 'c6_flexibility.png',      x: 460, y: 455, w: 430, h: 425 }
  ];

  for (const def of definitions) {
    const cropped = img.clone().crop({ x: def.x, y: def.y, w: def.w, h: def.h });
    
    // Now make the background transparent smoothly as well!
    const cw = cropped.bitmap.width;
    const ch = cropped.bitmap.height;

    cropped.scan(0, 0, cw, ch, (x, y, idx) => {
      const r = cropped.bitmap.data[idx];
      const g = cropped.bitmap.data[idx + 1];
      const b = cropped.bitmap.data[idx + 2];
      const currentAlpha = cropped.bitmap.data[idx + 3];

      const minVal = Math.min(r, g, b);

      if (minVal >= 250) {
        cropped.bitmap.data[idx + 3] = 0;
      } else if (minVal >= 235) {
        const factor = (250 - minVal) / (250 - 235);
        cropped.bitmap.data[idx + 3] = Math.round(currentAlpha * factor);
      }
    });

    // Auto crop transparent border but leave 15px clean padding so nothing touches edges
    await cropped.autocrop({ tolerance: 0.05 });
    
    // Create a square centered canvas with nice padding
    const maxDim = Math.max(cropped.bitmap.width, cropped.bitmap.height) + 30;
    const squareCanvas = new Jimp({ width: maxDim, height: maxDim, color: 0x00000000 });
    
    const posX = Math.floor((maxDim - cropped.bitmap.width) / 2);
    const posY = Math.floor((maxDim - cropped.bitmap.height) / 2);
    
    squareCanvas.composite(cropped, posX, posY);

    const outPath = path.join(outDir, def.name);
    await squareCanvas.write(outPath);
    console.log(`✓ Perfectly centered & padded: ${def.name} (${maxDim}x${maxDim})`);
  }
}

run().catch(console.error);

const { Jimp } = require('jimp');
const path = require('path');

async function fixSlices() {
  const src = 'public/assets/ritual/3 step.png';
  const dir = 'public/assets/ritual';
  const img = await Jimp.read(src);
  const W = img.bitmap.width; // 2172
  const H = img.bitmap.height; // 724

  // Let's refine coordinates so there's zero bleed between panels:
  // Panel 1: x: 0 to 710
  // Panel 2: x: 710 to 1430
  // Panel 3: x: 1450 to 2172 (clears the right edge of panel 2)
  const cuts = [
    { name: 'step1-dispense-3d-transparent.png', x: 20, y: 10, w: 685, h: 704 },
    { name: 'step2-warm-3d-transparent.png', x: 720, y: 15, w: 710, h: 695 },
    { name: 'step3-massage-3d-transparent.png', x: 1465, y: 10, w: 690, h: 704 }
  ];

  for (const c of cuts) {
    const cropped = img.clone().crop({ x: c.x, y: c.y, w: c.w, h: c.h });
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

    await cropped.autocrop({ tolerance: 0.05 });
    const outPath = path.join(dir, c.name);
    await cropped.write(outPath);
    console.log(`Cleaned & saved: ${c.name} (${cropped.bitmap.width}x${cropped.bitmap.height})`);
  }
}

fixSlices().catch(console.error);

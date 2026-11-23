const { Jimp } = require('jimp');
const path = require('path');

async function fineTuneCrops() {
  const src = 'Video/002.png';
  const outDir = 'public/assets/ingredients';
  const img = await Jimp.read(src);
  const W = img.bitmap.width;  // 1536
  const H = img.bitmap.height; // 1024

  // The 16 cards coordinates inside 002.png:
  // Card dimensions:
  // Row 1 & 2: 5 cards across (card width approx 280, gap approx 20)
  // Row 3: 6 cards across (card width approx 233, gap approx 17)

  // Top visual crop (just the plant/ingredient artwork without text):
  // Row 1: Y: 158, H: 175
  // Row 2: Y: 456, H: 172
  // Row 3: Y: 728, H: 165

  const items = [
    // Row 1 (5 items)
    { id: 'turmeric',    x: 24,   y: 158, w: 285, h: 175 },
    { id: 'ginger',      x: 324,  y: 158, w: 285, h: 175 },
    { id: 'eucalyptus',  x: 624,  y: 158, w: 285, h: 175 },
    { id: 'peppermint',  x: 924,  y: 158, w: 285, h: 175 },
    { id: 'wintergreen', x: 1224, y: 158, w: 285, h: 175 },

    // Row 2 (5 items)
    { id: 'boswellia',   x: 24,   y: 456, w: 285, h: 172 },
    { id: 'methi',       x: 324,  y: 456, w: 285, h: 172 },
    { id: 'garlic',      x: 624,  y: 456, w: 285, h: 172 },
    { id: 'cinnamon',    x: 924,  y: 456, w: 285, h: 172 },
    { id: 'clove',       x: 1224, y: 456, w: 285, h: 172 },

    // Row 3 (6 items)
    { id: 'blackseed',   x: 24,   y: 728, w: 236, h: 165 },
    { id: 'rosemary',    x: 275,  y: 728, w: 236, h: 165 },
    { id: 'camphor',     x: 526,  y: 728, w: 236, h: 165 },
    { id: 'menthol',     x: 777,  y: 728, w: 236, h: 165 },
    { id: 'sesame',      x: 1028, y: 728, w: 236, h: 165 },
    { id: 'olive',       x: 1279, y: 728, w: 236, h: 165 },
  ];

  for (const item of items) {
    const cropped = img.clone().crop({ x: item.x, y: item.y, w: item.w, h: item.h });
    const outPath = path.join(outDir, `${item.id}.jpg`);
    await cropped.write(outPath);
    console.log(`✓ Clean visual: ${item.id}.jpg`);
  }
}

fineTuneCrops().catch(console.error);

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Transparent cutout processor
async function makeTransparentCutout(inputPath, extractRegion, outputPath, options = {}) {
  // Extract region
  const { data, info } = await sharp(inputPath)
    .extract(extractRegion)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const outIdx = i * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    // Check if pixel is white background
    const isPureWhite = r >= 246 && g >= 246 && b >= 246;
    const isOffWhite = (r + g + b) / 3 > 240 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8;

    // Check if pixel is red pain ring/glow
    const isRedPain = r > 180 && (r - g > 30 || r - b > 30);

    if (isPureWhite || (isOffWhite && !isRedPain)) {
      // Background: transparent
      out[outIdx] = r;
      out[outIdx + 1] = g;
      out[outIdx + 2] = b;
      out[outIdx + 3] = 0;
    } else {
      // Drawing content (line art or red glow)
      out[outIdx] = r;
      out[outIdx + 1] = g;
      out[outIdx + 2] = b;
      
      // Calculate smooth antialiased alpha for light gray border pixels
      const brightness = (r + g + b) / 3;
      if (brightness > 230 && !isRedPain) {
        // Smooth feather edge
        const alpha = Math.round(255 * (1 - (brightness - 230) / 25));
        out[outIdx + 3] = Math.max(0, Math.min(255, alpha));
      } else {
        out[outIdx + 3] = 255;
      }
    }
  }

  // Trim transparent borders and add gentle padding
  await sharp(out, { raw: { width, height, channels: 4 } })
    .trim()
    .extend({
      top: 16,
      bottom: 16,
      left: 16,
      right: 16,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .resize(280, 280, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Created cutout: ${path.basename(outputPath)}`);
}

async function run() {
  const dir = 'public/assets/pain-cutouts';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const ref1 = 'public/assets/pain-reference-1.png';
  const ref2 = 'public/assets/pain-reference-2.png';

  console.log('Generating accurate cutouts for all target pain zones...');

  // 1. KNEE: Image 2 (Row 1 Col 2) - Both hands holding knee joint with red glow
  await makeTransparentCutout(
    ref2,
    { left: 220, top: 60, width: 155, height: 210 },
    `${dir}/knee-cutout.png`
  );

  // 2. SHOULDER: Image 1 (Row 3 Col 2) - Front view, hand touching shoulder with red concentric rings
  await makeTransparentCutout(
    ref1,
    { left: 270, top: 535, width: 235, height: 265 },
    `${dir}/shoulder-cutout.png`
  );

  // 3. BACK (LOWER BACK / LUMBAR): Image 1 (Row 2 Col 3) - Back view, two hands on lumbar with red rings
  await makeTransparentCutout(
    ref1,
    { left: 520, top: 290, width: 260, height: 245 },
    `${dir}/back-cutout.png`
  );

  // 4. NECK: Image 1 (Row 1 Col 2) - Back of neck, hand holding neck with red concentric rings
  await makeTransparentCutout(
    ref1,
    { left: 255, top: 5, width: 245, height: 265 },
    `${dir}/neck-cutout.png`
  );

  // 5. ELBOW: Image 2 (Row 1 Col 3) - Arm across chest, hand holding elbow joint with red glow
  await makeTransparentCutout(
    ref2,
    { left: 360, top: 75, width: 195, height: 185 },
    `${dir}/elbow-cutout.png`
  );

  // 6. ANKLE & FOOT: Image 1 (Row 3 Col 4) - Lower leg & foot, hands holding ankle joint with red concentric rings
  await makeTransparentCutout(
    ref1,
    { left: 785, top: 535, width: 235, height: 265 },
    `${dir}/ankle-cutout.png`
  );

  // 7. HIP: Image 1 (Row 1 Col 3) - Hands on hip / lower abdominal / pelvis with red rings
  await makeTransparentCutout(
    ref1,
    { left: 515, top: 15, width: 255, height: 255 },
    `${dir}/hip-cutout.png`
  );

  // 8. WRIST & HAND: Image 2 (Row 3 Col 4 / Image 1 hand holding)
  // Let's also create wrist cutout from the arm/hand in Image 2 or Image 1
  await makeTransparentCutout(
    ref2,
    { left: 605, top: 650, width: 160, height: 180 },
    `${dir}/wrist-cutout.png`
  ).catch(async () => {
    // Alternate crop from ref1 jaw/wrist or hand
    await makeTransparentCutout(
      ref1,
      { left: 780, top: 535, width: 235, height: 265 },
      `${dir}/wrist-cutout.png`
    );
  });

  console.log('All pain cutouts generated successfully!');
}

run().catch(console.error);

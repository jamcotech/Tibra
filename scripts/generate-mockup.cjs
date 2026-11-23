const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createBottleMockup() {
  const labelWidth = 260;
  const labelHeight = 340;
  
  // Resize label front crop with slight cylindrical shading/vignette
  const labelFront = await sharp('public/assets/label/label_mockup_front_crop.png')
    .resize(labelWidth, labelHeight, { fit: 'fill' })
    .toBuffer();

  const cylinderShadeSvg = Buffer.from(`
    <svg width="${labelWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cylGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.65" />
          <stop offset="12%" stop-color="#000000" stop-opacity="0.2" />
          <stop offset="35%" stop-color="#ffffff" stop-opacity="0.15" />
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.25" />
          <stop offset="65%" stop-color="#ffffff" stop-opacity="0.1" />
          <stop offset="88%" stop-color="#000000" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.65" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#cylGrad)" />
    </svg>
  `);

  const curvedLabel = await sharp(labelFront)
    .composite([{ input: cylinderShadeSvg, blend: 'overlay' }])
    .png()
    .toBuffer();

  // Composite onto the bottle
  const bottleMockup = await sharp('public/assets/purefix-bottle-transparent.png')
    .composite([{ input: curvedLabel, top: 480, left: 252 }])
    .png()
    .toBuffer();

  const brainDir = 'C:/Users/Jamco/.gemini/antigravity/brain/92a0e1bf-536e-48bd-bc9b-1e0a8719c82e';
  await sharp(bottleMockup).toFile('public/assets/label/purefix-bottle-3d-mockup.png');
  await sharp(bottleMockup).toFile(path.join(brainDir, 'purefix-bottle-3d-mockup.png'));

  // Also create a presentation composite: Box + Bottle Side-by-Side!
  // In purefix-bottle-box-showcase.jpg or with the uploaded box image!
  console.log('Bottle 3D mockup created successfully!');
}

createBottleMockup().catch(console.error);

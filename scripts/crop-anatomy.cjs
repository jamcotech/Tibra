const sharp = require('sharp');

async function cropAnatomy() {
  const src = 'public/assets/purefix-joint-oil-bottle.png';

  // 1. Dropper cap
  await sharp(src)
    .extract({ left: 260, top: 70, width: 240, height: 260 })
    .toFile('public/assets/anatomy/dropper-cap.jpg');

  // 2. Amber glass
  await sharp(src)
    .extract({ left: 240, top: 350, width: 280, height: 160 })
    .toFile('public/assets/anatomy/amber-glass.jpg');

  // 3. Herbal illustration
  await sharp(src)
    .extract({ left: 340, top: 680, width: 230, height: 160 })
    .toFile('public/assets/anatomy/herbal-blend.jpg');

  // 4. Volume 30 ML & Motto
  await sharp(src)
    .extract({ left: 250, top: 780, width: 270, height: 100 })
    .toFile('public/assets/anatomy/volume-mark.jpg');

  console.log('Anatomy crops generated successfully!');
}

cropAnatomy().catch(console.error);

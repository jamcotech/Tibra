const sharp = require('sharp');
const fs = require('fs');

async function extractAssets() {
  if (!fs.existsSync('public/assets/ingredients')) {
    fs.mkdirSync('public/assets/ingredients', { recursive: true });
  }

  const src = 'public/assets/purefix-ingredients-benefits.jpg';

  // Crop ingredients from bottom row (y: 500 to 682)
  await sharp(src)
    .extract({ left: 0, top: 500, width: 190, height: 182 })
    .toFile('public/assets/ingredients/oil-drop.jpg');

  await sharp(src)
    .extract({ left: 170, top: 500, width: 190, height: 182 })
    .toFile('public/assets/ingredients/ginger-root.jpg');

  await sharp(src)
    .extract({ left: 350, top: 500, width: 220, height: 182 })
    .toFile('public/assets/ingredients/turmeric-root.jpg');

  await sharp(src)
    .extract({ left: 560, top: 500, width: 230, height: 182 })
    .toFile('public/assets/ingredients/herbal-leaves.jpg');

  await sharp(src)
    .extract({ left: 780, top: 500, width: 240, height: 182 })
    .toFile('public/assets/ingredients/herbal-oil-bowl.jpg');

  console.log('Ingredient assets extracted successfully!');
}

extractAssets().catch(console.error);

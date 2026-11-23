const sharp = require('sharp');
const fs = require('fs');

async function createInitialRitualImages() {
  const dir = 'public/assets/ritual';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // 1. Step 1: Dispense - crop the precision dropper from purefix-joint-oil-bottle.png with golden droplet
  await sharp('public/assets/purefix-joint-oil-bottle.png')
    .extract({ left: 240, top: 70, width: 285, height: 320 })
    .resize(400, 300, { fit: 'contain', background: '#F5F0E6' })
    .toFile('public/assets/ritual/step1-dispense.jpg');

  // 2. Step 2: Warm & spread - crop the golden herbal oil bowl with leaves
  await sharp('public/assets/ingredients/herbal-oil-bowl.jpg')
    .resize(400, 300, { fit: 'cover' })
    .toFile('public/assets/ritual/step2-warm.jpg');

  // 3. Step 3: Massage - crop the knee joint soothing visualization
  await sharp('public/assets/targets/supports-joints.jpg')
    .resize(400, 300, { fit: 'contain', background: '#0F2213' })
    .toFile('public/assets/ritual/step3-massage.jpg');

  console.log('Initial ritual step images created!');
}

createInitialRitualImages().catch(console.error);

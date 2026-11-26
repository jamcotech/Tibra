const sharp = require('sharp');
const fs = require('fs');

const testImages = [
  'public/assets/tibra-bottle-box-showcase.webp',
  'public/assets/tibra-bottle-transparent.webp',
  'public/assets/packaging-showcase-003.webp',
  'public/assets/hero-video-poster.webp',
  'public/assets/tibra-logo.png',
  'public/assets/tibra-logo-white.webp',
  'public/assets/purefix-bottle-box-showcase.jpg',
  'public/assets/purefix-bottle-box-showcase.webp',
  'public/assets/purefix-bottle-transparent.webp',
  'public/assets/purefix-bottle-004-transparent.webp',
  'public/assets/purefix-bottle-004-transparent.png',
  'public/assets/ritual/step1-dispense-3d-transparent.webp',
  'public/assets/ritual/step2-warm-3d-transparent.webp',
  'public/assets/ritual/step3-massage-3d-transparent.webp',
  'public/assets/ingredients/turmeric.webp',
  'public/assets/ingredients/ginger.webp',
  'public/assets/ingredients/boswellia.webp',
  'public/assets/ingredients/eucalyptus.webp',
  'public/assets/ingredients/wintergreen.webp',
  'public/assets/ingredients/clove.webp',
  'public/assets/benefits-icons/c1_joint_discomfort.webp',
  'public/assets/pain-cutouts/knee-cutout.webp'
];

async function run() {
  console.log('File'.padEnd(58), 'Dim'.padEnd(12), 'Format'.padEnd(8), 'Size');
  console.log('='.repeat(85));
  for (const img of testImages) {
    if (fs.existsSync(img)) {
      const meta = await sharp(img).metadata();
      const stat = fs.statSync(img);
      const dim = `${meta.width}x${meta.height}`;
      const size = `${Math.round(stat.size / 1024)} KB`;
      console.log(img.padEnd(58), dim.padEnd(12), meta.format.padEnd(8), size);
    } else {
      console.log(img.padEnd(58), 'MISSING');
    }
  }
}
run();

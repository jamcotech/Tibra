const sharp = require('sharp');

async function cropTargets() {
  const src = 'public/assets/purefix-ingredients-benefits.jpg';

  // Row 1
  const row1 = [
    { name: 'knee-pain', left: 15 },
    { name: 'shoulder-pain', left: 180 },
    { name: 'back-pain', left: 350 },
    { name: 'elbow-pain', left: 520 },
    { name: 'ankle-pain', left: 690 },
    { name: 'wrist-pain', left: 860 },
  ];

  for (const item of row1) {
    await sharp(src)
      .extract({ left: item.left, top: 15, width: 150, height: 160 })
      .toFile(`public/assets/targets/${item.name}.jpg`);
  }

  // Row 2
  const row2 = [
    { name: 'hand-pain', left: 15 },
    { name: 'neck-pain', left: 180 },
    { name: 'hip-pain', left: 350 },
    { name: 'improves-mobility', left: 520 },
    { name: 'supports-joints', left: 690 },
    { name: 'active-lifestyle', left: 860 },
  ];

  for (const item of row2) {
    await sharp(src)
      .extract({ left: item.left, top: 180, width: 150, height: 160 })
      .toFile(`public/assets/targets/${item.name}.jpg`);
  }

  // Row 3 Green benefit badges
  // 7 badges across 1024 width: 1024 / 7 ≈ 146px
  const row3 = [
    { name: 'reduce-joint-pain', left: 10 },
    { name: 'relaxes-stiff-muscles', left: 155 },
    { name: 'mobility-badge', left: 300 },
    { name: 'bone-health', left: 450 },
    { name: 'soothes-inflammation', left: 600 },
    { name: 'supports-joint-function', left: 745 },
    { name: 'promotes-flexibility', left: 885 },
  ];

  for (const item of row3) {
    await sharp(src)
      .extract({ left: item.left, top: 355, width: 135, height: 135 })
      .toFile(`public/assets/targets/${item.name}.jpg`);
  }

  console.log('Target icons and benefit badges cropped successfully!');
}

cropTargets().catch(console.error);

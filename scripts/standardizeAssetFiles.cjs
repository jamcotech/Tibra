const fs = require('fs');
const path = require('path');

const copies = [
  // Product Bottle & Box
  {
    src: 'public/assets/tibra-bottle-transparent.webp',
    dest: 'public/assets/tibra-naturals-pain-relief-oil-bottle-30ml.webp'
  },
  {
    src: 'public/assets/tibra-bottle-box-showcase.webp',
    dest: 'public/assets/tibra-naturals-pain-relief-oil-box-packaging.webp'
  },
  {
    src: 'public/assets/tibra-bottle-box-showcase.webp',
    dest: 'public/assets/tibra-naturals-pain-relief-oil-duo-pack.webp'
  },
  {
    src: 'public/assets/packaging-showcase-003.webp',
    dest: 'public/assets/tibra-naturals-pain-relief-oil-packaging-showcase.webp'
  },
  {
    src: 'public/assets/tibra-bottle-transparent.webp',
    dest: 'public/assets/tibra-naturals-pain-relief-oil-product-gallery.webp'
  },

  // Videos & Poster
  {
    src: 'public/assets/hero-video-002.mp4',
    dest: 'public/assets/tibra-naturals-herbal-wellness-brand-hero-video.mp4'
  },
  {
    src: 'public/assets/hero-video-poster.webp',
    dest: 'public/assets/tibra-naturals-herbal-wellness-hero-poster.webp'
  },
  {
    src: 'public/assets/video-for-knee.mp4',
    dest: 'public/assets/tibra-naturals-pain-relief-oil-application-guide.mp4'
  },

  // Brand Logo
  {
    src: 'public/assets/tibra-logo.png',
    dest: 'public/assets/tibra-naturals-brand-logo.png'
  },
  {
    src: 'public/assets/tibra-logo-white.webp',
    dest: 'public/assets/tibra-naturals-brand-logo-white.webp'
  },
  {
    src: 'public/assets/brand-logo-white.png',
    dest: 'public/assets/tibra-naturals-brand-logo-white.png'
  },

  // Ritual 3-Step Images
  {
    src: 'public/assets/ritual/step1-dispense-3d-transparent.webp',
    dest: 'public/assets/ritual/tibra-naturals-ritual-step1-dispense.webp'
  },
  {
    src: 'public/assets/ritual/step2-warm-3d-transparent.webp',
    dest: 'public/assets/ritual/tibra-naturals-ritual-step2-warm.webp'
  },
  {
    src: 'public/assets/ritual/step3-massage-3d-transparent.webp',
    dest: 'public/assets/ritual/tibra-naturals-ritual-step3-massage.webp'
  },

  // Botanical Ingredients
  {
    src: 'public/assets/ingredients/turmeric.webp',
    dest: 'public/assets/ingredients/tibra-naturals-turmeric-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/ginger.webp',
    dest: 'public/assets/ingredients/tibra-naturals-ginger-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/boswellia.webp',
    dest: 'public/assets/ingredients/tibra-naturals-boswellia-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/eucalyptus.webp',
    dest: 'public/assets/ingredients/tibra-naturals-eucalyptus-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/wintergreen.webp',
    dest: 'public/assets/ingredients/tibra-naturals-wintergreen-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/clove.webp',
    dest: 'public/assets/ingredients/tibra-naturals-clove-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/cinnamon.webp',
    dest: 'public/assets/ingredients/tibra-naturals-cinnamon-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/menthol.webp',
    dest: 'public/assets/ingredients/tibra-naturals-menthol-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/camphor.webp',
    dest: 'public/assets/ingredients/tibra-naturals-camphor-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/blackseed.webp',
    dest: 'public/assets/ingredients/tibra-naturals-blackseed-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/methi.webp',
    dest: 'public/assets/ingredients/tibra-naturals-methi-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/garlic.webp',
    dest: 'public/assets/ingredients/tibra-naturals-garlic-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/olive.webp',
    dest: 'public/assets/ingredients/tibra-naturals-olive-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/sesame.webp',
    dest: 'public/assets/ingredients/tibra-naturals-sesame-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/peppermint.webp',
    dest: 'public/assets/ingredients/tibra-naturals-peppermint-ingredient.webp'
  },
  {
    src: 'public/assets/ingredients/rosemary.webp',
    dest: 'public/assets/ingredients/tibra-naturals-rosemary-ingredient.webp'
  },

  // Pain Relief Target Cutouts
  {
    src: 'public/assets/pain-cutouts/knee-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-knee-relief.webp'
  },
  {
    src: 'public/assets/pain-cutouts/back-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-back-relief.webp'
  },
  {
    src: 'public/assets/pain-cutouts/neck-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-neck-relief.webp'
  },
  {
    src: 'public/assets/pain-cutouts/shoulder-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-shoulder-relief.webp'
  },
  {
    src: 'public/assets/pain-cutouts/ankle-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-ankle-relief.webp'
  },
  {
    src: 'public/assets/pain-cutouts/elbow-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-elbow-relief.webp'
  },
  {
    src: 'public/assets/pain-cutouts/hip-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-hip-relief.webp'
  },
  {
    src: 'public/assets/pain-cutouts/upper-back-cutout.webp',
    dest: 'public/assets/pain-cutouts/tibra-naturals-upper-back-relief.webp'
  },

  // Benefit Icons
  {
    src: 'public/assets/benefits-icons/c1_joint_discomfort.webp',
    dest: 'public/assets/benefits-icons/tibra-naturals-benefit-joint-discomfort.webp'
  },
  {
    src: 'public/assets/benefits-icons/c2_muscle_ease.webp',
    dest: 'public/assets/benefits-icons/tibra-naturals-benefit-muscle-ease.webp'
  },
  {
    src: 'public/assets/benefits-icons/c3_daily_mobility.webp',
    dest: 'public/assets/benefits-icons/tibra-naturals-benefit-daily-mobility.webp'
  },
  {
    src: 'public/assets/benefits-icons/c4_joint_support.webp',
    dest: 'public/assets/benefits-icons/tibra-naturals-benefit-joint-support.webp'
  },
  {
    src: 'public/assets/benefits-icons/c5_inflammation.webp',
    dest: 'public/assets/benefits-icons/tibra-naturals-benefit-soothe-inflammation.webp'
  },
  {
    src: 'public/assets/benefits-icons/c6_flexibility.webp',
    dest: 'public/assets/benefits-icons/tibra-naturals-benefit-flexibility.webp'
  }
];

let created = 0;
copies.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    created++;
    console.log(`✓ Created: ${dest} (from ${src})`);
  } else {
    console.error(`✗ Source missing: ${src}`);
  }
});

console.log(`\nSuccessfully created ${created}/${copies.length} standardized TIBRA NATURALS media assets!`);

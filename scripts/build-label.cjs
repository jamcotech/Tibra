const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Exact colors sampled from the front panel of the box:
// Base Green: #5d7b35 / #607e37
// Dark Border Green: #3b5020 / #2f4019
// Highlight Soft Olive: #6f8d42 / #7d9c4c
// Gold Accent: #dfbf68 / #eed58a / #d4af37
// Crisp White: #ffffff
// Cream/Bone: #f5f2e8

function generateLabelSVG({ width = 2400, height = 1200, includeBleed = false }) {
  // 4 inches wide by 2 inches high
  // Left panel: 0 to 720 (30%) - 1.2 inches
  // Center panel: 720 to 1680 (40%) - 1.6 inches
  // Right panel: 1680 to 2400 (30%) - 1.2 inches

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradients using exact box greens -->
    <linearGradient id="mainBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4e682b" />
      <stop offset="35%" stop-color="#5a7732" />
      <stop offset="65%" stop-color="#5f7d36" />
      <stop offset="100%" stop-color="#435924" />
    </linearGradient>

    <!-- Radial glow for center hero section -->
    <radialGradient id="centerAura" cx="50%" cy="45%" r="45%">
      <stop offset="0%" stop-color="#739345" stop-opacity="0.55" />
      <stop offset="60%" stop-color="#5a7732" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#4e682b" stop-opacity="0" />
    </radialGradient>

    <!-- Golden accent gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdf3c7" />
      <stop offset="25%" stop-color="#eed58a" />
      <stop offset="50%" stop-color="#d4af37" />
      <stop offset="75%" stop-color="#b8860b" />
      <stop offset="100%" stop-color="#f5e6a3" />
    </linearGradient>

    <linearGradient id="goldHBorder" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0" />
      <stop offset="20%" stop-color="#eed58a" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#fff5d1" stop-opacity="1" />
      <stop offset="80%" stop-color="#eed58a" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#d4af37" stop-opacity="0" />
    </linearGradient>

    <linearGradient id="goldVDivider" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d4af37" stop-opacity="0" />
      <stop offset="15%" stop-color="#eed58a" stop-opacity="0.45" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.65" />
      <stop offset="85%" stop-color="#eed58a" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#d4af37" stop-opacity="0" />
    </linearGradient>

    <radialGradient id="reliefGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffe680" stop-opacity="0.9" />
      <stop offset="30%" stop-color="#f59e0b" stop-opacity="0.6" />
      <stop offset="70%" stop-color="#ef4444" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#ef4444" stop-opacity="0" />
    </radialGradient>

    <!-- Subtle leaf pattern in background -->
    <pattern id="leafPattern" width="160" height="160" patternUnits="userSpaceOnUse" opacity="0.04">
      <path d="M40,0 C60,40 100,50 120,40 C100,80 60,80 40,120 C20,80 0,60 40,0 Z" fill="#ffffff" />
      <path d="M120,80 C140,120 180,130 200,120 C180,160 140,160 120,200 C100,160 80,140 120,80 Z" fill="#ffffff" />
    </pattern>

    <!-- Drop shadow for main logo -->
    <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#1e2c0e" flood-opacity="0.65" />
    </filter>

    <filter id="badgeShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#152108" flood-opacity="0.5" />
    </filter>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=Noto+Nastaliq+Urdu:wght@400;700&amp;family=Great+Vibes&amp;display=swap');
    
    .font-brand { font-family: 'Cinzel', 'Playfair Display', Georgia, serif; }
    .font-sans { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .font-urdu { font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', Arial, sans-serif; }
    .font-script { font-family: 'Great Vibes', 'Brush Script MT', cursive; }
  </style>

  <!-- BASE SOLID / GRADIENT BACKGROUND -->
  <rect width="100%" height="100%" fill="url(#mainBgGrad)" />
  
  <!-- Subtle natural texture overlay -->
  <rect width="100%" height="100%" fill="url(#leafPattern)" />
  
  <!-- Center Panel Radiant Glow -->
  <rect x="680" y="0" width="1040" height="1200" fill="url(#centerAura)" />

  <!-- DECORATIVE PREMIUM GOLDEN BORDERS -->
  <!-- Outer Gold Border Inset 24px -->
  <rect x="24" y="24" width="2352" height="1152" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="3" opacity="0.85" />
  <!-- Inner Subtle Border Inset 34px -->
  <rect x="34" y="34" width="2332" height="1132" rx="12" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.2" />

  <!-- CORNER ACCENT ORNAMENTS (All 4 Corners) -->
  <g stroke="url(#goldGrad)" stroke-width="2" fill="none">
    <!-- Top-Left -->
    <path d="M 44 65 L 65 65 L 65 44" />
    <circle cx="65" cy="65" r="3" fill="#eed58a" />
    <!-- Bottom-Left -->
    <path d="M 44 1135 L 65 1135 L 65 1156" />
    <circle cx="65" cy="1135" r="3" fill="#eed58a" />
    <!-- Top-Right -->
    <path d="M 2356 65 L 2335 65 L 2335 44" />
    <circle cx="2335" cy="65" r="3" fill="#eed58a" />
    <!-- Bottom-Right -->
    <path d="M 2356 1135 L 2335 1135 L 2335 1156" />
    <circle cx="2335" cy="1135" r="3" fill="#eed58a" />
  </g>

  <!-- PANEL DIVIDERS (Subtle Gold Gradient Lines) -->
  <!-- Left to Center Divider at X = 720 -->
  <line x1="720" y1="60" x2="720" y2="1140" stroke="url(#goldVDivider)" stroke-width="2" />
  <!-- Center to Right Divider at X = 1680 -->
  <line x1="1680" y1="60" x2="1680" y2="1140" stroke="url(#goldVDivider)" stroke-width="2" />

  <!-- ======================================================== -->
  <!-- LEFT PANEL: HOW TO USE / DIRECTIONS & PRECAUTIONS        -->
  <!-- ======================================================== -->
  <g transform="translate(60, 60)">
    <!-- Header Badge -->
    <rect x="60" y="20" width="500" height="46" rx="23" fill="#2d3f18" stroke="url(#goldGrad)" stroke-width="1.5" />
    <text x="310" y="50" class="font-sans" font-size="20" font-weight="700" fill="#eed58a" text-anchor="middle" letter-spacing="3">DIRECTIONS FOR USE</text>

    <!-- 3-Step Ritual Container -->
    <!-- Step 1 -->
    <g transform="translate(40, 105)">
      <circle cx="45" cy="45" r="36" fill="#384f1f" stroke="#eed58a" stroke-width="2" filter="url(#badgeShadow)" />
      <!-- Dropper icon -->
      <path d="M45,22 L49,28 L49,38 C53,42 55,47 55,52 C55,58 50,63 45,63 C40,63 35,58 35,52 C35,47 37,42 41,38 L41,28 Z" fill="#eed58a" />
      <circle cx="45" cy="54" r="3" fill="#ffffff" />
      <text x="105" y="32" class="font-sans" font-size="20" font-weight="700" fill="#ffffff">Step 1: Dispense</text>
      <text x="105" y="58" class="font-sans" font-size="16" font-weight="400" fill="#e2ebd3">Take 3–5 drops of PureFix oil</text>
      <text x="105" y="80" class="font-sans" font-size="16" font-weight="400" fill="#e2ebd3">directly onto your palm.</text>
    </g>

    <!-- Step 2 -->
    <g transform="translate(40, 235)">
      <circle cx="45" cy="45" r="36" fill="#384f1f" stroke="#eed58a" stroke-width="2" filter="url(#badgeShadow)" />
      <!-- Circular massage icon -->
      <path d="M45,23 C57,23 67,33 67,45 C67,57 57,67 45,67 C33,67 23,57 23,45" fill="none" stroke="#eed58a" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 4" />
      <polygon points="45,17 53,24 45,31" fill="#eed58a" />
      <circle cx="45" cy="45" r="8" fill="#ffffff" />
      <text x="105" y="32" class="font-sans" font-size="20" font-weight="700" fill="#ffffff">Step 2: Gentle Massage</text>
      <text x="105" y="58" class="font-sans" font-size="16" font-weight="400" fill="#e2ebd3">Apply on affected joint/muscle.</text>
      <text x="105" y="80" class="font-sans" font-size="16" font-weight="400" fill="#e2ebd3">Massage in circular motion.</text>
    </g>

    <!-- Step 3 -->
    <g transform="translate(40, 365)">
      <circle cx="45" cy="45" r="36" fill="#384f1f" stroke="#eed58a" stroke-width="2" filter="url(#badgeShadow)" />
      <!-- Clock / Repeat icon -->
      <circle cx="45" cy="45" r="20" fill="none" stroke="#eed58a" stroke-width="3.5" />
      <polyline points="45,32 45,45 54,49" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
      <text x="105" y="32" class="font-sans" font-size="20" font-weight="700" fill="#ffffff">Step 3: Daily Routine</text>
      <text x="105" y="58" class="font-sans" font-size="16" font-weight="400" fill="#e2ebd3">Apply 2 to 3 times daily or as</text>
      <text x="105" y="80" class="font-sans" font-size="16" font-weight="400" fill="#e2ebd3">needed for continuous relief.</text>
    </g>

    <!-- Divider Line -->
    <line x1="40" y1="495" x2="580" y2="495" stroke="url(#goldHBorder)" stroke-width="1.5" />

    <!-- Badges Row -->
    <g transform="translate(40, 520)">
      <rect x="0" y="0" width="255" height="70" rx="10" fill="#2d3f18" stroke="#eed58a" stroke-width="1.2" />
      <text x="127" y="30" class="font-sans" font-size="15" font-weight="700" fill="#eed58a" text-anchor="middle">100% NATURAL</text>
      <text x="127" y="52" class="font-sans" font-size="13" font-weight="500" fill="#ffffff" text-anchor="middle">No Harsh Chemicals</text>

      <rect x="275" y="0" width="265" height="70" rx="10" fill="#2d3f18" stroke="#eed58a" stroke-width="1.2" />
      <text x="407" y="30" class="font-sans" font-size="15" font-weight="700" fill="#eed58a" text-anchor="middle">FAST PENETRATING</text>
      <text x="407" y="52" class="font-sans" font-size="13" font-weight="500" fill="#ffffff" text-anchor="middle">Deep Herbal Absorption</text>
    </g>

    <!-- Caution Box -->
    <g transform="translate(40, 625)">
      <rect x="0" y="0" width="540" height="235" rx="12" fill="#243414" stroke="#eed58a" stroke-width="1" opacity="0.95" />
      
      <!-- Caution Title -->
      <g transform="translate(20, 20)">
        <polygon points="18,5 34,33 2,33" fill="#eed58a" />
        <text x="18" y="29" font-size="18" font-weight="900" fill="#243414" text-anchor="middle">!</text>
        <text x="46" y="26" class="font-sans" font-size="18" font-weight="700" fill="#eed58a">CAUTION &amp; STORAGE / احتیاط</text>
      </g>

      <g transform="translate(25, 75)" class="font-sans" font-size="15" fill="#e4ecd5">
        <circle cx="8" cy="8" r="4" fill="#eed58a" />
        <text x="24" y="13">For external use only • صرف بیرونی استعمال کے لیے</text>

        <circle cx="8" cy="42" r="4" fill="#eed58a" />
        <text x="24" y="47">Keep out of reach of children • بچوں کی پہنچ سے دور رکھیں</text>

        <circle cx="8" cy="76" r="4" fill="#eed58a" />
        <text x="24" y="81">Avoid contact with eyes • آنکھوں میں لگانے سے گریز کریں</text>

        <circle cx="8" cy="110" r="4" fill="#eed58a" />
        <text x="24" y="115">Store below 30°C in a dry place • ٹھنڈی جگہ پر رکھیں</text>
      </g>
    </g>

    <!-- Bottom Registration & Packaging Info -->
    <g transform="translate(40, 905)" class="font-sans">
      <text x="0" y="20" font-size="14" font-weight="600" fill="#eed58a">FORMULATED &amp; PACKAGED FOR:</text>
      <text x="0" y="42" font-size="15" font-weight="700" fill="#ffffff">PureFix Health &amp; Wellness (Pvt) Ltd.</text>
      <text x="0" y="64" font-size="13" font-weight="400" fill="#cbd7bc">Quality Controlled • ISO &amp; GMP Standard Practice</text>
      <text x="0" y="86" font-size="13" font-weight="600" fill="#eed58a">Batch: PF-2608 | Exp: 08/2029 | MRP: Rs. 1,450</text>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- CENTER HERO PANEL: BRAND, LOGO, ARTWORK & BENEFITS       -->
  <!-- ======================================================== -->
  <g transform="translate(1200, 0)">
    <!-- Top Laurel / Botanical Wreath Accent -->
    <g transform="translate(0, 100)" text-anchor="middle">
      <!-- Top Pill: 100% NATURAL PRODUCT -->
      <rect x="-190" y="-30" width="380" height="42" rx="21" fill="#2d4017" stroke="url(#goldGrad)" stroke-width="1.8" />
      <!-- Left mini leaf -->
      <path d="M-155,-9 C-140,-18 -130,-12 -125,-9 C-130,0 -140,2 -155,-9 Z" fill="#eed58a" />
      <text x="0" y="-2" class="font-sans" font-size="17" font-weight="800" fill="#eed58a" letter-spacing="3">100% NATURAL PRODUCT</text>
      <!-- Right mini leaf -->
      <path d="M155,-9 C140,-18 130,-12 125,-9 C130,0 140,2 155,-9 Z" fill="#eed58a" />
    </g>

    <!-- MAIN BRAND LOGO "PureFix" -->
    <g transform="translate(0, 220)" text-anchor="middle" filter="url(#logoShadow)">
      <text x="0" y="0" class="font-brand" font-size="108" font-weight="800" fill="#ffffff" letter-spacing="4">PureFix</text>
      <!-- Gold leaf sprout on top of 'i' -->
      <path d="M78,-92 C88,-115 105,-118 112,-112 C108,-98 94,-88 78,-92 Z" fill="url(#goldGrad)" />
      <circle cx="82" cy="-90" r="4.5" fill="#ffe082" />
    </g>

    <!-- Product Subtitle -->
    <g transform="translate(0, 285)" text-anchor="middle">
      <text x="0" y="0" class="font-sans" font-size="34" font-weight="800" fill="url(#goldGrad)" letter-spacing="7">PAIN RELIEF OIL</text>
      <text x="0" y="32" class="font-sans" font-size="20" font-weight="700" fill="#ffffff" opacity="0.95" letter-spacing="3">( 50 ml / 1.7 Fl. Oz. )</text>
    </g>

    <!-- Gold Ornamental Divider Line -->
    <line x1="-340" y1="365" x2="340" y2="365" stroke="url(#goldHBorder)" stroke-width="2.5" />

    <!-- Tagline: "Move Freely, Live Better" -->
    <g transform="translate(0, 425)" text-anchor="middle">
      <text x="0" y="0" class="font-script" font-size="48" fill="#fff3c4" letter-spacing="2">Move Freely, Live Better</text>
    </g>

    <!-- CENTER VISUAL: GLOWING JOINT & BULLET BENEFIT LIST -->
    <!-- Two Column Layout in Center Panel: Left 5 bullets, Right glowing joint graphic -->
    
    <!-- LEFT SIDE: 5 CORE BENEFITS WITH BADGES -->
    <g transform="translate(-400, 470)">
      <!-- Item 1 -->
      <g transform="translate(0, 0)">
        <circle cx="28" cy="24" r="22" fill="#2d3f18" stroke="#eed58a" stroke-width="1.8" filter="url(#badgeShadow)" />
        <!-- Joint icon -->
        <circle cx="28" cy="24" r="7" fill="#eed58a" />
        <circle cx="28" cy="24" r="13" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="3 2" />
        <text x="65" y="30" class="font-sans" font-size="21" font-weight="700" fill="#ffffff">Helps Reduce Joint Pain</text>
      </g>

      <!-- Item 2 -->
      <g transform="translate(0, 68)">
        <circle cx="28" cy="24" r="22" fill="#2d3f18" stroke="#eed58a" stroke-width="1.8" filter="url(#badgeShadow)" />
        <!-- Arm muscle icon -->
        <path d="M20,30 C20,20 28,15 34,20 C38,18 42,22 40,28 C38,34 26,35 20,30 Z" fill="#eed58a" />
        <text x="65" y="30" class="font-sans" font-size="21" font-weight="700" fill="#ffffff">Relaxes Stiff Muscles</text>
      </g>

      <!-- Item 3 -->
      <g transform="translate(0, 136)">
        <circle cx="28" cy="24" r="22" fill="#2d3f18" stroke="#eed58a" stroke-width="1.8" filter="url(#badgeShadow)" />
        <!-- Active mobility icon -->
        <circle cx="28" cy="16" r="4.5" fill="#eed58a" />
        <path d="M24,24 L32,24 L34,35 M27,24 L23,35" stroke="#eed58a" stroke-width="2.5" stroke-linecap="round" fill="none" />
        <text x="65" y="30" class="font-sans" font-size="21" font-weight="700" fill="#ffffff">Improves Mobility</text>
      </g>

      <!-- Item 4 -->
      <g transform="translate(0, 204)">
        <circle cx="28" cy="24" r="22" fill="#2d3f18" stroke="#eed58a" stroke-width="1.8" filter="url(#badgeShadow)" />
        <!-- Bone health icon -->
        <path d="M20,18 C17,18 16,21 18,24 C16,27 17,30 20,30 L36,30 C39,30 40,27 38,24 C40,21 39,18 36,18 Z" fill="#eed58a" />
        <text x="65" y="30" class="font-sans" font-size="21" font-weight="700" fill="#ffffff">Helps in Bone Pain</text>
      </g>

      <!-- Item 5 -->
      <g transform="translate(0, 272)">
        <circle cx="28" cy="24" r="22" fill="#2d3f18" stroke="#eed58a" stroke-width="1.8" filter="url(#badgeShadow)" />
        <!-- Soothing leaf icon -->
        <path d="M18,32 C18,22 28,14 38,16 C38,26 28,34 18,32 Z" fill="#eed58a" />
        <path d="M22,28 L34,20" stroke="#2d3f18" stroke-width="1.5" />
        <text x="65" y="30" class="font-sans" font-size="21" font-weight="700" fill="#ffffff">Soothes Inflammation</text>
      </g>
    </g>

    <!-- RIGHT SIDE: ARTISTIC JOINT ANATOMY & RELIEF AURA -->
    <g transform="translate(230, 620)">
      <!-- Pulsing Aura Rings -->
      <circle cx="0" cy="0" r="140" fill="none" stroke="#ffe082" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="8 6" />
      <circle cx="0" cy="0" r="105" fill="none" stroke="#f59e0b" stroke-width="2" stroke-opacity="0.45" />
      <circle cx="0" cy="0" r="70" fill="url(#reliefGlow)" />
      
      <!-- Stylized Knee Joint Bone Graphic -->
      <!-- Femur (Upper Bone) -->
      <path d="M -22 -140 C -22 -90 -38 -55 -28 -20 C -20 0 -5 5 0 0 C 5 5 20 0 28 -20 C 38 -55 22 -90 22 -140 Z" fill="#ebf4db" opacity="0.88" />
      <path d="M -12 -130 L -12 -35 M 12 -130 L 12 -35" stroke="#7e9c52" stroke-width="2" opacity="0.6" />

      <!-- Joint Core Glowing Disc -->
      <circle cx="0" cy="0" r="22" fill="#fff59d" filter="url(#badgeShadow)" />
      <circle cx="0" cy="0" r="12" fill="#f59e0b" />
      <circle cx="0" cy="0" r="5" fill="#ffffff" />
      
      <!-- Tibia & Fibula (Lower Bones) -->
      <path d="M -28 20 C -38 55 -24 90 -24 140 L 24 140 C 24 90 38 55 28 20 C 20 12 5 8 0 12 C -5 8 -20 12 -28 20 Z" fill="#ebf4db" opacity="0.88" />
      <!-- Fibula slender side bone -->
      <path d="M 38 40 C 44 80 40 110 38 140" stroke="#d5e8b8" stroke-width="8" stroke-linecap="round" opacity="0.75" />

      <!-- Target Pain Sparkle Star -->
      <g stroke="#ffffff" stroke-width="2.5" stroke-linecap="round">
        <line x1="-35" y1="0" x2="35" y2="0" />
        <line x1="0" y1="-35" x2="0" y2="35" />
        <line x1="-22" y1="-22" x2="22" y2="22" />
        <line x1="-22" y1="22" x2="22" y2="-22" />
      </g>
      
      <!-- Bottom Floating Badge under Joint -->
      <g transform="translate(0, 160)" text-anchor="middle">
        <rect x="-95" y="-18" width="190" height="36" rx="18" fill="#263714" stroke="#eed58a" stroke-width="1.2" />
        <text x="0" y="6" class="font-sans" font-size="14" font-weight="700" fill="#eed58a" letter-spacing="1">TARGETED RELIEF</text>
      </g>
    </g>

    <!-- CENTER FOOTER: 3 PILL HIGHLIGHTS -->
    <g transform="translate(0, 920)" text-anchor="middle">
      <rect x="-380" y="0" width="760" height="64" rx="32" fill="#243414" stroke="url(#goldGrad)" stroke-width="1.8" />
      
      <!-- 3 Key Value Props -->
      <g class="font-sans" font-size="16" font-weight="700" fill="#ffffff">
        <text x="-240" y="38" fill="#eed58a">✓ 9 HERBAL OILS</text>
        <circle cx="-120" cy="32" r="3" fill="#eed58a" />
        <text x="0" y="38" fill="#ffffff">FAST ABSORBING</text>
        <circle cx="120" cy="32" r="3" fill="#eed58a" />
        <text x="240" y="38" fill="#eed58a">LONG LASTING ✓</text>
      </g>
    </g>

    <!-- Bottom Volume & Manufacturing line -->
    <g transform="translate(0, 1040)" text-anchor="middle" class="font-sans">
      <text x="0" y="0" font-size="15" font-weight="600" fill="#d8e5cb" letter-spacing="2">AYURVEDIC PROPRIETARY PAIN FORMULA</text>
      <text x="0" y="24" font-size="13" font-weight="400" fill="#eed58a">FOR BODY • JOINTS • MUSCLES • TENDONS</text>
    </g>
  </g>

  <!-- ======================================================== -->
  <!-- RIGHT PANEL: URDU BENEFITS, INGREDIENTS & BARCODE        -->
  <!-- ======================================================== -->
  <g transform="translate(1720, 60)">
    <!-- Header Badge in Urdu & English -->
    <rect x="40" y="20" width="540" height="46" rx="23" fill="#2d3f18" stroke="url(#goldGrad)" stroke-width="1.5" />
    <text x="310" y="52" class="font-urdu" font-size="22" font-weight="700" fill="#eed58a" text-anchor="middle">آرام اور بہتر فعال زندگی کے لیے</text>

    <!-- Urdu Benefits Section Container -->
    <g transform="translate(30, 85)">
      <!-- Urdu Description Paragraph -->
      <rect x="0" y="10" width="560" height="150" rx="12" fill="#263714" stroke="#eed58a" stroke-width="1" opacity="0.9" />
      
      <g transform="translate(540, 42)" text-anchor="end">
        <text x="0" y="0" class="font-urdu" font-size="18" fill="#ffffff" font-weight="700">پیور فکس (PureFix) قدرتی جڑی بوٹیوں سے تیار کردہ خاص تیل ہے</text>
        <text x="0" y="35" class="font-urdu" font-size="17" fill="#f0f6e8">جو کہ جوڑوں کے پرانے درد، پٹھوں کے کھنچاؤ، سوجن اور اکڑن</text>
        <text x="0" y="70" class="font-urdu" font-size="17" fill="#eed58a">میں فوری نفوذ کر کے قدرتی سکون اور حرکت میں آسانی لاتا ہے۔</text>
      </g>

      <!-- Key Urdu Benefit Bullets -->
      <g transform="translate(540, 195)" text-anchor="end">
        <!-- Bullet 1 -->
        <circle cx="10" cy="-6" r="4.5" fill="#eed58a" />
        <text x="-10" y="0" class="font-urdu" font-size="17" font-weight="700" fill="#ffffff">جوڑوں، گھٹنوں اور کمر کے درد میں فوری تسکین</text>

        <!-- Bullet 2 -->
        <circle cx="10" cy="34" r="4.5" fill="#eed58a" />
        <text x="-10" y="40" class="font-urdu" font-size="17" font-weight="700" fill="#ffffff">پٹھوں کی سختی، کچلاؤ اور سوجن میں واضح کمی</text>

        <!-- Bullet 3 -->
        <circle cx="10" cy="74" r="4.5" fill="#eed58a" />
        <text x="-10" y="80" class="font-urdu" font-size="17" font-weight="700" fill="#ffffff">ہڈیوں اور جوڑوں کی نقل و حرکت (Mobility) میں بہتری</text>

        <!-- Bullet 4 -->
        <circle cx="10" cy="114" r="4.5" fill="#eed58a" />
        <text x="-10" y="120" class="font-urdu" font-size="17" font-weight="700" fill="#ffffff">سوزش کا قدرتی خاتمہ اور روزمرہ کاموں میں آسانی</text>
      </g>
    </g>

    <!-- INGREDIENTS BREAKDOWN TABLE -->
    <g transform="translate(30, 465)">
      <rect x="0" y="0" width="560" height="270" rx="12" fill="#243414" stroke="#eed58a" stroke-width="1.2" />
      
      <!-- Table Header -->
      <path d="M 0 12 Q 0 0 12 0 L 548 0 Q 560 0 560 12 L 560 42 L 0 42 Z" fill="#344a1e" />
      <text x="25" y="28" class="font-sans" font-size="15" font-weight="800" fill="#eed58a" letter-spacing="1">BOTANICAL FORMULA BREAKDOWN</text>
      <text x="535" y="28" class="font-sans" font-size="13" font-weight="700" fill="#ffffff" text-anchor="end">% ACTIVE</text>
      
      <!-- 2-Column Grid of Ingredients -->
      <!-- Left Sub-column -->
      <g transform="translate(25, 68)" class="font-sans" font-size="14" fill="#ffffff">
        <text x="0" y="0" font-weight="600">🌿 Turmeric Extract</text>
        <text x="210" y="0" font-weight="700" fill="#eed58a" text-anchor="end">20%</text>

        <text x="0" y="32" font-weight="600">🌿 Boswellia Extract</text>
        <text x="210" y="32" font-weight="700" fill="#eed58a" text-anchor="end">20%</text>

        <text x="0" y="64" font-weight="600">🌿 Ginger Extract</text>
        <text x="210" y="64" font-weight="700" fill="#eed58a" text-anchor="end">15%</text>

        <text x="0" y="96" font-weight="600">🌿 Black Seed &amp; Methi</text>
        <text x="210" y="96" font-weight="700" fill="#eed58a" text-anchor="end">10%</text>

        <text x="0" y="128" font-weight="600">🌿 Sesame &amp; Olive Base</text>
        <text x="210" y="128" font-weight="700" fill="#eed58a" text-anchor="end">10%</text>
      </g>

      <!-- Center Table Divider -->
      <line x1="280" y1="52" x2="280" y2="210" stroke="#3b5220" stroke-width="1" />

      <!-- Right Sub-column -->
      <g transform="translate(305, 68)" class="font-sans" font-size="14" fill="#ffffff">
        <text x="0" y="0" font-weight="600">🌿 Eucalyptus Oil</text>
        <text x="225" y="0" font-weight="700" fill="#eed58a" text-anchor="end">8%</text>

        <text x="0" y="32" font-weight="600">🌿 Peppermint Oil</text>
        <text x="225" y="32" font-weight="700" fill="#eed58a" text-anchor="end">7%</text>

        <text x="0" y="64" font-weight="600">🌿 Cinnamon Oil</text>
        <text x="225" y="64" font-weight="700" fill="#eed58a" text-anchor="end">5%</text>

        <text x="0" y="96" font-weight="600">🌿 Clove Oil</text>
        <text x="225" y="96" font-weight="700" fill="#eed58a" text-anchor="end">5%</text>

        <text x="0" y="128" font-weight="600" fill="#eed58a">✓ Total Natural Active</text>
        <text x="225" y="128" font-weight="800" fill="#ffffff" text-anchor="end">100%</text>
      </g>

      <!-- Note footer inside table -->
      <line x1="15" y1="220" x2="545" y2="220" stroke="#3b5220" stroke-width="1" />
      <text x="280" y="248" class="font-sans" font-size="12" font-weight="500" fill="#cbd7bc" text-anchor="middle">Cold-Pressed • Steam-Distilled • 100% Chemical Free Formulation</text>
    </g>

    <!-- BARCODE & WEBSITE CONTAINER -->
    <g transform="translate(30, 765)">
      <!-- Barcode White Container -->
      <rect x="0" y="0" width="340" height="155" rx="8" fill="#ffffff" />
      
      <!-- Vector Barcode Lines -->
      <g transform="translate(25, 20)">
        <!-- Generate realistic crisp barcode stripes -->
        <rect x="0" y="0" width="4" height="85" fill="#000000" />
        <rect x="7" y="0" width="2" height="85" fill="#000000" />
        <rect x="13" y="0" width="5" height="85" fill="#000000" />
        <rect x="22" y="0" width="2" height="85" fill="#000000" />
        <rect x="28" y="0" width="7" height="85" fill="#000000" />
        <rect x="39" y="0" width="3" height="85" fill="#000000" />
        <rect x="46" y="0" width="2" height="85" fill="#000000" />
        <rect x="52" y="0" width="6" height="85" fill="#000000" />
        <rect x="62" y="0" width="3" height="85" fill="#000000" />
        <rect x="68" y="0" width="5" height="85" fill="#000000" />
        <rect x="78" y="0" width="2" height="85" fill="#000000" />
        <rect x="84" y="0" width="7" height="85" fill="#000000" />
        <rect x="95" y="0" width="3" height="85" fill="#000000" />
        <rect x="103" y="0" width="2" height="85" fill="#000000" />
        <rect x="109" y="0" width="6" height="85" fill="#000000" />
        <rect x="119" y="0" width="3" height="85" fill="#000000" />
        <rect x="127" y="0" width="4" height="85" fill="#000000" />
        <rect x="135" y="0" width="2" height="85" fill="#000000" />
        <rect x="142" y="0" width="7" height="85" fill="#000000" />
        <rect x="153" y="0" width="3" height="85" fill="#000000" />
        <rect x="160" y="0" width="4" height="85" fill="#000000" />
        <rect x="168" y="0" width="2" height="85" fill="#000000" />
        <rect x="174" y="0" width="6" height="85" fill="#000000" />
        <rect x="184" y="0" width="3" height="85" fill="#000000" />
        <rect x="192" y="0" width="5" height="85" fill="#000000" />
        <rect x="201" y="0" width="2" height="85" fill="#000000" />
        <rect x="208" y="0" width="7" height="85" fill="#000000" />
        <rect x="219" y="0" width="4" height="85" fill="#000000" />
        <rect x="228" y="0" width="2" height="85" fill="#000000" />
        <rect x="234" y="0" width="6" height="85" fill="#000000" />
        <rect x="245" y="0" width="3" height="85" fill="#000000" />
        <rect x="252" y="0" width="5" height="85" fill="#000000" />
        <rect x="261" y="0" width="2" height="85" fill="#000000" />
        <rect x="268" y="0" width="7" height="85" fill="#000000" />
        <rect x="279" y="0" width="4" height="85" fill="#000000" />
        <rect x="286" y="0" width="4" height="85" fill="#000000" />
        
        <!-- EAN Digits -->
        <text x="145" y="115" class="font-sans" font-size="19" font-weight="700" fill="#000000" text-anchor="middle" letter-spacing="4">8 901234 567890</text>
      </g>

      <!-- Right Side of Barcode: Official URL & Recyclable / Halal / Natural marks -->
      <g transform="translate(365, 10)">
        <text x="0" y="24" class="font-sans" font-size="14" font-weight="700" fill="#eed58a">OFFICIAL PORTAL</text>
        <text x="0" y="48" class="font-sans" font-size="19" font-weight="800" fill="#ffffff">www.purefix.pk</text>
        
        <g transform="translate(0, 70)">
          <!-- Recyclable icon -->
          <circle cx="18" cy="18" r="16" fill="none" stroke="#eed58a" stroke-width="1.8" />
          <path d="M12,18 L18,10 L24,18 M18,10 L18,26" stroke="#eed58a" stroke-width="2" stroke-linecap="round" fill="none" />
          <text x="44" y="15" class="font-sans" font-size="12" font-weight="700" fill="#ffffff">RECYCLABLE</text>
          <text x="44" y="30" class="font-sans" font-size="11" font-weight="500" fill="#cbd7bc">Amber Glass Bottle</text>
        </g>
        
        <g transform="translate(0, 115)">
          <circle cx="18" cy="15" r="14" fill="#2d3f18" stroke="#eed58a" stroke-width="1.5" />
          <text x="18" y="20" class="font-sans" font-size="12" font-weight="800" fill="#eed58a" text-anchor="middle">100%</text>
          <text x="44" y="14" class="font-sans" font-size="12" font-weight="700" fill="#ffffff">ORGANIC &amp; PURE</text>
          <text x="44" y="28" class="font-sans" font-size="11" font-weight="500" fill="#cbd7bc">Cruelty Free • Non-GMO</text>
        </g>
      </g>
    </g>

    <!-- Proudly Made in Pakistan Ribbon -->
    <g transform="translate(30, 945)">
      <rect x="0" y="0" width="560" height="42" rx="21" fill="#1e2c10" stroke="#eed58a" stroke-width="1.2" />
      <g transform="translate(280, 26)" text-anchor="middle" class="font-sans" font-size="14" font-weight="700">
        <!-- Crescent & Star -->
        <circle cx="-135" cy="-2" r="8" fill="#ffffff" />
        <circle cx="-133" cy="-2" r="6.5" fill="#1e2c10" />
        <polygon points="-129,-4 -128,-1 -125,-1 -127,1 -126,4 -129,2 -131,4 -130,1 -133,-1 -130,-1" fill="#ffffff" />
        <text x="0" y="2" fill="#ffffff" letter-spacing="2">PROUDLY FORMULATED IN PAKISTAN</text>
        <circle cx="135" cy="-2" r="3" fill="#eed58a" />
      </g>
    </g>
  </g>

  <!-- PRINT SPECS & DIMENSION MARKS (Optional subtle guides at the very edge) -->
  <g class="font-sans" font-size="11" fill="#ffffff" opacity="0.3">
    <text x="35" y="1185">WIDTH: 4.0 IN (101.6 mm) | HEIGHT: 2.0 IN (50.8 mm)</text>
    <text x="2365" y="1185" text-anchor="end">PUREFIX PAIN RELIEF OIL • BOTTLE WRAP LABEL 300/600 DPI</text>
  </g>
</svg>`;
}

async function run() {
  const outputDir = path.resolve(__dirname, '../public/assets/label');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const brainDir = 'C:/Users/Jamco/.gemini/antigravity/brain/92a0e1bf-536e-48bd-bc9b-1e0a8719c82e';

  console.log('Generating SVG Label (4" x 2")...');
  const svgContent = generateLabelSVG({ width: 2400, height: 1200 });

  const svgPath = path.join(outputDir, 'purefix-bottle-label-4x2.svg');
  fs.writeFileSync(svgPath, svgContent, 'utf8');
  fs.writeFileSync(path.join(brainDir, 'purefix-bottle-label-4x2.svg'), svgContent, 'utf8');
  console.log('Saved SVG to:', svgPath);

  console.log('Rendering 300 DPI PNG (1200x600)...');
  await sharp(Buffer.from(svgContent))
    .resize(1200, 600)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outputDir, 'purefix-bottle-label-300dpi.png'));
  
  await sharp(Buffer.from(svgContent))
    .resize(1200, 600)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(brainDir, 'purefix-bottle-label-300dpi.png'));
  console.log('Saved 300 DPI PNG');

  console.log('Rendering 600 DPI Ultra High-Res PNG (2400x1200)...');
  await sharp(Buffer.from(svgContent))
    .resize(2400, 1200)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(outputDir, 'purefix-bottle-label-600dpi.png'));

  await sharp(Buffer.from(svgContent))
    .resize(2400, 1200)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(brainDir, 'purefix-bottle-label-600dpi.png'));
  console.log('Saved 600 DPI PNG');

  // Also replace the bottle-label-texture.png in public/assets for the 3D model!
  console.log('Creating wrap texture for 3D bottle preview...');
  await sharp(Buffer.from(svgContent))
    .resize(1024, 512)
    .png()
    .toFile(path.join(__dirname, '../public/assets/bottle-label-texture.png'));
  console.log('Updated 3D model texture!');
}

run().catch(console.error);

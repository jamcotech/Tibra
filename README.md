# Tibra — Tibra Natural Joint Oil — Luxury Botanical Wellness E-Commerce Platform

> **A modern, high-conversion, cinematic e-commerce and interactive landing experience for Tibra Natural Joint Oil (30 ML Herbal Blend). Built with React 19, TypeScript, Vite, Tailwind CSS, Three.js 3D WebGL rendering, and an integrated Store & Admin Management Suite.**

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Design System & Styling](#-design-system--styling)
   - [Typography & Google Fonts](#typography--google-fonts)
   - [Color Palette & Tokens](#color-palette--tokens)
   - [Glassmorphism & Surface Effects](#glassmorphism--surface-effects)
   - [Custom Shadows & CSS Keyframe Animations](#custom-shadows--css-keyframe-animations)
3. [Architecture & Component Breakdown](#-architecture--component-breakdown)
   - [Storefront Landing Sections](#1-storefront-landing-sections)
   - [Interactive 3D Three.js Bottle](#2-interactive-3d-threejs-bottle)
   - [Floating Action Bar & CTAs](#3-floating-action-bar--ctas)
   - [Full E-Commerce Flow (Cart, Checkout, Success)](#4-full-e-commerce-flow)
   - [Spree-Inspired Admin Portal](#5-spree-inspired-admin-portal)
4. [State Management & Data Layer](#-state-management--data-layer)
5. [Directory & File Structure](#-directory--file-structure)
6. [Asset Processing Scripts](#-asset-processing-scripts)
7. [Getting Started & Local Development](#-getting-started--local-development)
8. [Build & Production Deployment](#-build--production-deployment)

---

## 🌿 Project Overview

**Tibra Natural Joint Oil** is crafted for high-performance direct-to-consumer (D2C) wellness sales. The application delivers an editorial, luxury botanical aesthetic inspired by high-end apothecary and wellness brands (Aesop, Le Labo, Augustinus Bader).

### Key Highlights:
- **Zero Framework Bloat:** Instant hydration powered by Vite + React 19 + TypeScript.
- **Cinematic 3D WebGL:** Interactive Three.js model of the amber dropper bottle with real-time lighting, glass transmission, and label texturing.
- **Interactive Anatomical Pain Selector:** Targeted relief points (Knees, Lower Back, Neck, Shoulders, Wrists) with clinical efficacy statistics.
- **Full E-Commerce Journey:** Floating quick-buy bar, slide-out cart drawer, dedicated cart page, checkout with Cash on Delivery (COD), order persistence in `localStorage`, and celebratory confetti completion.
- **Native WhatsApp Integration:** Direct order routing via WhatsApp with pre-filled order summaries and an elegant outline button.
- **Embedded Back-Office Portal:** Integrated admin dashboard (`/admin`) for tracking orders, revenue metrics, customer contacts, and inventory.

---

## 🎨 Design System & Styling

The visual identity is defined in `tailwind.config.js`, `src/index.css`, and `index.html`.

### Typography & Google Fonts
Loaded directly from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,600;1,400&display=swap" rel="stylesheet">
```

| Font Family | Weights | Tailwind Class | Role & Usage |
| :--- | :--- | :--- | :--- |
| **Plus Jakarta Sans** | 300, 400, 500, 600, 700 | `font-sans` | Primary UI, body copy, pricing, specification badges, buttons, form inputs |
| **Cinzel** | 500, 600, 700 | `font-serif` | Editorial headlines, luxury Roman headers, section numbers, brand name |
| **Playfair Display** | 500, 600, italic | `font-serif italic` | Testimonial quotes, brand origin storytelling, subtitle accents |

---

### Color Palette & Tokens

#### 1. Botanical Green Palette (Primary Brand Heritage)
| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `botanical-50` | `#F4F6EE` | Subtle section backgrounds, tint badges |
| `botanical-100` | `#E7EBD9` | Light hover states, pill badges |
| `botanical-200` | `#D1DBB6` | Card borders, subtle dividers |
| `botanical-300` | `#B5C58E` | Accent icons, secondary states |
| `botanical-400` | `#93A863` | Secondary olive green highlights |
| `botanical-500` | `#748C48` | **Official Logo Primary Green**, active highlights, scrollbar thumb |
| `botanical-600` | `#5F7339` | Buttons hover, primary icons |
| `botanical-700` | `#4B5C2B` | Card headers, icon frames |
| `botanical-800` | `#384520` | Deep forest container backgrounds |
| `botanical-900` | `#252E15` | Main high-contrast text color, dark footers |
| `botanical-950` | `#141A0B` | Deepest brand black-olive, luxury backdrops |

#### 2. Cream Palette (Natural Apothecary Canvas)
| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `cream-50` / `cream` | `#FAF8F5` | Main site body background (warm organic off-white) |
| `cream-100` | `#F5F0E6` | Card backgrounds, drawer panels, scrollbar track |
| `cream-200` | `#EAE1CE` | Light borders, subtle divider lines |
| `cream-300` | `#DDD1B4` | Input borders, framed borders |
| `cream-400` | `#CDBE9A` | Muted golden-tan accents |
| `cream-dark` | `#EFEBE1` | Contrast card background |

#### 3. Gold & Metallic Accents (Luxury Finishing)
| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `gold-light` | `#F5E6A3` | Shimmer gradient highlights, star ratings |
| `gold` / `DEFAULT`| `#D4AF37` | True luxury gold, crown icons, guarantee badges |
| `gold-dark` | `#AA820A` | Gradient end points, text shading |
| `gold-amber` | `#B87333` | Copper undertones for bottle reflections |

#### 4. Amber Glass (Medicinal Bottle Palette)
| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `amberGlass-light` | `#C67A26` | Liquid oil highlights, backlight gradients |
| `amberGlass` / `DEFAULT`| `#8C4812` | Rich pharmaceutical amber glass body |
| `amberGlass-dark` | `#542605` | Deep bottle shadows |

---

### Glassmorphism & Surface Effects

Custom classes defined in `src/index.css`:
```css
/* Frosted light glass panel */
.glass-panel {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* Luxury dark glass panel */
.glass-panel-dark {
  background: rgba(21, 44, 25, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Metallic text gradients */
.gold-gradient-text {
  background: linear-gradient(135deg, #F5E6A3 0%, #D4AF37 50%, #AA820A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.botanical-gradient-text {
  background: linear-gradient(135deg, #152C19 0%, #26522C 40%, #3D8145 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

### Custom Shadows & CSS Keyframe Animations

Configured in `tailwind.config.js`:
- `boxShadow.soft-glow`: `0 0 50px -10px rgba(61, 129, 69, 0.15)`
- `boxShadow.gold-glow`: `0 0 35px -5px rgba(212, 175, 55, 0.25)`
- `boxShadow.luxury`: `0 20px 60px -15px rgba(11, 23, 13, 0.12)`
- `boxShadow.glass`: `0 8px 32px 0 rgba(31, 38, 135, 0.07)`
- `animation.float-slow`: 7-second subtle floating elevation (`translateY(-12px) rotate(2deg)`)
- `animation.pulse-glow`: 4-second breathing ambient aura
- `animation.shimmer`: High-speed luxury sweep reflection across cards and buttons

---

## 🏛 Architecture & Component Breakdown

All source components reside under `src/components/` and `src/admin/`:

### 1. Storefront Landing Sections
- **`Navbar.tsx`**: Sticky translucent header with glassmorphism blur, official Tibra Natural logo with ambient glow, navigation menu, live shopping cart badge, and instant CTA.
- **`HeroSection.tsx`**: Cinematic hero reveal featuring full-bleed looping video background (`hero-video.mp4`), bottle showcase, badge assurances (100% Herbal, GMP Certified, Free Delivery), and direct Buy Now / Add to Cart triggers.
- **`ProductAnatomySection.tsx`**: Interactive exploded view illustrating amber glass UV barrier, measured silicone pipette dropper, cold-pressed extraction purity, and tamper-proof safety seal.
- **`IngredientsSection.tsx`**: Showcases 100% natural bio-actives (Eucalyptus Oil, Wintergreen, Menthol Crystals, Sesame Oil carrier base, Turmeric/Curcumin extract) with active benefits.
- **`BenefitsTargetSection.tsx`**: Visual anatomical pain-point selector. Clicking on **Knee**, **Lower Back**, **Shoulder & Neck**, or **Hands/Wrists** switches the clinical explanation, recommended dosage, and clinical improvement ratings.
- **`PackagingShowcaseSection.tsx`**: Highlights luxury apothecary bottling specifications (30 ML amber glass, leakproof dropper collar, embossed gold foil box).
- **`RitualUsageSection.tsx`**: 3-step morning and night application ritual (Dispense 4–6 drops → Gentle circular massage → Warm heat penetration).
- **`BrandStorySection.tsx`**: Tibra Natural heritage, clinical ethics, organic testing certification, and chemical-free guarantee.
- **`FAQSection.tsx`**: Interactive accordion answering common customer queries (delivery times, Cash on Delivery, usage frequency, skin sensitivity).
- **`FinalCtaSection.tsx`**: High-converting conversion banner at the page bottom offering special multi-bottle bundles.
- **`Footer.tsx`**: Footer with links, contact details, payment badges, and legal disclaimers.

---

### 2. Interactive 3D Three.js Bottle
- **`ThreeBottleScene.tsx`**:
  - Implements Three.js WebGL canvas.
  - Realistic Amber Glass shader material with reflection, roughness, and light transmission.
  - Golden screw collar, rubber pipette bulb, and high-resolution cylinder label texture mapping (`bottle-label-texture.png`).
  - Smooth mouse drag and touch rotation controls with auto-rotation dampening.

---

### 3. Floating Action Bar & CTAs
- **`FloatingBottomBar.tsx`**:
  - Sticks to the bottom of the viewport when scrolling past the hero section.
  - Contains:
    1. Quantity Stepper (`[-] 1 [+]`)
    2. Add to Cart button
    3. Buy Now button
    4. **WhatsApp Button**: Authentic solid circular WhatsApp button (`#25D366` green background, white vector icon, subtle border, and shadow) for instant direct WhatsApp ordering.
- **`OrderInquiryModal.tsx`**:
  - Direct Cash on Delivery modal popup.
  - Captures Customer Name, Phone / WhatsApp, Address, and City with instant validation.
  - Secondary direct **Outline WhatsApp** inquiry button.

---

### 4. Full E-Commerce Flow
- **`CartDrawer.tsx`**: Side-sheet slide-out cart showing items, quantity updates, subtotal, and direct checkout CTA.
- **`CartPage.tsx`**: Full-page dedicated cart view with free delivery threshold progress bar and order note input.
- **`CheckoutPage.tsx`**: Multi-section checkout with delivery address forms, Cash on Delivery (COD) payment selection, and automated order confirmation.
- **`OrderSuccessPage.tsx`**: Celebratory order completion view triggering `canvas-confetti` fireworks, order tracking number, summary breakdown, and WhatsApp order confirmation.

---

### 5. Spree-Inspired Admin Portal
- **`src/admin/SpreeAdminApp.tsx`**:
  - Full-featured back-office store administration dashboard accessible via `#admin` or through state.
  - **Orders Management**: Live order list, customer contact details, items purchased, COD status, and status updating (`Pending`, `Processing`, `Delivered`, `Cancelled`).
  - **Analytics**: Gross revenue calculation, total order count, average order value.
  - **Product & Inventory**: Live stock levels and pricing control.

---

## ⚡ State Management & Data Layer

- **`src/context/ShopContext.tsx`**:
  - Manages global e-commerce state via React Context:
    - `cart` (items, quantities, unit prices)
    - `currentView` (`home`, `cart`, `checkout`, `success`)
    - `isCartOpen` (drawer open/close toggle)
    - `isAdminOpen` (admin dashboard view switch)
    - Helper methods: `addToCart()`, `quickBuyNow()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`.
- **`src/services/storeService.ts`**:
  - LocalStorage persistence under key `purefix_store_data`.
  - Saves all confirmed orders, mock products, and customer records so orders persist across page reloads.

---

## 📁 Directory & File Structure

```text
Pure Fix website for Chat GPT/
├── index.html                   # HTML entry point, SEO meta tags, Google Fonts
├── package.json                 # Project dependencies & build scripts
├── postcss.config.js            # PostCSS configuration for Tailwind
├── tailwind.config.js           # Botanical design tokens, fonts, animations
├── tsconfig.json                # TypeScript root configuration
├── vite.config.ts               # Vite bundler configuration
│
├── public/                      # Static assets served at root
│   ├── assets/                  # High-resolution videos, bottle images, cutouts
│   │   ├── hero-video.mp4       # Cinematic background looping video
│   │   ├── bottle-label-texture.png # 3D Three.js label texture
│   │   ├── purefix-logo.png     # Official high-resolution brand logo
│   │   ├── purefix-bottle-transparent.png
│   │   ├── targets/             # Pain points target visual assets
│   │   ├── ingredients/         # Herb & botanical photography
│   │   └── ritual/              # Daily ritual step visuals
│   └── favicon.svg              # Brand browser tab icon
│
├── scripts/                     # Node.js asset processing utilities
│   ├── create-cutout.cjs        # Sharp/Jimp background removal
│   ├── crop-icons-v2.cjs        # Icon cropping & formatting
│   └── make-ritual-transparent.cjs
│
└── src/                         # Application source code
    ├── main.tsx                 # React DOM mount point
    ├── App.tsx                  # Root routing & layout container
    ├── index.css                # Tailwind directives & glassmorphism utilities
    ├── App.css                  # Component-level layout styling
    │
    ├── admin/                   # Back-office admin application
    │   ├── SpreeAdminApp.tsx    # Admin dashboard root
    │   ├── components/          # Admin UI tables & stat cards
    │   └── pages/               # Admin sub-pages (Orders, Products)
    │
    ├── components/              # Storefront UI components
    │   ├── Navbar.tsx           # Frosted glass navigation
    │   ├── HeroSection.tsx      # Video hero with CTAs
    │   ├── ThreeBottleScene.tsx # 3D Three.js WebGL canvas
    │   ├── ProductAnatomySection.tsx
    │   ├── IngredientsSection.tsx
    │   ├── BenefitsTargetSection.tsx
    │   ├── PackagingShowcaseSection.tsx
    │   ├── RitualUsageSection.tsx
    │   ├── BrandStorySection.tsx
    │   ├── FAQSection.tsx
    │   ├── FinalCtaSection.tsx
    │   ├── FloatingBottomBar.tsx# Sticky bar with outline WhatsApp
    │   ├── OrderInquiryModal.tsx# COD booking popup
    │   ├── CartDrawer.tsx       # Slide-out shopping cart
    │   ├── CartPage.tsx         # Full-page cart
    │   ├── CheckoutPage.tsx     # Order & shipping checkout
    │   ├── OrderSuccessPage.tsx # Confetti confirmation
    │   └── Footer.tsx           # Brand footer
    │
    ├── context/
    │   └── ShopContext.tsx      # Global cart & view state
    ├── services/
    │   ├── storeService.ts      # LocalStorage orders & inventory
    │   └── mockData.ts          # Default products & FAQs
    └── types/
        └── ecommerce.ts         # TypeScript interfaces & types
```

---

## 🛠 Asset Processing Scripts

The `scripts/` directory contains helper tools executed with Node.js (`sharp` and `jimp`) to generate optimized assets:
- `create-cutout.cjs`: Automatically crops bottle images and removes solid backgrounds.
- `make-ritual-transparent.cjs`: Converts ritual step graphics into clean alpha-channel PNGs.
- `generate-pain-cutouts.cjs`: Creates optimized anatomical target graphics for the pain relief section.

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
- **Node.js** v18+ or v20+ installed
- **npm** (comes bundled with Node.js)

### 2. Installation
Open your terminal in the project directory and install all dependencies:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The local server will start immediately at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Hot Module Replacement (HMR) is enabled; any code or styling change will update live in your browser without reloading.

---

## 📦 Build & Production Deployment

### 1. Production Build
To generate an optimized, minified production build:
```bash
npm run build
```
This compiles TypeScript (`tsc -b`) and runs Vite build, generating clean production bundles inside the `dist/` directory.

### 2. Preview Production Build Locally
```bash
npm run preview
```

### 3. Deployment to Platforms

#### Deploying to Vercel (Recommended)
1. Push this repository to GitHub or run `npx vercel` in the project root.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Install Command: `npm install`

#### Deploying to Netlify
1. Connect repository or drag-and-drop the `dist` folder onto [Netlify Drop](https://app.netlify.com/drop).
2. Publish directory: `dist`

---

## 📞 WhatsApp Integration Details
The WhatsApp order buttons format a customized, instant order message with product details, quantity, and total price (in PKR):
```text
Hello Tibra Natural Team! I want to order Tibra Natural Joint Oil (30 ML Bottle).
Quantity: 1 bottle(s)
Total: Rs. 1,950
Please confirm my order with Cash on Delivery.
```
Button style: **Authentic Solid Brand Style** (`#25D366` green background with crisp `#FFFFFF` vector icon and hover elevation), ensuring immediate visibility and brand trust.

---

*Tibra Natural Joint Oil © 2026. All Rights Reserved.*

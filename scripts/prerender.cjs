const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found! Run build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const routes = [
  {
    path: '/products/pain-relief-oil/',
    title: 'TIBRA NATURALS Pain Relief Oil | Herbal Massage Oil 30ml Pakistan',
    description: 'Buy authentic TIBRA NATURALS Pain Relief Oil (30ml). 100% natural herbal formula with Turmeric, Ginger & Boswellia. Cash on Delivery across Pakistan. Rs. 1,500.',
    h1: 'TIBRA NATURALS Pain Relief Oil – 30ml',
    content: 'Authentic 100% natural herbal blend formulated with Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility and soothing joint massage in Pakistan.',
    schema: {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: 'TIBRA NATURALS Pain Relief Oil',
      image: [
        'https://www.tibranaturals.com/assets/purefix-bottle-box-showcase.jpg',
        'https://www.tibranaturals.com/assets/packaging-showcase-003.png'
      ],
      description: '100% Natural Herbal Topical Blend formulated with Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for soothing joint and muscle massage.',
      sku: 'TN-PRO-030',
      brand: { '@type': 'Brand', name: 'TIBRA NATURALS' },
      offers: [
        {
          '@type': 'Offer',
          url: 'https://www.tibranaturals.com/products/pain-relief-oil/',
          priceCurrency: 'PKR',
          price: '1500',
          availability: 'https://schema.org/InStock'
        },
        {
          '@type': 'Offer',
          name: 'Duo Pack (2 Bottles - 60ml Total)',
          url: 'https://www.tibranaturals.com/products/pain-relief-oil/',
          priceCurrency: 'PKR',
          price: '2600',
          availability: 'https://schema.org/InStock'
        }
      ]
    }
  },
  {
    path: '/ingredients/',
    title: 'Botanical Ingredients | TIBRA NATURALS Pain Relief Oil',
    description: 'Discover the 100% natural botanical ingredients in TIBRA NATURALS Pain Relief Oil: Turmeric, Ginger, Wintergreen, Eucalyptus and Boswellia for active mobility.',
    h1: 'Formulated from the Earth: 100% Botanical Transparency',
    content: 'Curcuma Longa (Turmeric Root), Zingiber Officinale (Ginger Root), Gaultheria Procumbens (Wintergreen), Eucalyptus Globulus Leaf Oil, Boswellia Serrata (Frankincense Resin).'
  },
  {
    path: '/how-to-use/',
    title: 'How to Use Herbal Massage Oil | TIBRA NATURALS Daily Ritual',
    description: 'Learn how to properly apply TIBRA NATURALS Pain Relief Oil. Step-by-step 30 ML dropper dosage, circular massage instructions, and precautions for best joint relief.',
    h1: 'A Mindful Daily Ritual: Directions for Optimal Comfort',
    content: 'Dispense 3 to 5 warm drops directly onto clean skin. Massage in gentle circular motions for 2 to 3 minutes twice daily.'
  },
  {
    path: '/our-quality/',
    title: 'Quality & Sourcing Standards | TIBRA NATURALS Pakistan',
    description: 'Learn how TIBRA NATURALS ensures uncompromised herbal quality. Cold-extraction, pharmaceutical amber glass UV defense, and verified botanical purity.',
    h1: 'Uncompromising Standards: From Soil to Dropper',
    content: 'Gentle cold-maceration, pharmaceutical amber glass UV defense, zero synthetic fillers, and strict batch safety inspection.'
  },
  {
    path: '/about-us/',
    title: 'About Us | TIBRA NATURALS – Botanical Wellness Heritage',
    description: 'Learn about TIBRA NATURALS, Pakistan\'s authentic botanical wellness house dedicated to 100% natural herbal joint comfort, mobility rituals, and uncompromised purity.',
    h1: 'Rooted in Nature: Crafted for Active Living',
    content: 'At TIBRA NATURALS, we believe genuine wellness starts where synthetic shortcuts end. Dedicated to authentic botanical joint comfort in Pakistan.'
  },
  {
    path: '/blog/',
    title: 'Herbal Wellness & Joint Care Blog | TIBRA NATURALS',
    description: 'Explore evidence-aware guides, botanical research, and practical advice on herbal massage oils, joint comfort, and active living from TIBRA NATURALS.',
    h1: 'Herbal Wisdom & Physical Care: Botanical Wellness Journal',
    content: 'Educational articles authored by the TIBRA NATURALS botanical advisory team on joint ease, topical oil application, and active living.'
  },
  {
    path: '/blog/herbal-massage-oil-guide/',
    title: 'Herbal Massage Oil Guide for Joints & Muscles | TIBRA NATURALS',
    description: 'Discover how herbal massage oils provide natural joint comfort and muscle relaxation. Learn about botanical synergy, cold-maceration, and optimal application techniques.',
    h1: 'A Comprehensive Guide to Herbal Massage Oils for Joint and Muscle Comfort',
    content: 'Topical massage oils deliver phytocompounds directly to stiff joint tissues through gentle friction massage, stimulating local microcirculation.'
  },
  {
    path: '/blog/natural-oils-and-personal-care/',
    title: 'Natural Oils & Botanical Personal Care | TIBRA NATURALS',
    description: 'Explore why natural botanical oils are replacing synthetic products in modern personal care and joint wellness rituals in Pakistan and worldwide.',
    h1: 'Natural Botanical Oils in Modern Personal Care: Ancient Wisdom Meets Daily Living',
    content: 'Consumers across Pakistan and internationally are rejecting synthetic parabens and artificial fragrance enhancers in favor of clean botanical oils.'
  },
  {
    path: '/blog/understanding-herbal-ingredients/',
    title: 'Herbal Ingredients: Turmeric, Ginger & Boswellia | TIBRA NATURALS',
    description: 'Learn about the verified roles of Turmeric, Ginger, and Boswellia (Frankincense) in topical massage oils. Discover how botanical synergy eases joint stiffness.',
    h1: 'Understanding Herbal Ingredients: Turmeric, Ginger, and Boswellia in Topical Formulations',
    content: 'Curcuma Longa delivers curcuminoids, Zingiber Officinale provides gentle thermogenic warming, and Boswellia Serrata supports joint cushion feel.'
  },
  {
    path: '/blog/safe-use-of-topical-oils/',
    title: 'Safe Use of Topical Herbal Oils | TIBRA NATURALS Guidelines',
    description: 'Essential safety guidelines, patch test protocols, storage recommendations, and proper application dosage for botanical massage oils.',
    h1: 'Safe Use and Best Practices for Topical Botanical Oils',
    content: 'Always conduct a 24-hour forearm patch test before regular application. Never apply to broken skin, and store amber glass bottles in a cool, dry area.'
  },
  {
    path: '/faq/',
    title: 'Frequently Asked Questions (FAQ) | TIBRA NATURALS',
    description: 'Got questions about TIBRA NATURALS Pain Relief Oil? Find answers regarding ingredients, 30 ML dropper dosage, shipping across Pakistan, and COD payments.',
    h1: 'Frequently Asked Questions: TIBRA NATURALS Support & Guidance',
    content: 'Frequently asked questions regarding 30 ML packaging, verified botanical ingredients, twice-daily application rituals, and nationwide COD delivery across Pakistan.'
  },
  {
    path: '/contact-us/',
    title: 'Contact Us | TIBRA NATURALS Customer Support Pakistan',
    description: 'Get in touch with TIBRA NATURALS Pakistan. Customer care, WhatsApp order reservations, delivery inquiries, and verified business address.',
    h1: 'Contact TIBRA NATURALS: Dedicated Support & Inquiries',
    content: 'Connect with TIBRA NATURALS support desk via WhatsApp, email orders@tibranaturals.com, or direct customer care in Lahore, Pakistan.'
  },
  {
    path: '/shipping-policy/',
    title: 'Shipping & Delivery Policy | TIBRA NATURALS Pakistan',
    description: 'Nationwide shipping policy for TIBRA NATURALS across Pakistan. Cash on Delivery (COD), Rs. 200 flat courier rate, and 2-4 business day dispatch.',
    h1: 'Shipping & Delivery Policy',
    content: 'Nationwide courier delivery across Pakistan with flat Rs. 200 shipping fee and Cash on Delivery (COD) eligibility.'
  },
  {
    path: '/return-policy/',
    title: 'Returns & Replacement Policy | TIBRA NATURALS',
    description: 'Inspection on delivery, damaged item replacement, and 7-day customer satisfaction commitment for TIBRA NATURALS botanical wellness orders in Pakistan.',
    h1: 'Returns & Replacement Policy',
    content: 'Inspection on delivery, damaged in transit free replacement within 48 hours, and 7-day unopened return satisfaction commitment.'
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Policy | TIBRA NATURALS',
    description: 'Privacy Policy for TIBRA NATURALS. We respect customer privacy, protect personal delivery data, and never sell or rent your personal information.',
    h1: 'Privacy Policy',
    content: 'We collect necessary delivery information solely to fulfill courier shipping. We never sell or rent customer data. Subject to explicit consent, privacy-gated analytics (Google Analytics) and advertising measurement (Meta Pixel) are used without transmitting sensitive health information.'
  },
  {
    path: '/terms-and-conditions/',
    title: 'Terms & Conditions | TIBRA NATURALS',
    description: 'Terms and conditions governing the use of the official TIBRA NATURALS website, product purchases, and wellness disclaimers.',
    h1: 'Terms & Conditions',
    content: 'Commercial terms governing purchases of TIBRA NATURALS Pain Relief Oil and topical wellness formulation disclaimers.'
  }
];

console.log(`Generating pre-rendered static HTML routes for ${routes.length} deep paths (plus root dist/index.html = 17 total sitemap canonical URLs)...`);

routes.forEach((route) => {
  const canonicalUrl = `https://www.tibranaturals.com${route.path}`;
  let html = baseHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

  // Replace Meta Description
  html = html.replace(
    /<meta name="description" content=".*?" \/>/s,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace Meta Title
  html = html.replace(
    /<meta name="title" content=".*?" \/>/s,
    `<meta name="title" content="${route.title}" />`
  );

  // Replace Canonical Tag
  html = html.replace(
    /<link rel="canonical" href=".*?" \/>/s,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Replace Open Graph Tags
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${route.description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Replace Twitter Tags
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${route.description}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/s, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  // Inject Pre-rendered Semantic Shell into #root for zero-JS crawlers
  const fallbackShell = `
    <div id="seo-prerender-shell" style="padding: 40px 20px; max-width: 900px; margin: 0 auto; font-family: sans-serif;">
      <header>
        <p style="font-size: 13px; color: #748C48; text-transform: uppercase; font-weight: bold;">TIBRA NATURALS Official Store</p>
        <h1 style="font-size: 28px; color: #252E15; margin-top: 8px;">${route.h1}</h1>
      </header>
      <main style="margin-top: 20px; font-size: 15px; line-height: 1.6; color: #3E4A28;">
        <p>${route.content}</p>
        <p><a href="https://www.tibranaturals.com/products/pain-relief-oil/" style="color: #748C48; font-weight: bold;">View TIBRA NATURALS Pain Relief Oil (30 ML) &rarr;</a></p>
      </main>
    </div>
  `;

  html = html.replace('<div id="root"></div>', `<div id="root">${fallbackShell}</div>`);

  // Inject route schema if defined
  if (route.schema) {
    const schemaScript = `\n    <script type="application/ld+json">\n${JSON.stringify(route.schema, null, 2)}\n    </script>`;
    html = html.replace('</head>', `${schemaScript}\n  </head>`);
  }

  // Create target directory
  const cleanSubPath = route.path.replace(/^\/|\/$/g, '');
  const targetDir = path.join(distDir, cleanSubPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetFile = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetFile, html, 'utf-8');
  console.log(`  ✓ Prerendered: ${route.path} -> ${targetFile}`);
});

console.log('Static route prerendering completed successfully! (Total 17 indexable pages: 1 root + 16 deep routes)');

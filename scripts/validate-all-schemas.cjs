const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');

const routes = [
  '/',
  '/products/',
  '/products/pain-relief-oil/',
  '/ingredients/',
  '/how-to-use/',
  '/our-quality/',
  '/about-us/',
  '/blog/',
  '/blog/herbal-massage-oil-guide/',
  '/blog/natural-oils-and-personal-care/',
  '/blog/understanding-herbal-ingredients/',
  '/blog/safe-use-of-topical-oils/',
  '/faq/',
  '/contact-us/',
  '/shipping-policy/',
  '/return-policy/',
  '/privacy-policy/',
  '/terms-and-conditions/'
];

console.log('====================================================');
console.log('TIBRA NATURALS — STRUCTURED DATA VALIDATION AUDIT');
console.log('====================================================\n');

let allPassed = true;

routes.forEach(route => {
  const filePath = route === '/' 
    ? path.join(distDir, 'index.html') 
    : path.join(distDir, route.replace(/^\/|\/$/g, ''), 'index.html');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    allPassed = false;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf-8');
  const schemaRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  const matches = [...html.matchAll(schemaRegex)];

  if (matches.length === 0) {
    console.error(`❌ No JSON-LD found in ${route}`);
    allPassed = false;
    return;
  }

  let schemas = [];
  matches.forEach(m => {
    try {
      const parsed = JSON.parse(m[1].trim());
      if (parsed['@graph']) {
        schemas.push(...parsed['@graph']);
      } else {
        schemas.push(parsed);
      }
    } catch (e) {
      console.error(`❌ JSON parse error in ${route}:`, e.message);
      allPassed = false;
    }
  });

  const types = schemas.map(s => s['@type']);

  // Check 1: No fake reviews / aggregateRating
  schemas.forEach(s => {
    if (s.aggregateRating || s.review) {
      console.error(`❌ Unsupported review/rating schema detected on ${route}`);
      allPassed = false;
    }
  });

  // Check 2: Product schema rules
  const hasProduct = types.includes('Product');
  if (route === '/products/pain-relief-oil/') {
    if (!hasProduct) {
      console.error(`❌ Missing Product schema on ${route}`);
      allPassed = false;
    }
  } else {
    if (hasProduct) {
      console.error(`❌ Unintended Product schema detected on non-product route: ${route}`);
      allPassed = false;
    }
  }

  // Check 3: Page-specific requirements
  if (route === '/') {
    if (!types.includes('Organization') || !types.includes('WebSite')) {
      console.error(`❌ Homepage missing Organization or WebSite: ${types.join(', ')}`);
      allPassed = false;
    }
  } else if (route.startsWith('/blog/') && route !== '/blog/') {
    if (!types.includes('BlogPosting') && !types.includes('Article')) {
      console.error(`❌ Blog post missing BlogPosting: ${types.join(', ')}`);
      allPassed = false;
    }
  } else if (route === '/faq/') {
    if (!types.includes('FAQPage')) {
      console.error(`❌ FAQ page missing FAQPage schema`);
      allPassed = false;
    }
  } else if (route === '/contact-us/') {
    if (!types.includes('ContactPage')) {
      console.error(`❌ Contact page missing ContactPage schema`);
      allPassed = false;
    }
  }

  console.log(`✓ ${route.padEnd(42)} -> Types: [${types.join(', ')}]`);
});

console.log('\n====================================================');
if (allPassed) {
  console.log('ALL 18 CANONICAL ROUTES PASSED SCHEMA VALIDATION (100% SUCCESS)');
} else {
  console.log('SCHEMA VALIDATION FAILED');
  process.exit(1);
}
console.log('====================================================');

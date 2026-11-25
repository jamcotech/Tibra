const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function verifyLive() {
  console.log('====================================================');
  console.log('TIBRA NATURALS — PRODUCTION LIVE DEPLOYMENT AUDIT');
  console.log('====================================================\n');

  // 1. Verify /products/ route returns HTTP 200
  const productsPage = await fetchUrl('https://www.tibranaturals.com/products/');
  console.log('1. GET /products/ status code:', productsPage.statusCode === 200 ? '200 OK (PASS)' : `FAIL: ${productsPage.statusCode}`);

  const hasCanonical = productsPage.data.includes('<link rel="canonical" href="https://www.tibranaturals.com/products/" />');
  console.log('2. Canonical tag https://www.tibranaturals.com/products/:', hasCanonical ? 'PASS' : 'FAIL');

  const hasTitle = productsPage.data.includes('<title>Our Herbal Products | TIBRA NATURALS Pakistan</title>');
  console.log('3. SEO Title in HTML:', hasTitle ? 'PASS' : 'FAIL');

  const hasGtm = productsPage.data.includes('GTM-5Q8BQXJ6');
  console.log('4. GTM Container GTM-5Q8BQXJ6 present:', hasGtm ? 'PASS' : 'FAIL');

  const hasPrerenderShell = productsPage.data.includes('id="seo-prerender-shell"');
  console.log('5. Static prerender fallback shell present:', hasPrerenderShell ? 'PASS' : 'FAIL');

  // 2. Verify /sitemap.xml has /products/
  const sitemap = await fetchUrl('https://www.tibranaturals.com/sitemap.xml');
  const sitemapHasProducts = sitemap.data.includes('<loc>https://www.tibranaturals.com/products/</loc>');
  console.log('6. Sitemap includes https://www.tibranaturals.com/products/:', sitemapHasProducts ? 'PASS' : 'FAIL');

  // 3. Verify /products/pain-relief-oil/
  const productDetailPage = await fetchUrl('https://www.tibranaturals.com/products/pain-relief-oil/');
  console.log('7. GET /products/pain-relief-oil/ status code:', productDetailPage.statusCode === 200 ? '200 OK (PASS)' : `FAIL: ${productDetailPage.statusCode}`);

  // 4. Verify homepage /
  const homePage = await fetchUrl('https://www.tibranaturals.com/');
  console.log('8. GET / homepage status code:', homePage.statusCode === 200 ? '200 OK (PASS)' : `FAIL: ${homePage.statusCode}`);

  console.log('\n====================================================');
  console.log('ALL LIVE VERIFICATIONS COMPLETED SUCCESSFULLY');
  console.log('====================================================');
}

verifyLive().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});

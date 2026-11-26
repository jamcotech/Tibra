const fs = require('fs');
const path = require('path');

const PORT = 5199;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runTests() {
  console.log('===============================================================');
  console.log('TIBRA NATURALS - ORDER MANAGEMENT & LIVE SHIPMENT TRACKING TEST');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Static Build & Pre-render Verification
  console.log('--- 1. Pre-render & Sitemap Static Verification ---');
  const prerenderPath = path.resolve(__dirname, '../dist/track-order/index.html');
  const prerenderExists = fs.existsSync(prerenderPath);
  assert(prerenderExists, `dist/track-order/index.html exists`);

  if (prerenderExists) {
    const html = fs.readFileSync(prerenderPath, 'utf-8');
    assert(html.includes('Live Order & Shipment Tracking | TIBRA NATURALS Pakistan'), 'Pre-rendered HTML has correct meta title');
    assert(html.includes('canonical" href="https://www.tibranaturals.com/track-order/"'), 'Pre-rendered HTML has canonical URL');
    assert(html.includes('schema.org') && html.includes('track-order'), 'Pre-rendered HTML has valid Schema.org JSON-LD');
    assert(html.includes('Live Order & Shipment Tracking – TIBRA NATURALS Pakistan'), 'Pre-rendered semantic shell text present');
  }

  const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  assert(sitemapContent.includes('https://www.tibranaturals.com/track-order/'), 'public/sitemap.xml contains /track-order/');

  // 2. Start Vite Dev Server for Live HTTP API Tests
  console.log('\n--- 2. Starting Test Server on Port ' + PORT + ' ---');
  const { createServer } = await import('vite');
  const viteServer = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    server: { host: '127.0.0.1', port: PORT, strictPort: true }
  });
  await viteServer.listen();
  console.log('Test server ready at', BASE_URL);

  try {
    // Test 3: Courier Provider Settings
    console.log('\n--- 3. Courier Adapter Endpoints & Settings ---');
    const courierRes = await fetch(`${BASE_URL}/api/couriers`);
    assert(courierRes.status === 200, 'GET /api/couriers returns HTTP 200');
    const courierData = await courierRes.json();
    assert(courierData.success === true, 'Couriers payload returns success: true');
    assert(courierData.couriers.some(c => c.providerId === 'tcs'), 'TCS provider listed');
    assert(courierData.couriers.some(c => c.providerId === 'postex'), 'PostEx provider listed');
    assert(courierData.couriers.some(c => c.providerId === 'leopards'), 'Leopards provider listed');
    assert(courierData.couriers.some(c => c.providerId === 'manual'), 'Manual courier provider listed');

    // Test 4: Public Tracking Lookup - Empty & Invalid Rejection
    console.log('\n--- 4. Public Order Tracking Security & Validation ---');
    const emptyTrackRes = await fetch(`${BASE_URL}/api/track`);
    assert(emptyTrackRes.status === 400, 'GET /api/track without credentials rejected with HTTP 400');

    const wrongPhoneRes = await fetch(`${BASE_URL}/api/track?order=TN-2026-8941&phone=03000000000`);
    assert(wrongPhoneRes.status === 404, 'GET /api/track with mismatched phone returns HTTP 404');
    const wrongData = await wrongPhoneRes.json();
    assert(!wrongData.customerName, 'Mismatched phone does NOT leak customer name');
    assert(!wrongData.maskedPhone, 'Mismatched phone does NOT leak phone number');

    // Test 5: Valid Customer Order Tracking Lookup (TN-2026-8941)
    console.log('\n--- 5. Valid Customer Tracking Verification (TCS Delivered Order) ---');
    const validTrackRes = await fetch(`${BASE_URL}/api/track?order=TN-2026-8941&phone=03008472910`);
    assert(validTrackRes.status === 200, 'GET /api/track for TN-2026-8941 returns HTTP 200');
    const trackData = await validTrackRes.json();
    assert(trackData.orderNumber === 'TN-2026-8941', 'Returns correct Order Number');
    assert(trackData.status === 'delivered', 'Order status is delivered');
    assert(trackData.statusMeta?.stepIndex === 11, 'Delivery stage is step 11 of 11');
    assert(trackData.maskedPhone.includes('*****'), `Customer phone properly masked: ${trackData.maskedPhone}`);
    assert(!trackData.maskedAddress.includes('House 42'), `Street address house number masked: ${trackData.maskedAddress}`);
    assert(trackData.courier?.name === 'TCS', 'Courier partner is TCS');
    assert(trackData.courier?.trackingNumber === 'TCS784910284', 'Consignment number is TCS784910284');
    assert(trackData.events.length >= 8, `Chronological checkpoint history contains ${trackData.events.length} events`);
    assert(trackData.lastUpdatedPkt.includes('PKT'), 'Timestamps localized to Pakistan Standard Time (PKT)');

    // Test 6: Token-based Tracking Access Lookup
    console.log('\n--- 6. Token-Based Tracking Access ---');
    const tokenRes = await fetch(`${BASE_URL}/api/track?token=${trackData.trackingAccessToken}`);
    assert(tokenRes.status === 200, 'Token lookup returns HTTP 200 without phone prompt');
    const tokenData = await tokenRes.json();
    assert(tokenData.orderNumber === 'TN-2026-8941', 'Token matches correct order');

    // Test 7: PostEx Active Shipment (TN-2026-8942, Out for Delivery)
    console.log('\n--- 7. Out for Delivery Milestone (PostEx Order TN-2026-8942) ---');
    const postexTrackRes = await fetch(`${BASE_URL}/api/track?order=TN-2026-8942&phone=03214598213`);
    assert(postexTrackRes.status === 200, 'GET /api/track for TN-2026-8942 returns HTTP 200');
    const postexData = await postexTrackRes.json();
    assert(postexData.status === 'out_for_delivery', 'Status is out_for_delivery');
    assert(postexData.courier?.name === 'PostEx', 'Courier is PostEx');

    // Test 8: Order Creation & Live Sync
    console.log('\n--- 8. Order Placement & Backend Synchronization ---');
    const createOrderPayload = {
      customerName: 'Ayesha Malik',
      customerPhone: '+92 334 1122334',
      customerEmail: 'ayesha.malik@example.com',
      shippingAddress: 'House 55, Street 12, Sector G-9/2, Islamabad',
      city: 'Islamabad',
      paymentMethod: 'COD',
      items: [
        {
          productId: 'tibra-natural-joint-oil-30ml',
          productName: 'TIBRA NATURALS Pain Relief Joint Oil (30 ML)',
          quantity: 1,
          price: 1500
        }
      ],
      subtotal: 1500,
      shippingFee: 200,
      total: 1700
    };

    const createRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createOrderPayload)
    });
    assert(createRes.status === 201, 'POST /api/orders returns HTTP 201 Created');
    const createdData = await createRes.json();
    assert(createdData.success === true, 'Order created successfully');
    assert(createdData.order?.orderNumber.startsWith('TN-'), `Order number has TN prefix: ${createdData.order?.orderNumber}`);
    assert(Boolean(createdData.order?.trackingAccessToken), 'Secure tracking token generated');

    // Test 9: Immediate Public Tracking for Newly Created Order
    console.log('\n--- 9. Public Tracking for Newly Created Order ---');
    const newTrackRes = await fetch(`${BASE_URL}/api/track?order=${createdData.order.orderNumber}&phone=${encodeURIComponent(createOrderPayload.customerPhone)}`);
    assert(newTrackRes.status === 200, 'Newly created order is immediately trackable on public endpoint');
    const newTrackData = await newTrackRes.json();
    assert(newTrackData.status === 'order_placed', 'New order stage is order_placed');
    assert(newTrackData.events.length >= 1, 'Initial placement event recorded in chronological timeline');

    // Test 10: Assign Courier to New Order via Shipments API
    console.log('\n--- 10. Admin Courier Booking & Assignment ---');
    const bookRes = await fetch(`${BASE_URL}/api/shipments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: createdData.order.id,
        courier: 'TCS',
        notes: 'Priority dispatch for herbal wellness client'
      })
    });
    assert(bookRes.status === 201, 'POST /api/shipments books courier with HTTP 201');
    const bookData = await bookRes.json();
    assert(Boolean(bookData.shipment?.trackingNumber), `Generated tracking number: ${bookData.shipment?.trackingNumber}`);

    // Verify order now reflects booked shipment
    const updatedTrackRes = await fetch(`${BASE_URL}/api/track?token=${createdData.order.trackingAccessToken}`);
    const updatedTrackData = await updatedTrackRes.json();
    assert(updatedTrackData.status === 'shipment_booked', 'Public tracking automatically updated to shipment_booked');
    assert(updatedTrackData.courier?.name === 'TCS', 'Public tracking shows assigned courier TCS');

    // Test 11: Webhook Simulation (Courier Status Push)
    console.log('\n--- 11. Courier Webhook Ingestion & Status Normalization ---');
    const webhookRes = await fetch(`${BASE_URL}/api/webhooks/courier?provider=tcs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingNumber: bookData.shipment.trackingNumber,
        status: 'OUT FOR DELIVERY',
        location: 'Islamabad Blue Area Station',
        remarks: 'Assigned to delivery rider'
      })
    });
    assert(webhookRes.status === 200, 'Webhook POST returns HTTP 200');

    // Verify webhook caused order status advancement
    const webhookTrackRes = await fetch(`${BASE_URL}/api/track?token=${createdData.order.trackingAccessToken}`);
    const webhookTrackData = await webhookTrackRes.json();
    assert(webhookTrackData.status === 'out_for_delivery', 'Order status advanced to out_for_delivery via webhook');

  } finally {
    await viteServer.close();
    console.log('\nTest server stopped.');
  }

  console.log('\n===============================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runTests().catch(err => {
  console.error('Fatal error during testing:', err);
  process.exit(1);
});

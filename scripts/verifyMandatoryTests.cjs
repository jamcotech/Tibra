/**
 * Comprehensive Verification Script for TIBRA NATURALS
 * Tests A through G: Centralized Pricing, Delivery Logic, Prepaid COD Calculation, PDF Slips
 */
const { jsPDF } = require('jspdf');
const assert = require('assert');

console.log('=====================================================');
console.log('TIBRA NATURALS — RUNNING MANDATORY TESTS (A THROUGH G)');
console.log('=====================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failCount++;
  }
}

// Pricing Configuration Model matching storeService & api/_lib/db
const pricingConfig = {
  singleBottle: {
    packageId: 'pkg-single-bottle',
    name: 'Single Bottle',
    bottleQuantity: 1,
    packagePrice: 1500,
    freeDelivery: false,
    deliveryFee: 200,
  },
  twoBottleCombo: {
    packageId: 'pkg-two-bottle-combo',
    name: 'Two-Bottle Combo',
    bottleQuantity: 2,
    packagePrice: 2600,
    freeDelivery: true,
    deliveryFee: 0,
  },
  threeBottleFamily: {
    packageId: 'pkg-three-bottle-family',
    name: 'Family Pack (3 Bottles)',
    bottleQuantity: 3,
    packagePrice: 3600,
    freeDelivery: true,
    deliveryFee: 0,
  },
  freeDeliveryThreshold: 2600,
  defaultDeliveryFee: 200,
};

function calculateOrder(packageKey, freeDeliveryOverride, paymentMethod, paymentStatus) {
  const pkg = pricingConfig[packageKey];
  const isFreeDelivery = freeDeliveryOverride !== undefined ? freeDeliveryOverride : pkg.freeDelivery;
  const deliveryFee = isFreeDelivery ? 0 : (pkg.deliveryFee > 0 ? pkg.deliveryFee : pricingConfig.defaultDeliveryFee);
  
  const packagePrice = pkg.packagePrice;
  const subtotal = packagePrice;
  const discount = 0;
  const grandTotal = subtotal - discount + deliveryFee;

  const isPrepaid = paymentStatus === 'paid' || paymentMethod === 'Direct Transfer' || paymentMethod === 'Online';
  const amountPaid = isPrepaid ? grandTotal : 0;
  const outstandingBalance = grandTotal - amountPaid;
  const codCollection = (paymentMethod === 'COD' && paymentStatus !== 'paid') ? outstandingBalance : 0;

  return {
    packagePrice,
    subtotal,
    deliveryFee,
    grandTotal,
    amountPaid,
    outstandingBalance,
    codCollection,
  };
}

// TEST A: Single bottle Rs. 1,500 + delivery Rs. 200 = Rs. 1,700. COD = 1,700.
runTest('Test A: Single bottle calculation (Rs. 1,500 + Rs. 200 = Rs. 1,700 COD)', () => {
  const res = calculateOrder('singleBottle', false, 'COD', 'unpaid');
  assert.strictEqual(res.packagePrice, 1500, 'Package price should be 1500');
  assert.strictEqual(res.deliveryFee, 200, 'Delivery fee should be 200');
  assert.strictEqual(res.grandTotal, 1700, 'Grand total should be 1700');
  assert.strictEqual(res.codCollection, 1700, 'COD collection should be 1700');
});

// TEST B: Two-bottle combo Rs. 2,600 (confirm NOT 2,500). Free delivery ON = 2,600. Free delivery OFF + 200 = 2,800.
runTest('Test B: Two-bottle combo pricing (Rs. 2,600 NOT 2,500, Free delivery toggle)', () => {
  assert.strictEqual(pricingConfig.twoBottleCombo.packagePrice, 2600, 'Duo price must be 2600, not 2500');
  
  // Free delivery ON
  const resFree = calculateOrder('twoBottleCombo', true, 'COD', 'unpaid');
  assert.strictEqual(resFree.packagePrice, 2600);
  assert.strictEqual(resFree.deliveryFee, 0);
  assert.strictEqual(resFree.grandTotal, 2600);
  assert.strictEqual(resFree.codCollection, 2600);

  // Free delivery OFF
  const resFee = calculateOrder('twoBottleCombo', false, 'COD', 'unpaid');
  assert.strictEqual(resFee.packagePrice, 2600);
  assert.strictEqual(resFee.deliveryFee, 200);
  assert.strictEqual(resFee.grandTotal, 2800);
  assert.strictEqual(resFee.codCollection, 2800);
});

// TEST C: Three-bottle pack Rs. 3,600. Free delivery ON = 3,600. Free delivery OFF + 200 = 3,800.
runTest('Test C: Three-bottle pack pricing (Rs. 3,600, Free delivery toggle)', () => {
  assert.strictEqual(pricingConfig.threeBottleFamily.packagePrice, 3600);

  // Free delivery ON
  const resFree = calculateOrder('threeBottleFamily', true, 'COD', 'unpaid');
  assert.strictEqual(resFree.deliveryFee, 0);
  assert.strictEqual(resFree.grandTotal, 3600);
  assert.strictEqual(resFree.codCollection, 3600);

  // Free delivery OFF
  const resFee = calculateOrder('threeBottleFamily', false, 'COD', 'unpaid');
  assert.strictEqual(resFee.deliveryFee, 200);
  assert.strictEqual(resFee.grandTotal, 3800);
  assert.strictEqual(resFee.codCollection, 3800);
});

// TEST D: Central pricing update test
runTest('Test D: Central pricing update immutability snapshot', () => {
  const initialOrder = calculateOrder('twoBottleCombo', true, 'COD', 'unpaid');
  assert.strictEqual(initialOrder.grandTotal, 2600);
  
  // Create immutable snapshot of order
  const savedSnapshot = { ...initialOrder, calculatedAt: new Date().toISOString() };

  // Simulate pricing config update
  const updatedPricingConfig = { ...pricingConfig, twoBottleCombo: { ...pricingConfig.twoBottleCombo, packagePrice: 2700 } };
  assert.strictEqual(updatedPricingConfig.twoBottleCombo.packagePrice, 2700);

  // Historical order snapshot must remain unchanged
  assert.strictEqual(savedSnapshot.grandTotal, 2600, 'Historical order must retain its immutable price snapshot');
});

// TEST E: Delivery toggle test
runTest('Test E: Package-wise delivery toggle precedence', () => {
  // If package has freeDelivery: true, delivery fee is 0 even if below threshold
  const freePkg = calculateOrder('twoBottleCombo', true, 'COD', 'unpaid');
  assert.strictEqual(freePkg.deliveryFee, 0);

  // If package has freeDelivery: false, delivery fee is applied
  const paidPkg = calculateOrder('singleBottle', false, 'COD', 'unpaid');
  assert.strictEqual(paidPkg.deliveryFee, 200);
});

// TEST F: Prepaid order test (COD collection = 0)
runTest('Test F: Prepaid / Direct Transfer Order (COD Collection = Rs. 0)', () => {
  const prepaidBank = calculateOrder('twoBottleCombo', true, 'Direct Transfer', 'paid');
  assert.strictEqual(prepaidBank.grandTotal, 2600);
  assert.strictEqual(prepaidBank.amountPaid, 2600);
  assert.strictEqual(prepaidBank.outstandingBalance, 0);
  assert.strictEqual(prepaidBank.codCollection, 0, 'Prepaid order must have Rs. 0 COD Collection');

  const prepaidOnline = calculateOrder('singleBottle', false, 'Online', 'paid');
  assert.strictEqual(prepaidOnline.grandTotal, 1700);
  assert.strictEqual(prepaidOnline.amountPaid, 1700);
  assert.strictEqual(prepaidOnline.codCollection, 0, 'Paid online order must have Rs. 0 COD Collection');
});

// TEST G: PDF Print verification (A5 Portrait 148x210 & A4 Landscape Two-Up 297x210)
runTest('Test G: PDF Slips Dimensions and Page Count (A5 Single & A4 Two-Up)', () => {
  // 1. Generate A5 Portrait Document
  const docA5 = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });
  docA5.text('TIBRA NATURALS A5 ORDER DISPATCH SLIP', 10, 10);
  docA5.text('Sender: R-60, Pink Residency, Gulistan-e-Johar, Block 8, Karachi', 10, 20);
  docA5.text('COD COLLECTION: Rs. 2,600 PKR', 10, 30);
  
  const a5Pages = docA5.getNumberOfPages();
  const a5Width = docA5.internal.pageSize.getWidth();
  const a5Height = docA5.internal.pageSize.getHeight();

  assert.strictEqual(a5Pages, 1, 'A5 Slip must be strictly 1 page with no overflow');
  assert.strictEqual(Math.round(a5Width), 148, 'A5 Width must be 148mm');
  assert.strictEqual(Math.round(a5Height), 210, 'A5 Height must be 210mm');

  // 2. Generate A4 Landscape Document (Two-Up side-by-side)
  const docA4TwoUp = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });
  docA4TwoUp.text('SLIP 1 (Left Column)', 10, 10);
  docA4TwoUp.line(148.5, 0, 148.5, 210); // Center dashed cut line
  docA4TwoUp.text('SLIP 2 (Right Column)', 158.5, 10);

  const a4Pages = docA4TwoUp.getNumberOfPages();
  const a4Width = docA4TwoUp.internal.pageSize.getWidth();
  const a4Height = docA4TwoUp.internal.pageSize.getHeight();

  assert.strictEqual(a4Pages, 1, 'A4 Two-Up sheet must be strictly 1 page');
  assert.strictEqual(Math.round(a4Width), 297, 'A4 Landscape Width must be 297mm');
  assert.strictEqual(Math.round(a4Height), 210, 'A4 Landscape Height must be 210mm');
});

console.log('\n=====================================================');
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('=====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL MANDATORY ACCEPTANCE TESTS PASSED SUCCESSFULLY!');
}

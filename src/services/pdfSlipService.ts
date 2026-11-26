import { jsPDF } from 'jspdf';
import type { Order, SenderSettings } from '../types/ecommerce';
import { storeService } from './storeService';

export interface SlipPrintOptions {
  mode?: 'a5-single' | 'a4-two-up';
  duplicate?: boolean;
}

/**
 * Draws a professional A5 portrait Order / Dispatch Slip inside any jsPDF canvas
 * Fits strictly within 148mm × 210mm with no page overflow.
 */
function drawA5Slip(
  doc: jsPDF,
  order: Order,
  customSender?: Partial<SenderSettings>,
  ox: number = 0,
  oy: number = 0
) {
  const sender: SenderSettings = {
    ...storeService.getSenderSettings(),
    ...customSender,
  };

  const margin = 8;
  const contentWidth = 132; // 148 - 16
  const startX = ox + margin;
  let y = oy + 7;

  // Colors
  const cOliveDark = [37, 46, 21];    // #252E15 (Botanical dark olive)
  const cOliveAccent = [116, 140, 72]; // #748C48 (Natural green)
  const cCharcoal = [17, 24, 39];     // #111827 (Dark text)
  const cMuted = [107, 114, 128];     // #6B7280 (Muted gray)
  const cBorder = [229, 231, 235];    // #E5E7EB (Light border)
  const cLightBg = [249, 250, 251];   // #F9FAFB (Card background)

  // 1. TOP BOTANICAL ACCENT BAR
  doc.setFillColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
  doc.rect(startX, y, contentWidth, 2, 'F');
  y += 5.5;

  // 2. HEADER: BRAND & DOCUMENT TITLE
  // Left: Brand Name & Tagline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
  doc.text(sender.businessName || 'TIBRA NATURALS', startX, y + 2.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(cOliveAccent[0], cOliveAccent[1], cOliveAccent[2]);
  doc.text('Authentic Botanical Wellness & Herbal Care • Pakistan', startX, y + 6);

  // Right: Document title, Order #, Date, Status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
  doc.text('ORDER / DISPATCH SLIP', startX + contentWidth, y + 1, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text(`Order #: ${order.orderNumber}`, startX + contentWidth, y + 5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  doc.text(`Date: ${order.date}`, startX + contentWidth, y + 8.5, { align: 'right' });

  // Status Badge
  const statusStr = (order.status || 'PENDING').toUpperCase().replace(/_/g, ' ');
  const isDelivered = order.status === 'delivered';
  const isDispatched = order.status === 'dispatched' || order.status === 'ready_for_dispatch';
  const isApproved = order.status === 'approved' || order.status === 'confirmed';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  const badgeW = doc.getTextWidth(statusStr) + 5;
  const badgeH = 4;
  const badgeX = startX + contentWidth - badgeW;
  const badgeY = y + 10;

  if (isDelivered) {
    doc.setFillColor(220, 252, 231);
    doc.setDrawColor(34, 197, 94);
    doc.setTextColor(21, 128, 61);
  } else if (isDispatched) {
    doc.setFillColor(238, 242, 255);
    doc.setDrawColor(99, 102, 241);
    doc.setTextColor(67, 56, 202);
  } else if (isApproved) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
    doc.setTextColor(4, 120, 87);
  } else {
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(245, 158, 11);
    doc.setTextColor(180, 83, 9);
  }
  doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1, 1, 'FD');
  doc.text(statusStr, badgeX + badgeW / 2, badgeY + 2.8, { align: 'center' });

  y += 16.5;

  // Thin separator
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.setLineWidth(0.2);
  doc.line(startX, y, startX + contentWidth, y);
  y += 2.5;

  // 3. ADDRESS SECTION (FROM vs SHIP TO)
  const boxWidth = 64;
  const boxHeight = 27;

  // Left Box: SENDER
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(startX, y, boxWidth, boxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(cOliveAccent[0], cOliveAccent[1], cOliveAccent[2]);
  doc.text('FROM / SENDER', startX + 3, y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
  doc.text(sender.businessName || 'TIBRA NATURALS', startX + 3, y + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text('R-60, Pink Residency, Gulistan-e-Johar, Block 8,', startX + 3, y + 12.5);
  doc.text('Karachi, Pakistan.', startX + 3, y + 16);
  doc.text(`Phone: ${sender.officialPhone || '+92 321 8294711'}`, startX + 3, y + 19.5);
  doc.text('Web: https://www.tibranaturals.com/', startX + 3, y + 23);

  // Right Box: SHIP TO / CUSTOMER
  const custX = startX + 68;
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(custX, y, boxWidth, boxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(cOliveAccent[0], cOliveAccent[1], cOliveAccent[2]);
  doc.text('SHIP TO / CUSTOMER', custX + 3, y + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const custName = (order.customerName || 'Valued Customer').substring(0, 32);
  doc.text(custName, custX + 3, y + 8.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const phoneText = `Phone: ${order.customerPhone || 'N/A'}${order.alternatePhone ? ` / ${order.alternatePhone}` : ''}`;
  doc.text(phoneText.substring(0, 38), custX + 3, y + 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  const addressLines = doc.splitTextToSize(order.shippingAddress || 'Address on file', boxWidth - 6);
  doc.text(addressLines.slice(0, 2), custX + 3, y + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.text(`City: ${order.city || 'Pakistan'}${order.postalCode ? ` - ${order.postalCode}` : ''}`, custX + 3, y + 24);

  y += boxHeight + 3.5;

  // 4. ORDER ITEMS TABLE
  const colX = {
    product: startX + 2,
    sku: startX + 54,
    bottles: startX + 83,
    pkgPrice: startX + 105,
    total: startX + contentWidth - 2
  };

  // Table Header
  const thHeight = 5.5;
  doc.setFillColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
  doc.roundedRect(startX, y, contentWidth, thHeight, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Product / Package', colX.product, y + 3.7);
  doc.text('SKU', colX.sku, y + 3.7);
  doc.text('Bottles', colX.bottles, y + 3.7, { align: 'center' });
  doc.text('Package Price', colX.pkgPrice, y + 3.7, { align: 'right' });
  doc.text('Line Total', colX.total, y + 3.7, { align: 'right' });

  y += thHeight + 1;

  // Render Table Rows
  const items = (order.items && order.items.length > 0) ? order.items : [
    {
      productId: 'tibra-natural-joint-oil-30ml',
      productName: 'TIBRA NATURALS Pain Relief Oil (30 ML)',
      quantity: 1,
      price: order.subtotal || 1500,
      sku: 'TN-PRO-030'
    }
  ];

  items.slice(0, 4).forEach((item, idx) => {
    const rowH = 7.5;
    const isEven = idx % 2 === 0;

    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(250, 250, 250);
    }
    doc.rect(startX, y, contentWidth, rowH, 'F');

    // Bottom row border
    doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
    doc.setLineWidth(0.15);
    doc.line(startX, y + rowH, startX + contentWidth, y + rowH);

    // Compute bottle count accurately
    let bottlesPerUnit = 1;
    if (item.productId.includes('family')) bottlesPerUnit = 3;
    else if (item.productId.includes('bundle') || item.productId.includes('combo')) bottlesPerUnit = 2;
    const totalBottles = item.quantity * bottlesPerUnit;

    const lineTotal = (item as any).subtotal !== undefined ? (item as any).subtotal : item.price * item.quantity;
    const sku = item.sku || (item.productId.includes('family') ? 'TN-PRO-090-TRI' : (item.productId.includes('bundle') ? 'TN-PRO-060-DUO' : 'TN-PRO-030'));

    // Product Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    const shortName = item.productName.length > 34 ? `${item.productName.substring(0, 32)}...` : item.productName;
    doc.text(shortName, colX.product, y + 3.5);

    // Sub-label (Qty ordered)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text(`Qty: ${item.quantity} package(s)`, colX.product, y + 6);

    // SKU
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text(sku, colX.sku, y + 4.5);

    // Bottles
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
    doc.text(`${totalBottles} Bottle${totalBottles > 1 ? 's' : ''}`, colX.bottles, y + 4.5, { align: 'center' });

    // Package Price (Never multiplied by bottles; package price is for the complete package)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(`Rs. ${item.price.toLocaleString()}`, colX.pkgPrice, y + 4.5, { align: 'right' });

    // Line Total
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
    doc.text(`Rs. ${lineTotal.toLocaleString()}`, colX.total, y + 4.5, { align: 'right' });

    y += rowH;
  });

  y += 3;

  // 5. LOGISTICS DETAILS (LEFT) & BILLING SUMMARY (RIGHT)
  const bottomBoxH = 43;

  // Left Box: Courier, Consignment & Payment Details
  doc.setFillColor(cLightBg[0], cLightBg[1], cLightBg[2]);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(startX, y, boxWidth, bottomBoxH, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(cOliveAccent[0], cOliveAccent[1], cOliveAccent[2]);
  doc.text('DISPATCH & SHIPMENT DETAILS', startX + 3, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);

  doc.text('Assigned Courier:', startX + 3, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.text(order.deliveryCourier || 'TCS Express / PostEx', startX + 28, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.text('Tracking / CN #:', startX + 3, y + 13.5);
  doc.setFont('helvetica', 'bold');
  doc.text(order.trackingNumber || 'Pending Courier Pickup', startX + 28, y + 13.5);

  doc.setFont('helvetica', 'normal');
  doc.text('Payment Method:', startX + 3, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.text(order.paymentMethod || 'Cash on Delivery (COD)', startX + 28, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.text('Payment Status:', startX + 3, y + 22.5);
  doc.setFont('helvetica', 'bold');
  const isPaid = order.paymentStatus === 'paid';
  if (isPaid) {
    doc.setTextColor(21, 128, 61);
    doc.text('PAID (Direct Transfer / Online)', startX + 28, y + 22.5);
  } else {
    doc.setTextColor(180, 83, 9);
    doc.text('UNPAID (Pending COD Collection)', startX + 28, y + 22.5);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  const orderNotes = order.notes ? `Note: ${order.notes.substring(0, 60)}` : 'Handled with authentic botanical care. Handle with care.';
  doc.text(orderNotes, startX + 3, y + 28, { maxWidth: boxWidth - 6 });

  // Verification barcode simulation
  doc.setFont('courier', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
  doc.text(`*${order.orderNumber}*`, startX + 3, y + 37);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.5);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  doc.text('Official Verified Dispatch Record', startX + 3, y + 40);

  // Right Box: Billing Summary & COD Highlight
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.roundedRect(custX, y, boxWidth, bottomBoxH, 1.5, 1.5, 'FD');

  let billY = y + 4.5;
  const billLabelX = custX + 3;
  const billValX = custX + boxWidth - 3;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  doc.text('Product Subtotal:', billLabelX, billY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
  doc.text(`Rs. ${(order.subtotal || 0).toLocaleString()}`, billValX, billY, { align: 'right' });

  // Discount
  if (order.discount && order.discount > 0) {
    billY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text('Discount Applied:', billLabelX, billY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61);
    doc.text(`- Rs. ${order.discount.toLocaleString()}`, billValX, billY, { align: 'right' });
  }

  // Standard Delivery
  billY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  doc.text('Standard Delivery:', billLabelX, billY);
  doc.setFont('helvetica', 'bold');
  if (order.shippingFee === 0) {
    doc.setTextColor(21, 128, 61);
    doc.text('FREE (Rs. 0)', billValX, billY, { align: 'right' });
  } else {
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(`Rs. ${order.shippingFee.toLocaleString()}`, billValX, billY, { align: 'right' });
  }

  // Applicable Tax (only if configured and calculated)
  if (order.tax && order.tax > 0) {
    billY += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
    doc.text('Applicable Taxes:', billLabelX, billY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(cCharcoal[0], cCharcoal[1], cCharcoal[2]);
    doc.text(`Rs. ${order.tax.toLocaleString()}`, billValX, billY, { align: 'right' });
  }

  // Grand Total line
  billY += 4.5;
  doc.setDrawColor(cBorder[0], cBorder[1], cBorder[2]);
  doc.setLineWidth(0.2);
  doc.line(billLabelX, billY, billValX, billY);

  billY += 3.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(cOliveDark[0], cOliveDark[1], cOliveDark[2]);
  doc.text('Grand Total:', billLabelX, billY);
  doc.text(`Rs. ${order.total.toLocaleString()} PKR`, billValX, billY, { align: 'right' });

  // COD COLLECTION HIGHLIGHT BOX (CRITICAL REQUIREMENT)
  // For unpaid COD order: COD Collection = Grand Total - Amount Already Paid.
  // For fully prepaid order: COD Collection = Rs. 0.
  const isPrepaid = order.paymentMethod === 'Direct Transfer' || order.paymentMethod === 'Online' || isPaid;
  const grandTotal = order.total || 0;
  const amountPaid = order.amountPaid !== undefined ? order.amountPaid : (isPaid ? grandTotal : 0);
  const outstandingBalance = order.outstandingBalance !== undefined ? order.outstandingBalance : Math.max(0, grandTotal - amountPaid);
  const codCollection = order.codCollection !== undefined
    ? order.codCollection
    : (isPrepaid ? 0 : outstandingBalance);

  const codBoxY = y + 26;
  const codBoxH = 14;

  if (!isPrepaid && codCollection > 0) {
    // Yellow Highlight Box
    doc.setFillColor(254, 240, 138); // amber-200
    doc.setDrawColor(234, 179, 8);   // amber-500
    doc.roundedRect(custX + 2, codBoxY, boxWidth - 4, codBoxH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(133, 77, 14); // amber-900
    doc.text('COD CASH TO COLLECT AT DOORSTEP', custX + (boxWidth / 2), codBoxY + 4, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(113, 63, 18);
    doc.text(`Rs. ${codCollection.toLocaleString()} PKR`, custX + (boxWidth / 2), codBoxY + 10, { align: 'center' });
  } else {
    // Green Prepaid Box
    doc.setFillColor(220, 252, 231); // emerald-100
    doc.setDrawColor(34, 197, 94);   // emerald-500
    doc.roundedRect(custX + 2, codBoxY, boxWidth - 4, codBoxH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(21, 128, 61);
    doc.text('PREPAID — NO CASH COLLECTION', custX + (boxWidth / 2), codBoxY + 4, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(20, 83, 45);
    doc.text('PAID IN FULL (COD: Rs. 0)', custX + (boxWidth / 2), codBoxY + 10, { align: 'center' });
  }

  // 6. BOTTOM SIGN-OFF FOOTER
  const footerY = oy + 201;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(cMuted[0], cMuted[1], cMuted[2]);
  doc.text(
    'TIBRA NATURALS Official Dispatch Slip • R-60 Pink Residency, Karachi • Support: +92 321 8294711 • www.tibranaturals.com',
    startX + contentWidth / 2,
    footerY,
    { align: 'center' }
  );
}

export const pdfSlipService = {
  /**
   * Generates a Single A5 Portrait Order Slip PDF (148mm × 210mm)
   */
  generateOrderSlipPDF(order: Order, customSender?: Partial<SenderSettings>): jsPDF {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });
    drawA5Slip(doc, order, customSender, 0, 0);
    return doc;
  },

  /**
   * Generates an A4 Landscape Two-Up Slip PDF (297mm × 210mm)
   * Places two A5 slips side-by-side with a vertical dashed cutting guide down the center.
   */
  generateA4TwoUpSlipsPDF(
    order1: Order,
    order2?: Order | null,
    customSender?: Partial<SenderSettings>
  ): jsPDF {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const slipWidth = 148.5;

    // Draw Left Slip (Order 1)
    drawA5Slip(doc, order1, customSender, 0, 0);

    // Vertical dashed cutting guideline down the center
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.25);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(slipWidth, 6, slipWidth, 204);
    doc.setLineDashPattern([], 0); // reset

    // Small cutting indicator
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    doc.text('✂ CUT HERE', slipWidth, 4.5, { align: 'center' });
    doc.text('✂ CUT HERE', slipWidth, 207, { align: 'center' });

    // Draw Right Slip (Order 2, or duplicate of Order 1 if explicitly requested)
    const rightOrder = order2 || order1;
    drawA5Slip(doc, rightOrder, customSender, slipWidth, 0);

    return doc;
  },

  /**
   * Generates a bulk PDF supporting both A5 and A4 landscape two-up printing
   */
  generateBulkSlipsPDF(
    orders: Order[],
    mode: 'a5-single' | 'a4-two-up' = 'a5-single',
    customSender?: Partial<SenderSettings>
  ): jsPDF {
    if (orders.length === 0) {
      throw new Error('No orders provided for slip generation.');
    }

    if (mode === 'a4-two-up') {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      const slipWidth = 148.5;

      for (let i = 0; i < orders.length; i += 2) {
        if (i > 0) doc.addPage('a4', 'landscape');

        const ord1 = orders[i];
        const ord2 = orders[i + 1] || ord1; // duplicate if odd count

        drawA5Slip(doc, ord1, customSender, 0, 0);

        // Center cutting guide
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.25);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(slipWidth, 6, slipWidth, 204);
        doc.setLineDashPattern([], 0);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(120, 120, 120);
        doc.text('✂ CUT HERE', slipWidth, 4.5, { align: 'center' });
        doc.text('✂ CUT HERE', slipWidth, 207, { align: 'center' });

        drawA5Slip(doc, ord2, customSender, slipWidth, 0);
      }
      return doc;
    }

    // Single A5 portrait per order
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5'
    });

    orders.forEach((order, index) => {
      if (index > 0) doc.addPage('a5', 'portrait');
      drawA5Slip(doc, order, customSender, 0, 0);
    });

    return doc;
  },

  downloadOrderSlipPDF(order: Order, customSender?: Partial<SenderSettings>) {
    const doc = this.generateOrderSlipPDF(order, customSender);
    doc.save(`TIBRA_SLIP_${order.orderNumber}.pdf`);
  },

  downloadA4TwoUpSlipsPDF(order1: Order, order2?: Order | null, customSender?: Partial<SenderSettings>) {
    const doc = this.generateA4TwoUpSlipsPDF(order1, order2, customSender);
    doc.save(`TIBRA_TWO_UP_${order1.orderNumber}.pdf`);
  },

  downloadBulkOrderSlipsPDF(
    orders: Order[],
    mode: 'a5-single' | 'a4-two-up' = 'a5-single',
    customSender?: Partial<SenderSettings>
  ) {
    const doc = this.generateBulkSlipsPDF(orders, mode, customSender);
    const dateStr = new Date().toISOString().split('T')[0];
    doc.save(`TIBRA_BULK_SLIPS_${mode.toUpperCase()}_${dateStr}.pdf`);
  },

  printOrderSlip(order: Order, customSender?: Partial<SenderSettings>) {
    const doc = this.generateOrderSlipPDF(order, customSender);
    const blobUrl = doc.output('bloburl');
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = blobUrl.toString();
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, 250);
    };
  },

  printA4TwoUpSlip(order1: Order, order2?: Order | null, customSender?: Partial<SenderSettings>) {
    const doc = this.generateA4TwoUpSlipsPDF(order1, order2, customSender);
    const blobUrl = doc.output('bloburl');
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = blobUrl.toString();
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, 250);
    };
  },

  printBulkOrderSlips(
    orders: Order[],
    mode: 'a5-single' | 'a4-two-up' = 'a5-single',
    customSender?: Partial<SenderSettings>
  ) {
    const doc = this.generateBulkSlipsPDF(orders, mode, customSender);
    const blobUrl = doc.output('bloburl');
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.src = blobUrl.toString();
    document.body.appendChild(iframe);
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, 250);
    };
  }
};

// Aliases for direct named export compatibility
export const downloadOrderSlipPDF = (order: Order, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.downloadOrderSlipPDF(order, customSender);

export const downloadA4TwoUpSlipsPDF = (order1: Order, order2?: Order | null, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.downloadA4TwoUpSlipsPDF(order1, order2, customSender);

export const downloadBulkOrderSlipsPDF = (orders: Order[], customSender?: Partial<SenderSettings>, mode: 'a5-single' | 'a4-two-up' = 'a5-single') =>
  pdfSlipService.downloadBulkOrderSlipsPDF(orders, mode, customSender);

export const printOrderSlip = (order: Order, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.printOrderSlip(order, customSender);

export const printA4TwoUpSlip = (order1: Order, order2?: Order | null, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.printA4TwoUpSlip(order1, order2, customSender);

export const printBulkOrderSlips = (orders: Order[], customSender?: Partial<SenderSettings>, mode: 'a5-single' | 'a4-two-up' = 'a5-single') =>
  pdfSlipService.printBulkOrderSlips(orders, mode, customSender);

export const generateOrderSlipPDF = (order: Order, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.generateOrderSlipPDF(order, customSender);

export const generateA4TwoUpSlipsPDF = (order1: Order, order2?: Order | null, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.generateA4TwoUpSlipsPDF(order1, order2, customSender);

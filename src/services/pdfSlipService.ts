import { jsPDF } from 'jspdf';
import type { Order, SenderSettings } from '../types/ecommerce';
import { storeService } from './storeService';

export const pdfSlipService = {
  /**
   * Generates a professional branded jsPDF document for an Order / Dispatch Slip
   */
  generateOrderSlipPDF(order: Order, customSender?: Partial<SenderSettings>): jsPDF {
    const sender = { ...storeService.getSenderSettings(), ...customSender };
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
    const margin = 14;
    const contentWidth = pageWidth - margin * 2; // 182mm
    let y = 14;

    // Helper colors
    const colorOliveDark = [37, 46, 21];    // #252E15
    const colorOliveAccent = [116, 140, 72]; // #748C48
    const colorCharcoal = [24, 24, 27];     // #18181B
    const colorMuted = [113, 113, 122];     // #71717A
    const colorLightBg = [250, 248, 245];   // #FAF8F5
    const colorBorder = [228, 228, 231];    // #E4E4E7

    // --- 1. HEADER SECTION ---
    // Decorative top accent bar
    doc.setFillColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.rect(margin, y, contentWidth, 2.5, 'F');
    y += 7;

    // Brand Name & Tagline
    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(sender.businessName || 'TIBRA NATURALS', margin, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text('Authentic Botanical Wellness & Herbal Care Pakistan', margin, y + 9);

    // Right side: Document Title, Order #, Date, Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.text('ORDER / DISPATCH SLIP', pageWidth - margin, y + 1, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(`Order #: ${order.orderNumber}`, pageWidth - margin, y + 6, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text(`Date: ${order.date}`, pageWidth - margin, y + 10.5, { align: 'right' });

    // Status Badge
    const statusText = (order.status || 'PENDING').toUpperCase().replace(/_/g, ' ');
    const isDelivered = order.status === 'delivered';
    const isDispatched = order.status === 'dispatched' || order.status === 'ready_for_dispatch';
    const isApproved = order.status === 'approved' || order.status === 'confirmed';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const badgeWidth = doc.getTextWidth(statusText) + 6;
    const badgeX = pageWidth - margin - badgeWidth;
    const badgeY = y + 12.5;

    if (isDelivered) {
      doc.setFillColor(220, 252, 231); // emerald-100
      doc.setDrawColor(34, 197, 94);   // emerald-500
      doc.setTextColor(21, 128, 61);
    } else if (isDispatched) {
      doc.setFillColor(238, 242, 255); // indigo-100
      doc.setDrawColor(99, 102, 241);
      doc.setTextColor(67, 56, 202);
    } else if (isApproved) {
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.setDrawColor(16, 185, 129);
      doc.setTextColor(4, 120, 87);
    } else {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.setDrawColor(245, 158, 11);
      doc.setTextColor(180, 83, 9);
    }
    doc.roundedRect(badgeX, badgeY, badgeWidth, 5, 1, 1, 'FD');
    doc.text(statusText, badgeX + badgeWidth / 2, badgeY + 3.6, { align: 'center' });

    y += 22;

    // Thin separator line
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    // --- 2. SENDER & RECIPIENT TWO-COLUMN BOXES ---
    const colWidth = (contentWidth - 6) / 2; // ~88mm each
    const boxHeight = 44;

    // Left Column: SENDER DETAILS
    doc.setFillColor(colorLightBg[0], colorLightBg[1], colorLightBg[2]);
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.roundedRect(margin, y, colWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text('FROM (SENDER DETAILS)', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(sender.businessName, margin + 4, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);

    const senderAddressLines = doc.splitTextToSize(sender.senderAddress, colWidth - 8);
    doc.text(senderAddressLines, margin + 4, y + 16);

    const senderContactY = y + 16 + senderAddressLines.length * 3.8 + 1;
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text(`Official Tel: ${sender.officialPhone}`, margin + 4, senderContactY);
    doc.text(`Website: ${sender.website}`, margin + 4, senderContactY + 4);

    // Right Column: CUSTOMER / RECIPIENT DETAILS
    const rightColX = margin + colWidth + 6;
    doc.setFillColor(colorLightBg[0], colorLightBg[1], colorLightBg[2]);
    doc.roundedRect(rightColX, y, colWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text('SHIP TO (CUSTOMER DETAILS)', rightColX + 4, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(order.customerName || 'Valued Customer', rightColX + 4, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Phone: ${order.customerPhone}${order.alternatePhone ? ` / ${order.alternatePhone}` : ''}`, rightColX + 4, y + 15.5);

    const fullDest = `${order.shippingAddress}, ${order.city}${order.postalCode ? ` - ${order.postalCode}` : ''}`;
    const destLines = doc.splitTextToSize(fullDest, colWidth - 8);
    doc.setFontSize(8);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(destLines, rightColX + 4, y + 20);

    // Courier Assignment (if available)
    if (order.deliveryCourier || order.trackingNumber) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
      const courierInfo = `Courier: ${order.deliveryCourier || 'Assigned'} | AWB: ${order.trackingNumber || 'Pending'}`;
      doc.text(courierInfo, rightColX + 4, y + boxHeight - 3.5);
    }

    y += boxHeight + 6;

    // --- 3. ORDER ITEMS TABLE ---
    const colProductWidth = 92;
    const colSkuWidth = 30;
    const colQtyWidth = 16;
    const colUnitWidth = 22;
    const colTotalWidth = 22;

    // Table Header Bar
    doc.setFillColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.rect(margin, y, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    let tableX = margin + 3;
    doc.text('PRODUCT / DESCRIPTION', tableX, y + 4.8);
    tableX += colProductWidth;
    doc.text('SKU', tableX, y + 4.8);
    tableX += colSkuWidth;
    doc.text('QTY', tableX + colQtyWidth / 2, y + 4.8, { align: 'center' });
    tableX += colQtyWidth;
    doc.text('UNIT (PKR)', tableX + colUnitWidth - 2, y + 4.8, { align: 'right' });
    tableX += colUnitWidth;
    doc.text('TOTAL (PKR)', tableX + colTotalWidth - 3, y + 4.8, { align: 'right' });

    y += 7;

    // Table Line Items
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    order.items.forEach((item, index) => {
      const itemRowHeight = 7.5;
      if (index % 2 === 1) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y, contentWidth, itemRowHeight, 'F');
      }

      doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
      doc.line(margin, y + itemRowHeight, pageWidth - margin, y + itemRowHeight);

      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      let rowX = margin + 3;

      // Product Name
      doc.setFont('helvetica', 'medium' as any);
      const nameText = doc.splitTextToSize(item.productName, colProductWidth - 6);
      doc.text(nameText[0] || item.productName, rowX, y + 5);
      rowX += colProductWidth;

      // SKU
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      const itemSku = item.sku || (item.productId.includes('bundle') ? 'TN-PRO-060-DUO' : 'TN-PRO-030');
      doc.text(itemSku, rowX, y + 5);
      rowX += colSkuWidth;

      // Quantity
      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      doc.text(String(item.quantity), rowX + colQtyWidth / 2, y + 5, { align: 'center' });
      rowX += colQtyWidth;

      // Unit Price
      doc.text(`Rs. ${item.price.toLocaleString()}`, rowX + colUnitWidth - 2, y + 5, { align: 'right' });
      rowX += colUnitWidth;

      // Line Total
      doc.setFont('helvetica', 'bold');
      const lineTotal = item.subtotal || item.price * item.quantity;
      doc.text(`Rs. ${lineTotal.toLocaleString()}`, rowX + colTotalWidth - 3, y + 5, { align: 'right' });

      y += itemRowHeight;
    });

    y += 4;

    // --- 4. BILLING SUMMARY & COD HIGHLIGHT BOX ---
    const summaryBoxWidth = 80;
    const summaryX = pageWidth - margin - summaryBoxWidth;

    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text('Merchandise Subtotal:', summaryX, y + 4);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(`Rs. ${order.subtotal.toLocaleString()}`, pageWidth - margin, y + 4, { align: 'right' });
    y += 5.5;

    // Delivery Charges
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text('Delivery Charges:', summaryX, y + 4);
    if (order.shippingFee === 0) {
      doc.setTextColor(21, 128, 61);
      doc.setFont('helvetica', 'bold');
      doc.text('FREE (Included)', pageWidth - margin, y + 4, { align: 'right' });
    } else {
      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(`Rs. ${order.shippingFee.toLocaleString()}`, pageWidth - margin, y + 4, { align: 'right' });
    }
    y += 5.5;

    // Discount (if any)
    if (order.discount && order.discount > 0) {
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      doc.text('Promotional Discount:', summaryX, y + 4);
      doc.setTextColor(220, 38, 38);
      doc.text(`- Rs. ${order.discount.toLocaleString()}`, pageWidth - margin, y + 4, { align: 'right' });
      y += 5.5;
    }

    // Tax (only if configured > 0)
    if (order.tax && order.tax > 0) {
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      doc.text('Applicable Tax:', summaryX, y + 4);
      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      doc.text(`Rs. ${order.tax.toLocaleString()}`, pageWidth - margin, y + 4, { align: 'right' });
      y += 5.5;
    }

    // Grand Total Line
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.line(summaryX, y + 2, pageWidth - margin, y + 2);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.text('Grand Total:', summaryX, y + 3.5);
    doc.text(`Rs. ${order.total.toLocaleString()}`, pageWidth - margin, y + 3.5, { align: 'right' });
    y += 9;

    // Payment Info & COD Amount To Collect Box (Left side of summary)
    const codBoxWidth = contentWidth - summaryBoxWidth - 8;
    const codBoxY = y - 30;
    const isCod = order.paymentMethod === 'COD' || !order.paymentMethod;

    if (isCod) {
      // Bold Amber/Green Box for Cash on Delivery collection
      doc.setFillColor(254, 243, 199); // Amber-100 fill
      doc.setDrawColor(217, 119, 6);   // Amber-600 border
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, codBoxY, codBoxWidth, 29, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9); // Amber-800
      doc.text('CASH ON DELIVERY (COD) COLLECTION', margin + 4, codBoxY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(154, 52, 18); // Amber-900
      doc.text(`COLLECT: Rs. ${order.total.toLocaleString()}`, margin + 4, codBoxY + 13.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 53, 15);
      doc.text('Courier Rider: Collect exact amount before handing parcel to customer.', margin + 4, codBoxY + 19);
      doc.text(`Payment Status: ${order.paymentStatus === 'paid' ? 'PAID' : 'PENDING CASH COLLECTION'}`, margin + 4, codBoxY + 24);
    } else {
      // Prepaid Box
      doc.setFillColor(236, 253, 245); // Emerald-50 fill
      doc.setDrawColor(16, 185, 129);  // Emerald-500 border
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, codBoxY, codBoxWidth, 29, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(4, 120, 87);
      doc.text('PAYMENT VERIFIED (PREPAID ORDER)', margin + 4, codBoxY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(6, 95, 70);
      doc.text('DO NOT COLLECT CASH (PAID)', margin + 4, codBoxY + 13.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(4, 120, 87);
      doc.text(`Payment Method: ${order.paymentMethod} • Status: PAID IN FULL`, margin + 4, codBoxY + 19);
      doc.text('COD Amount to Collect: Rs. 0', margin + 4, codBoxY + 24);
    }

    // Customer / Admin Notes (if present)
    if (order.notes) {
      y += 2;
      doc.setFillColor(244, 244, 245);
      doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
      doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
      doc.text('DELIVERY INSTRUCTIONS / ORDER NOTES:', margin + 3, y + 4);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      const noteLines = doc.splitTextToSize(order.notes, contentWidth - 8);
      doc.text(noteLines[0] || order.notes, margin + 3, y + 8.5);
      y += 15;
    } else {
      y += 4;
    }

    // --- 5. SOCIAL MEDIA FOOTER & BRAND CLOSE ---
    const footerY = 270; // fixed bottom placement on A4

    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.text('Thank you for choosing TIBRA NATURALS.', pageWidth / 2, footerY + 5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    const socialText = `Facebook: ${sender.facebookUrl}  •  Instagram: ${sender.instagramUrl}  •  Handle: ${sender.socialHandle}`;
    doc.text(socialText, pageWidth / 2, footerY + 9.5, { align: 'center' });

    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text(`Official Website: ${sender.website}   |   Customer Care: ${sender.officialPhone}`, pageWidth / 2, footerY + 14, { align: 'center' });

    doc.setFontSize(6.5);
    doc.setTextColor(161, 161, 170);
    doc.text('Internal TIBRA NATURALS Order & Dispatch Documentation • Computer Generated', pageWidth / 2, footerY + 18, { align: 'center' });

    return doc;
  },

  /**
   * Generates and triggers automatic file download of the PDF slip
   */
  downloadOrderSlipPDF(order: Order, customSender?: Partial<SenderSettings>): void {
    const doc = this.generateOrderSlipPDF(order, customSender);
    const filename = `TIBRA_SLIP_${order.orderNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  },

  /**
   * Combines multiple orders into a single multi-page PDF document
   */
  downloadBulkOrderSlipsPDF(orders: Order[], customSender?: Partial<SenderSettings>): void {
    if (orders.length === 0) return;

    // Clean sequential multi-page generator
    const combinedDoc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    orders.forEach((ord, idx) => {
      if (idx > 0) combinedDoc.addPage('a4', 'portrait');
      this.renderSlipOntoDoc(combinedDoc, ord, customSender);
    });

    const filename = `TIBRA_BULK_SLIPS_${orders.length}_ORDERS_${new Date().toISOString().split('T')[0]}.pdf`;
    combinedDoc.save(filename);
  },

  /**
   * Direct printer window triggering
   */
  printOrderSlip(order: Order, customSender?: Partial<SenderSettings>): void {
    const sender = { ...storeService.getSenderSettings(), ...customSender };
    const htmlContent = this.generatePrintableHTML(order, sender);

    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      alert('Popup blocker prevented print window from opening. Please allow popups for printing.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  },

  /**
   * Bulk print launcher
   */
  printBulkOrderSlips(orders: Order[], customSender?: Partial<SenderSettings>): void {
    if (orders.length === 0) return;
    const sender = { ...storeService.getSenderSettings(), ...customSender };
    const slipsHtml = orders.map((o, idx) => `
      <div class="slip-page ${idx < orders.length - 1 ? 'page-break' : ''}">
        ${this.generateSingleSlipInnerHtml(o, sender)}
      </div>
    `).join('\n');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bulk Dispatch Slips (${orders.length} Orders) - TIBRA NATURALS</title>
          ${this.getPrintCSS()}
        </head>
        <body>
          ${slipsHtml}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=850,height=1100');
    if (!printWindow) {
      alert('Popup blocker prevented bulk print window from opening.');
      return;
    }

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  },

  /**
   * Internal renderer onto an existing jsPDF document
   */
  renderSlipOntoDoc(doc: jsPDF, order: Order, customSender?: Partial<SenderSettings>): void {
    const sender = { ...storeService.getSenderSettings(), ...customSender };
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    let y = 14;

    const colorOliveDark = [37, 46, 21];
    const colorOliveAccent = [116, 140, 72];
    const colorCharcoal = [24, 24, 27];
    const colorMuted = [113, 113, 122];
    const colorLightBg = [250, 248, 245];
    const colorBorder = [228, 228, 231];

    doc.setFillColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.rect(margin, y, contentWidth, 2.5, 'F');
    y += 7;

    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(sender.businessName || 'TIBRA NATURALS', margin, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text('Authentic Botanical Wellness & Herbal Care Pakistan', margin, y + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.text('ORDER / DISPATCH SLIP', pageWidth - margin, y + 1, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(`Order #: ${order.orderNumber}`, pageWidth - margin, y + 6, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text(`Date: ${order.date}`, pageWidth - margin, y + 10.5, { align: 'right' });

    y += 22;
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    const colWidth = (contentWidth - 6) / 2;
    const boxHeight = 44;

    doc.setFillColor(colorLightBg[0], colorLightBg[1], colorLightBg[2]);
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.roundedRect(margin, y, colWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text('FROM (SENDER DETAILS)', margin + 4, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(sender.businessName, margin + 4, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const senderAddressLines = doc.splitTextToSize(sender.senderAddress, colWidth - 8);
    doc.text(senderAddressLines, margin + 4, y + 16);

    const senderContactY = y + 16 + senderAddressLines.length * 3.8 + 1;
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text(`Official Tel: ${sender.officialPhone}`, margin + 4, senderContactY);
    doc.text(`Website: ${sender.website}`, margin + 4, senderContactY + 4);

    const rightColX = margin + colWidth + 6;
    doc.setFillColor(colorLightBg[0], colorLightBg[1], colorLightBg[2]);
    doc.roundedRect(rightColX, y, colWidth, boxHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text('SHIP TO (CUSTOMER DETAILS)', rightColX + 4, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(order.customerName || 'Valued Customer', rightColX + 4, y + 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Phone: ${order.customerPhone}${order.alternatePhone ? ` / ${order.alternatePhone}` : ''}`, rightColX + 4, y + 15.5);

    const fullDest = `${order.shippingAddress}, ${order.city}${order.postalCode ? ` - ${order.postalCode}` : ''}`;
    const destLines = doc.splitTextToSize(fullDest, colWidth - 8);
    doc.setFontSize(8);
    doc.text(destLines, rightColX + 4, y + 20);

    if (order.deliveryCourier || order.trackingNumber) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
      doc.text(`Courier: ${order.deliveryCourier || 'Assigned'} | AWB: ${order.trackingNumber || 'Pending'}`, rightColX + 4, y + boxHeight - 3.5);
    }

    y += boxHeight + 6;

    const colProductWidth = 92;
    const colSkuWidth = 30;
    const colQtyWidth = 16;
    const colUnitWidth = 22;
    const colTotalWidth = 22;

    doc.setFillColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    let tableX = margin + 3;
    doc.text('PRODUCT / DESCRIPTION', tableX, y + 4.8);
    tableX += colProductWidth;
    doc.text('SKU', tableX, y + 4.8);
    tableX += colSkuWidth;
    doc.text('QTY', tableX + colQtyWidth / 2, y + 4.8, { align: 'center' });
    tableX += colQtyWidth;
    doc.text('UNIT (PKR)', tableX + colUnitWidth - 2, y + 4.8, { align: 'right' });
    tableX += colUnitWidth;
    doc.text('TOTAL (PKR)', tableX + colTotalWidth - 3, y + 4.8, { align: 'right' });

    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    order.items.forEach((item, index) => {
      const itemRowHeight = 7.5;
      if (index % 2 === 1) {
        doc.setFillColor(248, 248, 248);
        doc.rect(margin, y, contentWidth, itemRowHeight, 'F');
      }
      doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
      doc.line(margin, y + itemRowHeight, pageWidth - margin, y + itemRowHeight);
      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      let rowX = margin + 3;

      const nameText = doc.splitTextToSize(item.productName, colProductWidth - 6);
      doc.text(nameText[0] || item.productName, rowX, y + 5);
      rowX += colProductWidth;

      const itemSku = item.sku || (item.productId.includes('bundle') ? 'TN-PRO-060-DUO' : 'TN-PRO-030');
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      doc.text(itemSku, rowX, y + 5);
      rowX += colSkuWidth;

      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      doc.text(String(item.quantity), rowX + colQtyWidth / 2, y + 5, { align: 'center' });
      rowX += colQtyWidth;

      doc.text(`Rs. ${item.price.toLocaleString()}`, rowX + colUnitWidth - 2, y + 5, { align: 'right' });
      rowX += colUnitWidth;

      doc.setFont('helvetica', 'bold');
      const lineTotal = item.subtotal || item.price * item.quantity;
      doc.text(`Rs. ${lineTotal.toLocaleString()}`, rowX + colTotalWidth - 3, y + 5, { align: 'right' });
      y += itemRowHeight;
    });

    y += 4;
    const summaryBoxWidth = 80;
    const summaryX = pageWidth - margin - summaryBoxWidth;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text('Merchandise Subtotal:', summaryX, y + 4);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text(`Rs. ${order.subtotal.toLocaleString()}`, pageWidth - margin, y + 4, { align: 'right' });
    y += 5.5;

    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text('Delivery Charges:', summaryX, y + 4);
    if (order.shippingFee === 0) {
      doc.setTextColor(21, 128, 61);
      doc.setFont('helvetica', 'bold');
      doc.text('FREE (Included)', pageWidth - margin, y + 4, { align: 'right' });
    } else {
      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      doc.setFont('helvetica', 'normal');
      doc.text(`Rs. ${order.shippingFee.toLocaleString()}`, pageWidth - margin, y + 4, { align: 'right' });
    }
    y += 5.5;

    if (order.discount && order.discount > 0) {
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      doc.text('Promotional Discount:', summaryX, y + 4);
      doc.setTextColor(220, 38, 38);
      doc.text(`- Rs. ${order.discount.toLocaleString()}`, pageWidth - margin, y + 4, { align: 'right' });
      y += 5.5;
    }

    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.line(summaryX, y + 2, pageWidth - margin, y + 2);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.text('Grand Total:', summaryX, y + 3.5);
    doc.text(`Rs. ${order.total.toLocaleString()}`, pageWidth - margin, y + 3.5, { align: 'right' });
    y += 9;

    const codBoxWidth = contentWidth - summaryBoxWidth - 8;
    const codBoxY = y - 26;
    const isCod = order.paymentMethod === 'COD' || !order.paymentMethod;

    if (isCod) {
      doc.setFillColor(254, 243, 199);
      doc.setDrawColor(217, 119, 6);
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, codBoxY, codBoxWidth, 26, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(180, 83, 9);
      doc.text('CASH ON DELIVERY (COD) COLLECTION', margin + 4, codBoxY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(154, 52, 18);
      doc.text(`COLLECT: Rs. ${order.total.toLocaleString()}`, margin + 4, codBoxY + 13.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 53, 15);
      doc.text('Courier Rider: Collect exact amount before handing parcel to customer.', margin + 4, codBoxY + 19);
    } else {
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.6);
      doc.roundedRect(margin, codBoxY, codBoxWidth, 26, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(4, 120, 87);
      doc.text('PAYMENT VERIFIED (PREPAID ORDER)', margin + 4, codBoxY + 5.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(6, 95, 70);
      doc.text('DO NOT COLLECT CASH (PAID)', margin + 4, codBoxY + 13.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(4, 120, 87);
      doc.text(`Payment Method: ${order.paymentMethod} • Status: PAID IN FULL`, margin + 4, codBoxY + 19);
    }

    const footerY = 270;
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colorOliveDark[0], colorOliveDark[1], colorOliveDark[2]);
    doc.text('Thank you for choosing TIBRA NATURALS.', pageWidth / 2, footerY + 5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    const socialText = `Facebook: ${sender.facebookUrl}  •  Instagram: ${sender.instagramUrl}  •  Handle: ${sender.socialHandle}`;
    doc.text(socialText, pageWidth / 2, footerY + 9.5, { align: 'center' });

    doc.setTextColor(colorOliveAccent[0], colorOliveAccent[1], colorOliveAccent[2]);
    doc.text(`Official Website: ${sender.website}   |   Customer Care: ${sender.officialPhone}`, pageWidth / 2, footerY + 14, { align: 'center' });
  },

  /**
   * Generates single-page printable HTML string with styling
   */
  generatePrintableHTML(order: Order, sender: SenderSettings): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Slip_${order.orderNumber}_TIBRA_NATURALS</title>
          ${this.getPrintCSS()}
        </head>
        <body>
          <div class="slip-page">
            ${this.generateSingleSlipInnerHtml(order, sender)}
          </div>
        </body>
      </html>
    `;
  },

  getPrintCSS(): string {
    return `
      <style>
        @page {
          size: A4 portrait;
          margin: 12mm;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: #fff;
            color: #18181b;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-break {
            page-break-after: always;
            break-after: page;
          }
          .no-print {
            display: none !important;
          }
        }
        body {
          margin: 0;
          padding: 10px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #18181b;
          background: #f4f4f5;
        }
        .slip-page {
          max-width: 800px;
          margin: 0 auto 20px auto;
          background: #ffffff;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          box-sizing: border-box;
        }
        .top-accent-bar {
          height: 4px;
          background: #252E15;
          margin-bottom: 16px;
          border-radius: 2px;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 14px;
          border-bottom: 1px solid #e4e4e7;
          margin-bottom: 16px;
        }
        .brand-name {
          font-size: 24px;
          font-weight: 800;
          color: #252E15;
          margin: 0;
          letter-spacing: -0.5px;
        }
        .brand-sub {
          font-size: 11px;
          color: #748C48;
          font-weight: 600;
          margin-top: 3px;
        }
        .doc-title-block {
          text-align: right;
        }
        .doc-title {
          font-size: 16px;
          font-weight: 800;
          color: #252E15;
          margin: 0;
        }
        .doc-order-num {
          font-size: 13px;
          font-weight: 700;
          color: #18181b;
          margin-top: 3px;
          font-family: monospace;
        }
        .doc-date {
          font-size: 11px;
          color: #71717a;
          margin-top: 2px;
        }
        .status-badge {
          display: inline-block;
          margin-top: 6px;
          padding: 3px 10px;
          font-size: 10px;
          font-weight: 700;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        .two-col-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .info-card {
          background: #FAF8F5;
          border: 1px solid #e4e4e7;
          border-radius: 8px;
          padding: 14px;
          font-size: 12px;
          line-height: 1.5;
        }
        .card-heading {
          font-size: 10px;
          font-weight: 700;
          color: #748C48;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .party-name {
          font-size: 13px;
          font-weight: 700;
          color: #18181b;
          margin-bottom: 4px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 12px;
        }
        .items-table th {
          background: #252E15;
          color: #ffffff;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 9px 12px;
          text-align: left;
        }
        .items-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e4e4e7;
          color: #27272a;
        }
        .items-table tr:nth-child(even) td {
          background: #fafafa;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
          align-items: start;
        }
        .cod-callout {
          border-radius: 8px;
          padding: 14px 16px;
          border: 2px solid;
        }
        .cod-callout.cod {
          background: #fffbeb;
          border-color: #d97706;
          color: #92400e;
        }
        .cod-callout.prepaid {
          background: #ecfdf5;
          border-color: #10b981;
          color: #065f46;
        }
        .cod-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .cod-amount {
          font-size: 22px;
          font-weight: 900;
          margin-bottom: 4px;
        }
        .totals-table {
          width: 100%;
          font-size: 12px;
        }
        .totals-table tr td {
          padding: 4px 0;
        }
        .totals-table .total-row td {
          font-size: 15px;
          font-weight: 800;
          color: #252E15;
          border-top: 2px solid #e4e4e7;
          padding-top: 8px;
          margin-top: 4px;
        }
        .slip-footer {
          border-top: 1px solid #e4e4e7;
          padding-top: 16px;
          text-align: center;
          font-size: 11px;
          color: #71717a;
          line-height: 1.6;
        }
        .thank-you {
          font-size: 13px;
          font-weight: 700;
          color: #252E15;
          margin-bottom: 4px;
        }
        .social-links a {
          color: #748C48;
          text-decoration: none;
          font-weight: 600;
          margin: 0 6px;
        }
      </style>
    `;
  },

  generateSingleSlipInnerHtml(order: Order, sender: SenderSettings): string {
    const isCod = order.paymentMethod === 'COD' || !order.paymentMethod;
    const statusText = (order.status || 'PENDING').toUpperCase().replace(/_/g, ' ');

    let badgeClass = 'background: #fef3c7; color: #b45309; border: 1px solid #f59e0b;';
    if (order.status === 'delivered') badgeClass = 'background: #dcfce7; color: #15803d; border: 1px solid #22c55e;';
    else if (order.status === 'dispatched' || order.status === 'ready_for_dispatch') badgeClass = 'background: #eef2ff; color: #4338ca; border: 1px solid #6366f1;';
    else if (order.status === 'approved' || order.status === 'confirmed') badgeClass = 'background: #ecfdf5; color: #047857; border: 1px solid #10b981;';

    const itemsRows = order.items.map(item => `
      <tr>
        <td>
          <strong>${item.productName}</strong>
        </td>
        <td style="color: #71717a; font-family: monospace;">${item.sku || (item.productId.includes('bundle') ? 'TN-PRO-060-DUO' : 'TN-PRO-030')}</td>
        <td style="text-align: center; font-weight: bold;">${item.quantity}</td>
        <td style="text-align: right;">Rs. ${item.price.toLocaleString()}</td>
        <td style="text-align: right; font-weight: bold;">Rs. ${(item.subtotal || item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    return `
      <div class="top-accent-bar"></div>
      <div class="header-row">
        <div>
          <h1 class="brand-name">${sender.businessName}</h1>
          <div class="brand-sub">Authentic Botanical Wellness & Herbal Care Pakistan</div>
        </div>
        <div class="doc-title-block">
          <div class="doc-title">ORDER / DISPATCH SLIP</div>
          <div class="doc-order-num">${order.orderNumber}</div>
          <div class="doc-date">Date: ${order.date}</div>
          <div class="status-badge" style="${badgeClass}">${statusText}</div>
        </div>
      </div>

      <div class="two-col-grid">
        <div class="info-card">
          <div class="card-heading">FROM (SENDER DETAILS)</div>
          <div class="party-name">${sender.businessName}</div>
          <div>${sender.senderAddress.replace(/\n/g, '<br>')}</div>
          <div style="margin-top: 6px; color: #71717a;">
            <strong>Official Tel:</strong> ${sender.officialPhone}<br>
            <strong>Website:</strong> <a href="${sender.website}" style="color: #748C48; text-decoration: none;">${sender.website}</a>
          </div>
        </div>

        <div class="info-card">
          <div class="card-heading">SHIP TO (CUSTOMER DETAILS)</div>
          <div class="party-name">${order.customerName || 'Valued Customer'}</div>
          <div><strong>Phone:</strong> ${order.customerPhone}${order.alternatePhone ? ` &bull; Alt: ${order.alternatePhone}` : ''}</div>
          <div style="margin-top: 4px;"><strong>Address:</strong> ${order.shippingAddress}, ${order.city}${order.postalCode ? ` - ${order.postalCode}` : ''}</div>
          ${order.deliveryCourier || order.trackingNumber ? `
            <div style="margin-top: 6px; font-weight: bold; color: #252E15;">
              Courier: ${order.deliveryCourier || 'Assigned'} &bull; Tracking (AWB): ${order.trackingNumber || 'Pending'}
            </div>
          ` : ''}
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th style="width: 48%;">Product Description</th>
            <th style="width: 18%;">SKU</th>
            <th style="width: 10%; text-align: center;">Qty</th>
            <th style="width: 12%; text-align: right;">Unit (PKR)</th>
            <th style="width: 12%; text-align: right;">Total (PKR)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div class="summary-grid">
        <div class="cod-callout ${isCod ? 'cod' : 'prepaid'}">
          <div class="cod-title">${isCod ? 'CASH ON DELIVERY (COD) COLLECTION' : 'PAYMENT VERIFIED (PREPAID)'}</div>
          <div class="cod-amount">${isCod ? `COLLECT: Rs. ${order.total.toLocaleString()}` : 'PAID IN FULL — Rs. 0'}</div>
          <div style="font-size: 11px;">
            ${isCod ? 'Courier Rider: Please collect exact cash before handing parcel.' : `Paid via ${order.paymentMethod}. Do NOT collect cash from customer.`}
          </div>
          <div style="margin-top: 6px; font-size: 10px; font-weight: 600;">
            Payment Method: ${order.paymentMethod || 'COD'} &bull; Payment Status: ${(order.paymentStatus || 'pending').toUpperCase()}
          </div>
        </div>

        <div>
          <table class="totals-table">
            <tr>
              <td style="color: #71717a;">Merchandise Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">Rs. ${order.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="color: #71717a;">Delivery Charges:</td>
              <td style="text-align: right; font-weight: 600; color: ${order.shippingFee === 0 ? '#15803d' : '#18181b'};">
                ${order.shippingFee === 0 ? 'FREE (Included)' : `Rs. ${order.shippingFee.toLocaleString()}`}
              </td>
            </tr>
            ${order.discount && order.discount > 0 ? `
              <tr>
                <td style="color: #71717a;">Promotional Discount:</td>
                <td style="text-align: right; color: #dc2626; font-weight: 600;">- Rs. ${order.discount.toLocaleString()}</td>
              </tr>
            ` : ''}
            ${order.tax && order.tax > 0 ? `
              <tr>
                <td style="color: #71717a;">Applicable Tax:</td>
                <td style="text-align: right; font-weight: 600;">Rs. ${order.tax.toLocaleString()}</td>
              </tr>
            ` : ''}
            <tr class="total-row">
              <td>Grand Total:</td>
              <td style="text-align: right;">Rs. ${order.total.toLocaleString()}</td>
            </tr>
          </table>
        </div>
      </div>

      ${order.notes ? `
        <div style="background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; font-size: 11px;">
          <strong>CUSTOMER / DELIVERY NOTE:</strong> ${order.notes}
        </div>
      ` : ''}

      <div class="slip-footer">
        <div class="thank-you">Thank you for choosing TIBRA NATURALS.</div>
        <div class="social-links">
          <a href="${sender.facebookUrl}" target="_blank">Facebook: ${sender.facebookUrl}</a> &bull;
          <a href="${sender.instagramUrl}" target="_blank">Instagram: ${sender.instagramUrl}</a> &bull;
          <span>Handle: ${sender.socialHandle}</span>
        </div>
        <div style="margin-top: 4px; color: #748C48; font-weight: 600;">
          Official Store: ${sender.website} &bull; Customer Care: ${sender.officialPhone}
        </div>
        <div style="margin-top: 4px; font-size: 9px; color: #a1a1aa;">
          Internal TIBRA NATURALS Order & Dispatch Documentation &bull; Computer Generated
        </div>
      </div>
    `;
  }
};

export const downloadOrderSlipPDF = (order: Order, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.downloadOrderSlipPDF(order, customSender);

export const downloadBulkOrderSlipsPDF = (orders: Order[], customSender?: Partial<SenderSettings>) =>
  pdfSlipService.downloadBulkOrderSlipsPDF(orders, customSender);

export const printOrderSlip = (order: Order, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.printOrderSlip(order, customSender);

export const printBulkOrderSlips = (orders: Order[], customSender?: Partial<SenderSettings>) =>
  pdfSlipService.printBulkOrderSlips(orders, customSender);

export const generateOrderSlipPDF = (order: Order, customSender?: Partial<SenderSettings>) =>
  pdfSlipService.generateOrderSlipPDF(order, customSender);

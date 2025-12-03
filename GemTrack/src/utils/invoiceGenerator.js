import {Platform} from 'react-native';
import {SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE, SHOP_GSTIN} from '../services/config';

export const generateInvoice = async (customer, sale, items, paymentMethod, amountPaid, amountDue) => {
  if (Platform.OS !== 'web') {
    alert('Invoice generation is only available on web');
    return;
  }
  const {jsPDF} = await import('jspdf');
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  let y = 15;

  // Header - Shop Name
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(SHOP_NAME.toUpperCase(), pageWidth / 2, y, {align: 'center'});
  
  y += 7;
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(`${SHOP_ADDRESS} | Mob: ${SHOP_PHONE}`, pageWidth / 2, y, {align: 'center'});
  
  // Line separator
  y += 5;
  pdf.line(10, y, pageWidth - 10, y);
  
  // TAX INVOICE title and GSTIN/Bill details
  y += 8;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.rect(80, y - 5, 50, 8);
  pdf.text('TAX INVOICE', pageWidth / 2, y, {align: 'center'});
  
  pdf.setFontSize(9);
  pdf.text(`GSTIN No: ${SHOP_GSTIN}`, pageWidth - 15, y - 2, {align: 'right'});
  pdf.text(`Bill No: ${sale.id}`, pageWidth - 15, y + 4, {align: 'right'});
  pdf.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, pageWidth - 15, y + 10, {align: 'right'});
  
  // Customer Details Box
  y += 15;
  pdf.setFillColor(250, 250, 250);
  pdf.rect(10, y - 3, 100, 20, 'F');
  pdf.rect(10, y - 3, 100, 20, 'S');
  
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(9);
  pdf.text('Name:', 12, y);
  pdf.setFont(undefined, 'normal');
  pdf.text(customer.name, 30, y);
  
  y += 6;
  pdf.setFont(undefined, 'bold');
  pdf.text('Address:', 12, y);
  pdf.setFont(undefined, 'normal');
  pdf.text(customer.address || 'N/A', 30, y);
  
  y += 6;
  pdf.setFont(undefined, 'bold');
  pdf.text('Phone:', 12, y);
  pdf.setFont(undefined, 'normal');
  pdf.text(customer.phone || 'N/A', 30, y);
  
  // Items Table
  y += 10;
  const colWidths = [50, 25, 15, 25, 25, 25, 35];
  const headers = ['Particulars', 'HSN', 'Pcs', 'Gross Wt', 'Net Wt', 'Rate', 'Amount'];
  
  // Table Header
  pdf.setFillColor(240, 240, 240);
  pdf.rect(10, y, pageWidth - 20, 8, 'F');
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(9);
  let x = 12;
  headers.forEach((header, i) => {
    pdf.text(header, x, y + 5);
    x += colWidths[i];
  });
  
  // Table Rows
  y += 8;
  pdf.setFont(undefined, 'normal');
  let subtotal = 0;
  let totalOtherCharges = 0;
  
  items.forEach(item => {
    pdf.line(10, y, pageWidth - 10, y);
    y += 6;
    x = 12;
    
    pdf.text(item.name, x, y, {maxWidth: 45});
    x += colWidths[0];
    pdf.text('7113', x, y);
    x += colWidths[1];
    pdf.text('1', x, y);
    x += colWidths[2];
    pdf.text(String(item.grossWeight || '-'), x, y);
    x += colWidths[3];
    pdf.text(String(item.netWeight || '-'), x, y);
    x += colWidths[4];
    pdf.text(String(item.rate || '-'), x, y);
    x += colWidths[5];
    pdf.text(`₹${(item.soldPrice || 0).toFixed(2)}`, x, y);
    
    subtotal += item.soldPrice || 0;
    totalOtherCharges += (item.hallmarkingCharges || 0) + (item.stoneCharges || 0) + (item.otherCharges || 0);
    y += 6;
  });
  
  pdf.line(10, y, pageWidth - 10, y);
  
  // Total Weight
  const totalWeight = items.reduce((sum, i) => sum + (parseFloat(i.netWeight) || 0), 0);
  y += 6;
  pdf.setFont(undefined, 'bold');
  pdf.text(`Total Wt: ${totalWeight.toFixed(3)}`, 80, y);
  
  // Calculations
  const cgst = subtotal * 0.015;
  const sgst = subtotal * 0.015;
  const total = subtotal + cgst + sgst + totalOtherCharges;
  
  y += 10;
  const rightX = pageWidth - 15;
  
  pdf.setFont(undefined, 'normal');
  pdf.text('Other Charges:', rightX - 40, y);
  pdf.text(totalOtherCharges.toFixed(2), rightX, y, {align: 'right'});
  
  y += 6;
  pdf.text('Total:', rightX - 40, y);
  pdf.text(subtotal.toFixed(2), rightX, y, {align: 'right'});
  
  y += 6;
  pdf.text('CGST (1.50%):', rightX - 40, y);
  pdf.text(cgst.toFixed(2), rightX, y, {align: 'right'});
  
  y += 6;
  pdf.text('SGST (1.50%):', rightX - 40, y);
  pdf.text(sgst.toFixed(2), rightX, y, {align: 'right'});
  
  y += 8;
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(11);
  pdf.text('Total sales amount:', rightX - 40, y);
  pdf.text(`₹${total.toFixed(2)}`, rightX, y, {align: 'right'});
  
  y += 8;
  pdf.setFontSize(9);
  pdf.text('Net Payable:', rightX - 40, y);
  pdf.text(`₹${total.toFixed(2)}`, rightX, y, {align: 'right'});
  
  // Payment Details Box
  y += 15;
  const paymentBoxHeight = amountDue > 0 ? 30 : 18;
  pdf.setFillColor(250, 250, 250);
  pdf.rect(10, y - 3, 90, paymentBoxHeight, 'F');
  pdf.rect(10, y - 3, 90, paymentBoxHeight, 'S');
  
  pdf.setFont(undefined, 'bold');
  pdf.setFontSize(10);
  pdf.text('Payment Details', 12, y);
  y += 7;
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.text(`By ${paymentMethod}:`, 14, y);
  pdf.text(`₹${amountPaid.toFixed(2)}`, 60, y);
  
  y += 6;
  pdf.setFont(undefined, 'bold');
  pdf.text('Total Amount:', 14, y);
  pdf.text(`₹${(amountPaid + amountDue).toFixed(2)}`, 60, y);
  
  if (amountDue > 0) {
    y += 6;
    pdf.setFillColor(255, 240, 240);
    pdf.rect(10, y - 4, 90, 8, 'F');
    pdf.setTextColor(200, 0, 0);
    pdf.text('Amount Pending:', 14, y);
    pdf.text(`₹${amountDue.toFixed(2)}`, 60, y);
    pdf.setTextColor(0, 0, 0);
  }
  
  // Footer
  const footerY = pdf.internal.pageSize.getHeight() - 20;
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'normal');
  pdf.text('Thank you for your business!', pageWidth / 2, footerY, {align: 'center'});
  pdf.setFontSize(7);
  pdf.text(`For queries: ${SHOP_PHONE}`, pageWidth / 2, footerY + 4, {align: 'center'});
  
  const pdfBlob = pdf.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newWindow = window.open(pdfUrl, '_blank');
  
  if (!newWindow) {
    pdf.save(`Invoice-${sale.id}.pdf`);
  }
};

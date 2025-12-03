import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {SHOP_NAME, SHOP_ADDRESS, SHOP_PHONE, SHOP_GSTIN} from '../services/config';

export const generateInvoice = async (customer, sale, items, paymentMethod, amountPaid, amountDue) => {
  const subtotal = items.reduce((sum, i) => sum + (i.soldPrice || 0), 0);
  const cgst = (subtotal * 0.015).toFixed(2);
  const sgst = (subtotal * 0.015).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(cgst) + parseFloat(sgst)).toFixed(2);

  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 11px; padding: 15px; }
          .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .shop-name { font-size: 20px; font-weight: bold; text-transform: uppercase; }
          .shop-details { font-size: 10px; margin-top: 3px; }
          .invoice-title { text-align: center; font-size: 14px; font-weight: bold; margin: 10px 0; padding: 5px; border: 1px solid #000; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .info-section { flex: 1; }
          .label { font-weight: bold; display: inline-block; width: 80px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #000; padding: 5px; text-align: center; font-size: 10px; }
          th { background: #f0f0f0; font-weight: bold; }
          .left { text-align: left; }
          .right { text-align: right; }
          .totals { margin-top: 10px; text-align: right; }
          .totals div { padding: 3px 0; }
          .net-total { font-size: 14px; font-weight: bold; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px; }
          .footer { margin-top: 15px; border-top: 1px solid #000; padding-top: 10px; }
          .payment-info { background: #f9f9f9; padding: 8px; border: 1px solid #ddd; margin-top: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="shop-name">${SHOP_NAME}</div>
          <div class="shop-details">${SHOP_ADDRESS} | Phone: ${SHOP_PHONE}</div>
          <div class="shop-details">GSTIN: ${SHOP_GSTIN}</div>
        </div>
        
        <div class="invoice-title">TAX INVOICE</div>
        
        <div class="info-row">
          <div class="info-section">
            <div><span class="label">Customer:</span> ${customer.name}</div>
            <div><span class="label">Phone:</span> ${customer.phone || 'N/A'}</div>
            <div><span class="label">Address:</span> ${customer.address || 'N/A'}</div>
          </div>
          <div class="info-section" style="text-align: right;">
            <div><span class="label">Bill No:</span> ${sale.id}</div>
            <div><span class="label">Date:</span> ${new Date().toLocaleDateString('en-IN')}</div>
            <div><span class="label">Time:</span> ${new Date().toLocaleTimeString('en-IN')}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="left">Particulars</th>
              <th>HSN</th>
              <th>Pcs</th>
              <th>Gross Wt</th>
              <th>Net Wt</th>
              <th>Rate</th>
              <th class="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td class="left">${item.name}<br/><small>SKU: ${item.sku}</small></td>
                <td>7113</td>
                <td>1</td>
                <td>${item.grossWeight || '-'}</td>
                <td>${item.netWeight || '-'}</td>
                <td>₹${item.soldPrice}</td>
                <td class="right">₹${item.soldPrice}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>Subtotal: ₹${subtotal.toFixed(2)}</div>
          <div>CGST (1.5%): ₹${cgst}</div>
          <div>SGST (1.5%): ₹${sgst}</div>
          <div class="net-total">Net Payable: ₹${total}</div>
        </div>

        <div class="footer">
          <div class="payment-info">
            <div><strong>Payment Method:</strong> ${paymentMethod}</div>
            <div><strong>Amount Paid:</strong> ₹${amountPaid}</div>
            <div><strong>Balance Due:</strong> ₹${amountDue}</div>
          </div>
          <div style="text-align: center; margin-top: 15px; font-size: 10px;">
            <p>Thank you for your business!</p>
            <p style="margin-top: 5px;">For queries: ${SHOP_PHONE}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const {uri} = await Print.printToFileAsync({html});
  await Sharing.shareAsync(uri, {mimeType: 'application/pdf', dialogTitle: `Invoice #${sale.id}`});
};

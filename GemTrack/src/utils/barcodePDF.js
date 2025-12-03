import {Platform} from 'react-native';

const fetchBarcodeImage = async (sku) => {
  const response = await fetch(`https://barcodeapi.org/api/128/${encodeURIComponent(sku)}?height=15&width=2&bg=ffffff&fg=000000`);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const generateBarcodesPDF = async (items) => {
  if (Platform.OS !== 'web') {
    alert('PDF generation is only available on web');
    return;
  }
  try {
    const {jsPDF} = await import('jspdf');
    console.log('Generating PDF for items:', items.length);
    const pdf = new jsPDF();
    let x = 10, y = 20, col = 0;

    pdf.setFontSize(16);
    pdf.text('Barcode Labels', 10, 10);

    for (const item of items) {
      console.log('Fetching barcode for:', item.sku);
      const barcodeImg = await fetchBarcodeImage(item.sku);
      
      pdf.addImage(barcodeImg, 'PNG', x, y, 60, 20);
      pdf.setFontSize(10);
      pdf.text(item.name, x, y + 25, {maxWidth: 60});
      pdf.setFontSize(8);
      pdf.text(`SKU: ${item.sku}`, x, y + 30);

      col++;
      if (col === 3) {
        col = 0;
        y += 40;
        x = 10;
        if (y > 250) {
          pdf.addPage();
          y = 20;
        }
      } else {
        x += 70;
      }
    }

    console.log('Opening PDF preview...');
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfUrl, '_blank');
    
    if (!newWindow) {
      console.log('Popup blocked, downloading instead');
      pdf.save('barcodes.pdf');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

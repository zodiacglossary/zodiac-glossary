import React from "react";
import { PDFDocument } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit';

const PdfViewer = () => {
  const generatePdf = async () => {
    try {
      const fontUrl = '/fonts/EBGaramond-Regular.ttf';
      const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());

      // Step 2: Create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // Step 3: Register fontkit with the PDFDocument
      pdfDoc.registerFontkit(fontkit);

      // Step 4: Embed the EB Garamond font
      const customFont = await pdfDoc.embedFont(fontBytes);

      // Step 5: Add a page and draw text using the custom font
      const page = pdfDoc.addPage([600, 400]);
      page.drawText("Hello, PDF-Lib with EB Garamond!", {
        x: 50,
        y: 300,
        size: 24,
        font: customFont,
      });

      // Step 6: Save the PDF and trigger a download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "example.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <h1>PDF Generator with EB Garamond</h1>
      <button onClick={generatePdf}>Generate PDF</button>
    </div>
  );
};

export default PdfViewer;

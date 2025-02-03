import React, { useState, useEffect } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

// import unicodeFontBytes from '../../../Fonts/Symbola.ttf';


import styles from '../AdvancedSearch.module.css';

const PdfViewer = props => {
  // const glossary = props.glossary;
  // console.log(props.searchResults)
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  const [fontName, setFontName] = React.useState('');
  
  const createPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Embed fonts
    let customFont, customFontBold;
    try {
      // const fontUrl = '/fonts/EBGaramond-Regular.ttf';
      // const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
      // customFont = await pdfDoc.embedFont(fontBytes);

      let fontFile;
      fontFile = '../../../Fonts/new_athena_unicode.ttf';
      // fontFile = '../../../Fonts/EBGaramond-Regular.ttf';
      const unicodeFontBytes = await fetch(fontFile)
        .then(res => res.arrayBuffer())
        .catch(err => console.error("Font load error:", err));
      console.log(unicodeFontBytes)
      customFont = await pdfDoc.embedFont(unicodeFontBytes);
      // customFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      setFontName('EB Garamond');
    } catch(error) {
      console.error(error)
      customFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      // const customFontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      setFontName('Times Roman');
    }

    // console.log(customFont)
    customFontBold = customFont;

    // Add a page
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    
    // Title
    const titleFontSize = 30;
    page.drawText('Glossary', {
      x: 50,
      y: height - 50,
      size: titleFontSize,
      font: customFont,
      color: rgb(0, 0, 0),
    });

    // Glossary terms and definitions
    const glossary = [
      { term: 'Hieroglyphs', definition: 'A formal writing system used in ancient Egypt, composed of symbols. What\'s actually going to happen here if the line gets too long? What if I don\'t use the helper function?' },
      { term: 'Papyrus', definition: 'A plant-based material ancient Egyptians used as a writing surface.' },
      { term: 'Pharaoh', definition: 'The title used by the rulers of ancient Egypt.' },
      { term: 'Mummification', definition: 'A process used by ancient Egyptians to preserve bodies for the afterlife.' },
      { term: 'Sarcophagus', definition: 'A stone coffin, often adorned with inscriptions and used in ancient Egypt.' },
      { term: 'ἀβελιακός', definition: 'A stone coffin, often adorned with inscriptions and used in ancient Egypt.' },
      { term: 'בּוּל', definition: 'A stone coffin, often adorned with inscriptions and used in ancient Egypt.' },
      { term: 'ⲁϭⲏⲗⲱ', definition: 'A stone coffin, often adorned with inscriptions and used in ancient Egypt.' },
    ];

    const termFontSize = 14;
    const definitionFontSize = 12;
    const lineHeight = 20;
    let yPosition = height - 100;

    glossary.forEach(({ term, definition }) => {
      if (yPosition < 100) {
        // Add a new page if space runs out
        page = pdfDoc.addPage([600, 800]);
        yPosition = height - 50;
      }

      // Draw the term in bold
      page.drawText(term, {
        x: 50,
        y: yPosition,
        size: termFontSize,
        font: customFontBold,
        color: rgb(0, 0, 0),
      });

      // Draw the definition in regular font
      const definitionLines = splitTextIntoLines(definition, 480, definitionFontSize, customFont);
      definitionLines.forEach(line => {
        yPosition -= lineHeight;
        page.drawText(line, {
          x: 60, // Indent for the definition
          y: yPosition,
          size: definitionFontSize,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });

      yPosition -= lineHeight; // Add extra space between terms
    });

    const pdfBytes = await pdfDoc.save();

    // Convert the PDF bytes to Base64
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(pdfBytes))
    );

    // Prepend the required Data URL scheme
    const dataUrl = `data:application/pdf;base64,${base64String}`;

    // Update state with the Data URL
    setPdfDataUrl(dataUrl);
  };

  useEffect(() => {
    createPdf();
  }, []);

  return (
    <div>
      <h1>PDF Viewer</h1>
      <h2>{fontName}</h2>
      {pdfDataUrl ? (
        <>
          <a href={pdfDataUrl} download="glossary.pdf">
            Download PDF
          </a>
          <br />
          <iframe
            title="PDF Viewer"
            src={pdfDataUrl}
            className={styles.pdfViewer}
            width="600"
            height="400"
          />
        </>
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

const splitTextIntoLines = (text, maxWidth, fontSize, font) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  words.forEach(word => {
    const width = font.widthOfTextAtSize(currentLine + word, fontSize);
    if (width <= maxWidth) {
      currentLine += (currentLine.length === 0 ? '' : ' ') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
};

export default PdfViewer;



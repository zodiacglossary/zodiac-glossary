import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { vfs } from './vfs_fonts';

// Register the custom font
// pdfMake.vfs = { ...pdfMake.vfs, ...vfs };

const fonts = {
  Symbola: {
    normal: 'http://localhost:3000/fonts/Symbola.ttf',
  },
	'New Athena Unicode': {
		normal: 'http://localhost:3000/fonts/new_athena_unicode.ttf'
	}
};

// PDF content
const docDefinition = {
  content: [
    { text: 'ἀβελιακός – בּוּל — ⲁ ⲃ ⲅ ⲇ ⲉ ⲍ ⲏ ⲑ ⲓ', font: 'New Athena Unicode', fontSize: 20 },
    { text: 'ἀβελιακός – בּוּל — ⲁ ⲃ ⲅ ⲇ ⲉ ⲍ ⲏ ⲑ ⲓ', font: 'Symbola', fontSize: 20 },
  ],
  defaultStyle: { font: 'New Athena Unicode' }
};

// Generate and download the PDF
pdfMake.createPdf(docDefinition, null, fonts).download('Coptic_PDF.pdf');



const PdfViewer2 = props => {

	return <></>;
};

export default PdfViewer2;
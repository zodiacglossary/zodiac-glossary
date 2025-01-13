import React from 'react';
import { Font, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';


Font.register({
	family: 'EB Garamond',
  fonts: [
    {
      src: '/fonts/EBGaramond-Regular.ttf', // Replace with the path to your font file
    },
    {
      src: '/fonts/EBGaramond-Bold.ttf', // Optional: Bold variant
      fontWeight: 'bold',
    },
    {
      src: '/fonts/EBGaramond-Italic.ttf', // Optional: Italic variant
      fontStyle: 'italic',
    },
  ],
});

// Define styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    border: '1px solid #ccc',
  },
  text: {
    fontFamily: 'EB Garamond', // Use the registered font
    fontSize: 14,
  },
});

// PDFDocument component
const PDFDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.text}>
          This is a PDF generated using @react-pdf/renderer with EB Garamond font.
        </Text>
      </View>
    </Page>
  </Document>
);

export default PDFDocument;

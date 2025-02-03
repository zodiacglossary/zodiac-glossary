import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PDFDocument from './PDFDocument';

const PdfGlossary = props => (
  <div style={{ height: '100vh' }}>
    <PDFViewer width="100%" height="100%">
      <PDFDocument searchResults={props.searchResults} />
    </PDFViewer>
  </div>
);

export default PdfGlossary;
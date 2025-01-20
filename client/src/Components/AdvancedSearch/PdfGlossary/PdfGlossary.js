import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import AdvancedSearchResults from "./AdvancedSearchResults";
import AdvancedSearchBuilder from "./AdvancedSearchBuilder";
import PDFDocument from './PDFDocument';

import styles from './AdvancedSearch.module.css';

const PdfGlossary = () => (
  
  <div className={styles.content}>
  <div className={styles.container}>
    <h1>Advanced Search</h1>
    <AdvancedSearchBuilder runAdvancedSearch={runAdvancedSearch} resetSearchResults={resetSearchResults} />
    <div style={{ height: '100vh' }}>
      <PDFViewer width="100%" height="100%">
        <PDFDocument />
      </PDFViewer>
    </div>
    <AdvancedSearchResults searchResults={searchResults} />
  </div>
</div>
);

export default PdfGlossary;
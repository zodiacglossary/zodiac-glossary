import React, {useState} from 'react';
import styles from './AdvancedSearch.module.css';

const PdfExportButton = ({ lemmaIds }) => {
  const [loading, setLoading] = useState(false);
  const [includeSpellingVariants, setIncludeSpellingVariants] = useState(true);
  const [includeQuotations, setIncludeQuotations] = useState(true);

  const handleDownload = async () => {
    setLoading(true);
    try {
        const requestBody = {
            lemmaIds,
            includeSpellingVariants,
            includeQuotations,
        };

      const response = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'glossary.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    } finally {
        setLoading(false)
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeSpellingVariants}
            onChange={() => setIncludeSpellingVariants(!includeSpellingVariants)}
          />
          Include spelling variants
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeQuotations}
            onChange={() => setIncludeQuotations(!includeQuotations)}
          />
          Include quotations
        </label>
      </div>
      <button onClick={handleDownload} disabled={loading}>
        {loading ? 'Downloading...' : 'Download PDF'}
      </button>
    </div>
  );
};

export default PdfExportButton;
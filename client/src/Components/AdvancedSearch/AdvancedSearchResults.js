import React from 'react';

import AdvancedSearchResult from "./AdvancedSearchResult.js";
import PdfExportButton from './PdfExportButton.js';

const AdvancedSearchResults = ({searchResults, sortingCriteria, searchTerms}) => {

  if (searchResults.length === 0) {
    return <><br /><br /><br /><br /></>;
  }


  return (
    <>
      <h2>Results</h2>
      <PdfExportButton searchTerms={searchTerms} sortingCriteria={sortingCriteria} lemmaIds={searchResults.map(x => x.lemma_id)} />
      <ol>
        {(searchResults.length === 0 ? (<li>Results will appear here...</li>) :
          searchResults.map((result, i) => (
            <AdvancedSearchResult result={result} key={i} />
          ))
        )}
      </ol>
    </>
  )
};

export default AdvancedSearchResults;
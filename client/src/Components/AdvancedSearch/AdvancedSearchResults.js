import React from 'react';

import AdvancedSearchResult from "./AdvancedSearchResult.js";
import PdfExportButton from './PdfExportButton.js';

const AdvancedSearchResults = props => {

  if (props.searchResults.length === 0) {
    return <><br /><br /><br /><br /></>;
  }

  console.log(props.searchResults)

  return (
    <>
      <h2>Results</h2>
      <PdfExportButton lemmaIds={props.searchResults.map(x => x.lemma_id)} />
      <ol>
        {(props.searchResults.length === 0 ? (<li>Results will appear here...</li>) :
          props.searchResults.map((result, i) => (
            <AdvancedSearchResult result={result} key={i} />
          ))
        )}
      </ol>
    </>
  )
};

export default AdvancedSearchResults;
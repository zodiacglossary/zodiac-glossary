import React from 'react';

import AdvancedSearchResult from "./AdvancedSearchResult.js";

const AdvancedSearchResults = props => {

  if (props.searchResults.length === 0) {
    return <></>;
  }
  
  return (
    <>
      <h2>Results</h2>
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
import React from 'react';

const AdvancedSearchResults = props => {

  return (
    <>
      <h2>Results</h2>
      <ol>
        <li>Results will go here...</li>
        <li>{JSON.stringify(props.searchResults)}</li>
      </ol>
    </>
  )
};

export default AdvancedSearchResults;
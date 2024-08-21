import React from 'react';

const AdvancedSearchResult = props => {
  const result = props.result;
  return (
    <li style={(result.published ? {} : {fontStyle: 'italic'})}>
      <a 
        href={"/"+result.lemma_id} 
        target="_blank" 
        rel="noopener noreferrer"
        // onClick={e => checkLemmaChange(lemma.lemmaId, true)}
      >
        <span style={(result.published ? {} : {fontStyle: 'italic'})}>{result.disp_transliteration} | {result.disp_original} | {result.disp_meaning}</span>
      </a>
    </li>
  );
};

export default AdvancedSearchResult;
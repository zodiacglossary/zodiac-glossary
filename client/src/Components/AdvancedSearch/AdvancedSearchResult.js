import React from 'react';

const AdvancedSearchResult = props => {

  const result = props.result;

  return (
    <>
      <li>
        <a 
          href={"/"+result.lemma_id} 
          target="_blank" 
          rel="noopener noreferrer"
          // onClick={e => checkLemmaChange(lemma.lemmaId, true)}
        >
          {result.disp_transliteration} | {result.disp_original} | {result.disp_meaning}
        </a>
      </li>
    </>
  )
};

export default AdvancedSearchResult;
import React from 'react';

import Collapsible from "react-collapsible";
import {MdExpandMore, MdExpandLess} from 'react-icons/md';

const AdvancedSearchResult = props => {
  const result = props.result;
  const publishedStyle = (result.published ? {} : {fontStyle: 'italic'});

  return (
    <li>
      <a 
        href={"/"+result.lemma_id} 
        target="_blank" 
        rel="noopener noreferrer"
        // onClick={e => checkLemmaChange(lemma.lemmaId, true)}
      >
        <span style={publishedStyle}>{result.disp_transliteration} | {result.disp_original} | {result.disp_meaning}</span>
        {/* <Collapsible 
          trigger={<MdExpandMore />}
          triggerWhenOpen={<MdExpandLess />}
          contentContainerTagName="span"
          transitionTime={200}
        >
          <ul>
            <li>
              Meaning 1 
              <Collapsible 
                trigger={<MdExpandMore />}
                triggerWhenOpen={<MdExpandLess />}
                contentContainerTagName="span"
                transitionTime={200}
              >
                <ul>
                  <li>
                    Category 1
                  </li>
                </ul>
              </Collapsible>
            </li>
          </ul>
        </Collapsible> */}
      </a>
    </li>
  );
};

export default AdvancedSearchResult;
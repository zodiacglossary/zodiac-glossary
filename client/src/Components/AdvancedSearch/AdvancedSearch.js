import React from 'react';

import styles from './AdvancedSearch.module.css';

import AdvancedSearchResults from "./AdvancedSearchResults";
import AdvancedSearchBuilder from "./AdvancedSearchBuilder";

import PdfGlossary from './PdfGlossary/PdfGlossary';

import UserContext from '../../Contexts/UserContext';

import { runAdvancedSearchDB } from "../../Data/api";

const AdvancedSearch = props => {
  const {user} = React.useContext(UserContext);

  let [searchResults, setSearchResults] = React.useState([]);

  // This function takes the list of search terms and organizes it into an object that easily
  // becomes the WHERE clause of the SQL query
  // In the SQL query, multiple different field conditions are joined with AND
  // multiple conditions for the same field are joined with OR
  const organizeSearchTerms = searchTerms => {
    let whereComponents = [];
  
    searchTerms = searchTerms.map(term => {
      term.fieldName = term.field;
      term.uniqueTableField = term.table + '|' + term.field;
      return term;
    });
  
    for (let term of searchTerms) {
      // Make sure that there's actually a search term there and that the default null value isn't selected in a dropdown
      if (term.term && !(term.inputType === 'dropdown' && parseInt(term.term) === 0)) {
        let matchedComp = whereComponents.find(comp => comp.uniqueTableField === term.uniqueTableField);
        if (matchedComp) {
          matchedComp.conditions.push(matchedComp.type === 'string' ? term.term : parseInt(term.term));
        } else {
          whereComponents.push({
            uniqueTableField: term.uniqueTableField,
            fieldName: term.fieldName,
            type: (term.inputType === 'text' ? 'string' : 'integer'),
            conditions: [ (term.inputType === 'text' ? term.term : parseInt(term.term)) ],
          });
        }
      }
    }
    return whereComponents;
  };

  const runAdvancedSearch = searchTerms => {
    runAdvancedSearchDB(organizeSearchTerms(searchTerms), setSearchResults, user.token);
  };

  const resetSearchResults = () => {
    // Search builder has already been reset to defaults in sub-component
    setSearchResults([]);
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Advanced Search</h1>
        <AdvancedSearchBuilder runAdvancedSearch={runAdvancedSearch} resetSearchResults={resetSearchResults} />
          {/* <PdfGlossary searchResults={searchResults} /> */}
        <AdvancedSearchResults searchResults={searchResults} />
      </div>
    </div>
  )
};

export default AdvancedSearch;
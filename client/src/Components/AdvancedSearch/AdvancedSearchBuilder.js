import React from 'react';

import styles from './AdvancedSearch.module.css';

import AdvancedSearchEntry from "./AdvancedSearchEntry";

import { IoIosAddCircle } from "react-icons/io";

import { searchFieldTypes } from '../../Data/options';

// const searchTermsInitial = [
//   { termNumber: 1, table: 'lemmata',  field: 'language_id',  term: '7', inputType: 'dropdown', },
//   { termNumber: 2, table: 'lemmata',  field: 'language_id',  term: '3', inputType: 'dropdown', },
//   { termNumber: 3, table: 'lemmata',  field: 'language_id',  term: '4', inputType: 'dropdown', },
//   { termNumber: 4, table: 'meanings', field: 'value',        term: 'test', inputType: 'text', },
//   { termNumber: 5, table: 'meanings', field: 'value',        term: 'a', inputType: 'text', },
// ];

const searchTermsInitial = [
  { termNumber: 1, table: 'lemmata',  field: 'l.language_id',  term: '', inputType: 'dropdown', },
  { termNumber: 2, table: 'meanings', field: 'm.value',        term: '', inputType: 'text', },
  { termNumber: 3, table: 'meanings', field: 'm.category',     term: '', inputType: 'text', },
];

const AdvancedSearchBuilder = props => {

  let [searchTerms, setSearchTerms] = React.useState(JSON.parse(JSON.stringify(searchTermsInitial)));

  // Figure out what sort of input is needed based on the chosen search field
  // Some fields have text inputs, some dropdowns
  const getInputType = (searchTable, searchField) => {
    try {
      let inputType = searchFieldTypes.find(searchFieldType => {
        return (searchFieldType.table === searchTable) && (searchFieldType.field === searchField);
      }).inputType;
      return inputType;
    } catch (error) {
      return 'text';
    }
  };

  const onFieldChange = (e, termNumber) => {
    console.log(e.target.value)
    setSearchTerms(prevSearchTerms =>
      prevSearchTerms.map(searchTerm => {
        if (searchTerm.termNumber === termNumber) {
          let newTableField = e.target.value.split('|');  // Gotta put both table and field together to avoid collisions in field names
          searchTerm.table = newTableField[0];
          searchTerm.field = newTableField[1];
          searchTerm.inputType = getInputType(newTableField[0], newTableField[1]);
          searchTerm.term = '';
          return searchTerm;
        }
        return searchTerm;
      })
    );
    console.log('onFieldChange()', searchTerms);
  };

  const onTermChange = (termNumber, newTerm, newInputType) => {
    setSearchTerms(prevSearchTerms =>
      prevSearchTerms.map(searchTerm => {
        if (searchTerm.termNumber === termNumber) {
          searchTerm.term = newTerm;
          // searchTerm.inputType = newInputType;        // Needed to override previous value in case of search field change. Probably should happen in onFieldChange() but easier to implement here
          return searchTerm;
        }
        return searchTerm;
      })
    );
    console.log('onTermChange()', searchTerms);
  };

  const addNewSearchTerm = e => {
    setSearchTerms(prevSearchTerms => {
      return [
        ...prevSearchTerms,
        { termNumber: Math.max(...prevSearchTerms.map(term=>term.termNumber))+1, table: 'lemmata',  field: 'language_id',  term: '', inputType: 'dropdown', }
      ];
    })
  };

  const deleteSearchTerm = termNumber => {
    setSearchTerms(prevSearchTerms => {
      return prevSearchTerms.filter(term => term.termNumber !== termNumber);
    });
  };

  const runAdvancedSearch = e => {
    props.runAdvancedSearch(searchTerms);
  };

  const resetSearch = e => {
    setSearchTerms(JSON.parse(JSON.stringify(searchTermsInitial)));
    props.resetSearchResults();
  };

  return (
    <>
      <h2>Build a search</h2>
      <table><tbody>
        { searchTerms.map((term, termIndex) => {
          return (
            <AdvancedSearchEntry
              key={term.termNumber}
              termNumber={term.termNumber}
              table={term.table}
              field={term.field}
              term={term.term}
              onFieldChange={onFieldChange}
              onTermChange={onTermChange}
              deleteSearchTerm={deleteSearchTerm}
            />
          );
        })}
        <tr><td>
        <button className={styles.add} onClick={addNewSearchTerm}><IoIosAddCircle /></button>
        </td></tr>
      </tbody></table>

      <button onClick={e => runAdvancedSearch(e)}>Search</button>
      <button onClick={e => resetSearch(e)}>Reset</button>
    </>
  )
};

export default AdvancedSearchBuilder;
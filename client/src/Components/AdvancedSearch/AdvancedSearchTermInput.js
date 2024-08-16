import React from 'react';

import styles from './AdvancedSearch.module.css';

import { searchFieldTypes, optionLists } from '../../Data/options';

const AdvancedSearchTermInput = props => {

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

  // Get a list for the dropdown where needed
  const getOptionsList = (searchTable, searchField) => {
    let objectName = searchFieldTypes.find(searchFieldType => {
      return (searchFieldType.table === searchTable) && (searchFieldType.field === searchField);
    }).objectName;

    let optionList = optionLists.find(optionList => {
      return optionList.name === objectName;
    });

    if (optionList)
      return optionList.object;
    return [];
  };

  // Use different UI components depending on text input or dropdown
  if (getInputType(props.table, props.field) === 'text') {
    return (
      <input
        className={styles.inputWide}
        type="text"
        id={props.termNumber}
        name="editor"
        placeholder="search term"
        value={props.term}
        onChange={e => props.onTermChange(props.termNumber, e.target.value, 'text')}
      />
    )
  } else {
    return (
      <select 
        className={styles.input} 
        name="search_term" 
        id="search_term" 
        value={props.term}
        onChange={e => props.onTermChange(props.termNumber, e.target.value, 'dropdown')}
      >
        {getOptionsList(props.table, props.field).map(option => {
          // Create an empty default for new data
          if (!option.value)
            return (
              <option disabled key={option.id} value={option.id}>{option.label}</option>
            );
          return (
            <option key={option.id} value={option.id}>{option.label}</option>
          );
        })}
      </select>
    );
  }
};

export default AdvancedSearchTermInput;
import React from 'react';

import styles from './AdvancedSearch.module.css';

import AdvancedSearchResults from "./AdvancedSearchResults";
import AdvancedSearchBuilder from "./AdvancedSearchBuilder";

import UserContext from '../../Contexts/UserContext';

import { runAdvancedSearchDB } from "../../Data/api";

const AdvancedSearch = props => {
  const {user} = React.useContext(UserContext);

  let [searchResults, setSearchResults] = React.useState([]);

  const runAdvancedSearch = searchTerms => {
    console.log('runAdvancedSearch()', searchTerms);

    runAdvancedSearchDB(searchTerms, setSearchResults, user.token);
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Advanced Search</h1>
        <AdvancedSearchBuilder runAdvancedSearch={runAdvancedSearch} />
        <AdvancedSearchResults searchResults={searchResults} />
      </div>
    </div>
  )
};

export default AdvancedSearch;
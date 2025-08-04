import React from 'react';

import styles from './AdvancedSearch.module.css';

import AdvancedSearchResults from "./AdvancedSearchResults";
import AdvancedSearchBuilder from "./AdvancedSearchBuilder";

import PdfGlossary from './PdfGlossary/PdfGlossary';

import UserContext from '../../Contexts/UserContext';

import { runAdvancedSearchDB } from "../../Data/api";

const AdvancedSearch = props => {
  const { user } = React.useContext(UserContext);

  let [searchResults, setSearchResults] = React.useState([]);

  // This function takes the list of search terms and organizes it into an object that easily
  // becomes the WHERE clause of the SQL query
  // In the SQL query, multiple different field conditions are joined with AND
  // multiple conditions for the same field are joined with OR
  const organizeSearchTerms = (searchTerms) => {
    let whereComponents = [];

    searchTerms = searchTerms.map((term) => {
      term.fieldName = term.field;
      term.uniqueTableField = term.table + "|" + term.field;
      return term;
    });

    for (let term of searchTerms) {
      // Make sure that there's actually a search term there and that the default null value isn't selected in a dropdown
      if (
        term.term &&
        !(term.inputType === "dropdown" && parseInt(term.term) === 0)
      ) {
        let matchedComp = whereComponents.find(
          (comp) => comp.uniqueTableField === term.uniqueTableField
        );
        if (matchedComp) {
          matchedComp.conditions.push(
            matchedComp.type === "string" ? term.term : parseInt(term.term)
          );
        } else {
          whereComponents.push({
            uniqueTableField: term.uniqueTableField,
            fieldName: term.fieldName,
            type: term.inputType === "text" ? "string" : "integer",
            conditions: [
              term.inputType === "text" ? term.term : parseInt(term.term),
            ],
          });
        }
      }
    }
    return whereComponents;
  };

  /**
   * Returns a comparison function that sorts items based on their position in a given list.
   * @param {Array<string>} list - The list of items to sort by.
   * @returns {function} A comparison function for sorting.
   */
  function sortingKeyFromList(list) {
    return (a, b) => {
      console.log("sorting on list", list);
      const indexA = list.indexOf(a.toLowerCase());
      const indexB = list.indexOf(b.toLowerCase());

      if (indexA !== -1 && indexB !== -1) {
        // If both terms are in the list, sort by their order
        return indexA - indexB;
      } else if (indexA !== -1) {
        // If a is in the list and b is not, a comes first
        return -1;
      } else if (indexB !== -1) {
        // If b is in the list and a is not, b comes first
        return 1;
      } else {
        // If neither are in the list, maintain their relative order
        return 0;
      }
    };
  }

  /**
   * Collates multiple sorting keys into a single comparison function.
   * This function allows sorting of items based on multiple criteria in a specified order,
   * applying the ones further back in the list each time a stalemate arises from an earlier one.
   * @param {Array<function>} sortingKeys - An array of sorting key functions.
   * @returns {function} A comparison function that uses the provided sorting keys.
   */
  function collateSortingKeys(sortingKeys) {
    return (a, b) => {
      let result = 0;
      for (const key of sortingKeys) {
        result ||= key(a, b);
      }
      return result;
    };
  }

  const sortingFunctions = {
    zodiac: sortingKeyFromList([
        "aries",
        "taurus",
        "gemini",
        "cancer",
        "leo",
        "virgo",
        "libra",
        "scorpio",
        "sagittarius",
        "capricorn",
        "aquarius",
        "pisces",
    ]),
    planets_babylonian: sortingKeyFromList([
        "moon",
        "sun",
        "jupiter",
        "venus",
        "saturn",
        "mercury",
        "mars",
    ]),
    planets_weekday: sortingKeyFromList([
        "sun",
        "moon",
        "mars",
        "mercury",
        "jupiter",
        "venus",
        "saturn",
    ]),
    planets_heliocentric: sortingKeyFromList([
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
    ]),
    planets_geocentric: sortingKeyFromList([
        "moon",
        "mercury",
        "venus",
        "sun",
        "mars",
        "jupiter",
        "saturn",
    ]),
    decans: sortingKeyFromList(
        // generate list of: decan 1, decan 2, decan 3, ...
        Array.from({ length: 36 }, (_, index) => `decan ${index + 1}`)
    ),
    alphabetical: (a, b) => a.localeCompare(b),
};

  const applySortingCriteria = (sortingCriteria, data) => {
    const key = collateSortingKeys(sortingCriteria.map(criterionName => sortingFunctions[criterionName]));
    return data.sort((a, b) => key(a.disp_meaning, b.disp_meaning));
  };

  const runAdvancedSearch = (searchTerms, sortingCriteria) => {
    runAdvancedSearchDB(
      organizeSearchTerms(searchTerms),
      (data) => {
        console.log(data);
        setSearchResults(applySortingCriteria(sortingCriteria, data));
      },
      user.token
    );
  };

  const resetSearchResults = () => {
    // Search builder has already been reset to defaults in sub-component
    setSearchResults([]);
  };

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Advanced Search</h1>
        <AdvancedSearchBuilder
          runAdvancedSearch={runAdvancedSearch}
          resetSearchResults={resetSearchResults}
        />
        {/* <PdfGlossary searchResults={searchResults} /> */}
        <AdvancedSearchResults searchResults={searchResults} />
      </div>
    </div>
  );
};

export default AdvancedSearch;
import React, { Component } from "react";

import styles from "./Graph.module.css";

import { createGraph } from "./Graph";
import { getLemmataList } from "../../Data/api";
import UserContext from "../../Contexts/UserContext";

const Categories = (props) => {
  const { user } = React.useContext(UserContext);
  let [lemmataList, setLemmataList] = React.useState([]);

  React.useEffect(() => {
    getLemmataList(setLemmataList, user.token);
  }, [user.token]);

  React.useEffect(() => {
    const lemmaExists = (id) => lemmataList.some((x) => x.lemmaId === id);

    console.log(lemmataList);
    if (lemmataList.length > 0) {
      const links = lemmataList
        .flatMap((lemma) =>
          lemma.meanings.map((meaning) => ({
            source: lemma.lemmaId,
            target: meaning.category,
            id: `${lemma.original}: ${meaning.value} (${meaning.category})`,
          }))
        )
        .filter((mapping) => lemmaExists(mapping.source) && mapping.target);

      createGraph(
        lemmataList
          .map((lemma) => ({
            ...lemma,
            id: lemma.lemmaId,
          }))
          .concat(
            [
              ...new Set(
                lemmataList.flatMap((lemma) =>
                  lemma.meanings.map((meaning) => meaning.category)
                )
              ),
            ].map((c) => ({
              id: c,
              isCategory: true,
            }))
          ),
        links
      );
    }
  }, [lemmataList]);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Categories</h1>
      </div>
    </div>
  );
};

export default Categories;

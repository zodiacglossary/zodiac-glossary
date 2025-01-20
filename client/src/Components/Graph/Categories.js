import React from "react";

import styles from "./Graph.module.css";

import { getLemmataList } from "../../Data/api";
import UserContext from "../../Contexts/UserContext";
import { graphOptions, languageColor, lemmaExists, openLemma } from "./Graph";
import { Network } from "vis-network";
import { v4 } from "uuid";

const Categories = (props) => {
  const { user } = React.useContext(UserContext);
  let [lemmataList, setLemmataList] = React.useState([]);

  // Needed to apply style to <body> without affecting all other components – CDC 2024-12-18
  React.useEffect(() => {
    document.body.classList.add(styles.graphBodyStyle);
    return () => document.body.classList.remove(styles.graphBodyStyle);
  }, []);

  React.useEffect(() => {
    getLemmataList(setLemmataList, user.token);
  }, [user.token]);

  React.useEffect(() => {
    if (lemmataList.length > 0) {
      const categories = [
        ...new Set(
          lemmataList.flatMap((lemma) =>
            lemma.meanings.map((meaning) => meaning.category)
          )
        ),
      ];

      const lemmaExists = (id) => lemmataList.some((x) => x.lemmaId === id);

      const nodes = lemmataList
        .map((lemma) => ({
          ...lemma,
          label: lemma.transliteration || lemma.original,
          id: lemma.lemmaId,
          color: languageColor(lemma.language),
        }))
        .concat(
          categories.map((x) => ({
            id: "category:" + x,
            color: "#fff",
            label: x,
            shape: "box",
          }))
        );

      const edges = lemmataList
        .flatMap((lemma) =>
          lemma.meanings.map((meaning) => ({
            from: lemma.lemmaId,
            to: "category:" + meaning.category,
            id: v4(),
          }))
        )
        .filter((crossLink) => lemmaExists(crossLink.from));

      const network = new Network(
        document.getElementById("crosslinks-graph"),
        { nodes, edges },
        graphOptions
      );
      network.on("doubleClick", openLemma);
    }
  }, [lemmataList]);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Categories</h1>
        <div style={{ height: 80 + "vh" }} id="crosslinks-graph"></div>
      </div>
    </div>
  );
};

export default Categories;

import React from "react";

import styles from "./Graph.module.css";

import { getCrosslinks, getLemmataList } from "../../Data/api";
import UserContext from "../../Contexts/UserContext";
import { Network } from "vis-network";
import { graphOptions, languageColor, lemmaExists, openLemma } from "./Graph";

const CrossReferences = (props) => {
  const { user } = React.useContext(UserContext);
  let [lemmataList, setLemmataList] = React.useState([]);
  let [crosslinks, setCrosslinks] = React.useState([]);

  // Needed to apply style to <body> without affecting all other components – CDC 2024-12-18
  React.useEffect(() => {
    document.body.classList.add(styles.graphBodyStyle);
    return () => document.body.classList.remove(styles.graphBodyStyle);
  }, []);

  React.useEffect(() => {
    getLemmataList(setLemmataList, user.token);
  }, [user.token]);
  React.useEffect(() => {
    getCrosslinks(setCrosslinks, user.token);
  }, [user.token]);

  React.useEffect(() => {
    if (lemmataList.length > 0 && crosslinks.length > 0) {
      const lemmaExists = (id) => lemmataList.some((x) => x.lemmaId === id);

      const nodes = lemmataList.map((lemma) => ({
        ...lemma,
        label: lemma.transliteration || lemma.original,
        id: lemma.lemmaId,
        color: languageColor(lemma.language),
      }));

      const edges = crosslinks
        .map((crossLink) => ({
          from: crossLink.lemma_id,
          to: crossLink.link,
          id: `${crossLink.lemma_id}↔${crossLink.link}`,
        }))
        .filter(
          (crossLink) =>
            lemmaExists(crossLink.to) && lemmaExists(crossLink.from)
        );

      const network = new Network(
        document.getElementById("crosslinks-graph"),
        { nodes, edges },
        graphOptions
      );
      network.on("doubleClick", openLemma);
    }
  }, [lemmataList, crosslinks]);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Cross links</h1>
        <div style={{ height: 80 + "vh" }} id="crosslinks-graph"></div>
      </div>
    </div>
  );
};

export default CrossReferences;

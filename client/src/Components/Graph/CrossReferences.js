import React, { Component } from "react";

import styles from "./Graph.module.css";

import { createGraph } from "./Graph";
import { getCrosslinks, getLemmataList } from "../../Data/api";
import UserContext from "../../Contexts/UserContext";

const CrossReferences = (props) => {
  const { user } = React.useContext(UserContext);
  let [lemmataList, setLemmataList] = React.useState([]);
  let [crosslinks, setCrosslinks] = React.useState([]);

  React.useEffect(() => {
    getLemmataList(setLemmataList, user.token);
  }, [user.token]);
  React.useEffect(() => {
    getCrosslinks(setCrosslinks, user.token);
  }, [user.token]);

  React.useEffect(() => {
    const lemmaExists = (id) => lemmataList.some((x) => x.lemmaId === id);

    console.log(lemmataList, crosslinks);
    if (lemmataList.length > 0 && crosslinks.length > 0) {
      createGraph(
        lemmataList.map((lemma) => ({
          ...lemma,
          id: lemma.lemmaId,
        })),
        crosslinks
          .map((crossLink) => ({
            source: crossLink.lemma_id,
            target: crossLink.link,
            id: `${crossLink.lemma_id}↔${crossLink.link}`,
          }))
          .filter(
            (crossLink) =>
              lemmaExists(crossLink.source) && lemmaExists(crossLink.target)
          )
      );
    }
  }, [lemmataList, crosslinks]);

  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <h1>Cross links</h1>
      </div>
    </div>
  );
};

export default CrossReferences;

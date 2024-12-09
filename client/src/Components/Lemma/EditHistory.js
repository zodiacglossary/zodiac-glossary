import React from "react";

import styles from './Lemma.module.css';

const EditHistory = props => {
  const lemma = props.lemma;
  const edits = props.edits;

  const [showAll, setShowAll] = React.useState(false);

  if (!lemma) {
    return <></>;
  }

  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return (
    <div className={styles.crossLinks}>
      <h3>Edit History</h3>
      <table><tbody>
      {edits.length ? "" : (<tr><td>Loading edit history...</td></tr>)}
      {edits.map((edit, i) => {
        if (!showAll && i >= 5) {
          return null;
        }

        return (
          <tr key={edit.id}>
            <td>
              {edits.length-i}
            </td>
            <td>
              {edit.username}
            </td>
            <td>
              {edit.timestamp.toLocaleDateString("en-US", dateFormat)}
            </td>
          </tr>
        )
      })}
      </tbody></table>
      {showAll || edits.length <= 5 || <button className={styles.sortButtons} onClick={e => setShowAll(true)}>Show all...</button>}
    </div>
  );
};

export default EditHistory;
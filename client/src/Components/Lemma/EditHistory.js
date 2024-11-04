import React from "react";
import DocumentMeta from "react-document-meta";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

// Creates a formatted list of editors for Zotero, etc.
const compileEditorList = edits => {
  let editsUnique = [];
  for (const edit of edits) {
    const matchedEdit = editsUnique.find(editUnique => editUnique.username === edit.username);
    if (matchedEdit) {
      matchedEdit.count++;
    }
    else {
      editsUnique.push({...edit, count: 1});
    }
  }
  
  editsUnique.sort((a, b) => b.count - a.count);
  let editorList = editsUnique.map(edit => [edit.last_name, edit.first_name].join(', '));
  editorList = editorList.join('; ');
  return editorList;
}

const getMostRecentEditDate = edits => {
  if (edits.length) {
    const mostRecentEvent = edits.map(edit => edit.timestamp).reduce((mostRecent, currentEvent) => {
      return new Date(currentEvent.date) > new Date(mostRecent.date) ? currentEvent : mostRecent;
    });
    return mostRecentEvent;
  }
  return new Date();
}

const EditHistory = props => {
  const lemma = props.lemma;
  const edits = props.edits;
  const {user} = React.useContext(UserContext);

  const [showAll, setShowAll] = React.useState(false);

  if (!lemma) {
    return <></>;
  }

  const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  // Get all the editors into the metadata for Zotero connector, etc.
  const metadata = {
    meta: {
      charset: 'utf-8',
      name: {
        citation_editors: compileEditorList(edits),
        citation_date: getMostRecentEditDate(edits).toLocaleDateString("de-DE"),
      }
    }
  };

  return (
    <DocumentMeta {...metadata} extend>
    <div className={styles.crossLinks}>
      <h3>Edit History</h3>
      <table><tbody>
      {edits.length ? "" : (<>Loading edit history...</>)}
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
    </DocumentMeta>
  );
};

export default EditHistory;
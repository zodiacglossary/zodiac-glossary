import React from 'react';

import styles from './Recents.module.css';

import { getRecentsListPromise, checkLemma } from '../../Data/api';
import UserContext from '../../Contexts/UserContext';

const LemmaCheck = props => {
  const [lemma, setLemma] = React.useState(props.lemma);
  const {user} = React.useContext(UserContext);

  const checkLemmaChange = (lemmaId, checked, field = "checked") => {
    // Don't mark the lemma as checked if the person clicking is the same as the editor
    if (lemma.editor === user.user.username) {
      checked = false;
    }
    checkLemma(lemmaId, checked, field, user.token);
    setLemma(prevLemma => ({
      ...prevLemma,
      [field]: checked,
    }));
    // props.updateNumChecked(lemmaId, checked);
  };

  const dateFormat = { year: 'numeric', month: 'numeric', day: 'numeric' };

  return (
    <li key={lemma.lemmaId}>
      <label htmlFor="attention">Attention </label>
      <input
        name="attention"
        type="checkbox"
        checked={lemma.attention}
        onChange={e => checkLemmaChange(lemma.lemmaId, e.target.checked, 'attention')}
      />
      &nbsp;&nbsp;
      <label htmlFor="checked">Checked </label>
      <input
        name="checked"
        type="checkbox"
        checked={lemma.checked}
        onChange={e => checkLemmaChange(lemma.lemmaId, e.target.checked)}
      />
      &nbsp;&nbsp;
      <a 
        href={"/"+lemma.lemmaId} 
        // target="_blank" 
        // rel="noopener noreferrer"
        // onClick={e => checkLemmaChange(lemma.lemmaId, true)}
      >
        — {lemma.timestamp.toLocaleDateString("de", dateFormat)} | {lemma.editor} | {lemma.transliteration} | {lemma.original} | {lemma.primary_meaning}
      </a>
    </li>
  )
};

const Recents = props => {
  const {user} = React.useContext(UserContext);

  const [lemmata, setLemmata] = React.useState([]);

  // Sort function to separate this out and make debugging easier
  // Can be refactored away as desired
  const sortLemmata = lemmata => {

    // Original method
    // l.sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1)); // sort by order created, desc
    // l.sort((a, b) => (a.attention > b.attention ? -1 : 1)); // put ones that need attention at the top  
    // l.sort((a, b) => (a.checked < b.checked ? -1 : 1)); // put checked ones at the bottom

    let l = lemmata.slice(0);

    // l = l.filter((lemma, index) => index % 30 === 0); // Decimate the list for debugging

    // Convert the timestamp into a tiny number for sorting
    // Needed to deal with the way Firefox mishandles multiple sorts
    l = l.map(lemma => {
      let timevalue = lemma.timestamp - 1577836800000; // milliseconds since 2020
      timevalue = timevalue / 1000 / 60 / 60 / 24 / 365 / 100; // convert to years / 100
      timevalue = 1 - timevalue; // Sort in descending order
      lemma.timevalue = timevalue;
      return lemma;
    })
    
    // Function that mathematically converts checkbox combo into sortable integer
    // Needed to deal with Firefox's pathological handling of the sort function
    const sortFunction = a => (1 - a.attention) + a.checked * 2 + a.timevalue;

    l.sort((a, b) => sortFunction(a) < sortFunction(b) ? -1 : 1);

    setLemmata(l);
  }

  React.useEffect(() => {
    getRecentsListPromise(user.token)
    .then(lemmata => sortLemmata(lemmata))
    .catch(error => console.error(error));
  }, [user]);


  return (
    <div className={styles.content}>
      <div className={styles.container}>
      <h1>Recent Edits to Double Check</h1>
      {lemmata.map(lemma => (<LemmaCheck key={lemma.lemmaId} lemma={lemma} />))}
      </div>
    </div>
  );
};

export default Recents;
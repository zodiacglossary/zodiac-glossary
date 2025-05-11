import React from "react";
import { IoIosAddCircle } from "react-icons/io";

import Quotation from './Quotation';
import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Quotations = props => {
  const {user} = React.useContext(UserContext);
  let quotations = props.quotations;

  // Put a flag in to display the quotations in either the old or new way for now
  // while developing the new system and troubleshooting – CDC 2025.05.05
  if (props.filterByMeaning) {
    quotations = quotations.filter(quotation => quotation.meaning_id === props.meaning.id);
  }
  
  // Separate the fn out for debugging
  // Because switch to meanings => quotes is complicated
  // This can be refactored out once everything works stably – CDC 2025.05.11
  const addNewQuotation = (e, meaning_id) => {
    console.log('addNewQuotation', meaning_id);

    props.addNewQuotation(e, meaning_id);
  }

  return (
    <div className={styles.quotations}>
      <h3>Quotations</h3>
      {quotations.map((quotation, quotationIndex) => {
        return (
          <Quotation
            key={quotation.id}
            language={props.language}
            quotation={quotation} 
            quotationIndex={quotationIndex} 
            meanings={props.meanings}
            updateQuotation={props.updateQuotation}
            deleteQuotation={props.deleteQuotation}
          />
        )
      })}
      
      {/* Fix this to include the meaning id. – CDC 2025.05.05 */}
      <div style={{display: (user.token ? 'block' : 'none')}}>
        <button className={styles.add} onClick={e => addNewQuotation(e, props.meaning?.id)}><IoIosAddCircle /></button>
      </div>
      
    </div>
  );
};

export default Quotations;
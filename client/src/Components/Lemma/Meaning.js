import React from "react";
import { IoIosTrash } from "react-icons/io";

import Categories from "./Categories";
import Quotations from "./Quotations";
import PublicLabelledText from "../PublicLabelledText";
import ResizingTextarea from "../ResizingTextarea";

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';

const Meaning = props => {
  const {user} = React.useContext(UserContext);
  const meaning = props.meaning;
  const i = props.i;
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  if (user && !user.token) {
    return (
      <div className={styles.row}>
        <h4>{i+1}</h4>
        
        <PublicLabelledText label={'Meaning'} content={meaning.value} />
        <PublicLabelledText label={'Comment'} content={meaning.comment} />
        {(meaning.categories && meaning.categories.length) ? <Categories categories={meaning.categories} /> : null}
        <Quotations
          filterByMeaning={true}
          meaning={meaning}
          quotations={props.quotations}
          language={props.language}
          meanings={props.meanings}
          updateQuotation={props.updateQuotation}
          addNewQuotation={props.addNewQuotation}
          deleteQuotation={props.deleteQuotation}
        />
      </div>
    )
  }

  return (
    <>
    <div 
      onMouseEnter={e => {
        if (user.token)
          setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
    >
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"meaning_"+meaning.id}>{i+1}</label>
        <input
          style={{display: (user.token || meaning.value ? 'inline' : 'none')}}
          className={styles.inputMeaning}
          type="text"
          name={"meaning_"+meaning.id}
          id={"meaning_"+meaning.id}
          placeholder="meaning"
          value={meaning.value}
          onChange={e => props.updateMeaning('value', e.target.value, meaning.id)}
        />
        {/* <textarea
          style={{
            display: (user.token || meaning.comment ? 'inline' : 'none'),
            height: `${Math.max(meaning.comment.length / 35, 2) * 1.2}vw`,
          }}
          className={styles.inputMeaning}
          name={"comment_"+meaning.id}
          id={"comment_"+meaning.id}
          placeholder={user.token ? "comment" : ''}
          value={(meaning.comment ? meaning.comment : '')}
          onChange={e => props.updateMeaning('comment', e.target.value, meaning.id)}
        /> */}
        <ResizingTextarea
          style={{
            display: (user.token || meaning.comment ? 'inline' : 'none'),
          }}
          characterWidth={80}
          className={styles.inputMeaning}
          name={"comment_"+meaning.id}
          id={"comment_"+meaning.id}
          placeholder={user.token ? "comment" : ''}
          value={(meaning.comment ? meaning.comment : '')}
          onChange={e => props.updateMeaning('comment', e.target.value, meaning.id)}
        />
        <Categories
          categories={meaning.categories} 
          meaning={meaning}
          updateCategory={props.updateCategory}
          deleteCategory={props.deleteCategory}
          addNewCategory={props.addNewCategory}
          meaningsCategories={props.meaningsCategories}
        />
      </div>
      <Quotations
          filterByMeaning={true}
          meaning={meaning}
          quotations={props.quotations}
          language={props.language}
          meanings={props.meanings}
          updateQuotation={props.updateQuotation}
          addNewQuotation={props.addNewQuotation}
          deleteQuotation={props.deleteQuotation}
        />
      <div className={styles.row}>
        <button className={styles.delete} style={style} onClick={() => props.deleteMeaning(meaning.id)}><IoIosTrash /></button>
      </div>
    </div>
    </>
  );
};

export default Meaning;
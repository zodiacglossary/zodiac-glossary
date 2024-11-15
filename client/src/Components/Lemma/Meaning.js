import React from "react";
import { IoIosTrash } from "react-icons/io";

import Categories from "./Categories";
import PublicLabelledText from "../PublicLabelledText";

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
        <textarea
          style={{display: (user.token || meaning.comment ? 'inline' : 'none')}}
          className={styles.inputMeaning}
          type="text"
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
      <div className={styles.row}>
        <button className={styles.delete} style={style} onClick={() => props.deleteMeaning(meaning.id)}><IoIosTrash /></button>
      </div>
    </div>
    </>
  );
};

export default Meaning;
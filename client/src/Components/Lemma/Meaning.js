import React from "react";
import { IoIosTrash } from "react-icons/io";

import Categories from "./Categories";
import PublicLabelledText from "../PublicLabelledText";

import UserContext from '../../Contexts/UserContext';

const Meaning = props => {
  const {user} = React.useContext(UserContext);
  const meaning = props.meaning;
  const i = props.i;

  const [style, setStyle] = React.useState({display: 'none'});

  if (user && !user.token) {
    return (
      <div>
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
      <div>
        <label htmlFor={"meaning_"+meaning.id}>{i+1}</label>
        <input
          style={{display: (user.token || meaning.value ? 'inline' : 'none')}}
          type="text"
          name={"meaning_"+meaning.id}
          id={"meaning_"+meaning.id}
          placeholder="meaning"
          value={meaning.value}
          onChange={e => props.updateMeaning('value', e.target.value, meaning.id)}
        />
        {/* Commented out because of the new categories 1->n setup – CDC 2023-09-11 */}
        {/* <input
          style={{display: (user.token || meaning.category ? 'inline' : 'none')}}
          type="text"
          name={"category_"+meaning.id}
          id={"category_"+meaning.id}
          placeholder="category"
          value={meaning.category}
          onChange={e => props.updateMeaning('category', e.target.value, meaning.id)}
          list="meaning_categories"
        />
        <datalist id="meaning_categories">
          {props.meaningsCategories.map((category, key) => (
            <option
              key={key}
              value={category}
            />
          ))}
        </datalist> */}
        <input
          style={{display: (user.token || meaning.comment ? 'inline' : 'none')}}
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
      <div>
        <button style={style} onClick={() => props.deleteMeaning(meaning.id)}><IoIosTrash /></button>
      </div>
    </div>
    </>
  );
};

export default Meaning;

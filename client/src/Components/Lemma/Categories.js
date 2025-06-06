import React from "react";
import { IoIosTrash, IoIosAddCircle } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';


import { getMeaningCategories } from "../../Data/autocomplete";

import styles from './Lemma.module.css';

const Categories = props => {
  const {user} = React.useContext(UserContext);

  if (user && !user.token) {
		let categoryList = ((props.categories && props.categories.length) ? props.categories.map(category => category.category).join(', ') : null);
    return (
			<div className={styles.row}>
				<div className={styles.label}>Categories</div>
				<div className={styles.label}>
					{typeof categoryList === 'string' ? categoryList : null}
				</div>
			</div>
    )
  }

  return (
		<div className={styles.row}>
			<div>
				<h3>Categories</h3>
				
			</div>
			{props.categories && props.categories.map(category => (
				<Category
					key={category.category_id}
					category={category}
					categories={props.categories}
					meaning={props.meaning}
					meaningsCategories={props.meaningsCategories}
					updateCategory={props.updateCategory}
					deleteCategory={props.deleteCategory}
				/>
			))}
			<button className={styles.button} onClick={e => props.addNewCategory(props.meaning.id)}><IoIosAddCircle /></button>
		</div>
  );
};

export default Categories;


const Category = props => {
	const category = props.category;
  const [style, setStyle] = React.useState({display: 'block'});

	// Reload Categories in this component so that selection dropdown updates
  let [meaningsCategories, setMeaningsCategories] = React.useState([]);

  React.useEffect(() => {
    getMeaningCategories(setMeaningsCategoriesFilter);
  }, []);
	
	// Middleman function to filter the results passed from the API before updating state variable
	function setMeaningsCategoriesFilter(list) {

		// Filter out already used categories to avoid entering duplicates
		for (let cursorCategory of props.categories) {
			list = list.filter(categoryName => categoryName !== cursorCategory.category);
		}
		
		setMeaningsCategories(list);
	}

	return (
		<div 
			onMouseEnter={e => {
				setStyle({display: 'block'});
			}}
			onMouseLeave={e => {
				setStyle({display: 'block'});
			}}
			key={category.category_id}
		>
			{/* <label className={styles.label} htmlFor={"meaning_category_" + category.category_id}>{i+1}</label> */}
			<input 
				type="text"
				name={"category_" + category.category_id}
				id={"category_" + category.category_id}
				className={styles.inputCategory}
				placeholder="new category"
				value={category.category}
				list={"meaning_categories" + category.category_id}
				onChange={e => props.updateCategory(e.target.value, props.meaning.id, category.category_id)}
			/>
			<datalist id={"meaning_categories" + category.category_id}>
				{meaningsCategories.map((category, key) => {
					return (<option
						key={key}
						value={category}
					/>)
				})}
			</datalist>
			<button className={styles.delete} style={style} onClick={e => props.deleteCategory(props.meaning.id, category.category_id)}><IoIosTrash /></button>
		</div>
	)
};
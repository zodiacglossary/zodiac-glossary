import React from 'react';
import { Tooltip } from 'react-tooltip';
import { IoIosTrash, IoIosOpen } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import { getQuotationFields, getQuotationFromSource } from "../../Data/autocomplete";
import { checkUrlForHttp } from "../../Functions/checkUrlForHttp";

import NewlineText from "../NewLineText";
import PublicLabelledText from "../PublicLabelledText";
import ResizingTextarea from "../ResizingTextarea";

import styles from './Lemma.module.css';

const Quotation = props => {
  const quotationIndex = props.quotationIndex;
  const quotation = props.quotation;
  const meaning = props.meanings.find(meaning => meaning.id === quotation.meaning_id);

  let categoryList = ((meaning && meaning.categories && meaning.categories.length) ? ' (' + meaning.categories.map(category => category.category).join(', ') + ')' : '');
  const meaningString = meaning ? meaning.value + categoryList : '';
  
  const {user} = React.useContext(UserContext);
  
  const [style, setStyle] = React.useState({display: 'none'});

  const [quotationAutofill, setQuotationAutofill] = React.useState(props.quotation);

  const [sourceAutocomplete, setSourceAutocomplete] = React.useState([]);
  const [genreAutocomplete, setGenreAutocomplete] = React.useState([]);
  const [provenanceAutocomplete, setProvenanceAutocomplete] = React.useState([]);
  const [publicationAutocomplete, setPublicationAutocomplete] = React.useState([]);

  React.useEffect(() => {
    getQuotationFields(setSourceAutocomplete, 'source');
    getQuotationFields(setGenreAutocomplete, 'genre');
    getQuotationFields(setProvenanceAutocomplete, 'provenance');
    getQuotationFields(setPublicationAutocomplete, 'publication');
  }, [quotation]);

  // Whenever Source changes, set:
  // Genre, Provenance, Date, Publication, Link
  const setSource = e => {
    const source = e.target.value;
    props.updateQuotation("source", source, quotation.id);

    // There are some entries with empty sources, don't use them to autofill
    if (source) {
      getQuotationFromSource(setQuotationAutofill, source);
    }
  };

  React.useEffect(() => {
    
    // Stop this from running when the component loads
    // Otherwise it sets the changed state of the lemma to true, even though it isn't
    if (quotationAutofill === props.quotation)
      return;
    
    if (quotationAutofill) {
      // Need to do it this way so that fields are only updated when they're empty
      const fields = [ 'genre', 'provenance', 'date', 'publication', 'link' ];
      for (let field of fields)
        if (!quotation[field])
          props.updateQuotation(field, quotationAutofill[field], quotation.id);
    }

    // If other variables are included in the dependency array, they cause a bug where the lemma is marked as modified erroneously
    // – CDC 2025-04-09
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationAutofill]);
  
  
  if (!user.token) {
    return (
      <div className={styles.quotationsList}>
        <h4>{quotationIndex+1}</h4>

        <PublicLabelledText
          label={(props.language === "akkadian" ? 'Normalized' : 'Transliteration')}
          content={<NewlineText text={quotation.transliteration} style={{fontStyle: 'italic'}} />}
        />
        <PublicLabelledText
          label={(props.language === "akkadian" ? 'Transliteration' : 'Original')}
          content={<NewlineText text={quotation.original} />}
        />
        <PublicLabelledText 
          label={'Translation'} 
          content={<NewlineText text={quotation.translation} />} 
        />
        <PublicLabelledText label={'Meaning'} content={meaningString} />
        <PublicLabelledText label={'Source'} content={quotation.source} />
        <PublicLabelledText label={'Line/Column'} content={quotation.line} />
        <PublicLabelledText label={'Genre'} content={quotation.genre} />
        <PublicLabelledText label={'Provenance'} content={quotation.provenance} />
        <PublicLabelledText label={'Date'} content={quotation.date} />
        <PublicLabelledText 
          label={'Publication'} 
          content={quotation.link ? (
              <a href={quotation.link} target="_blank" rel="noopener noreferrer">
                {quotation.publication} <IoIosOpen />
              </a>
            ) : quotation.publication}
        />
        <PublicLabelledText label={'Page Number'} content={quotation.page} />
        <PublicLabelledText label={'Comment'} content={quotation.comment} />
      </div>
    );
  }

  return (
    <div 
      className={styles.quotationsList}
      onMouseEnter={e => {
        setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
    >
      <h4>{quotationIndex+1}</h4>
      
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"transliteration_"+quotation.id}
          data-tip="Akkadian: (normalized) transcription<br />Egyptian: Egyptological transliteration<br />Other: Roman transliteration"
          data-for={"phonetic_"+quotation.id+"-tooltip"}
        >
          {props.language === "akkadian" ? 'Normalized' : 'Transliteration'}
        </label>
        <Tooltip id={"phonetic_"+quotation.id+"-tooltip"} type="light" html={true} />
        {/* <textarea
          style={{
            fontStyle: (props.language === "akkadian" || 'italic'),
            height: `${Math.max(Math.ceil(quotation.transliteration.length / 75), 2) * 1.4}vw`,
          }}
          className={styles.textareaQuotation}
          name={"transliteration_"+quotation.id}
          id={"transliteration_"+quotation.id}
          placeholder={props.language === "akkadian" ? 'normalized' : 'transliteration'}
          value={quotation.transliteration}
          onChange={e => props.updateQuotation("transliteration", e.target.value, quotation.id)} 
        /> */}
        <ResizingTextarea
          characterWidth={80}
          style={{
            fontStyle: (props.language === "akkadian" || 'italic'),
          }}
          className={styles.textareaQuotation}
          name={"transliteration_"+quotation.id}
          id={"transliteration_"+quotation.id}
          placeholder={props.language === "akkadian" ? 'normalized' : 'transliteration'}
          value={quotation.transliteration}
          onChange={e => props.updateQuotation("transliteration", e.target.value, quotation.id)} 
        />
      </div>
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"original_"+quotation.id}
          data-tip="Akkadian: transliteration<br />Egyptian: hieroglyphic<br />Other: original text (Unicode)"
          data-for={"original_"+quotation.id+"-tooltip"}
        >
          {props.language === "akkadian" ? 'Transliteration' : 'Original'}
        </label>
        <Tooltip id={"original_"+quotation.id+"-tooltip"} type="light" html={true} />
        {/* <textarea
          style={{
            height: `${Math.max(Math.ceil(quotation.original.length / 80), 2) * 1.4}vw`,
          }}
          className={styles.textareaQuotation}
          name={"original_"+quotation.id}
          id={"original_"+quotation.id}
          placeholder={props.language === "akkadian" ? 'transliteration' : 'original'}
          value={quotation.original}
          onChange={e => props.updateQuotation("original", e.target.value, quotation.id)} 
        /> */}
        <ResizingTextarea
          characterWidth={80}
          className={styles.textareaQuotation}
          name={"original_"+quotation.id}
          id={"original_"+quotation.id}
          placeholder={props.language === "akkadian" ? 'transliteration' : 'original'}
          value={quotation.original}
          onChange={e => props.updateQuotation("original", e.target.value, quotation.id)} 
        />
      </div>
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"translation_"+quotation.id}>Translation</label>
        {/* <textarea
          style={{
            height: `${Math.max(Math.ceil(quotation.translation.length / 75), 2) * 1.4}vw`,
          }}
          className={styles.textareaQuotation}
          name={"translation_"+quotation.id}
          id={"translation_"+quotation.id}
          placeholder="translation"
          value={quotation.translation}
          onChange={e => props.updateQuotation("translation", e.target.value, quotation.id)} 
        /> */}
        <ResizingTextarea
          characterWidth={60}
          className={styles.textareaQuotation}
          name={"translation_"+quotation.id}
          id={"translation_"+quotation.id}
          placeholder="translation"
          value={quotation.translation}
          onChange={e => props.updateQuotation("translation", e.target.value, quotation.id)} 
        />
      </div>
      {/* Removed as quotes are now directly attached to meanings already – CDC 2025-05-19 */}
      {/* <div className={styles.row}>
        <label className={styles.label} htmlFor={"meaning_"+quotation.id}>Meaning</label>
        <select
          className={styles.inputQuotation}
          name={"meaning_"+quotation.id}
          id={"meaning_"+quotation.id}
          value={(quotation.meaning_id ? quotation.meaning_id : (props.meaning.id ? props.meaning.id : 0))}
          onChange={e => props.updateQuotation("meaning_id", e.target.value, quotation.id)}
        >
          <option key={'empty'} value={0}></option>
          {props.meanings.map((item, key) => {
            let categoryList = (item?.categories?.length ? ' (' + item?.categories?.map(category => category.category).join(', ') + ')' : '');
            return (
            <option key={key} value={item.id}>
              {item.value + categoryList}
            </option>
          //   <option key={key} value={item.id}>
          //   {item.value + (item.category ? ' (' + item.category + ')' : '')}
          // </option>
          )})}
        </select>
      </div> */}
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"source_"+quotation.id}>Source</label>
        <input
          className={styles.inputQuotation}
          type="text"
          name={"source_"+quotation.id}
          id={"source_"+quotation.id}
          placeholder="source"
          value={quotation.source}
          onChange={e => setSource(e)} 
          list="quotation_sources"
        />
        <datalist id="quotation_sources">
          {sourceAutocomplete.map((item, key) => (
            <option key={key} value={item} />
          ))}
        </datalist>
      </div>
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"line_"+quotation.id}
          data-tip="Part of source text where quote is found<br />Perhaps a line or column number"
          data-for={"line_"+quotation.id+"-tooltip"}
        >
          Line/Column
        </label>
        <Tooltip id={"line_"+quotation.id+"-tooltip"} type="light" html={true} />
        <input
          type="text"
          className={styles.inputQuotation}
          name={"line_"+quotation.id}
          id={"line_"+quotation.id}
          placeholder="line or column"
          value={quotation.line}
          onChange={e => props.updateQuotation("line", e.target.value, quotation.id)} 
        />
      </div>
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"genre_"+quotation.id}>Genre</label>
        <input
          className={styles.inputQuotation}
          type="text"
          name={"genre_"+quotation.id}
          id={"genre_"+quotation.id}
          placeholder="genre"
          value={quotation.genre}
          onChange={e => props.updateQuotation("genre", e.target.value, quotation.id)}
          list="quotation_genre"
        />
        <datalist id="quotation_genre">
          {genreAutocomplete.map((item, key) => (
            <option key={key} value={item} />
          ))}
        </datalist>
      </div>
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"provenance_"+quotation.id}>Provenance</label>
        <input
          className={styles.inputQuotation}
          type="text"
          name={"provenance_"+quotation.id}
          id={"provenance_"+quotation.id}
          placeholder="provenance"
          value={quotation.provenance}
          onChange={e => props.updateQuotation("provenance", e.target.value, quotation.id)} 
          list="quotation_provenance"
        />
        <datalist id="quotation_provenance">
          {provenanceAutocomplete.map((item, key) => (
            <option key={key} value={item} />
          ))}
        </datalist>
      </div>
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"date_"+quotation.id}>Date</label>
        <input
          className={styles.inputQuotation}
          type="text"
          name={"date_"+quotation.id}
          id={"date_"+quotation.id}
          placeholder="date"
          value={quotation.date}
          onChange={e => props.updateQuotation("date", e.target.value, quotation.id)} 
        />
      </div>
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"publication_"+quotation.id}>Publication</label>
        <input
          className={styles.inputQuotation}
          type="text"
          name={"publication_"+quotation.id}
          id={"publication_"+quotation.id}
          placeholder="publication"
          value={quotation.publication}
          onChange={e => props.updateQuotation("publication", e.target.value, quotation.id)} 
          list="quotation_publication"
        />
        <datalist id="quotation_publication">
          {publicationAutocomplete.map((item, key) => (
            <option key={key} value={item} />
          ))}
        </datalist>
      </div>
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"page_"+quotation.id}>
          Page Number
        </label>
        <input
          className={styles.inputQuotation}
          type="text"
          name={"page_"+quotation.id}
          id={"page_"+quotation.id}
          placeholder="page number"
          value={quotation.page ? quotation.page : ''}
          onChange={e => props.updateQuotation("page", e.target.value, quotation.id)} 
        />
      </div>
      <div className={styles.row}>
        <label className={styles.label} htmlFor={"link_"+quotation.id}>
          Link &nbsp;
          {(quotation.link ? (<a href={checkUrlForHttp(quotation.link)} target="_blank" rel="noopener noreferrer"><IoIosOpen /></a>) : '')}
        </label>
        <input
          className={styles.inputQuotation}
          type="text"
          name={"link_"+quotation.id}
          id={"link_"+quotation.id}
          placeholder="URL link to publication"
          value={quotation.link}
          onChange={e => props.updateQuotation("link", checkUrlForHttp(e.target.value), quotation.id)} 
        />
      </div>
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"comment_"+quotation.id}
          data-tip="Strictly optional!<br />Additional comments about this quotation"
          data-for={"comment_"+quotation.id+"-tooltip"}
        >
          Comment
        </label>
        <Tooltip id={"comment_"+quotation.id+"-tooltip"} type="light" html={true} />
        <textarea
          className={styles.textareaQuotation}
          name={"comment_"+quotation.id}
          id={"comment_"+quotation.id}
          value={quotation.comment}
          onChange={e => props.updateQuotation("comment", e.target.value, quotation.id)} 
        />
      </div>
      <div className={styles.row}>
        <button className={styles.add} style={style} onClick={() => props.deleteQuotation(quotation.id)}><IoIosTrash /></button>
      </div>
    </div>
  );
};

export default Quotation;
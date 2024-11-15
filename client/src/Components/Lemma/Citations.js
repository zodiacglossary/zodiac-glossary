import React from "react";
import ReactTooltip from 'react-tooltip';
import Collapsible from "react-collapsible";
import {MdExpandMore, MdExpandLess} from 'react-icons/md';
import { IoIosCopy, IoIosCheckmark } from "react-icons/io";
import { FcCancel } from "react-icons/fc";

import DynamicMetadata from '../DynamicMetadata';

import styles from './Lemma.module.css';

import { copyToClipboard } from '../../Functions/copyToClipboard';

// Creates a formatted list of editors for Zotero, etc.
const compileEditorListZotero = editorList => {
  return editorList.map(editor => [editor.last_name, editor.first_name].join(', '));
};

const compileEditorListAPA = editorList => {
  if (!editorList.length)
    return '';

  editorList = editorList.map((editor) => `${editor.last_name}, ${editor.first_name[0]}.`);
  if (editorList.length < 2)
    return (editorList[0]).trim();

  return (editorList.slice(0, -1).join(', ') + ', & ' + editorList.at(-1)).trim();
};

const compileDateAPA = date => {
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = String(date.getDate());
  return `${year}, ${month} ${day}`;
};

const citeAPA = (editorList, date, title, lemmaId) => {
  return (
    <>
      {compileEditorListAPA(editorList)
      + ' (' + compileDateAPA(date) + '). '}
      <span style={{fontStyle: 'italic'}}>{title}</span>.
      The Zodiac Glossary: A Cross-Cultural Glossary of Ancient Astral Science.&nbsp;
      <a href={"https://zodiac.fly.dev/" + lemmaId}>{"https://zodiac.fly.dev/" + lemmaId}</a>
    </>
  )
};

const compileEditorListChicago = editorList => {
  if (!editorList.length)
    return '';

  let editorListOut = editorList[0].last_name + ', ' + editorList[0].first_name;
  if (editorList.length === 1)
    return editorListOut;

  if (editorList.length > 2)
    editorListOut += ', ' + editorList.slice(1,-1).map((editor) => `${editor.first_name} ${editor.last_name}`).join(', ');
  
  editorListOut += `, and ${editorList.at(-1).first_name} ${editorList.at(-1).last_name}.`;
  return editorListOut;
};

const compileDateChicago = date => {
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = String(date.getDate());
  return `${day} ${month} ${year}`;
};

const citeChicago = (editorList, date, title, lemmaId) => {
  return (
    <>
      {compileEditorListChicago(editorList)
      + ' ' + date.getFullYear() + '. '
      + '‘' + title + '’. '
      + 'The Zodiac Glossary: A Cross-Cultural Glossary of Ancient Astral Science, '
      + compileDateChicago(date) + '. '}
      <a href={"https://zodiac.fly.dev/" + lemmaId}>{"https://zodiac.fly.dev/" + lemmaId}</a>.
    </>
  )
};

const compileEditorListHarvard = editorList => {
  if (!editorList.length)
    return '';

  editorList = editorList.map((editor) => `${editor.last_name}, ${editor.first_name[0]}.`);
  if (editorList.length < 2)
    return (editorList[0]).trim();

  if (editorList.length > 3)
    return (editorList[0] + ' et al.').trim();

  return (editorList.slice(0, -1).join(', ') + ' and ' + editorList.at(-1)).trim();
};

const compileDateHarvard = date => {
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = String(date.getDate());
  return `${day} ${month} ${year}`;
};

const citeHarvard = (editorList, date, title, lemmaId) => {
  return (
    <>
      {compileEditorListHarvard(editorList)
      + ' (' + date.getFullYear() + '). '}
      <span style={{fontStyle: 'italic'}}>{title + '. The Zodiac Glossary: A Cross-Cultural Glossary of Ancient Astral Science.'}</span>{' [online] Available at: '}
      <a href={"https://zodiac.fly.dev/" + lemmaId}>{"https://zodiac.fly.dev/" + lemmaId}</a> 
      {' [Accessed ' + compileDateHarvard(new Date()) + '].'}
    </>
  )
};

const compileEditorListMLA = editorList => {
  if (!editorList.length)
    return '';

  let editorListOut = editorList[0].last_name + ', ' + editorList[0].first_name;
  if (editorList.length === 1)
    return editorListOut + '.';

  if (editorList.length === 2)
    return editorListOut + `, and ${editorList.at(1).first_name} ${editorList.at(1).last_name}.`;
  
  return editorListOut + ', et al.';
};

const compileDateMLA = date => {
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = String(date.getDate());
  return `${day} ${month}. ${year}`;
};

const citeMLA = (editorList, date, title, lemmaId) => {
  return (
    <>
      {compileEditorListMLA(editorList)
      + ' ‘' + title + '’. '}
      <span style={{fontStyle: 'italic'}}>The Zodiac Glossary: A Cross-Cultural Glossary of Ancient Astral Science</span>,&nbsp;
      {compileDateMLA(date) + ', '}
      <a href={"https://zodiac.fly.dev/" + lemmaId}>{"https://zodiac.fly.dev/" + lemmaId}</a>.
    </>
  )
};

const compileEditorListBibTeX = editorList => {
  if (!editorList.length)
    return '';

  editorList = editorList.map((editor) => `${editor.last_name}, ${editor.first_name}`);
  return editorList.join(' and ');
};

const citeBibTeX = (editorList, date, title, lemmaId) => {
  
  // BibTeX format uses the same date format as the Harvard style
  
  return (
    <>
      {`@online{zodiac${date.getFullYear()}lemma${lemmaId},
  author    = {${compileEditorListBibTeX(editorList)}},
  title     = {${title}},
  journal   = {The Zodiac Glossary: A Cross-Cultural Glossary of Ancient Astral Science},
  year      = {${compileDateHarvard(date)}},
  url       = {${"https://zodiac.fly.dev/" + lemmaId}},
  note      = {Accessed: ${compileDateHarvard(new Date())}}
}
`}
    </>
  )
};

const citeStyle = (citationStyle, editorList, date, title, lemmaId) => {
  if (citationStyle === 'apa')
    return citeAPA(editorList, date, title, lemmaId);
  if (citationStyle === 'chicago')
    return citeChicago(editorList, date, title, lemmaId);
  if (citationStyle === 'harvard')
    return citeHarvard(editorList, date, title, lemmaId);
  if (citationStyle === 'mla')
    return citeMLA(editorList, date, title, lemmaId);
  if (citationStyle === 'bibtex')
    return citeBibTeX(editorList, date, title, lemmaId);
};

const Citations = props => {
  const lemma = props.lemma;
  const [copied, setCopied] = React.useState({
    apa: 'not clicked',
    chicago: 'not clicked',
    mla: 'not clicked',
    harvard: 'not clicked',
    bibtex: 'not clicked',
  });

  if (!lemma) {
    return <></>;
  }


  const copyCitation = (e, citationStyle, citationJSX) => {

    const success = copyToClipboard(e, citationJSX);

    setCopied(prevState => {
      let updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = 'not clicked'; // Set all keys to the new value
        return acc;
      }, {});
      updatedState = {
        ...updatedState,
        [citationStyle]: (success ? 'copied' : 'not copied'),
      };
      return updatedState;
    });
  };
  
  // Get all the editors into the metadata for Zotero connector, etc.
  const editorList = compileEditorListZotero(props.editorList);
  const metadata = {
    title: props.title,
    canonical: 'https://zodiac.fly.dev/' + lemma.lemmaId,
    editors: editorList, // Needs to be in a separate object because each editor needs its own meta tag (see DynamicMetadata component)
    meta: {
      "DC.type": "Web Page",
      "DC.title":  props.title,
      "DC.date": props.mostRecentDate.toLocaleDateString("en-US"),
      "DC.format": "html",
      "DC.relation": 'https://zodiac.fly.dev/' + lemma.lemmaId,
      "DC.source": 'The Zodiac Glossary: A cross-cultural glossary of ancient astral science',
      "DC.description": "----",
    },
  }

  return (
    <div className={styles.crossLinks}>
      <DynamicMetadata metadata={metadata} />

      <h3>How to Cite</h3>
      
      <Citation
        header="American Psychological Association (APA) 7th Edition"
        copied={copied.apa}
        citationStyle="apa"
        citation={citeStyle('apa', props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
        copyCitation={copyCitation}
      />
      <Citation
        header="Chicago Manual of Style 7th Edition"
        copied={copied.chicago}
        citationStyle="chicago"
        citation={citeStyle('chicago', props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
        copyCitation={copyCitation}
      />
      <Citation
        header="Harvard Style of Referencing"
        copied={copied.harvard}
        citationStyle="harvard"
        citation={citeStyle('harvard', props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
        copyCitation={copyCitation}
      />
      <Citation
        header="Modern Language Association (MLA) 9th Edition"
        copied={copied.mla}
        citationStyle="mla"
        citation={citeStyle('mla', props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
        copyCitation={copyCitation}
      />

      <Citation
        header="BibTeX"
        copied={copied.bibtex}
        citationStyle="bibtex"
        citation={citeStyle('bibtex', props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
        copyCitation={copyCitation}
      />
    </div>
  );
};

const Citation = props => {

  const [visible, setVisible] = React.useState(false);

  // Needed to copy the BibTeX citation without the html that makes it display as code in the webpage
  let fullCitation = props.citation;
  if (props.citationStyle === 'bibtex') {
    fullCitation = (
      <pre><code><br />
        {props.citation}
      </code></pre>
    );
  }

  return (
    <>
      <h4 style={{cursor: 'pointer'}} onClick={e => setVisible(!visible)}>{props.header}{(visible ? <MdExpandLess /> : <MdExpandMore />)}</h4>
      {visible && <div className={styles.bibliographicEntry}>
        <button className={styles.copy} onClick={e => props.copyCitation(e, props.citationStyle, props.citation)}>
          <CopyButton copied={props.copied} citationStyle={props.citationStyle} />
        </button>
        <div className={styles.citationText}>
          {fullCitation}
        </div>
      </div>}
    </>
  );
};

const CopyButton = props => {
  
  if (props.copied === 'not clicked')
    return (
      <>
        <IoIosCopy
          data-tip="Copy citation to clipboard"
          data-for={"copy-tooltip_" + props.citationStyle}
        />
        {/* <ReactTooltip id={"copy-tooltip_" + props.citationStyle} type="light" place="right" html={false} /> */}
      </>
    )

  if (props.copied === 'copied')
    return (
      <>
        <IoIosCheckmark
          data-tip="Citation copied to clipboard"
          data-for={"copy-succeeded-tooltip_" + props.citationStyle}
        />
        {/* <ReactTooltip id={"copy-succeeded-tooltip_" + props.citationStyle} type="light" place="right" html={true} /> */}
      </>
    )

  // On copy failure
  return (
    <>
      <FcCancel
        data-tip="Copy to clipboard failed.<br />(NB This feature doesn't work in Safari.)"
        data-for={"copy-failed-tooltip_" + props.citationStyle}
       />
       {/* <ReactTooltip id={"copy-failed-tooltip_" + props.citationStyle} type="light" place="right" html={true} /> */}
    </>
  );
};

export default Citations;


import React from "react";
import ReactDOMServer from 'react-dom/server';
import { IoIosCopy } from "react-icons/io";

import DynamicMetadata from '../DynamicMetadata';

import styles from './Lemma.module.css';


// Copy JSX object to clipboard as formatted text

// MOVE THIS TO THE FUNCTIONS FILE SO OTHER THINGS CAN USE IT – CDC 06.11.2024

const copyToClipboard = (e, citationJSX) => {
  const htmlContent = ReactDOMServer.renderToString(citationJSX);

  console.log(citationJSX)
  
  function listener(e) {
    e.clipboardData.setData("text/html", htmlContent);
    e.clipboardData.setData("text/plain", htmlContent);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
};

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

const Citation = props => {
  const lemma = props.lemma;
  // const edits = props.edits;

  if (!lemma) {
    return <></>;
  }
  
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

      <h4>APA</h4>
      <p className={styles.citation}>
        <button className={styles.copy} onClick={e => copyToClipboard(e, citeAPA(props.editorList, props.mostRecentDate, props.title, lemma.lemmaId))}>
          <IoIosCopy />
        </button>
        {citeAPA(props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
      </p>

      <h4>Chicago</h4>
      <p className={styles.citation}>
        <button className={styles.copy} onClick={e => copyToClipboard(e, citeChicago(props.editorList, props.mostRecentDate, props.title, lemma.lemmaId))}>
          <IoIosCopy />
        </button>
        {citeChicago(props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
      </p>

      <h4>MLA</h4>
      <p className={styles.citation}>
        <button className={styles.copy} onClick={e => copyToClipboard(e, citeMLA(props.editorList, props.mostRecentDate, props.title, lemma.lemmaId))}>
          <IoIosCopy />
        </button>
        {citeMLA(props.editorList, props.mostRecentDate, props.title, lemma.lemmaId)}
      </p>
      

    </div>
  );
};

export default Citation;
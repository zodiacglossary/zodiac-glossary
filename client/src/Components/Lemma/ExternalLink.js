import React from 'react';
import { Tooltip } from 'react-tooltip';
import { IoIosTrash, IoIosOpen } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import { checkUrlForHttp } from "../../Functions/checkUrlForHttp";

import styles from './Lemma.module.css';

const ExternalLink = props => {
  const {user} = React.useContext(UserContext);
  // const [externalLink, setExternallink] = React.useState(props.externalLink);
  const i = props.i;
  
  const [style, setStyle] = React.useState({display: 'none'});
  
  if (!user.token) {    
    return (
      <a className={styles.label} target="_blank" rel="noopener noreferrer" href={props.externalLink.url}>
        {props.externalLink.display}
        &nbsp;
        <IoIosOpen />
      </a>
    )
  }
  
  return (
    <div 
      className={styles.crossLinksList}
      onMouseEnter={e => {
        setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
    >
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"externalLink_URL_"+i}
          data-tip="Paste in a URL for a related online dictionary entry"
          data-for={"externalLink_URL_"+i+"-tooltip"}
        >
          URL
        </label>
        <Tooltip id={"externalLink_URL_"+i+"-tooltip"} type="light" html={true} />
        <input
          className={styles.inputWide}
          name={"externalLink_URL_"+i}
          id={"externalLink_URL_"+i}
          placeholder="URL to link to"
          value={props.externalLink.url}
          onChange={e => props.updateExternalLink('url', checkUrlForHttp(e.target.value), props.externalLink.id)} 
        />
      </div>
      <div className={styles.row}>
        <label
          className={styles.label}
          htmlFor={"externalLink_display_"+i}
          data-tip='Add display text for link (e.g. "TLG: κριός")'
          data-for={"externalLink_display_"+i+"-tooltip"}
        >
          Display Text
        </label>
        <Tooltip id={"externalLink_display_"+i+"-tooltip"} type="light" html={true} />
        <input
          className={styles.inputWide}
          name={"externalLink_display_"+i}
          id={"externalLink_display_"+i}
          placeholder="Text to show in link"
          value={props.externalLink.display}
          onChange={e => props.updateExternalLink('display', e.target.value, props.externalLink.id)} 
        />
      </div>
      <div className={styles.row}>
        <div
          className={styles.label}
        >
          Sample Link
        </div>
        <a className={styles.label} target="_blank" rel="noopener noreferrer" href={checkUrlForHttp(props.externalLink.url)}>
          &nbsp;
          {props.externalLink.display}
          &nbsp;
          <IoIosOpen />
        </a>
        {/*}<input
          className={styles.inputWide}
          name={"externalLink_sample_"+i}
          placeholder="URL"
          value={props.externalLink.display}
          onChange={e => props.updateExternalLink('display', e.target.value, props.externalLink.id)} 
        />*/}
      </div>
      <div className={styles.row}>
        <div style={{display: (user.token ? 'inline' : 'none')}}>
          <button className={styles.add} style={style} onClick={() => props.deleteExternalLink(props.externalLink.id)}><IoIosTrash /></button>
        </div>
      </div>
    </div>
  );
};

export default ExternalLink;
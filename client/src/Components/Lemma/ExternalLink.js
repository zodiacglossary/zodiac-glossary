import React from 'react';
import ReactTooltip from 'react-tooltip';
import { IoIosTrash, IoIosOpen } from "react-icons/io";

import UserContext from '../../Contexts/UserContext';

import { checkUrlForHttp } from "../../Functions/checkUrlForHttp";

const ExternalLink = props => {
  const {user} = React.useContext(UserContext);
  // const [externalLink, setExternallink] = React.useState(props.externalLink);
  const i = props.i;

  const [style, setStyle] = React.useState({display: 'none'});

  if (!user.token) {
    return (
      <a target="_blank" rel="noopener noreferrer" href={props.externalLink.url}>
        {props.externalLink.display}
        &nbsp;
        <IoIosOpen />
      </a>
    )
  }

  return (
    <div
      onMouseEnter={e => {
        setStyle({display: 'block'});
      }}
      onMouseLeave={e => {
        setStyle({display: 'none'});
      }}
    >
      <div>
        <label
          htmlFor={"externalLink_URL_"+i}
          data-tip="Paste in a URL for a related online dictionary entry"
          data-for={"externalLink_URL_"+i+"-tooltip"}
        >
          URL
        </label>
        <ReactTooltip id={"externalLink_URL_"+i+"-tooltip"} type="light" html={true} />
        <input
          name={"externalLink_URL_"+i}
          id={"externalLink_URL_"+i}
          placeholder="URL to link to"
          value={props.externalLink.url}
          onChange={e => props.updateExternalLink('url', checkUrlForHttp(e.target.value), props.externalLink.id)}
        />
      </div>
      <div>
        <label
          htmlFor={"externalLink_display_"+i}
          data-tip='Add display text for link (e.g. "TLG: κριός")'
          data-for={"externalLink_display_"+i+"-tooltip"}
        >
          Display Text
        </label>
        <ReactTooltip id={"externalLink_display_"+i+"-tooltip"} type="light" html={true} />
        <input
          name={"externalLink_display_"+i}
          id={"externalLink_display_"+i}
          placeholder="Text to show in link"
          value={props.externalLink.display}
          onChange={e => props.updateExternalLink('display', e.target.value, props.externalLink.id)}
        />
      </div>
      <div>
        <div
        >
          Sample Link
        </div>
        <a target="_blank" rel="noopener noreferrer" href={checkUrlForHttp(props.externalLink.url)}>
          &nbsp;
          {props.externalLink.display}
          &nbsp;
          <IoIosOpen />
        </a>
        {/*}<input
          name={"externalLink_sample_"+i}
          placeholder="URL"
          value={props.externalLink.display}
          onChange={e => props.updateExternalLink('display', e.target.value, props.externalLink.id)}
        />*/}
      </div>
      <div>
        <div style={{display: (user.token ? 'inline' : 'none')}}>
          <button style={style} onClick={() => props.deleteExternalLink(props.externalLink.id)}><IoIosTrash /></button>
        </div>
      </div>
    </div>
  );
};

export default ExternalLink;

import React from 'react';
import ReactTooltip from 'react-tooltip';

import { useNavigate, useLocation } from "react-router-dom";
// import { IoIosPlay, IoIosPause, } from 'react-icons/io';
import { IoIosHome, IoIosHelpCircle, IoIosClock, IoIosLogIn, IoIosLogOut, IoIosList, IoIosPeople, } from 'react-icons/io';

import UserContext from '../../Contexts/UserContext';
import LogIn from './LogIn.js';

import zodiacConstellations from '../../Graphics/zodiac_constellations.svg';
// import zodiacLogo from '../Graphics/zodiac_logo.svg';

const StarHeader = () => {
  const {user, setUser} = React.useContext(UserContext);
  let navigate = useNavigate();
  let location = useLocation();
  const [loginVisible, setLoginVisible] = React.useState(false);

  let startStyle;
  if (localStorage.getItem('pauseStarChart') === 'true') {
    startStyle = {animationPlayState: 'paused'};
  } else {
    startStyle = {animationPlayState: 'running'};
  }
  startStyle = {animationPlayState: 'paused'};
  const [style, setStyle] = React.useState(startStyle);

  function logout() {
    const emptyUser = {user: {}, token: null};
    setUser(emptyUser);
    localStorage.setItem('user', JSON.stringify(emptyUser));
    setLoginVisible(false);
  }

  function login() {
    setLoginVisible(true);
  }

  const playPause = () => {
    setStyle(prevStyle => {
      if (prevStyle.animationPlayState === 'running') {
        localStorage.setItem('pauseStarChart', true);
        return {animationPlayState: 'paused'};
      }
      localStorage.setItem('pauseStarChart', false);
      return {animationPlayState: 'running'};
    });
  };

  const goHome = () => {
    navigate('/');
  }

  return (
    <>
      <button onClick={goHome}>
        <IoIosHome />
      </button>
      <a href="/help" target={location.pathname === '/help' ? '' : "_blank"} rel="noopener noreferrer">
        <IoIosHelpCircle />
      </a>
      <a href="/people" target={location.pathname === '/people' ? '' : "_blank"} rel="noopener noreferrer">
        <IoIosPeople />
      </a>
      {(user && user.token) ? (
        <a href="/recents" target={location.pathname === '/recents' ? '' : "_blank"} rel="noopener noreferrer">
          <IoIosClock />
        </a>
      ) : null}
      {(user && user.token) ? (
        <a href="/todo" target={location.pathname === '/todo' ? '' : "_blank"} rel="noopener noreferrer">
          <IoIosList />
        </a>
      ) : null}
      {(user && user.token) ? null : (
        <button onClick={login}>
          <IoIosLogIn />
        </button>
      )}
      {(user && user.token) ? (
        <button onClick={logout}>
          <IoIosLogOut />
        </button>
      ) : null}
      {(user.user.username) ? (
        <div> &nbsp;{user.user.username}</div>
      ) : null}
      {/* <button className={styles.playPause} onClick={playPause}>
        {(style.animationPlayState === 'running') ? (<IoIosPause />) : <IoIosPlay />}
      </button> */}
      <LogIn
        visible={loginVisible}
        setLoginVisible={setLoginVisible}
      />
      <header onClick={() => playPause()}>
        <img
          style={style}
          src={zodiacConstellations}
          alt="Star chart with zodiac constellations"
          onClick={playPause}
        />
        <div >The</div>
        <h1 >
          Zodiac
        </h1>
        <div >
          Glossary
        </div>
        <div >
          A cross-cultural glossary of ancient astral science
          <sub
            data-tip='This project is currently in a beta stage. Please forgive any errors.'
            data-for="beta"
          >
            β
          </sub>
          <ReactTooltip id="beta" type="light" html={true} />
        </div>
      </header>
      <div ></div>
      <div ></div>
    </>
  );
};

export default StarHeader;

// <img src={zodiacLogo} style={{height: '5vw'}} alt="Zodiac logo"/>

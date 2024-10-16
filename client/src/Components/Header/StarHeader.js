import React from 'react';
import Tooltip from 'react-tooltip';

import { useNavigate, useLocation } from "react-router-dom";
// import { IoIosPlay, IoIosPause, } from 'react-icons/io';
import { IoIosHome, IoIosHelpCircle, IoIosLogIn, IoIosLogOut, IoIosList, IoIosPeople, IoIosSearch } from 'react-icons/io';
import { GiAlarmClock, } from 'react-icons/gi';

import UserContext from '../../Contexts/UserContext';
import LogIn from './LogIn.js';

import styles from './StarHeader.module.css';

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
      <button 
        className={styles.home} 
        onClick={goHome}
        data-tip="Home"
        data-for="home-tooltip"
      >
        <IoIosHome />
      </button>
      <Tooltip id="home-tooltip" type="light" html={false} place="bottom-start" />

      <a 
        className={styles.home} 
        href="/advanced-search" 
        target={location.pathname === '/advanced-search' ? '' : "_blank"} 
        rel="noopener noreferrer"
        data-tip="Advanced Search"
        data-for="advanced-search-tooltip"
      >
        <IoIosSearch />
      </a>
      <Tooltip id="advanced-search-tooltip" type="light" html={false} place="bottom-start" />

      <a 
        className={styles.home} 
        href="/help" 
        target={location.pathname === '/help' ? '' : "_blank"} 
        rel="noopener noreferrer"
        data-tip="Help"
        data-for="help-tooltip"
      >
        <IoIosHelpCircle />
      </a>
      <Tooltip id="help-tooltip" type="light" html={false} place="bottom-start" />

      <a 
        className={styles.home} 
        href="/people" 
        target={location.pathname === '/people' ? '' : "_blank"} 
        rel="noopener noreferrer"
        data-tip="Contributors"
        data-for="people-tooltip"
      >
        <IoIosPeople />
      </a>
      <Tooltip id="people-tooltip" type="light" html={false} place="bottom-start" />

      {(user && user.token) ? (
        <>
          <a className={styles.home} href="/recents" target={location.pathname === '/recents' ? '' : "_blank"} rel="noopener noreferrer" data-tip="Recent Changes" data-for="recents-tooltip">
            <GiAlarmClock />
          </a>
          <Tooltip id="recents-tooltip" type="light" html={false} place="bottom-start" />
        </>
      ) : null}
      {(user && user.token) ? (
        <>
          <a className={styles.home} href="/todo" target={location.pathname === '/todo' ? '' : "_blank"} rel="noopener noreferrer" data-tip="Todo List" data-for="todo-tooltip">
            <IoIosList />
          </a>
          <Tooltip id="todo-tooltip" type="light" html={false} place="bottom-start" />
        </>
      ) : null}
      {(user && user.token) ? null : (
        <>
          <button className={styles.home} onClick={login} data-tip="Log In" data-for="login-tooltip">
            <IoIosLogIn />
          </button>
          <Tooltip id="login-tooltip" type="light" html={false} place="bottom-start" />
        </>
      )}
      {(user && user.token) ? (
        <>
          <button className={styles.home} onClick={logout} data-tip="Log Out" data-for="logout-tooltip">
            <IoIosLogOut />
          </button>
          <Tooltip id="logout-tooltip" type="light" html={false} place="bottom-start" />
        </>
      ) : null}
      {(user.user.username) ? (
        <div className={styles.username}> &nbsp;{user.user.username}</div>
      ) : null}
      {/* <button className={styles.playPause} onClick={playPause}>
        {(style.animationPlayState === 'running') ? (<IoIosPause />) : <IoIosPlay />}
      </button> */}
      <LogIn
        visible={loginVisible}
        setLoginVisible={setLoginVisible}
      />
      <header className={styles.header} onClick={() => playPause()}>
        <img
          style={style}
          className={styles.starChart}
          src={zodiacConstellations}
          alt="Star chart with zodiac constellations"
          onClick={playPause}
        />
        <div className={styles.titleThe}>The</div>
        <h1 className={styles.zodiacLogotype}>
          Zodiac
        </h1>
        <div className={styles.titleGlossary}>
          Glossary
        </div>
        <div className={styles.subtitle}>
          A cross-cultural glossary of ancient astral science
          <sub
            data-tip='This project is currently in a beta stage. Please forgive any errors.'
            data-for="beta"
          >
            β
          </sub>
          <Tooltip id="beta" type="light" html={true} />
        </div>
      </header>
      <div className={styles.headerBodyGradient}></div>
      <div className={styles.bodyBackground}></div>
    </>
  );
};

export default StarHeader;

// <img src={zodiacLogo} style={{height: '5vw'}} alt="Zodiac logo"/>
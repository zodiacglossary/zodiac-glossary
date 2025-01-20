import React from 'react';
import { Routes, Route } from "react-router-dom";

import styles from './Components/Content.module.css';

import StarHeader from './Components/Header/StarHeader';
import Content from './Components/Content';
import Lemma from './Components/Lemma/Lemma';
import SignUp from './Components/SignUp/SignUp';
import Help from './Components/Help/Help';
import Todo from './Components/Help/Todo';
import Contributors from './Components/Contributors/Contributors';
import Recents from './Components/Recents/Recents';
import AdvancedSearch from './Components/AdvancedSearch/AdvancedSearch';
import PdfGlossary from "./Components/AdvancedSearch/PdfGlossary/PdfGlossary";
import CrossReferences from './Components/Graph/CrossReferences';
import Categories from './Components/Graph/Categories';

import Footer from './Components/Footer/Footer';

import UserContext from './Contexts/UserContext';
import PdfGlossary from "./Components/AdvancedSearch/PdfGlossary/PdfGlossary";


function App() {
  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user')) || {token: null, user: ''});

  return (
    <UserContext.Provider value={{
      user,
      setUser
    }}>
      <div className="App">
        <StarHeader />
        <Routes>
          <Route path="/" element={<Content />}>
            <Route className={styles.lemma} index element={<Lemma />} />
            <Route className={styles.lemma} path=":lemmaId" element={<Lemma />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/help" element={<Help />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/people" element={<Contributors />} />
          <Route path="/recents" element={<Recents />} />
          <Route path="/advanced-search" element={<AdvancedSearch />} />
          <Route path="/pdf-glossary" element={<PdfGlossary />} />
          <Route path="/graph/crosslinks" element={<CrossReferences />} />
          <Route path="/graph/categories" element={<Categories />} />
        </Routes>
        <Footer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
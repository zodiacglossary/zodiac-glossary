import React from "react";
import { useParams, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { IoIosShareAlt, IoIosCopy } from "react-icons/io";


// import { deleteLemmaFromDB } from "../../Data/sample-data";
import { getLemmaFromDB, saveLemmaToDB, deleteLemmaFromDB, getEditHistory } from "../../Data/api";

import BasicInfo from './BasicInfo';
import Meanings from './Meanings';
import Variants from './Variants';
import Quotations from './Quotations';
import CrossLinks from './CrossLinks';
import ExternalLinks from './ExternalLinks';
import DeleteLemma from './DeleteLemma';
import EditHistory from './EditHistory';
import Citations from './Citations';

import UserContext from '../../Contexts/UserContext';

import styles from './Lemma.module.css';
import { copyToClipboard } from "../../Functions/copyToClipboard";

const Lemma = props => {
  let navigate = useNavigate();
  let location = useLocation();
  const {user} = React.useContext(UserContext);

  let params = useParams();
  let [lemma, setLemma] = React.useState();
  const [edits, setEdits] = React.useState([]);
  const [title, setTitle] = React.useState('');
  
  // Really stupid cludge that forces the sidebar to update when the user saves a new lemma
  // It's either this or raise all of the lemma state and redo the routing just for that one edge case
  let [updateLemmataList, changed, setChanged, setContentLemma, lemmataList, meaningsCategories] = useOutletContext(); 

  // Track rerenders for debugging and optimization
  // Still a work in progress right now – CDC 2025-05-22
  console.count("Lemma renders");
  console.log("RENDER START", {
    lemma,
    title,
    edits,
    changed
  });
  
  React.useEffect(() => {
    // Scroll lemma to top on load
    const element = document.getElementById('lemma-component');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollTo({ top: 0, behavior: 'smooth' });
    }

    var lemmaId = parseInt(params.lemmaId);

    // On refresh or load from URL, lemmaId in the route gets changed to null by React Router
    // This fixes it by temporarily saving the most recent lemma id and using that when the route has null
    if (isNaN(lemmaId)) {
      const fallbackId = localStorage.getItem('currentLemmaId');

      const currentPath = '/' + (fallbackId || '') + (location.search || '');
      if (location.pathname !== currentPath) {
        navigate(currentPath, { replace: true }); // <- avoid history stacking
      }
    } else {
      getLemmaFromDB(setLemma, lemmaId);
      localStorage.setItem('currentLemmaId', lemmaId);
    }

    // Mark changed as false (don't alert user to save) any time a new lemma is selected
    setChanged(false);

    // Disable all back navigation for the time being
    // Redo this so that it launches an alert and confirms the action before proceeeding
    // CDC 2023-11-15
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function (event){
        window.history.pushState(null, document.title,  window.location.href);
    });
  }, [params.lemmaId, user]);

  // Set the page title to give information about the current lemma if available
  // Update metadata for Zotero citations, other uses
  React.useEffect(() => {
    
    if (lemma) {
      getEditHistory(lemma.lemmaId, user.token)
      .then(edits => setEdits(edits))
      .catch(error => console.error(error));

      let titleString = '';
      titleString = lemma.translation || titleString;
      titleString = lemma.transliteration || titleString;
      titleString = lemma.original || titleString;
      titleString = titleString + ' – Lemma ' + lemma.lemmaId;
      setTitle(titleString);
    }


  }, [lemma?.lemmaId]);

  // Warn if unsaved changes on refresh
  // This code doesn't actually launch a dialog but triggers the browser to do so
  const alertUser = (e) => {
    if (changed) {
      e.preventDefault();
      e.returnValue = "";
    }
  };
  React.useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, [changed]);
  
  const saveLemma = React.useCallback(() => {
    updateLemmataList();
    setChanged(false);
    saveLemmaToDB(setLemma, lemma, user.token);
    setContentLemma(lemma);
    
    // Remind users to fill the editor field if it is blank
    if (!lemma || !lemma.editor) {
      alert('Please add your name to the editor field and save again.');
      setChanged(true);
    }
  }, [lemma, user.token]);

  // Keyboard shortcuts
  const handleKeyPress = React.useCallback((e) => {
    // Meta keys
    if (e.ctrlKey || e.metaKey) {
      // Save shortcuts (ctrl+s and cmd+s)
      if (e.key === 's') {
        e.preventDefault();
        setChanged(false);
        saveLemma();
      }
    }
    
    // Trying to prevent the stupid back button from erasing half-entered lemmata
    if (e.keyCode === 166 || e.keyCode === 167) {
      e.preventDefault();
    }
    if (e.key === 'BrowserBack' || e.key === 'BrowserForward') {
      e.preventDefault();
      console.log('Browser nav button press blocked')
    }
    if ((e.key === 'ArrowLeft' && e.metaKey) || (e.key === 'ArrowRight' && e.metaKey)) {
      e.preventDefault();
      console.log('Browser nav with cmd left/right blocked')
    }
  }, [saveLemma]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const onChange = e => {
    if (e.target.type === "checkbox") {
      setLemma(prevLemma => {
        return {
          ...prevLemma,
          [e.target.name]: e.target.checked
        }
      });
    } else {
      setLemma(prevLemma => {
        return {
          ...prevLemma,
          [e.target.name]: e.target.value
        }
      });
    }
    setChanged(true);
  };
  
  const deleteLemma = () => {
    deleteLemmaFromDB(lemma.lemmaId, user.token);
    navigate('/' + location.search);
    setLemma(null);
    setContentLemma(null);
    updateLemmataList();
    navigate(0);  // Cludge to make the lemmata list update after deletion by forcing page refresh
                  // I just can't seem to get the stupid lemmata list to update reliably
                  // CDC 2022-11-30
  }
  //////////////////////////////////////////////////////////////////////////////
  // MEANINGS
  const updateMeaning = (field, updatedMeaning, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: prevLemma.meanings.map(meaning => {
          if (meaning.id === id) {
            return {
              ...meaning,
              [field]: updatedMeaning,
            };
          }
          return meaning;
        })
      }
    });
    setChanged(true);
  };

  const deleteMeaning = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: prevLemma.meanings.filter(meaning => {
          return meaning.id !== id;
        }),
      };
    });
    setChanged(true);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  // CATEGORIES
  const addNewMeaning = (e, newMeaningData = null) => {
    e.preventDefault();
    
    const newMeaning = {
      id: uuidv4(),
      value: (newMeaningData ? newMeaningData.value : ''),
      category: '',
      comment: '',
      categories: [],
    };
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: [
          ...prevLemma.meanings,
          newMeaning
        ]
      };
    });
    setChanged(true);
  };

  const updateCategory = (updatedCategory, meaningId, categoryId) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: prevLemma.meanings.map(meaning => {
          if (meaning.id === meaningId) {
            return {
              ...meaning,
              categories: meaning.categories.map(category => {
                if (category.category_id === categoryId) {
                  return {
                    ...category,
                    category: updatedCategory,
                  };
                }
                return category;
              }),
            };
          }
          return meaning;
        }),
      }
    });
    setChanged(true);
  };

  const deleteCategory = (meaningId, categoryId) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: prevLemma.meanings.map(meaning => {
          if (meaning.id === meaningId) {
            meaning.categories = meaning.categories.filter(category => category.category_id !== categoryId);
          }
          return meaning;
        }),
      }
    });
    setChanged(true);
  };

  const addNewCategory = (meaningId, newCategoryData = null) => {
    
    const newCategory = {
      category_id: uuidv4(),
      category: '',
    };

    setLemma(prevLemma => {
      return {
        ...prevLemma,
        meanings: prevLemma.meanings.map(meaning => {
          if (meaning.id === meaningId) {
            meaning.categories = [
              ...meaning.categories,
              newCategory,
            ];
          }
          return meaning;
        }),
      }
    });

    setChanged(true);
  };

  //////////////////////////////////////////////////////////////////////////////
  // VARIANTS
  const updateVariant = (key, updatedVariant, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        variants: lemma.variants.map(variant => {
          if (variant.id === id) {
            return {
              ...variant,
              [key]: updatedVariant,
            };
          }
          return variant;
        })
      }
    });
    setChanged(true);
  };

  const deleteVariant = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        variants: prevLemma.variants.filter(variant => {
          return variant.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewVariant = (e, newVariantData = null) => {
    e.preventDefault();
    
    const newVariant = {
      id: uuidv4(),
      original: (newVariantData ? newVariantData.original : ''),
      transliteration: (newVariantData ? newVariantData.transliteration : ''), 
      comment: '',
    };
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        variants: [
          ...prevLemma.variants,
          newVariant
        ]
      };
    });
    setChanged(true);
  };
  //////////////////////////////////////////////////////////////////////////////
  // QUOTATIONS
  const updateQuotation = (key, updatedQuotation, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        quotations: lemma.quotations.map(quotation => {
          if (quotation.id === id) {
            quotation[key] = updatedQuotation;
          }
          return quotation;
        })
      }
    });
    setChanged(true);
  };

  const deleteQuotation = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        quotations: prevLemma.quotations.filter(quotation => {
          return quotation.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewQuotation = (e, meaning_id) => {
    e.preventDefault();
    console.log('addNewQuote():', meaning_id)

    // What happens if someone somehow gets to the old Quotations from Lemma?
    // Here's a temporary blocking method
    // Delete when stable – CDC 2025.05.11
    if (!meaning_id) {
      console.error('Attempt to add quotation at lemma level.')
      alert(`Adding quotations at the lemma level is no longer supported.
You should not be seeing this.
Something has gone terribly wrong.
Please contact Christian and tell him: christiancasey86@gmail.com
Lemma: ${lemma.lemmaId}`)
      return;
    }
    
    const newQuotation = {
      id: uuidv4(),
      original: '',
      transliteration: '',
      translation: '',
      source: '',
      genre: '',
      provenance: '',
      date: '',
      publication: '',
      link: '',
      line: '',
      page: '',
      meaning_id: meaning_id,
    }
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        quotations: [
          ...prevLemma.quotations,
          newQuotation
        ]
      };
    });
    setChanged(true);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  // EXTERNAL LINKS
  const updateExternalLink = (key, updatedexternalLink, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        externalLinks: lemma.externalLinks.map(externalLink => {
          if (externalLink.id === id) {
            externalLink[key] = updatedexternalLink;
          }
          return externalLink;
        }),
      }
    });
    setChanged(true);
  };

  const deleteExternalLink = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        externalLinks: prevLemma.externalLinks.filter(externalLink => {
          return externalLink.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewExternalLink = e => {
    e.preventDefault();
    const newExternalLink = {
      id: uuidv4(),
      url: '',
      display: lemma.original,
    }
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        externalLinks: [
          ...prevLemma.externalLinks,
          newExternalLink
        ]
      };
    });
    setChanged(true);
  };
  
  //////////////////////////////////////////////////////////////////////////////
  // CROSS LINKS
  const updateCrossLink = (updatedCrossLink, id) => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        crossLinks: lemma.crossLinks.map(crossLink => {
          if (crossLink.id === id) {
            return {
              ...crossLink,
              link: updatedCrossLink,
              new: false,
            };
            // crossLink.link = updatedCrossLink;
            // crossLink.new = false; // 
          }
          return crossLink;
        }),
      }
    });
    setChanged(true);
  };

  const deleteCrossLink = id => {
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        crossLinks: prevLemma.crossLinks.filter(crossLink => {
          return crossLink.id !== id;
        }),
      };
    });
    setChanged(true);
  };

  const addNewCrossLink = e => {
    e.preventDefault();
    const newCrossLink = {
      id: uuidv4(),
      link: '',
      lemmaId: lemma.lemmaId,
      new: true,
    }
    
    setLemma(prevLemma => {
      return {
        ...prevLemma,
        crossLinks: [
          ...prevLemma.crossLinks,
          newCrossLink
        ]
      };
    });
    setChanged(true);
  };

  // CITATIONS

  // Returns a list of unique editors for the lemma with a count of the number of edits made
  // Sorted in descending order by number of edits
  const uniqueEditorList = edits => {
    if (!edits.length)
      return [];
    
    let editsUnique = [];
    for (const edit of edits) {
      const matchedEdit = editsUnique.find(editUnique => editUnique.username === edit.username);
      if (matchedEdit) {
        matchedEdit.count++;
      }
      else {
        editsUnique.push({...edit, count: 1});
      }
    }
    
    // Bump the first editor up slightly so that they get listed as first author even if someone else has the same number of edits
    editsUnique.find(edit => edit.username === edits.at(-1).username).count += 0.5;
    
    editsUnique.sort((a, b) => b.count - a.count);
    
    return editsUnique;
  }

  // Returns most recent edit date for citation purposes
  const getMostRecentEditDate = edits => {
    if (edits.length) {
      const mostRecentEvent = edits.map(edit => edit.timestamp).reduce((mostRecent, currentEvent) => {
        return new Date(currentEvent.date) > new Date(mostRecent.date) ? currentEvent : mostRecent;
      });
      return mostRecentEvent;
    }
    return new Date();
  }
  
  // Default display when an invalid lemma id is in the URL params
  if (params.lemmaId && !lemma) {
    return (
      <main className={styles.lemma}>
        <h2>Lemma</h2>
        <div style={{opacity: 0.5}}>
          <p>The lemma ID in the URL does not correspond to a valid lemma.</p>
          <p>Perhaps the lemma you are looking for has been deleted.</p>
          <p>Please select a new lemma from the options on the left.</p>
        </div>
      </main>
    );
  }
  // Default display when no lemma is selected
  // Condition on "null" because refreshing the page replaces the lemma ID in URL with null
  // Properly, this should be fixed with React Router –CDC 2022-11-29
  if (!params.lemmaId || params.lemmaId === "null") {
    return (
      <main className={styles.lemma}>
        <h2>Lemma</h2>
        <div style={{opacity: 0.5}}>
          <p>No lemma selected.</p>
          <p>Please select a lemma from the options on the left.</p>
        </div>
      </main>
    );
  }
  
  // Full lemma display
  return (
    <main className={styles.lemma} id="lemma-component">
      <h1>
        {changed ? <i>Lemma (unsaved)</i> : 'Lemma'}
        {(user && user.token) ? (
          <button className={styles.delete} onClick={() => saveLemma()}>SAVE</button>
        ) : null}
        {/* <button className={styles.delete} style={{cursor: "pointer"}} onClick={e => copyToClipboard(e, 'https://zodiac.fly.dev/' + lemma.lemmaId)}>Share <IoIosCopy /></button> */}
      </h1>
      
      <fieldset style={{border: 'none', margin: 0, padding: 0}}>

        <BasicInfo lemma={lemma} onChange={onChange} />
        
        <Variants
          lemma={lemma}
          updateVariant={updateVariant}
          addNewVariant={addNewVariant}
          deleteVariant={deleteVariant}
        />
        
        <Meanings
          lemma={lemma}
          meaningsCategories={meaningsCategories}
          updateMeaning={updateMeaning}
          addNewMeaning={addNewMeaning}
          deleteMeaning={deleteMeaning}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
          addNewCategory={addNewCategory}

          quotations={lemma.quotations}
          language={lemma.language}
          meanings={lemma.meanings}
          updateQuotation={updateQuotation}
          addNewQuotation={addNewQuotation}
          deleteQuotation={deleteQuotation}
        />
        
        <CrossLinks
          crossLinks={lemma.crossLinks}
          lemmataList={lemmataList}
          currentLemma={lemma}
          updateCrossLink={updateCrossLink}
          addNewCrossLink={addNewCrossLink}
          deleteCrossLink={deleteCrossLink}
        />
        
        <ExternalLinks
          externalLinks={lemma.externalLinks}
          lemma={lemma}
          updateExternalLink={updateExternalLink}
          addNewExternalLink={addNewExternalLink}
          deleteExternalLink={deleteExternalLink}
        />

        <Citations lemma={lemma} title={title} edits={edits} editorList={uniqueEditorList(edits)} mostRecentDate={getMostRecentEditDate(edits)} />

        <EditHistory lemma={lemma} edits={edits} editorList={uniqueEditorList(edits)} mostRecentDate={getMostRecentEditDate(edits)} />
        
        <DeleteLemma lemma={lemma} deleteLemma={deleteLemma} />
      </fieldset>
      
    </main>
  );
};

export default Lemma;
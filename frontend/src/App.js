import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
  const [word, setWord] = useState('');
  const [rhymesByCategory, setRhymesByCategory] = useState({});
  const [rhymeType, setRhymeType] = useState('vowel');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  // Function to validate searchWord based on rhymeType.
  const validateSearchWord = (searchWord, type) => {
    // For vowel rhymes, ensure the searchWord contains at least one vowel.
    if (type === 'vowel' && !/[aáeiouyö]/i.test(searchWord)) {
      return 'Atte sáni mas leat vokálat.';
    }
    if (
      type === 'consonant' &&
      !/[bcčdđfghljklmnŋprsštvzž]/i.test(searchWord)
    ) {
      return 'Atte sáni mas leat konsonánttat.';
    }
    // Add other validations here if needed.
    return '';
  };

  const fetchRhymes = async (searchWord, type) => {
    setInfoMessage('');
    // Validate the search word.
    const validationError = validateSearchWord(searchWord, type);
    if (validationError) {
      // Instead of calling the API, we set the info message,
      // clear any previous rhymes, and update the search word.
      setWord(searchWord);
      setRhymesByCategory({});
      setInfoMessage(validationError);
      return;
    }
    setLoading(true);
    setWord(searchWord);
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
        }/rhyme/${searchWord}/${type}`
      );
      setRhymesByCategory(response.data.rhymes || {});
    } catch (error) {
      console.error('Error fetching rhymes:', error);
      setRhymesByCategory({}); // Reset to an empty object in case of error
    } finally {
      setLoading(false);
    }
  };

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }

  const handleRhymeClick = (clickedWord) => {
    setWord(clickedWord);
    fetchRhymes(clickedWord, rhymeType);
    scrollToTop();
  };

  return (
    <div className='app-container'>
      {/* Pass word state to Header */}
      <Header
        word={word}
        fetchRhymes={(searchWord) => fetchRhymes(searchWord, rhymeType)}
        rhymeType={rhymeType}
        setRhymeType={setRhymeType}
      />
      {/* Display only one info message at a time */}
      {infoMessage && (
        <div className='info-message'>
          <h3>{infoMessage}</h3>
        </div>
      )}
      {/* Render categories or message if no rhymes */}
      <Main
        rhymesByCategory={rhymesByCategory}
        handleRhymeClick={handleRhymeClick}
        word={word}
        rhymeType={rhymeType}
        loading={loading}
        infoMessage={infoMessage}
      />
      <Footer />
    </div>
  );
}

export default App;

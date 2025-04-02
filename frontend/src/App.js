import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [word, setWord] = useState('');
  const [rhymesByCategory, setRhymesByCategory] = useState({});

  const fetchRhymes = async (searchWord) => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
        }/rhyme/${searchWord}`
      );
      setRhymesByCategory(response.data.rhymes);
    } catch (error) {
      console.error('Error fetching rhymes:', error);
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
    fetchRhymes(clickedWord);
    scrollToTop();
  };

  return (
    <div className='app-container'>
      {/* Pass word state to Header */}
      <Header word={word} fetchRhymes={fetchRhymes} />
      {/* render categories */}
      {Object.keys(rhymesByCategory).length > 0 && (
        <div className='categories-container'>
          {Object.keys(rhymesByCategory)
            .sort((a, b) => a - b)
            .map((category) => (
              <div key={category} className='category-container'>
                <h2 className='category-title'>stohpu {category}.</h2>
                <ul className='rhymes-list'>
                  {rhymesByCategory[category].map((rhyme, index) => (
                    <li key={index} className='rhyme-item'>
                      <button
                        onClick={() => handleRhymeClick(rhyme)}
                        className='rhyme-link'
                      >
                        {rhyme}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;

// src/components/Main.js
import React, { useState, useEffect } from 'react';
import './Main.css';

function Main({
  rhymesByCategory,
  handleRhymeClick,
  word,
  rhymeType,
  loading,
  infoMessage,
}) {
  // Local state for the animated loading text
  const [loadingText] = useState('Ohcamen riimmaid...');

  // If a separate infoMessage exists, do not display any additional info.
  if (infoMessage) {
    return null;
  }

  // If loading, show the animated loading text
  if (loading) {
    return (
      <div className='categories-container'>
        <div className='info-message'>
          <h3>{loadingText}</h3>
        </div>
      </div>
    );
  }

  // Get additional category keys (≥ 2) sorted numerically.
  const additionalKeys = Object.keys(rhymesByCategory)
    .filter((key) => Number(key) >= 2)
    .sort((a, b) => Number(a) - Number(b));

  // Scroll smoothly to the category section with the given key.
  const scrollToCategory = (categoryId) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Function to scroll all the way to the top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to scroll all the way to the bottom
  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  // If there are no rhymes in any category, show the message.
  if (Object.keys(rhymesByCategory).length === 0) {
    if (word === '') {
      return (
        <div className='categories-container'>
          <div className='info-message'>
            <h3>Buresboahtin!</h3>
          </div>
        </div>
      );
    }
    if (rhymeType === 'consonant') {
      return (
        <div className='categories-container'>
          <div className='info-message'>
            <h3>Eai gávdnon riimmat sátnái "{word}".</h3>
            <h4>Iskka vaikko "gillot"</h4>
          </div>
        </div>
      );
    }
    return (
      <div className='categories-container'>
        <div className='info-message'>
          <h3>Eai gávdnon riimmat sátnái "{word}".</h3>
          <h4>Iskka vaikko "cohcagit"</h4>
        </div>
      </div>
    );
  }

  return (
    <div className='main-container'>
      <div className='categories-container'>
        {/* Render categories 0 and 1 without titles */}
        {[0, 1].map((cat) => {
          const catKey = String(cat);
          if (rhymesByCategory.hasOwnProperty(catKey)) {
            return (
              <div key={catKey} className='category-container'>
                <ul className='rhymes-list'>
                  {rhymesByCategory[catKey].map((rhyme, index) => (
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
            );
          }
          return null;
        })}

        {/* Render categories 2 and upward with titles */}
        {additionalKeys.map((key) => (
          <div key={key} className='category-container' id={`category-${key}`}>
            <h2 className='category-title'>stohpu {key}.</h2>
            <ul className='rhymes-list'>
              {rhymesByCategory[key].map((rhyme, index) => (
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

      {/* Fixed vertical bar with arrow up/down and additional categories */}
      {additionalKeys.length > 0 && (
        <div className='vertical-bar'>
          <button className='vertical-arrow-button' onClick={scrollToTop}>
            &#x2191;
          </button>
          {additionalKeys.map((key) => (
            <button
              key={key}
              className='vertical-bar-button'
              onClick={() => scrollToCategory(key)}
            >
              {key}
            </button>
          ))}
          <button className='vertical-arrow-button' onClick={scrollToBottom}>
            &#x2193;
          </button>
        </div>
      )}
    </div>
  );
}

export default Main;

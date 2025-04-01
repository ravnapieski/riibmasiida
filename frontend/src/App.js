import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [word, setWord] = useState('');
  const [rhymesByCategory, setRhymesByCategory] = useState({});

  const fetchRhymes = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/rhyme/${word}`);
      setRhymesByCategory(response.data.rhymes);
    } catch (error) {
      console.error('Error fetching rhymes:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchRhymes();
    }
  };

  return (
    <div className='app-container'>
      <h1 className='title'>RiibmaSiida</h1>
      <input
        type='text'
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder='Enter a word'
        className='input-field'
      />
      <button onClick={fetchRhymes} className='button'>
        Oza
      </button>

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
                      <a
                        href={`https://satni.org/${encodeURIComponent(rhyme)}`}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {rhyme}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default App;

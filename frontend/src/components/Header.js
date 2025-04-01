import React, { useState } from 'react';
import './Header.css';

const Header = ({ fetchRhymes }) => {
  const [word, setWord] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchRhymes(word);
    }
  };

  return (
    <header className='header'>
      <h1 className='title'>RiibmaSiida</h1>
      <input
        type='text'
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder='Čuokko sáni dása'
        className='input-field'
      />
      <button onClick={() => fetchRhymes(word)} className='button'>
        Oza
      </button>
    </header>
  );
};

export default Header;

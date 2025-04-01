import React, { useState } from 'react';
import './Header.css';

const Header = ({ word, fetchRhymes }) => {
  // keeps track of input's value locally
  const [inputValue, setInputValue] = useState(word);

  // Update inputValue when word changes
  React.useEffect(() => {
    setInputValue(word);
  }, [word]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchRhymes(inputValue);
    }
  };

  return (
    <header className='header'>
      <h1 className='title'>RiibmaSiida</h1>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder='Čuokko sáni dása'
        className='input-field'
      />
      <button onClick={() => fetchRhymes(inputValue)} className='button'>
        Oza
      </button>
    </header>
  );
};

export default Header;

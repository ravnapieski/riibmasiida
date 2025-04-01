import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className='footer'>
      <p>
        <a
          href='https://github.com/ravnapieski'
          target='_blank'
          rel='noopener noreferrer'
          title='My GitHub Profile'
        >
          Github
        </a>
      </p>
      <p>© Hans Ravna-Pieski.</p>
    </footer>
  );
};

export default Footer;

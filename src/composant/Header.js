// src/composant/Header.js
import React from 'react';
import '../CSS/App2.css';

const Header = () => {
  return (
    <header>
      <div className="Header">
      <h1>
        <a href="http://localhost:3001/" style={{ textDecoration: 'none', color: 'inherit' }}>Valkyrie</a>
      </h1>
      <button className="SignInButton">
        <a href="https://www.topachat.com/pages/configomatic.php" style={{ color: 'inherit', textDecoration:'none' }}>Sign in</a>
        <div class="arrow-wrapper">
        <div class="arrow"></div>
        </div>
      </button>
      </div>
    </header>
  );
};

export default Header;

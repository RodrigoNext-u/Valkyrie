// App.js
import React from 'react';
import './CSS/App.css';
import App2 from './composant/page';
import Header from './composant/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <App2 />
    </div>
  );
}

export default App;

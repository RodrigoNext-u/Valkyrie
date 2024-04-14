// App.js
import React from 'react';
import ComponentPage from './ComponentPage';
import './CSS/App.css';
import Header from './composant/Header';
import ProductPage from './ProductPage';
import ComposantForm from './composant/ComposantForm'

function App() {
  return (
    <div className="App">
      <Header />
      <ProductPage />
      <ComposantForm/>
    </div>
  );
}

export default App;

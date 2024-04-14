// ProductPage.js
import React, { useState, useEffect } from 'react';
import './CSS/ProductPage.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.75.14/projet%20v2/projet-x/src/API/API.php/data');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="product-page">
      <h1>Product Page</h1>
      {products.map(product => (
        <div key={product.idComposant} className="product-details">
          <img src={`http://192.168.75.14/projet%20v2/projet-x/src/ImageComposant/${product.type}/${product.qrCode}.jpg`} alt={product.libelle} />
          <div className="product-info">
            <h2>{product.libelle}</h2>
            <p>Type: {product.type}</p>
            <p>Marque: {product.marque}</p>
            <p>Prix: {product.prix}</p>
            <p>QR Code: {product.qrCode}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductPage;
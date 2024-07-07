import React, { useState, useEffect } from 'react';
import '../CSS/ProductPage.css';

const ComposantSelector = () => {
  const [products, setProducts] = useState([]);
  const [hoveredComponent, setHoveredComponent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.0.19/projet%20v2/projet-x/src/API/API.php/selecetItem/CPU');
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
      <div className="product-list">
        {products.map(product => (
          <div
            key={product.idComposant}
            className="product-details"
            onMouseEnter={() => setHoveredComponent(product.idComposant)}
          >
            <img src={`http://192.168.0.19/projet%20v2/projet-x/src/ImageComposant/${product.type}/${product.qrCode}.jpg`} alt={product.libelle} />
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
      {hoveredComponent && (
        <div className="modal">
          <div className="left-pane">
            {products.map(product => {
              if (product.idComposant === hoveredComponent) {
                return (
                  <div key={product.idComposant}>
                    <h2>{product.libelle}</h2>
                    <p>Type: {product.type}</p>
                    <p>Marque: {product.marque}</p>
                    <p>Prix: {product.prix}</p>
                    <p>QR Code: {product.qrCode}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default ComposantSelector;

import React, { useState, useEffect } from 'react';
import './CSS/ComponentPage.css';
import getUrl from './UrlApi.js';

const url = getUrl();

  // Assume that getDataFromDatabase function is defined globally
  const getDataFromDatabase = async () => {
    try {
      const response = await fetch(`${url}/src/API/API.php/data`);
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error('Error fetching data from API:', error);
    }
  };

const ComponentPage = () => {
  const [components, setComponents] = useState([]);

  useEffect(() => {
    // Call getDataFromDatabase function from API
    const getData = async () => {
      try {
        const response = await getDataFromDatabase();
        setComponents(response);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };

    getData();
  }, []);

  return (
    <div className="component-page">
      <h1>Components</h1>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {components.map(component => (
            <tr key={component.idComposant}>
              <td>{component.type}</td>
              <td>{component.marque}</td>
              <td>{component.libelle}</td>
              <td>{component.prix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComponentPage;

import React, { useState, useEffect } from 'react';

const ComposantForm = () => {
  const [composants, setComposants] = useState([]);
  const [formData, setFormData] = useState({
    idComposant: '',
    type: '',
    marque: '',
    libelle: '',
    prix: '',
    qrCode: ''
  });
  const [action, setAction] = useState('Ajouter');

  // Simulation des données JSON
  const initialData = [{"idComposant":"1","type":"Processeur","marque":"Intel","libelle":"Core i7","prix":"299.99","qrCode":"ProcI71"}];

  useEffect(() => {
    setComposants(initialData);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (action === 'Ajouter') {
      // Logique pour ajouter un composant
      const newComposant = { ...formData };
      setComposants([...composants, newComposant]);
    } else if (action === 'Modifier') {
      // Logique pour modifier un composant
      const updatedComposants = composants.map((comp) =>
        comp.idComposant === formData.idComposant ? formData : comp
      );
      setComposants(updatedComposants);
    } else if (action === 'Supprimer') {
      // Logique pour supprimer un composant
      const filteredComposants = composants.filter(
        (comp) => comp.idComposant !== formData.idComposant
      );
      setComposants(filteredComposants);
    }
    setFormData({
      idComposant: '',
      type: '',
      marque: '',
      libelle: '',
      prix: '',
      qrCode: ''
    });
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const selectedComposant = composants.find(
      (comp) => comp.idComposant === selectedId
    );
    if (selectedComposant) {
      setFormData(selectedComposant);
    } else {
      setFormData({
        idComposant: '',
        type: '',
        marque: '',
        libelle: '',
        prix: '',
        qrCode: ''
      });
    }
  };

  return (
    <div>
      <h1>Formulaire de gestion des composants</h1>
      <form onSubmit={handleSubmit}>
        <select onChange={handleActionChange}>
          <option value="Ajouter">Ajouter</option>
          <option value="Modifier">Modifier</option>
          <option value="Supprimer">Supprimer</option>
        </select>
        <select onChange={handleSelectChange}>
          <option value="">Sélectionner un composant</option>
          {composants.map((comp) => (
            <option key={comp.idComposant} value={comp.idComposant}>
              {comp.libelle}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="type"
          value={formData.type}
          placeholder="Type"
          onChange={handleChange}
        />
        <input
          type="text"
          name="marque"
          value={formData.marque}
          placeholder="Marque"
          onChange={handleChange}
        />
        <input
          type="text"
          name="libelle"
          value={formData.libelle}
          placeholder="Libellé"
          onChange={handleChange}
        />
        <input
          type="text"
          name="prix"
          value={formData.prix}
          placeholder="Prix"
          onChange={handleChange}
        />
        <input
          type="text"
          name="qrCode"
          value={formData.qrCode}
          placeholder="QR Code"
          onChange={handleChange}
        />
        <button type="submit">{action}</button>
      </form>
    </div>
  );
};

export default ComposantForm;

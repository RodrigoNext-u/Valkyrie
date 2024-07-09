import React from 'react';
import '../CSS/App2.css';
import getUrl from '../UrlApi.js';
import axios from 'axios';

  const debutUrl = getUrl();

const url = debutUrl + "/src/API/API.php";

class App2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: [],
      showModal: false,
      currentCategory: null,
      itemsByCategory: {},
      currentHoveredItem: null,
      compatibilityMessage: '', 
    };
    this.modalRef = React.createRef();
  }

  componentDidMount() {
    axios.get(url+"/data")
      .then(response => {
        //console.log('Data from API:', response.data);
        const itemsFromAPI = response.data; 
        const renamedCategories = this.renameCategories(itemsFromAPI);
        this.setState({ itemsByCategory: renamedCategories });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de l\'API:', error);
      });
      document.addEventListener("mousedown", this.handleClickOutside);
      document.addEventListener("keydown", this.handleEscapeKey);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
    document.removeEventListener("keydown", this.handleEscapeKey);
  }

  handleClickOutside = (event) => {
    if (this.modalRef && this.modalRef.current && !this.modalRef.current.contains(event.target)) {
      this.setState({ showModal: false, currentHoveredItem: null });
    }
  };

  handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      this.setState({ showModal: false, currentHoveredItem: null });
    }
  };

  renameCategories = (items) => {
    const renamedCategories = {};
    //console.log(items);
    items.forEach(item => {
      let category;
      switch (item.type) {
        case 'CPU': category = 'Le Processeur'; break;
        case 'GPU': category = 'La carte graphique'; break;
        case 'MOB': category = 'La Carte mère'; break;
        case 'RAM': category = 'La RAM'; break;
        case 'SSD': category = 'Le SSD'; break;
        case 'HDD': category = 'Le Disque dur'; break;
        case 'COL': category = 'Watercooling / Ventirad'; break;
        case 'WIF': category = 'Carte Wifi'; break;
        case 'CAS': category = 'Le boîtier'; break;
        case 'PSU': category = 'L\'alimentation'; break;
        default: category = 'Autres';
      }
      if (!renamedCategories[category]) {
        renamedCategories[category] = [];
      }
      renamedCategories[category].push(item);
    });
    return renamedCategories;
  };

  handleItemClick = (item) => {
    const { selectedItems } = this.state;
    const index = selectedItems.findIndex((i) => i.idComposant === item.idComposant);

    if (index === -1) {
      const sameTypeIndex = selectedItems.findIndex((i) => i.type === item.type);
      if (sameTypeIndex !== -1) {
        const updatedItems = [...selectedItems];
        updatedItems[sameTypeIndex] = { ...item, quantity: 1 };
        this.setState({ selectedItems: updatedItems }, this.fetchCompatibleComponents);
      } else {
        const newItem = { ...item, quantity: 1 };
        this.setState({ selectedItems: [...selectedItems, newItem] }, this.fetchCompatibleComponents);
      }
    } else {
      const updatedItems = [...selectedItems];
      updatedItems[index].quantity += 1;
      this.setState({ selectedItems: updatedItems }, this.fetchCompatibleComponents);
    }

    this.handleHoverItem(null)
    this.toggleModal(null);
  };

  fetchCompatibleComponents = () => {
    const { selectedItems } = this.state;
    const componentIds = selectedItems.map(item => `${item.idComposant}`).join(',');
    axios.get(`${url}/compat/${componentIds}`)
      .then(response => {
        const compatibleComponents = response.data;
        const renamedCategories = this.renameCategories(compatibleComponents);
        this.setState({ itemsByCategory: renamedCategories });
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des composants compatibles:', error);
      });
  };
  

  handleRemoveItem = (item) => {
    const { selectedItems } = this.state;
    const updatedItems = selectedItems.filter((i) => i.idComposant !== item.idComposant);
    this.setState({ selectedItems: updatedItems }, () => {
      if (this.state.selectedItems.length < 1) {
        this.componentDidMount();
      }else
        this.fetchCompatibleComponents();
      
    });
  };

  calculateTotalPrice = () => {
    const { selectedItems } = this.state;
    return selectedItems.reduce((total, item) => total + (parseFloat(item.prix) * item.quantity), 0);
  };

  toggleModal = (category) => {
    this.setState((prevState) => ({
      showModal: !prevState.showModal,
      currentCategory: category,
    }));
  };

  handleHoverItem = (item) => {
    this.setState({ currentHoveredItem: item });
  };

  render() {
    const { itemsByCategory, currentCategory, currentHoveredItem, compatibilityMessage } = this.state;

    return (
      <div className="container">
        <div className="left-panel">
          <h2>Choisissez vos éléments :</h2>
          <div className="item-buttons">
            {Object.keys(itemsByCategory).map((category, index) => (
              <button key={index} className="category-button" onClick={() => this.toggleModal(category)}>
                {category}
              </button>
            ))}
          </div>
        </div>
        {this.state.showModal && (
          <div className="modal">
            <div className="modal-content" ref={this.modalRef} >
              {currentHoveredItem && (
                <div className="item-description">
                  <img className="img" src={`${debutUrl}/src/ImageComposant/${currentHoveredItem.type}/${currentHoveredItem.qrCode}.jpg`} alt={currentHoveredItem.libelle} />
                  <p>Description détaillée</p>
                  <p>A venir ...</p>
                </div>
              )}
              <div className="items-list">
                <span className="close" onClick={() => this.toggleModal(null) && this.handleHoverItem(null)}>&times;</span>
                {itemsByCategory[currentCategory].map(item => (
                  <div
                    key={item.idComposant}
                    className="item"
                    onClick={() => this.handleItemClick(item)}
                    onMouseEnter={() => this.handleHoverItem(item)}
                  >
                    <p>{item.marque}</p>
                    <p>{item.libelle}</p>
                    <p>{item.prix} €</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="right-panel">
          <h2>Éléments sélectionnés :</h2>
          <ul>
            {this.state.selectedItems.map((item, index) => (
              <li key={index}>
                {item.libelle} - {item.prix} € x {item.quantity}
                <button onClick={() => this.handleRemoveItem(item)}>Supprimer</button>
              </li>
            ))}
          </ul>
          <h3>Total : {this.calculateTotalPrice()} €</h3>
          <p>{compatibilityMessage}</p>
        </div>
      </div>
    );
  }
}

export default App2;

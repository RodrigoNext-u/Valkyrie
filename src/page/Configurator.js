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
      selectedItemsByCategory: {}, // Tracks selected item by category
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
    const { selectedItems, selectedItemsByCategory } = this.state;

    const index = selectedItems.findIndex((i) => i.idComposant === item.idComposant);
    const category = this.getCategoryFromType(item.type);

    if (index === -1) {
      const sameTypeIndex = selectedItems.findIndex((i) => i.type === item.type);
      if (sameTypeIndex !== -1) {
        const updatedItems = [...selectedItems];
        updatedItems[sameTypeIndex] = { ...item, quantity: 1 };
        this.setState({ 
          selectedItems: updatedItems,
          selectedItemsByCategory: { ...selectedItemsByCategory, [category]: item }, // Update selected item by category
        }, this.fetchCompatibleComponents);
      } else {
        const newItem = { ...item, quantity: 1 };
        this.setState({ 
          selectedItems: [...selectedItems, newItem],
          selectedItemsByCategory: { ...selectedItemsByCategory, [category]: item }, // Update selected item by category
        }, this.fetchCompatibleComponents);
      }
    } else {
      const updatedItems = [...selectedItems];
      updatedItems[index].quantity += 1;
      this.setState({ 
        selectedItems: updatedItems,
        selectedItemsByCategory: { ...selectedItemsByCategory, [category]: item }, // Update selected item by category
      }, this.fetchCompatibleComponents);
    }

    this.handleHoverItem(null);
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
    const { selectedItems, selectedItemsByCategory } = this.state;
    const updatedItems = selectedItems.filter((i) => i.idComposant !== item.idComposant);
    const category = this.getCategoryFromType(item.type);

    this.setState({ 
      selectedItems: updatedItems,
      selectedItemsByCategory: { ...selectedItemsByCategory, [category]: null }, // Clear selected item for category
    }, () => {
      if (this.state.selectedItems.length < 1) {
        this.componentDidMount();
      } else {
        this.fetchCompatibleComponents();
      }
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

  getCategoryFromType = (type) => {
    switch (type) {
      case 'CPU': return 'Le Processeur';
      case 'GPU': return 'La carte graphique';
      case 'MOB': return 'La Carte mère';
      case 'RAM': return 'La RAM';
      case 'SSD': return 'Le SSD';
      case 'HDD': return 'Le Disque dur';
      case 'COL': return 'Watercooling / Ventirad';
      case 'WIF': return 'Carte Wifi';
      case 'CAS': return 'Le boîtier';
      case 'PSU': return 'L\'alimentation';
      default: return 'Autres';
    }
  };

  render() {
    const { itemsByCategory, currentCategory, currentHoveredItem, selectedItemsByCategory, compatibilityMessage } = this.state;

    return (
      <div className="container">
        <div className="left-panel">
          <div className="categories-grid">
            {Object.keys(itemsByCategory).map((category, index) => (
              <button key={index} className="category-button" onClick={() => this.toggleModal(category)}>
              {selectedItemsByCategory[category] ? (
                <div className="button-content-horizontal">
                  <img 
                    className="selected-item-image" 
                    src={`${debutUrl}/src/ImageComposant/${selectedItemsByCategory[category].type}/${selectedItemsByCategory[category].qrCode}.jpg`} 
                    alt={selectedItemsByCategory[category].libelle} 
                  />
                  <p>{selectedItemsByCategory[category].libelle}</p>
                  <p>{selectedItemsByCategory[category].prix} €</p>
                  {/* New cross button to remove the selected item */}
                  <button 
                    className="remove-button" 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent opening the modal
                      this.handleRemoveItem(selectedItemsByCategory[category]);
                    }}
                  >
                    &times;
                  </button>
                </div>
              ) : category}
            </button>
            ))}
          </div>
        </div>

        {/* Modal to display item list */}
        {this.state.showModal && (
          <div className="modal">
            <div className="modal-content" ref={this.modalRef}>
              {currentHoveredItem && (
                <div className="item-description">
                  <img className="img" src={`${debutUrl}/src/ImageComposant/${currentHoveredItem.type}/${currentHoveredItem.qrCode}.jpg`} alt={currentHoveredItem.libelle} />
                  <p>Description détaillée</p>
                </div>
              )}
              <div className="items-list">
                <span className="close" onClick={() => this.toggleModal(null)}>&times;</span>
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

        {/* Selected Items Section */}
        <div className="right-panel">
          <h2>Aperçu de la config</h2>
          <ul>
            {this.state.selectedItems.map((item, index) => (
              <li key={index}>
                {item.libelle} - {item.prix} € x {item.quantity}
                <button onClick={() => this.handleRemoveItem(item)}>x</button>
              </li>
            ))}
          </ul>
          <h3>Total: {this.calculateTotalPrice()} €</h3>
          <p>{compatibilityMessage}</p>
        </div>
      </div>
    );
  }
}

export default App2;

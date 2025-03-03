// modale-view.js

/**
 * Composant Web simple pour gérer une modale.
 * Ce composant affiche son contenu dans une fenêtre centrée.
 */
class ModaleView extends HTMLElement {
    constructor() {
      super();
      // Optionnel : vous pouvez attacher un Shadow DOM pour isoler les styles
      // this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      // La modale est cachée par défaut.
      this.style.display = 'none';
      this.style.position = 'fixed';
      this.style.top = '0';
      this.style.left = '0';
      this.style.width = '100%';
      this.style.height = '100%';
      this.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      this.style.justifyContent = 'center';
      this.style.alignItems = 'center';
      this.style.zIndex = '1000';
    }
  
    /**
     * Ouvre la modale en affichant son contenu.
     */
    open() {
      this.style.display = 'flex';
    }
  
    /**
     * Ferme la modale.
     */
    close() {
      this.style.display = 'none';
    }
  }
  
  // Définition du composant personnalisé
  customElements.define('modale-view', ModaleView);
  
  /**
   * Ouvre la modale identifiée par son id.
   * @param {string} id - L'identifiant de la modale.
   */
  function openModale(id) {
    const modal = document.getElementById(id);
    if (modal && typeof modal.open === 'function') {
      modal.open();
    } else {
      console.error("La modale avec l'ID " + id + " est introuvable ou ne dispose pas d'une méthode open().");
    }
  }
  
  /**
   * Ferme la modale identifiée par son id.
   * @param {string} id - L'identifiant de la modale.
   */
  function closeModale(id) {
    const modal = document.getElementById(id);
    if (modal && typeof modal.close === 'function') {
      modal.close();
    } else {
      console.error("La modale avec l'ID " + id + " est introuvable ou ne dispose pas d'une méthode close().");
    }
  }
  
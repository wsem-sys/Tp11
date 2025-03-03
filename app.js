// app.js

// =====================================================================
// Constantes, variables globales et sélection des éléments DOM
// =====================================================================

// Identifiant créateur fixe (utilisé pour filtrer les utilisateurs)
const currentCreatorId = "khlifi Wissem le supa saiyajin Dr stone";

// Variables globales
let users = [];
let deleteCandidateId = null;
let editMode = false; // false = création, true = modification

// Sélection des éléments du DOM
const statusMessageDiv = document.getElementById('status-message');
const formMessageDiv   = document.getElementById('form-message');
const usersTableBody   = document.getElementById('users-table-body');
const userForm         = document.getElementById('user-form');
const btnSubmit        = document.getElementById('btn-submit');
const modaleTitle      = document.getElementById('modale-title');

// =====================================================================
// Initialisation
// =====================================================================

// Au chargement du document, on récupère la liste des utilisateurs
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
});

// =====================================================================
// Fonctions de gestion des utilisateurs via json-server
// =====================================================================

/**
 * Récupère la liste des utilisateurs filtrés par idCreateur
 * et met à jour le tableau HTML.
 */
function fetchUsers() {
  statusMessageDiv.innerHTML = '<p>Chargement des utilisateurs...</p>';
  fetch(`http://localhost:3000/utilisateurs?idCreateur=${encodeURIComponent(currentCreatorId)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      return response.json();
    })
    .then(data => {
      users = data;
      displayUsers();
      statusMessageDiv.innerHTML = '';
    })
    .catch(err => {
      statusMessageDiv.innerHTML = `<p class="error">${err.message}</p>`;
      console.error("Erreur:", err);
    });
}

/**
 * Affiche la liste des utilisateurs dans le tableau HTML.
 */
function displayUsers() {
  usersTableBody.innerHTML = '';

  if (users.length === 0) {
    usersTableBody.innerHTML = '<tr><td colspan="8">Aucun utilisateur trouvé</td></tr>';
    return;
  }

  users.forEach(user => {
    // Construction de l'adresse complète
    const adresseComplete = [
      user.numeroRue || '',
      user.libelleRue || '',
      user.codePostal || '',
      user.ville || ''
    ].join(' ').trim();

    // Formatage de la date de naissance
    let dateN = 'N/A';
    if (user.dateNaissance) {
      const d = new Date(user.dateNaissance);
      if (!isNaN(d)) {
        dateN = d.toLocaleDateString('fr-FR');
      }
    }

    // Création de la ligne du tableau pour cet utilisateur
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id || 'N/A'}</td>
      <td>${user.nom || 'N/A'}</td>
      <td>${user.prenom || 'N/A'}</td>
      <td>${dateN}</td>
      <td>${user.lieuNaissance || 'N/A'}</td>
      <td>${user.departementNaissance || 'N/A'}</td>
      <td>${adresseComplete || 'N/A'}</td>
      <td>
        <button class="icon-btn" onclick="openDeleteConfirm(${user.id})" title="Supprimer">
          <svg class="trash-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5V6h1v9.5A1.5 1.5 0 0 1 10.5 17h-5A1.5 1.5 0 0 1 4 15.5V6h1v-.5zm1 .5v9.5a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5V6h-4z"/>
            <path fill-rule="evenodd" d="M4.5 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5V4h1.5a.5.5 0 0 1 0 1H14v10.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 15.5V5H1a.5.5 0 0 1 0-1H2V3zM5 4v-.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5V4H5z"/>
          </svg>
        </button>
        <button class="btn btn-warning btn-sm ms-2" onclick="openEditModal(${user.id})">Modifier</button>
      </td>
    `;
    usersTableBody.appendChild(tr);
  });
}

/**
 * Récupère les données du formulaire et renvoie un objet utilisateur.
 * @returns {Object} L'objet contenant les données saisies.
 */
function getFormData() {
  return {
    nom                 : document.getElementById('nom').value,
    prenom              : document.getElementById('prenom').value,
    dateNaissance       : document.getElementById('dateNaissance').value,
    lieuNaissance       : document.getElementById('lieuNaissance').value,
    departementNaissance: document.getElementById('departementNaissance').value,
    numeroRue           : document.getElementById('numeroRue').value,
    libelleRue          : document.getElementById('libelleRue').value,
    codePostal          : document.getElementById('codePostal').value,
    ville               : document.getElementById('ville').value,
    idCreateur          : currentCreatorId
  };
}

// =====================================================================
// Fonctions de gestion des modales (ouverture, fermeture, réinitialisation)
// =====================================================================

/**
 * Ouvre la modale en mode création.
 */
function openCreateModal() {
  editMode = false;
  resetForm();
  modaleTitle.textContent = 'Créer un utilisateur';
  btnSubmit.textContent = 'Créer';
  openModale('modaleUserForm');
}

/**
 * Ouvre la modale en mode modification avec les données de l'utilisateur sélectionné.
 * @param {number} userId - L'identifiant de l'utilisateur à modifier.
 */
function openEditModal(userId) {
  const userToEdit = users.find(u => u.id == userId);
  if (!userToEdit) {
    console.error("Utilisateur non trouvé !");
    return;
  }

  // Remplissage des champs du formulaire avec les données existantes
  document.getElementById('user-id').value = userToEdit.id;
  document.getElementById('nom').value = userToEdit.nom;
  document.getElementById('prenom').value = userToEdit.prenom;
  document.getElementById('dateNaissance').value = userToEdit.dateNaissance;
  document.getElementById('lieuNaissance').value = userToEdit.lieuNaissance;
  document.getElementById('departementNaissance').value = userToEdit.departementNaissance;
  document.getElementById('numeroRue').value = userToEdit.numeroRue;
  document.getElementById('libelleRue').value = userToEdit.libelleRue;
  document.getElementById('codePostal').value = userToEdit.codePostal;
  document.getElementById('ville').value = userToEdit.ville;

  // Passage en mode modification
  editMode = true;
  modaleTitle.textContent = 'Modifier un utilisateur';
  btnSubmit.textContent = 'Modifier';
  openModale('modaleUserForm');
}

/**
 * Annule l'opération en cours et réinitialise le formulaire.
 */
function onCancel() {
  closeModale('modaleUserForm');
  resetForm();
}

/**
 * Réinitialise le formulaire et remet les textes par défaut.
 */
function resetForm() {
  userForm.reset();
  formMessageDiv.innerHTML = '';
  editMode = false;
  modaleTitle.textContent = 'Créer un utilisateur';
  btnSubmit.textContent = 'Créer';
}

// =====================================================================
// Fonctions de création, mise à jour et suppression des utilisateurs
// =====================================================================

/**
 * Gère la soumission du formulaire. Appelle createUser() si en création,
 * ou updateUser() si en modification.
 */
function onSubmit() {
  if (editMode) {
    updateUser();
  } else {
    createUser();
  }
}

/**
 * Crée un nouvel utilisateur en envoyant une requête POST à json-server.
 */
function createUser() {
  const data = getFormData();
  formMessageDiv.innerHTML = '<p>Création en cours...</p>';

  fetch('http://localhost:3000/utilisateurs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(`Erreur (${response.status}): ${text || response.statusText}`); });
    }
    return response.json();
  })
  .then(result => {
    formMessageDiv.innerHTML = '<p class="success">Utilisateur créé avec succès.</p>';
    closeModale('modaleUserForm');
    resetForm();
    fetchUsers();
  })
  .catch(err => {
    console.error("Erreur lors de la création :", err);
    formMessageDiv.innerHTML = `<p class="error">${err.message}</p>`;
  });
}

/**
 * Met à jour un utilisateur existant en envoyant une requête PUT à json-server.
 */
function updateUser() {
  const userId = document.getElementById('user-id').value;
  const data = getFormData();
  formMessageDiv.innerHTML = '<p>Mise à jour en cours...</p>';

  fetch(`http://localhost:3000/utilisateurs/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(`Erreur (${response.status}): ${text || response.statusText}`); });
    }
    return response.json();
  })
  .then(result => {
    formMessageDiv.innerHTML = '<p class="success">Utilisateur mis à jour avec succès.</p>';
    closeModale('modaleUserForm');
    resetForm();
    fetchUsers();
  })
  .catch(err => {
    console.error("Erreur lors de la mise à jour :", err);
    formMessageDiv.innerHTML = `<p class="error">${err.message}</p>`;
  });
}

/**
 * Ouvre la modale de confirmation pour supprimer un utilisateur.
 * @param {number} userId - L'identifiant de l'utilisateur à supprimer.
 */
function openDeleteConfirm(userId) {
  deleteCandidateId = userId;
  openModale('modaleConfirmDelete');
}

/**
 * Confirme et exécute la suppression de l'utilisateur sélectionné.
 */
function confirmDelete() {
  deleteUser(deleteCandidateId);
  closeModale('modaleConfirmDelete');
}

/**
 * Supprime un utilisateur en envoyant une requête DELETE à json-server.
 * @param {number} userId - L'identifiant de l'utilisateur à supprimer.
 */
function deleteUser(userId) {
  statusMessageDiv.innerHTML = '<p>Suppression en cours...</p>';

  fetch(`http://localhost:3000/utilisateurs/${userId}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => { throw new Error(`Erreur (${response.status}): ${text || response.statusText}`); });
    }
    return response.json();
  })
  .then(() => {
    statusMessageDiv.innerHTML = '<p class="success">Utilisateur supprimé avec succès.</p>';
    fetchUsers();
  })
  .catch(err => {
    console.error("Erreur lors de la suppression :", err);
    statusMessageDiv.innerHTML = `<p class="error">${err.message}</p>`;
  });
}

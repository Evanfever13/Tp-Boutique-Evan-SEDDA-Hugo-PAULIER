// on essaie de trouver la balise <main>. + sécurité en cas d'erreur
let zoneFavoris = document.querySelector('main');
if (!zoneFavoris) {
    console.error("La balise <main> est introuvable dans favoris.html");
    zoneFavoris = document.body;
}

let favorisIds = [];

// Fonction pour récupérer les IDs depuis le stockage local
function chargerIdsFavoris() {
    let stock = localStorage.getItem('vapeurFavoriteIds');
    if (!stock) {
        return [];
    }
    
    try {
        let donnees = JSON.parse(stock);
        if (Array.isArray(donnees)) {
            return donnees;
        } else {
            return [];
        }
    } catch (erreur) {
        return [];
    }
}

// Fonction pour sauvegarder les IDs
function sauvegarderIdsFavoris() {
    localStorage.setItem('vapeurFavoriteIds', JSON.stringify(favorisIds));
}

// fonction qui initialise la page des favoris
async function initialiserFavoris() {
    favorisIds = chargerIdsFavoris();
    zoneFavoris.innerHTML = '<p class="page-message">Chargement des favoris...</p>';

    try {
        const reponse = await fetch('http://localhost:8080/home');
        const data = await reponse.json();

        if (data.success && data.games) {
            let jeuxFavoris = [];
            for (let i = 0; i < data.games.length; i++) {
                let jeu = data.games[i];
                if (favorisIds.includes(String(jeu.id))) {
                    jeuxFavoris.push(jeu);
                }
            }
            afficherFavoris(jeuxFavoris);
        } else {
            zoneFavoris.innerHTML = '<p class="page-message">Impossible de charger les jeux.</p>';
        }
    } catch (erreur) {
        console.error(erreur);
        zoneFavoris.innerHTML = '<p class="page-message">Erreur serveur.</p>';
    }
}

// fonction qui affiche les jeux en favoris
function afficherFavoris(jeux) {
    if (jeux.length === 0) {
        zoneFavoris.innerHTML = `
            <div class="favorites-container">
                <h2>Aucun favori pour l'instant</h2>
                <p>Ajoutez des jeux aux favoris depuis la boutique pour les retrouver ici.</p>
                <a href="./shop.html" class="button button-primary">Visiter la boutique</a>
            </div>
        `;
        return;
    }

    let html = `
        <div class="favorites-container">
            <h1>Mes Favoris</h1>
            <div class="favorites-grid" id="liste-favoris">
    `;

    for (let i = 0; i < jeux.length; i++) {
        let jeu = jeux[i];
        let image = jeu.image;
        if (!image) image = '../../backend/data/images/perdu.jpg';
        
        let prix = "Prix inconnu";
        if (typeof jeu.prix === 'number') {
            prix = jeu.prix.toFixed(2) + " €";
        }

        html += `
            <div class="fav-card">
                <img src="${image}" alt="${jeu.game}">
                <h3>${jeu.game}</h3>
                <p class="price">${prix}</p>
                <a href="product.html?id=${jeu.id}" class="button button-secondary">Voir le jeu</a>
                <button class="button button-primary btn-supprimer" data-id="${jeu.id}">Retirer</button>
            </div>
        `;
    }

    html += `</div></div>`;
    zoneFavoris.innerHTML = html;

    let boutons = zoneFavoris.querySelectorAll('.btn-supprimer');
    for (let i = 0; i < boutons.length; i++) {
        boutons[i].addEventListener('click', (evenement) => {
            let id = evenement.target.getAttribute('data-id');
            
            favorisIds = favorisIds.filter(f => f !== id);
            sauvegarderIdsFavoris();
            
            initialiserFavoris();
        });
    }
}

initialiserFavoris();

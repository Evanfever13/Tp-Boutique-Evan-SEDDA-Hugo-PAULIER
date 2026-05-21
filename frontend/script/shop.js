// et encore on récupère la section shop etc... + sécurité en cas d'erreur
let zoneBoutique = document.querySelector('.shop');
let inputRecherche = document.getElementById('searchInput');
let zoneFiltres = document.getElementById('filters');
 
if (!zoneBoutique) {
    console.error("La balise .shop est introuvable dans shop.html");
    zoneBoutique = document.body;
}

if (!inputRecherche) {
    console.error("La balise #searchInput est introuvable dans shop.html");
}

if (!zoneFiltres) {
    console.error("La balise #filters est introuvable dans shop.html");
}
 
// variables globales
let tousLesJeux = [];
let idsFavoris = [];
 
// gestion de fav
function chargerFavoris() {
    let stockage = localStorage.getItem('vapeurFavoriteIds');
    if (stockage) {
        try {
            return JSON.parse(stockage);
        } catch (erreur) {
            return [];
        }
    }
    return [];
}

// fonction pour sauvegarder les favoris
function sauvegarderFavoris() {
    localStorage.setItem('vapeurFavoriteIds', JSON.stringify(idsFavoris));
}

// fonctions pour gérer les favoris
function estFavori(id) {
    return idsFavoris.includes(String(id));
}

// fonction pour ajouter ou retirer des favoris
function changerFavori(id) {
    id = String(id);
    if (estFavori(id)) {
        idsFavoris = idsFavoris.filter(favId => favId !== id);
    } else {
        idsFavoris.push(id);
    }
    sauvegarderFavoris();
    if (inputRecherche) {
        appliquerFiltresEtRecherche();
    } else {
        afficherJeux(tousLesJeux);
    }
}
 
// fonction qui affiche les jeux
function creerCarteJeu(jeu) {
    let carte = document.createElement('div');
    carte.className = 'shop-card';
 
    let image1 = jeu.image;
    if (!image1) image1 = 'http://localhost:8080/images/perdu.jpg';
 
    let image2 = jeu.image1 || image1;
 
    let prix = "Prix inconnu";
    if (typeof jeu.prix === 'number') {
        prix = jeu.prix.toFixed(2) + " €";
    }
 
    let optionsEditions = "";
    let editions = jeu.editions;
    if (!editions) editions = ["Standard"];
 
    for (let i = 0; i < editions.length; i++) {
        optionsEditions += `<option value="${editions[i]}">${editions[i]}</option>`;
    }
 
    let boutonDesactive = "";
    if (jeu.stock <= 0) {
        boutonDesactive = "disabled";
    }
 
    let texteFavori = estFavori(jeu.id) ? "★ Retirer des favoris" : "☆ Ajouter en favori";
 
    carte.innerHTML = `
        <a href="product.html?id=${jeu.id}" style="text-decoration: none; color: white;">
            <img class="shop-card-img" src="${image1}" data-img1="${image1}" data-img2="${image2}">
            <h3>${jeu.game}</h3>
            <p class="price">${prix}</p>
            <p class="genre">Genre : ${jeu.genre}</p>
        </a>
        <select class="select-edition button button-secondary">
            ${optionsEditions}
        </select>
        <button class="btn-add-pannier button button-primary" ${boutonDesactive}>Ajouter au panier</button>
        <button class="btn-favori button button-secondary">${texteFavori}</button>
    `;
 
    let img = carte.querySelector('.shop-card-img');
    img.addEventListener('mouseenter', () => {
        img.src = image2;
    });
    img.addEventListener('mouseleave', () => {
        img.src = image1;
    });
 
    let btnAjouter = carte.querySelector('.btn-add-pannier');
    let selectEdition = carte.querySelector('.select-edition');
 
    btnAjouter.addEventListener('click', () => {
        const item = { ...jeu, selectedEdition: selectEdition.value };
        const itemId = `pannier_${jeu.id}_${selectEdition.value}`;
        localStorage.setItem(itemId, JSON.stringify(item));
        alert(`${jeu.game} (${selectEdition.value}) a été ajouté à votre panier !`);
    });
 
    let btnFavori = carte.querySelector('.btn-favori');
    btnFavori.addEventListener('click', () => {
        changerFavori(jeu.id);
    });
 
    return carte;
}
 
// fonction qui affiche les jeux dans la boutique
function afficherJeux(jeuxAAfficher) {
    if (!zoneBoutique) return;
    zoneBoutique.innerHTML = '';
 
    if (jeuxAAfficher.length === 0) {
        zoneBoutique.innerHTML = '<p>Aucun jeu trouvé.</p>';
        return;
    }
 
    let grille = document.createElement('div');
    grille.className = 'shop-grid';
 
    for (let i = 0; i < jeuxAAfficher.length; i++) {
        let carte = creerCarteJeu(jeuxAAfficher[i]);
        grille.appendChild(carte);
    }
 
    zoneBoutique.appendChild(grille);
}
 
// fonction async qui charge les jeux
async function chargerJeuxDepuisServeur() {
    idsFavoris = chargerFavoris();
    try {
        let reponse = await fetch('http://localhost:8080/home');
        let data = await reponse.json();
 
        if (data.success && data.games) {
            tousLesJeux = data.games;
            creerFiltres();
            afficherJeux(tousLesJeux);
        }
    } catch (erreur) {
        console.error(erreur);
        if (zoneBoutique) {
            zoneBoutique.innerHTML = '<p>Erreur lors du chargement des jeux.</p>';
        }
    }
}
 
// fonction de tri
function appliquerFiltresEtRecherche() {
    let texteRecherche = "";
    let filtreGenre = "";
    let filtreSupport = "";
    let tri = "";
    if (zoneFiltres) {
        filtreGenre = document.getElementById('genre-filter').value;
        filtreSupport = document.getElementById('support-filter').value;
        tri = document.getElementById('sort-filter').value;
    }
 
    if (inputRecherche) {
        texteRecherche = inputRecherche.value.toLowerCase();
    }
 
    let jeuxFiltres = [];
    for (let i = 0; i < tousLesJeux.length; i++) {
        let jeu = tousLesJeux[i];
        let nomJeu = "";
        if (jeu.game) {
            nomJeu = jeu.game.toLowerCase();
        }
 
        let correspondRecherche = nomJeu.includes(texteRecherche);
        let correspondGenre = (filtreGenre === "") || (jeu.genre === filtreGenre);
        let correspondSupport = (filtreSupport === "") || (jeu.support && jeu.support.includes(filtreSupport));
 
        if (correspondRecherche && correspondGenre && correspondSupport) {
            jeuxFiltres.push(jeu);
        }
    }
 
    if (tri === 'prix-asc') {
        jeuxFiltres.sort((a, b) => a.prix - b.prix);
    } else if (tri === 'prix-desc') {
        jeuxFiltres.sort((a, b) => b.prix - a.prix);
    } else if (tri === 'nom-asc') {
        jeuxFiltres.sort((a, b) => a.game.localeCompare(b.game));
    } else if (tri === 'nom-desc') {
        jeuxFiltres.sort((a, b) => b.game.localeCompare(a.game));
    }
 
    afficherJeux(jeuxFiltres);
}
 
// fonction qui crée les filtres de genre et de support
function creerFiltres() {
    if (!zoneFiltres) return;
 
    let genres = [];
    let supports = [];
 
    for (let i = 0; i < tousLesJeux.length; i++) {
        let jeu = tousLesJeux[i];
        let genreJeu = jeu.genre;
        if (genreJeu && !genres.includes(genreJeu)) {
            genres.push(genreJeu);
        }
        if (jeu.support && Array.isArray(jeu.support)) {
            for (let j = 0; j < jeu.support.length; j++) {
                if (!supports.includes(jeu.support[j])) {
                    supports.push(jeu.support[j]);
                }
            }
        }
    }
 
    let optionsGenre = '<option value="">Tous les genres</option>';
    for (let i = 0; i < genres.length; i++) {
        optionsGenre += `<option value="${genres[i]}">${genres[i]}</option>`;
    }
 
    let optionsSupport = '<option value="">Tous les supports</option>';
    for (let i = 0; i < supports.length; i++) {
        optionsSupport += `<option value="${supports[i]}">${supports[i]}</option>`;
    }
 
    zoneFiltres.innerHTML = `
        <div class="filter-controls" style="display: flex; gap: 15px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
            <label for="genre-filter">Genre:</label>
            <select id="genre-filter" class="button button-secondary">
                ${optionsGenre}
            </select>
 
            <label for="support-filter">Catégorie:</label>
            <select id="support-filter" class="button button-secondary">
                ${optionsSupport}
            </select>
 
            <label for="sort-filter">Trier par:</label>
            <select id="sort-filter" class="button button-secondary">
                <option value="">Défaut</option>
                <option value="prix-asc">Prix (croissant)</option>
                <option value="prix-desc">Prix (décroissant)</option>
                <option value="nom-asc">Nom (A-Z)</option>
                <option value="nom-desc">Nom (Z-A)</option>
            </select>
 
            <button id="reset-filters" class="button button-primary">Réinitialiser</button>
        </div>
    `;
 
    const genreFilter = document.getElementById('genre-filter');
    const supportFilter = document.getElementById('support-filter');
    const sortFilter = document.getElementById('sort-filter');
    const resetBtn = document.getElementById('reset-filters');
 
    genreFilter?.addEventListener('change', appliquerFiltresEtRecherche);
    supportFilter?.addEventListener('change', appliquerFiltresEtRecherche);
    sortFilter?.addEventListener('change', appliquerFiltresEtRecherche);
    resetBtn?.addEventListener('click', () => {
        if (genreFilter) genreFilter.value = "";
        if (supportFilter) supportFilter.value = "";
        if (sortFilter) sortFilter.value = "";
        if (inputRecherche) inputRecherche.value = "";
        appliquerFiltresEtRecherche();
    });
}
 
if (inputRecherche) {
    inputRecherche.addEventListener('input', appliquerFiltresEtRecherche);
}
 
// Démarrage du script
chargerJeuxDepuisServeur();
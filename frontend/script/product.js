// script pour la page product.html
document.addEventListener('DOMContentLoaded', () => {
    let container = document.querySelector('main');
 
    if (!container) {
        console.error("Erreur critique : La balise <main> est introuvable dans votre HTML.");
        return;
    }
 
    // Récupérer l'ID du jeu dans l'URL (ex: product.html?id=1 etc... )
    function getGameIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
 
    // Récupérer toutes les images du jeu dans l'ordre
    function getGameImages(game) {
        let images = [];
        if (game.image) images.push(game.image);
        for (let cle in game) {
            if (cle.startsWith('image') && cle !== 'image' && typeof game[cle] === 'string') {
                images.push(game[cle]);
            }
        }
        if (images.length === 0) {
            images.push('http://localhost:8080/images/perdu.jpg');
        }
        return images;
    }
    
    // fonction qui affiche les détails du jeu
    function afficherProduit(game, tousLesJeux) {
        let images = getGameImages(game);
        let currentImageIndex = 0;
 
        let prixTexte = "Prix non disponible";
        if (typeof game.prix === 'number') {
            prixTexte = game.prix.toFixed(2) + " €";
        }
 
        // description tronquée à 150 caractères avec bouton "Lire plus"
        let descCourte = game.description;
        let descComplete = game.description;
        let boutonLirePlus = '';
        if (descComplete && descComplete.length > 150) {
            descCourte = descComplete.substring(0, 150) + '...';
            boutonLirePlus = `<button id="btn-lire-plus" class="button button-secondary">Lire plus</button>`;
        }
 
        // produits similaires : même genre, différent ID, max 4
        let similaires = tousLesJeux.filter(j => j.genre === game.genre && j.id !== game.id).slice(0, 4);
        let htmlSimilaires = '';
        if (similaires.length > 0) {
            htmlSimilaires = `<section class="similaires-section">
                <h2>Jeux similaires</h2>
                <div class="similaires-grid">
                    ${similaires.map(j => `
                        <a href="product.html?id=${j.id}" class="similaire-card">
                            <img src="${j.image || 'http://localhost:8080/images/perdu.jpg'}" alt="${j.game}">
                            <p>${j.game}</p>
                            <p class="price">${typeof j.prix === 'number' ? j.prix.toFixed(2) + ' €' : ''}</p>
                        </a>
                    `).join('')}
                </div>
            </section>`;
        }
 
        container.innerHTML = `
            <div class="product-page-grid">
                <div class="product-gallery">
                    <img src="${images[0]}" alt="Image du jeu" id="main-image">
                    <div id="gallery-controls">
                        <button id="btn-prev" class="button button-secondary">Précédent</button>
                        <button id="btn-next" class="button button-secondary">Suivant</button>
                    </div>
                </div>
 
                <div class="product-info">
                    <h1>${game.game}</h1>
                    <h3 id="prix-affichage">${prixTexte}</h3>
 
                    <div id="description-container">
                        <p id="description-texte">${descCourte}</p>
                        ${boutonLirePlus}
                    </div>
 
                    <p><strong>Stock :</strong> <span id="stock-affichage">${game.stock}</span></p>
                    <p><strong>Genre :</strong> ${game.genre}</p>
                    <p><strong>Développeur :</strong> ${game.developpeur || 'N/A'}</p>
                    <p><strong>Éditeur :</strong> ${game.editeur || 'N/A'}</p>
                    <p><strong>Date de sortie :</strong> ${game.date_de_sortie || 'N/A'}</p>
 
                    <div id="actions-achat">
                        <select id="select-edition" class="button button-secondary"></select>
                        <button id="btn-add-pannier" class="button button-primary">Ajouter au panier</button>
                    </div>
                </div>
            </div>
            ${htmlSimilaires}
        `;
 
        // gestion du bouton "Lire plus"
        const btnLirePlus = document.getElementById('btn-lire-plus');
        const descTexte = document.getElementById('description-texte');
        let descEtendue = false;
        if (btnLirePlus) {
            btnLirePlus.addEventListener('click', () => {
                descEtendue = !descEtendue;
                descTexte.textContent = descEtendue ? descComplete : descCourte;
                btnLirePlus.textContent = descEtendue ? 'Lire moins' : 'Lire plus';
            });
        }
 
        // carrousel d'images
        if (images.length <= 1) {
            document.getElementById('gallery-controls').style.display = 'none';
        }
 
        const imgPrincipale = document.getElementById('main-image');
        document.getElementById('btn-prev').addEventListener('click', () => {
            currentImageIndex--;
            if (currentImageIndex < 0) currentImageIndex = images.length - 1;
            imgPrincipale.src = images[currentImageIndex];
        });
        document.getElementById('btn-next').addEventListener('click', () => {
            currentImageIndex++;
            if (currentImageIndex >= images.length) currentImageIndex = 0;
            imgPrincipale.src = images[currentImageIndex];
        });
 
        // sélecteur d'édition
        const selectEdition = document.getElementById('select-edition');
        let editionsDisponibles = game.editions || ["Standard"];
        for (let i = 0; i < editionsDisponibles.length; i++) {
            let option = document.createElement('option');
            option.value = editionsDisponibles[i];
            option.textContent = editionsDisponibles[i];
            selectEdition.appendChild(option);
        }
 
        selectEdition.addEventListener('change', () => {
            let editionChoisie = selectEdition.value.toLowerCase();
            let prixAffichage = document.getElementById('prix-affichage');
            if (editionChoisie === 'standard') {
                prixAffichage.textContent = prixTexte;
                imgPrincipale.src = images[currentImageIndex];
            } else {
                let clePrix = "prix_" + editionChoisie;
                let cleImage = "image_" + editionChoisie;
                prixAffichage.textContent = game[clePrix] ? game[clePrix].toFixed(2) + " €" : "Prix non disponible";
                if (game[cleImage]) imgPrincipale.src = game[cleImage];
            }
        });
 
        // bouton panier
        const btnAjouter = document.getElementById('btn-add-pannier');
        if (game.stock <= 0) {
            btnAjouter.textContent = "Rupture de stock";
            btnAjouter.disabled = true;
        }
        btnAjouter.addEventListener('click', () => {
            const item = { ...game, selectedEdition: selectEdition.value };
            const itemId = `pannier_${game.id}_${selectEdition.value}`;
            localStorage.setItem(itemId, JSON.stringify(item));
            alert(`${game.game} (${selectEdition.value}) a été ajouté à votre panier !`);
        });
    }
 
    async function loadProduct() {
        const id = getGameIdFromURL();
        if (!id) {
            container.innerHTML = "<p>Aucun jeu sélectionné.</p>";
            return;
        }
 
        container.innerHTML = "<p>Chargement en cours...</p>";
 
        try {
            // on charge le jeu ET tous les jeux pour les suggestions grace a l'api
            const [reponseJeu, reponseTous] = await Promise.all([
                fetch('http://localhost:8080/game/' + id),
                fetch('http://localhost:8080/home')
            ]);
            const dataJeu = await reponseJeu.json();
            const dataTous = await reponseTous.json();
 
            if (dataJeu.success && dataJeu.game) {
                const tousLesJeux = (dataTous.success && dataTous.games) ? dataTous.games : [];
                afficherProduit(dataJeu.game, tousLesJeux);
            } else {
                container.innerHTML = "<p>Jeu introuvable.</p>";
            }
        } catch (erreur) {
            console.error(erreur);
            container.innerHTML = "<p>Erreur serveur.</p>";
        }
    }
 
    loadProduct();
});
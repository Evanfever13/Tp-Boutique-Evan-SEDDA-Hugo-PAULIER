document.addEventListener('DOMContentLoaded', () => {
    let container = document.querySelector('main');
    
    if (!container) {
        console.error("Erreur critique : La balise <main> est introuvable dans votre HTML. Le contenu ne peut pas être affiché.");
        return;
    }

    // Récupérer l'ID du jeu dans l'URL (ex: product.html?id=1)
    function getGameIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // Récupérer toutes les images du jeu
    function getGameImages(game) {
        let images = [];
        
        if (game.image) {
            images.push(game.image);
        }
        
        for (let cle in game) {
            if (cle.startsWith('image') && cle !== 'image' && typeof game[cle] === 'string') {
                images.push(game[cle]);
            }
        }

        if (images.length === 0) {
            images.push('../../backend/data/images/perdu.jpg');
        }

        return images;
    }

    function afficherProduit(game) {
        let images = getGameImages(game);
        let currentImageIndex = 0;

        let prixTexte = "Prix non disponible";
        if (typeof game.prix === 'number') {
            prixTexte = game.prix.toFixed(2) + " €";
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
                    <p>${game.description}</p>
                    <p><strong>Stock :</strong> <span id="stock-affichage">${game.stock}</span></p>
                    <p><strong>Genre :</strong> ${game.genre}</p>
                    
                    <div id="actions-achat">
                        <select id="select-edition" class="button button-secondary"></select>
                        <button id="btn-add-pannier" class="button button-primary">Ajouter au panier</button>
                    </div>
                </div>
            </div>
        `;

        if (images.length <= 1) {
            document.getElementById('gallery-controls').style.display = 'none';
        }

        const imgPrincipale = document.getElementById('main-image');
        document.getElementById('btn-prev').addEventListener('click', () => {
            currentImageIndex--;
            if (currentImageIndex < 0) {
                currentImageIndex = images.length - 1;
            }
            imgPrincipale.src = images[currentImageIndex];
        });

        document.getElementById('btn-next').addEventListener('click', () => {
            currentImageIndex++;
            if (currentImageIndex >= images.length) {
                currentImageIndex = 0;
            }
            imgPrincipale.src = images[currentImageIndex];
        });

        const selectEdition = document.getElementById('select-edition');
        let editionsDisponibles = game.editions;
        if (!editionsDisponibles) {
            editionsDisponibles = ["Standard"];
        }

        for (let i = 0; i < editionsDisponibles.length; i++) {
            let option = document.createElement('option');
            option.value = editionsDisponibles[i];
            option.textContent = editionsDisponibles[i];
            selectEdition.appendChild(option);
        }

        selectEdition.addEventListener('change', () => {
            let editionChoisie = selectEdition.value.toLowerCase();
            let prixAffichage = document.getElementById('prix-affichage');

            // Changer le prix
            if (editionChoisie === 'standard') {
                prixAffichage.textContent = prixTexte;
                imgPrincipale.src = images[currentImageIndex];
            } else {
                let clePrix = "prix_" + editionChoisie;
                let cleImage = "image_" + editionChoisie;

                if (game[clePrix]) {
                    prixAffichage.textContent = game[clePrix].toFixed(2) + " €";
                } else {
                    prixAffichage.textContent = "Prix non disponible";
                }

                if (game[cleImage]) {
                    imgPrincipale.src = game[cleImage];
                }
            }
        });

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
            const reponse = await fetch('http://localhost:8080/game/' + id);
            const data = await reponse.json();

            if (data.success && data.game) {
                afficherProduit(data.game);
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
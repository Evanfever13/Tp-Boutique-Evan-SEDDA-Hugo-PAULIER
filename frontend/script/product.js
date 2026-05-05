product = document.querySelector('.Product');

function renderProductDetail(g) {
    const img = document.createElement('img');
    img.src = g.image;
    img.alt = g.game;
    const title = document.createElement('h2');
    title.textContent = g.game;
    const price = document.createElement('h3');
    price.textContent = g.prix + '€';
    const desc = document.createElement('p');
    desc.textContent = g.description || 'Aucune description disponible.';
    const avis = document.createElement('p');
    avis.textContent = `Avis: ${g.avis || 'Aucun avis disponible.'}`;
    const genre = document.createElement('p');
    genre.textContent = `Genre: ${g.genre || 'Genre inconnu'}`;
    const date = document.createElement('p');
    date.textContent = `Date de sortie: ${g.date || 'Date inconnue'}`;
    const dev = document.createElement('p');
    dev.textContent = `Développeur: ${g.dev || 'Développeur inconnu'}`;
    const editeur = document.createElement('p');
    editeur.textContent = `Éditeur: ${g.editeur || 'Éditeur inconnu'}`;
    const pannier = document.createElement('button');
    pannier.textContent = 'Ajouter au panier';
    pannier.addEventListener('click', () => {
        localStorage.setItem(`pannier_${g.id}`, JSON.stringify(g));
    });
    product.appendChild(img);
    product.appendChild(title);
    product.appendChild(price);
    product.appendChild(desc);
    product.appendChild(avis);
    product.appendChild(genre);
    product.appendChild(date);
    product.appendChild(dev);
    product.appendChild(pannier);
    product.appendChild(editeur);
}

async function loadProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
        product.textContent = 'ID de jeu manquant.';
        return;
    }
    try {
        const response = await fetch(`http://localhost:8080/game/${id}`);
        const data = await response.json();
        if (!data || !data.game) {
            product.textContent = 'Détails du jeu introuvables.';
            return;
        }
        renderProductDetail(data.game);
    } catch (error) {
        console.error('Erreur fetch:', error);
        product.textContent = 'Impossible de charger les détails du jeu.';
    }
}

loadProduct();
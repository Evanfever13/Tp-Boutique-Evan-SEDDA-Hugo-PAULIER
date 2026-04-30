const shop = document.querySelector('.shop');
const searchInput = document.getElementById('searchInput');
const searchForm = document.getElementById('searchForm');
const clearBtn = document.getElementById('clearSearch');

let allGames = [];

function renderProducts(games) {
    shop.innerHTML = '';
    if (!games || games.length === 0) {
        shop.textContent = 'Aucun jeu trouvé.';
        return;
    }
    for (const game of games) {

        const link = document.createElement('a');
        link.href = `product.html?id=${game.id}`;
        shop.appendChild(link);
        const product = document.createElement('div');
        product.classList.add('product');

        const img = document.createElement('img');
        img.src = game.image;
        img.alt = game.game;
        product.appendChild(img);

        const title = document.createElement('h2');
        title.textContent = game.game;

        const price = document.createElement('h3');
        price.textContent = game.prix + '€';

        product.appendChild(title);
        product.appendChild(price);
        link.appendChild(product);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:8080/home');
        const data = await response.json();
        //cherche si data.games existe
        if (!data || !Array.isArray(data.games)) {
            shop.textContent = 'Aucun jeu trouvé.';
            return;
        }
        allGames = data.games;
        renderProducts(allGames);
    } catch (error) {
        console.error('Erreur fetch:', error);
        shop.textContent = 'Impossible de charger les produits.';
    }
}

function recherche(query) {
    const q = String(query || '').trim().toLowerCase();
    if (!q) {
        renderProducts(allGames);
        return;
    }
    const filtered = allGames.filter(g => {
        const title = (g.game || '').toLowerCase();
        const editor = (g.editeur || '').toLowerCase();
        const genre = (g.genre || '').toLowerCase();
        return title.includes(q) || editor.includes(q) || genre.includes(q);
    });
    renderProducts(filtered);
}


if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        Recherche(searchInput.value);
    });
}
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        recherche(e.target.value);
    });
}
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        recherche('');
        searchInput && searchInput.focus();
    });
}

loadProducts();
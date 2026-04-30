pannier = document.querySelector('.Pannier');

function loadPannier() {
    const items = Object.keys(localStorage).filter(key => key.startsWith('pannier_'));
    if (items.length === 0) {
        pannier.textContent = 'Votre panier est vide.';
        return;
    }
    for (const key of items) {
        const game = JSON.parse(localStorage.getItem(key));
        const item = document.createElement('div');
        item.classList.add('pannier-item');
        const img = document.createElement('img');
        img.src = game.image;
        img.alt = game.game;
        const title = document.createElement('h2');
        title.textContent = game.game;
        const price = document.createElement('h3');
        price.textContent = game.prix + '€';
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Retirer';
        removeBtn.addEventListener('click', () => {
            localStorage.removeItem(key);
            loadPannier();
        });
        item.appendChild(img);
        item.appendChild(title);
        item.appendChild(price);
        item.appendChild(removeBtn);
        pannier.appendChild(item);
    }
}

loadPannier();

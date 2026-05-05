const pannier = document.querySelector('.Pannier');

function loadPannier() {
    if (!pannier) return;
    pannier.innerHTML = '';
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
        const buyBtn = document.createElement('button');
        buyBtn.textContent = 'Acheter';
        buyBtn.addEventListener('click', () => {
            localStorage.removeItem(key);
            localStorage.setItem(`achat_${game.id}`, JSON.stringify(game));
            loadPannier();
            alert(`Merci pour votre achat de ${game.game} !`);
        });
        item.appendChild(img);
        item.appendChild(title);
        item.appendChild(price);
        item.appendChild(removeBtn);
        item.appendChild(buyBtn);
        pannier.appendChild(item);
    }
}

loadPannier();

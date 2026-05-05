const pannier = document.querySelector('.Pannier');

function loadPannier() {
    if (!pannier) return;
    pannier.innerHTML = '';
    const items = Object.keys(localStorage).filter(key => key.startsWith('achat_'));
    if (items.length === 0) {
        pannier.textContent = 'Votre bibliothèque est vide.';
        return;
    }
    for (const key of items) {
        const game = JSON.parse(localStorage.getItem(key));
        const item = document.createElement('div');
        item.classList.add('library-item');
        const img = document.createElement('img');
        img.src = game.image;
        img.alt = game.game;
        const title = document.createElement('h2');
        title.textContent = game.game;
        const playBtn = document.createElement('button');
        playBtn.textContent = 'Jouer';
        item.appendChild(img);
        item.appendChild(title);
        item.appendChild(playBtn);
        pannier.appendChild(item);
    }
}

loadPannier();

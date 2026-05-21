// on essaie de trouver la balise .Pannier. + sécurité en cas d'erreur
const pannier = document.querySelector('.Pannier');
if (!pannier) {
    console.error("La balise .Pannier est introuvable dans pannier.html");
    pannier = document.body;
}

// fonction qui charge le panier
async function loadPannier() {
    if (!pannier) return;
    pannier.innerHTML = '';

    const itemKeys = Object.keys(localStorage).filter(key => key.startsWith('pannier_'));
    
    if (itemKeys.length === 0) {
        pannier.innerHTML = `
            <div class="empty-state cart-empty">
                <h2>Votre panier est vide</h2>
                <p>Il semble que vous n'ayez pas encore fait votre choix. Découvrez nos derniers jeux et promotions dans la boutique !</p>
                <a href="./shop.html" class="button button-primary btn-discover">Découvrir les jeux</a>
            </div>
        `;
        return;
    }

    let total = 0;

    for (const key of itemKeys) {
        const game = JSON.parse(localStorage.getItem(key));
        const item = document.createElement('div');
        item.className = 'pannier-item';

        const img = document.createElement('img');
        img.src = game.image;
        img.alt = game.game;
        img.className = 'cart-item-image';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'cart-item-info';

        const title = document.createElement('h2');
        title.textContent = `${game.game} (${game.selectedEdition})`;
        title.className = 'cart-item-title';

        let prix = game.prix;
        if (game.selectedEdition.toLowerCase() !== 'standard' && game[`prix_${game.selectedEdition.toLowerCase()}`]) {
            prix = game[`prix_${game.selectedEdition.toLowerCase()}`];
        }
        total += prix;

        const price = document.createElement('h3');
        price.textContent = prix.toFixed(2) + '€';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Retirer';
        removeBtn.className = 'button button-secondary';
        removeBtn.addEventListener('click', () => {
            localStorage.removeItem(key);
            loadPannier();
        });

        item.appendChild(img);
        infoDiv.appendChild(title);
        infoDiv.appendChild(price);
        item.appendChild(infoDiv);
        item.appendChild(removeBtn);
        pannier.appendChild(item);
    }

    const summary = document.createElement('div');
    summary.className = 'cart-summary';
    summary.innerHTML = `
        <h2>Total du panier : ${total.toFixed(2)}€</h2>
        <button id="buy-all-btn" class="button button-primary">Acheter tout le panier</button>
    `;
    pannier.appendChild(summary);

    document.getElementById('buy-all-btn').addEventListener('click', async () => {
        const email = localStorage.getItem('vapeurUserEmail');
        if (!email) {
            alert("Veuillez vous connecter pour acheter.");
            return;
        }

        for (const key of itemKeys) {
            const game = JSON.parse(localStorage.getItem(key));
            try {
                const reponse = await fetch('http://localhost:8080/buy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: email,
                        gameId: game.id,
                        edition: game.selectedEdition
                    })
                });
                const data = await reponse.json();
                if (data.success) {
                    localStorage.removeItem(key);
                } else {
                    alert(`Erreur lors de l'achat de ${game.game}: ${data.message}`);
                }
            } catch (erreur) {
                alert(`Erreur de communication pour ${game.game}.`);
            }
        }
        alert("Traitement des achats terminé !");
        loadPannier();
    });
}

loadPannier();

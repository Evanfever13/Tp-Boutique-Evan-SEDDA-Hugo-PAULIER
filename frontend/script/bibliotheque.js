// on essaie de trouver la balise <main>. + sécurité en cas d'erreur
let sectionBibliotheque = document.querySelector('main')
if (!sectionBibliotheque) {
    console.error("La balise <main> est introuvable dans library.html");
    sectionBibliotheque = document.body;
}

// fonction qui charge la bibliothèque
async function chargerBibliotheque() {
    const emailUtilisateur = localStorage.getItem('vapeurUserEmail');
    
    if (!emailUtilisateur) {
        sectionBibliotheque.innerHTML = `
            <div class="login-prompt">
                <h1>Connexion requise</h1>
                <p>Veuillez vous connecter pour voir vos jeux.</p>
                <a href="./login.html" class="button button-primary">Se connecter</a>
            </div>
        `;
        return;
    }

    sectionBibliotheque.innerHTML = '<p class="page-message">Chargement de votre bibliothèque...</p>';

    try {
        const reponse = await fetch('http://localhost:8080/user/games?email=' + emailUtilisateur);
        const data = await reponse.json();

        if (data.success && data.games) {
            afficherJeux(data.games);
        } else {
            sectionBibliotheque.innerHTML = '<p class="page-message">Erreur: ' + data.message + '</p>';
        }
    } catch (erreur) {
        console.error(erreur);
        sectionBibliotheque.innerHTML = '<p class="page-message">Erreur de communication avec le serveur.</p>';
    }
}

// fonction qui affiche les jeux
function afficherJeux(jeux) {
    if (jeux.length === 0) {
        sectionBibliotheque.innerHTML = `
            <div class="library-container library-empty">
                <h1>Ma Bibliothèque (0)</h1>
                <p>Vous n'avez pas encore de jeux.</p>
                <a href="./shop.html" class="button button-primary">Aller à la boutique</a>
            </div>
        `;
        return;
    }

    let html = `
        <div class="library-container">
            <h1>Ma Bibliothèque (${jeux.length})</h1>
            <div class="library-grid">
    `;

    for (let i = 0; i < jeux.length; i++) {
        let jeu = jeux[i];
        let image = jeu.image;
        if (!image) {
            image = '../../backend/data/images/perdu.jpg';
        }

        html += `
            <div class="library-card">
                <img src="${image}" alt="${jeu.game}">
                <h3>${jeu.game}</h3>
                <button onclick="window.location.href='https://www.youtube.com/watch?v=YAgJ9XugGBo&list=RDYAgJ9XugGBo&start_radio=1'" class="button button-primary">Jouer</button>
            </div>
        `;
    }

    html += `</div></div>`;
    sectionBibliotheque.innerHTML = html;
}

chargerBibliotheque();
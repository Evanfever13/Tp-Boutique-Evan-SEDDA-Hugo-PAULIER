const profileSection = document.querySelector('.Profil');
const profileEmailKey = 'vapeurUserEmail';

async function loadProfil() {
    if (!profileSection) return;

    const storedEmail = localStorage.getItem(profileEmailKey);
    if (!storedEmail) {
        renderLoginPrompt();
        return;
    }

    profileSection.innerHTML = '<div class="loading-card">Chargement du profil...</div>';

    try {
        const response = await fetch(`http://localhost:8080/users/profile?email=${encodeURIComponent(storedEmail)}`, { cache: 'no-store' });
        const data = await response.json();
        if (data && data.success && data.user) {
            renderProfile(data.user);
            return;
        }

        renderLoginPrompt('Profil introuvable, veuillez vous reconnecter.');
    } catch (error) {
        console.warn('Backend profil inaccessible, affichage local.', error);
        renderLoginPrompt('Impossible de charger votre profil actuellement.');
    }
}

function renderLoginPrompt(message = '') {
    if (!profileSection) return;

    profileSection.innerHTML = `
        <div class="page-shell">
            <div class="page-header">
                <div>
                    <span class="eyebrow">Profil</span>
                    <h1>Connexion requise</h1>
                    <p class="page-copy">${message || 'Veuillez vous connecter pour accéder à votre compte.'}</p>
                </div>
                <a href="./login.html" class="button button-primary">Se connecter</a>
            </div>
        </div>
    `;
}

function renderProfile(user) {
    if (!profileSection) return;

    const level = user.niveau || user.level || 1;
    const wallet = Number(user.portefeuille || user.wallet || 0);
    const friends = Array.isArray(user.amis) ? user.amis.length : (user.friends || 0);
    const gamesCount = Array.isArray(user.jeux) ? user.jeux.length : 0;
    const about = user.about || `Connecté en tant que ${user.email}.`;
    const avatar = user.image || user.avatar || '../../backend/data/images/perdu.jpg';

    profileSection.innerHTML = `
        <div class="page-shell">
            <div class="page-header">
                <div>
                    <span class="eyebrow">Profil du joueur</span>
                    <h1>${user.username}</h1>
                    <p class="page-copy">${about}</p>
                </div>
                <div>
                    <a href="./favoris.html" class="button button-secondary">Voir mes favoris</a>
                    <button id="logoutButton" class="button button-secondary">Déconnexion</button>
                </div>
            </div>

            <article class="profile-card">
                <div class="profile-hero">
                    <img src="${avatar}" alt="${user.username}" class="profile-avatar">
                    <div class="profile-meta">
                        <span class="subtitle">Statut membre</span>
                        <h2>LEVEL ${level}</h2>
                        <p>Vous êtes connecté avec ${user.email}.</p>
                    </div>
                </div>

                <div class="profile-stats-grid">
                    <article class="status-card">
                        <span>Portefeuille</span>
                        <strong class="stat-value">${wallet.toFixed(2)} €</strong>
                    </article>
                    <article class="status-card">
                        <span>Amis</span>
                        <strong class="stat-value">${friends}</strong>
                    </article>
                    <article class="status-card">
                        <span>Jeux</span>
                        <strong class="stat-value">${gamesCount}</strong>
                    </article>
                </div>

                <div class="profile-about">
                    <h2>À propos</h2>
                    <p>${about}</p>
                </div>
            </article>
        </div>
    `;

    const logoutButton = document.getElementById('logoutButton');
    logoutButton?.addEventListener('click', () => {
        localStorage.removeItem(profileEmailKey);
        window.location.href = './login.html';
    });
}

loadProfil();

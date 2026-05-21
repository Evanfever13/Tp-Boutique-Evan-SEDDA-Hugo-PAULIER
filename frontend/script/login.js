// ici on récupere les éléments du DOM nécessaires
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const storedEmail = localStorage.getItem('vapeurUserEmail');

// fonction qui affiche un message
function setMessage(text, type = 'info') {
    if (!loginMessage) return;
    loginMessage.textContent = text;
    loginMessage.className = `auth-message ${type === 'error' ? 'error' : 'success'}`;
}

// fonction pour se déconnecter
function logout() {
    localStorage.removeItem('vapeurUserEmail');
    window.location.reload();
}

// vérifie si l'utilisateur est déjà connecté et affiche un message approprié
if (storedEmail) {
    setMessage(`Connecté en tant que ${storedEmail}.`, 'success');
}

// gestion du formulaire de connexion
loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!email || !password) {
        setMessage('Veuillez renseigner votre email et votre mot de passe.', 'error');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (data.success) {
            localStorage.setItem('vapeurUserEmail', email);
            setMessage('Connexion réussie. Redirection vers le profil...', 'success');
            setTimeout(() => {
                window.location.href = './profil.html';
            }, 1000);
            return;
        }

        setMessage(data.message || 'Impossible de se connecter.', 'error');
    } catch (error) {
        console.error(error);
        setMessage('Erreur de connexion au serveur.', 'error');
    }
});

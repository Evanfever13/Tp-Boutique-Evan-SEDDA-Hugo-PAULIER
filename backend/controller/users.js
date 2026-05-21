
const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../data/users.json');
const gamesFile = path.join(__dirname, '../data/games.json');
 
function readUsers() {
    try {
        const data = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        return Array.isArray(data.users) ? data.users : [];
    } catch (err) {
        return [];
    }
}

function readGames() {
    try {
        return JSON.parse(fs.readFileSync(gamesFile, 'utf8'));
    } catch (err) {
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2), 'utf8');
}

function registerUser(username, email, password) {
    const users = readUsers();
    if (users.find(user => user.username === username || user.email === email)) {
        return {
            success: false,
            message: 'Nom d\'utilisateur ou email déjà utilisé',
        };
    }

    users.push({
        id: users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1,
        username,
        email,
        mot_de_passe: password,
        portefeuille: 10000.0,
        niveau: 1,
        amis: [],
        jeux: [],
        image: 'http://localhost:8080/images/perdu.jpg',
    });
    writeUsers(users);
    return {
        success: true,
        message: 'Utilisateur inscrit avec succès',
    };
}

function loginUser(identifier, password) {
    const users = readUsers();
    const user = users.find((user) =>
        (user.email === identifier || user.username === identifier) &&
        (user.mot_de_passe === password || user.password === password)
    );

    if (user) {
        return {
            success: true,
            message: 'Utilisateur connecté avec succès',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                portefeuille: user.portefeuille || 0,
                niveau: user.niveau || user.level || 1,
                amis: user.amis || [],
                jeux: user.jeux || [],
                image: user.image || 'http://localhost:8080/images/perdu.jpg',
            },
        };
    }

    return {
        success: false,
        message: 'Email ou mot de passe incorrect',
    };
}

function getUserProfile(email) {
    const users = readUsers();
    const user = users.find((user) => user.email === email || user.username === email);
    if (user) {
        return {
            success: true,
            message: 'Profil trouvé',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                portefeuille: user.portefeuille || 0,
                niveau: user.niveau || user.level || 1,
                amis: user.amis || [],
                jeux: user.jeux || [],
                image: user.image || 'http://localhost:8080/images/perdu.jpg',
            },
        };
    }

    return {
        success: false,
        message: 'Utilisateur non trouvé',
    };
}

function searchUser(username) {
    const users = readUsers();
    const user = users.find((user) => user.username === username || user.email === username);
    if (user) {
        return {
            success: true,
            message: 'Utilisateur trouvé',
            user: {
                username: user.username,
                friends: user.amis || [],
                games: user.jeux || [],
            },
        };
    }
    return {
        success: false,
        message: 'Utilisateur non trouvé',
    };
}

function addFriend(username, friendUsername) {
    const users = readUsers();
    const user = users.find((user) => user.username === username || user.email === username);
    const friend = users.find((user) => user.username === friendUsername || user.email === friendUsername);
    if (user && friend) {
        if (!user.amis) {
            user.amis = [];
        }
        if (!user.amis.includes(friendUsername)) {
            user.amis.push(friendUsername);
            writeUsers(users);
            return {
                success: true,
                message: 'Ami ajouté avec succès',
            };
        } else {
            return {
                success: false,
                message: 'Cet utilisateur est déjà votre ami',
            };
        }
    }
    return {
        success: false,
        message: 'Utilisateur ou ami non trouvé',
    };
}

function removeFriend(username, friendUsername) {
    const users = readUsers();
    const user = users.find((user) => user.username === username || user.email === username);
    const friend = users.find((user) => user.username === friendUsername || user.email === friendUsername);
    if (user && friend) {
        if (user.amis && user.amis.includes(friendUsername)) {
            user.amis = user.amis.filter((friend) => friend !== friendUsername);
            writeUsers(users);
            return {
                success: true,
                message: 'Ami supprimé avec succès',
            };
        } else {
            return {
                success: false,
                message: 'Cet utilisateur n\'est pas votre ami',
            };
        }
    }
    return {
        success: false,
        message: 'Utilisateur ou ami non trouvé',
    };
}

function addGameToUser(email, gameId, price) {
    const users = readUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
        return { success: false, message: 'Utilisateur non trouvé.' };
    }

    const user = users[userIndex];

    if (!user.jeux) {
        user.jeux = [];
    }

    if (user.jeux.includes(gameId)) {
        return { success: false, message: 'Vous possédez déjà ce jeu.' };
    }

    if (price > 0) {
        if (user.portefeuille === undefined || user.portefeuille < price) {
            return { success: false, message: `Solde insuffisant. Vous avez ${user.portefeuille.toFixed(2)}€.` };
        }
        user.portefeuille -= price;
        user.portefeuille = Math.round(user.portefeuille * 100) / 100;
    }

    user.jeux.push(gameId);
    writeUsers(users);
    return { 
        success: true, 
        message: 'Jeu ajouté à votre bibliothèque.',
        newBalance: user.portefeuille
    };
}

function getUserGames(email) {
    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        return { success: false, message: 'Utilisateur non trouvé.' };
    }

    const userGameIds = user.jeux || [];
    if (userGameIds.length === 0) {
        return { success: true, message: 'Aucun jeu trouvé', games: [] };
    }

    const allGames = readGames();
    const userGames = allGames.filter(game => userGameIds.includes(game.id));

    return { success: true, message: 'Jeux trouvés', games: userGames };
}

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    searchUser,
    addFriend,
    removeFriend,
    addGameToUser,
    getUserGames
};
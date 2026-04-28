// fichier users (pas idée de nom) pour faire les fonctions qui vont être utilisées dans les routes pour les utilisateurs (inscription, connexion, etc)

// je vais faire une fonction pour lire et écrire dans un fichier json, gain de temps tkt
const fs = require('fs');
// bon pour palier au probième de chemin, on va utiliser le module path qui va tout faire pour moi
const path = require('path');

// fonction pour lire les données des utilisateurs
function readUsers() {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
        return data;
    } catch (err) {        
        return [];
    } 
}

// fonction pour écrire les données des utilisateurs
function writeUsers(users) {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users));
}

// fonction pour inscrire un utilisateur, avec la vérification si l'utilisateur existe déjà ou pas, et si l'inscription est réussie ou pas
function registerUser(username, password) {
    const users = readUsers();
    if (users.find(user => user.username === username)) {
        return { 
            success: false, 
            message: 'Utilisateur déjà existant' };
    }
    users.push({ username, password });
    writeUsers(users);
    return { 
        success: true, 
        message: 'Utilisateur inscrit avec succès' };
}

// fonction pour connecter un utilisateur, avec la vérification si l'utilisateur existe ou pas, et si la connexion est réussie ou pas
function loginUser(username, password) {
    const users = readUsers();
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        return { 
            success: true, 
            message: 'Utilisateur connecté avec succès' };
    }
    return { 
        success: false, 
        message: 'Nom d\'utilisateur ou mot de passe incorrect' };
}

// fonction pour chercher un utilisateur, avec la vérification si l'utilisateur existe ou pas, et si la recherche est réussie ou pas, afin de chercher ses camarades en amis, (evan je vais te faire chômer)
function searchUser(username) {
    const users = readUsers();
    const user = users.find(user => user.username === username);
    if (user) {
        return { 
            success: true,
            message: 'Utilisateur trouvé',
            user: { username: user.username, friends: user.friends, games: user.games } };
    }
    return { 
        success: false, 
        message: 'Utilisateur non trouvé' };
}

// fonction pour ajouter un ami, avec la vérification si l'utilisateur et l'ami, 
// et si l'ajout est réussi ou pas, le tout dans le json dans la liste des amis
function addFriend(username, friendUsername) {
    const users = readUsers();
    const user = users.find(user => user.username === username);
    const friend = users.find(user => user.username === friendUsername);
    if (user && friend) {
        if (!user.friends) {
            user.friends = [];
        }
        if (!user.friends.includes(friendUsername)) {
            user.friends.push(friendUsername);
            writeUsers(users);
            return { 
                success: true, 
                message: 'Ami ajouté avec succès' };
        } else {
            return { 
                success: false, 
                message: 'Cet utilisateur est déjà votre ami' };
        }
    }
    return { 
        success: false, 
        message: 'Utilisateur ou ami non trouvé' };
}

// s'il y a une fonction add, il y'a une fonction remove chef (comme son nom l'indique, elle va supprimer un ami de la liste d'amis d'un utilisateur, avec la vérification dans le json)
function removeFriend(username, friendUsername) {
    const users = readUsers();
    const user = users.find(user => user.username === username);
    const friend = users.find(user => user.username === friendUsername);
    if (user && friend) {
        if (user.friends && user.friends.includes(friendUsername)) {
            user.friends = user.friends.filter(friend => friend !== friendUsername);
            writeUsers(users);
            return { 
                success: true, 
                message: 'Ami supprimé avec succès' };
        } else {
            return { 
                success: false, 
                message: 'Cet utilisateur n\'est pas votre ami' };
        }
    }
    return { 
        success: false, 
        message: 'Utilisateur ou ami non trouvé' };
}



module.exports = {
    registerUser,
    loginUser,
    searchUser,
    addFriend,
    removeFriend
};
// dans ce ficher games pour faire les fonctions qui vont être utilisées dans les routes pour les jeux (ajout, suppression, etc)

// je vais faire une fonction pour lire et écrire dans un fichier json, encore du gain de temps x3
const fs = require('fs');
// comme je l'ai dis dans users.js, pour palier au probième de chemin, on va utiliser le module path
const path = require('path');

// nouveau problème d'import, donc je déclare une variable dataPath directement
const dataPath = path.join(__dirname, '../data/games.json');

// fonction pour lire les données des jeux
function readGames() {
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        return data.games;
    } catch (err) {        
        return [];
    }
}

// fonction pour écrire les données des jeux
function writeGames(games) {
    fs.writeFileSync(dataPath, JSON.stringify(games));
}

// fonction pour ajouter un jeu à sa bibliothèque (jeux possédés), avec la vérification
function addGame(username, game) {
    const games = readGames();
    if (games.find(g => g.username === username && g.game === game)) {
        return { 
            success: false, 
            message: 'Jeu déjà ajouté' };
    }
    games.push({ username, game });
    writeGames(games);
    return { 
        success: true, 
        message: 'Jeu ajouté avec succès' };
}

// fonction pour supprimer un jeu de sa bibliothèque, avec la vérification
function removeGame(username, game) {
    const games = readGames();
    const index = games.findIndex(g => g.username === username && g.game === game);
    if (index !== -1) {
        games.splice(index, 1);
        writeGames(games);
        return { 
            success: true, 
            message: 'Jeu supprimé avec succès' };
    }
    return {
        success: false,
        message: 'Jeu non trouvé' };
}

// fonction pour chercher les jeux d'un utilisateur, avec la vérification
function getUserGames(username) {
    const games = readGames();
    const userGames = games.filter(g => g.username === username).map(g => g.game);
    if (userGames.length > 0) {
        return { 
            success: true,
            message: 'Jeux trouvés',
            games: userGames };
    }
    return { 
        success: false,
        message: 'Aucun jeu trouvé' };
}

// fonction pour chercher tous les jeux disponibles, avec la vérif
function getAllGames() {
    const games = readGames();
    if (games.length > 0) {
        return {
            success: true,
            message: 'Jeux trouvés',
            games: games.map(g => g.game) };
    }
    return {
        success: false,
        message: 'Aucun jeu trouvé' };
}

// fonction pour ajouter un jeu dans le magasin, avec vérif
function addGameToStore(game) {
    const games = readGames();
    if (games.find(g => g.game === game)) {
        return { 
            success: false, 
            message: 'Jeu déjà dans le magasin' };
    }
    games.push({ game });
    writeGames(games);
    return { 
        success: true, 
        message: 'Jeu ajouté au magasin avec succès' };
}

// fonction pour supprimer un jeu du magasin, avec la vérification
function removeGameFromStore(game) {
    const games = readGames();
    const index = games.findIndex(g => g.game === game);
    if (index !== -1) {
        games.splice(index, 1);
        writeGames(games);
        return { 
            success: true, 
            message: 'Jeu supprimé du magasin avec succès' };
    }
    return {
        success: false,
        message: 'Jeu non trouvé dans le magasin' };
}

// fonction pour chercher tous les jeux disponibles dans le magasin, avec la vérification
function getStoreGames() {
    const games = readGames();
    const storeGames = games.filter(g => !g.id).map(g => g.game);
    if (storeGames.length > 0) {
        return {
            success: true,
            message: 'Jeux trouvés dans le magasin',
            games: storeGames };
    }
    return {
        success: false,
        message: 'Aucun jeu trouvé dans le magasin' };
}

// fonction pour ajouter une promotion à un jeu, avec la vérification
function addPromotion(game, promotion) {
    const games = readGames();
    const index = games.findIndex(g => g.game === game);
    if (index !== -1) {
        games[index].promotion = promotion;
        writeGames(games);
        return { 
            success: true, 
            message: 'Promotion ajoutée au jeu avec succès' };
    }
    return {
        success: false,
        message: 'Jeu non trouvé pour ajouter la promotion' };
}

// si addPromotion, existe, removePromotion, pour supprimer la promotion d'un jeu, avec la vérification
function removePromotion(game) {
    const games = readGames();
    const index = games.findIndex(g => g.game === game);
    if (index !== -1) {
        delete games[index].promotion;
        writeGames(games);
        return { 
            success: true, 
            message: 'Promotion supprimée du jeu avec succès' };
    }
    return {
        success: false,
        message: 'Jeu non trouvé pour supprimer la promotion' };
}


// on exporte les fonctions pour les utiliser dans les routes
module.exports = {
    addGame,
    removeGame,
    getUserGames,
    getAllGames,
    addGameToStore,
    removeGameFromStore,
    getStoreGames,
    addPromotion,
    removePromotion
};
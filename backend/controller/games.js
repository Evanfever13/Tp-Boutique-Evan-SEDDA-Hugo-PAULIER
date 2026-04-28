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
            games: games };
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

// fonction pour chercher tous les jeux disponibles dans le magasin avec leur prix et image, avec la vérification
function getStoreGames() {
    const games = readGames();

    if (!games || games.length === 0) {
        return {
            success: false,
            message: 'Aucun jeu trouvé dans le magasin'
        };
    }

    const storeGames = games.map(g => ({
        id: g.id,
        game: g.game,
        prix: g.prix,
        image: g.image
    }));

    return {
        success: true,
        message: 'Jeux trouvés dans le magasin',
        games: storeGames
    };
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

// fonction pour trier selon le genre + verif
function getGamesByGenre(genre) {
    const games = readGames();
    const genreGames = games.filter(g => g.genre === genre).map(g => g.game);
    if (genreGames.length > 0) {
        return {
            success: true,
            message: 'Jeux trouvés pour le genre',
            games: genreGames };
    }
    return {
        success: false,
        message: 'Aucun jeu trouvé pour ce genre' };
}

// fonction pour trier selon le prix + verif
function getGamesByPrice(price) {
    const games = readGames();
    const priceGames = games.filter(g => g.price <= price).map(g => g.game);
    if (priceGames.length > 0) {
        return {
            success: true,
            message: 'Jeux trouvés pour le prix',
            games: priceGames };
    }
    return {
        success: false,
        message: 'Aucun jeu trouvé pour ce prix' };
}

// fonction pour gérer la pagination 10 par 10 par page pour le evan , avec bien sur la vérification
function getGamebyPage(page){
    const games = readGames();
    const pageSize = 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedGames = games.slice(startIndex, endIndex).map(g => g.game);
    if (paginatedGames.length > 0) {
        return {
            success: true,
            message: 'Jeux trouvés pour la page',
            games: paginatedGames };
    }
    return {
        success: false,
        message: 'Aucun jeu trouvé pour cette page' 
    };
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
    removePromotion,
    getGamesByGenre,
    getGamesByPrice
};
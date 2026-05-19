// dans ce ficher games pour faire les fonctions qui vont être utilisées dans les routes pour les jeux (ajout, suppression, etc)

// je vais faire une fonction pour lire et écrire dans un fichier json, encore du gain de temps x3
const fs = require('fs');
const path = require('path');

// fonction pour lire les données des jeux
function readGames() {
    try {
        const data = fs.readFileSync(path.join(__dirname, '../data/games.json'));
        return JSON.parse(data);
    } catch (err) {        
        return [];
    }
}

// fonction pour écrire les données des jeux
function writeGames(games) {
    fs.writeFileSync(path.join(__dirname, '../data/games.json'), JSON.stringify(games, null, 2));
}

// fonction pour ajouter un jeu à sa bibliothèque (jeux possédés), avec la vérification
function addGame(req, res) {
    const { username, game } = req.body;
    const games = readGames();
    if (games.find(g => g.username === username && g.game === game)) {
        return res.json({ 
            success: false, 
            message: 'Jeu déjà ajouté' });
    }
    games.push({ username, game });
    writeGames(games);
    res.json({ 
        success: true, 
        message: 'Jeu ajouté avec succès' });
}

// fonction pour supprimer un jeu de sa bibliothèque, avec la vérification
function removeGame(req, res) {
    const { username, game } = req.body;
    const games = readGames();
    const index = games.findIndex(g => g.username === username && g.game === game);
    if (index !== -1) {
        games.splice(index, 1);
        writeGames(games);
        return res.json({ 
            success: true, 
            message: 'Jeu supprimé avec succès' });
    }
    res.json({
        success: false,
        message: 'Jeu non trouvé' });
}

// fonction pour chercher les jeux d'un utilisateur, avec la vérification
function getUserGames(req, res) {
    const { username } = req.query;
    const games = readGames();
    const userGames = games.filter(g => g.username === username).map(g => g.game);
    if (userGames.length > 0) {
        return res.json({ 
            success: true,
            message: 'Jeux trouvés',
            games: userGames });
    }
    res.json({ 
        success: false,
        message: 'Aucun jeu trouvé' });
}

// fonction pour chercher tous les jeux disponibles, avec la vérif
function getAllGames(req, res) {
    const games = readGames();
    if (games.length > 0) {
        return res.json({
            success: true,
            message: 'Jeux trouvés',
            games: games });
    }
    res.json({
        success: false,
        message: 'Aucun jeu trouvé' });
}

// fonction pour ajouter un jeu dans le magasin, avec vérif
function addGameToStore(req, res) {
    const { game } = req.body;
    const games = readGames();
    if (games.find(g => g.game === game)) {
        return res.json({ 
            success: false, 
            message: 'Jeu déjà dans le magasin' });
    }
    games.push({ game });
    writeGames(games);
    res.json({ 
        success: true, 
        message: 'Jeu ajouté au magasin avec succès' });
}

// fonction pour supprimer un jeu du magasin, avec la vérification
function removeGameFromStore(req, res) {
    const { game } = req.body;
    const games = readGames();
    const index = games.findIndex(g => g.game === game);
    if (index !== -1) {
        games.splice(index, 1);
        writeGames(games);
        return res.json({ 
            success: true, 
            message: 'Jeu supprimé du magasin avec succès' });
    }
    res.json({
        success: false,
        message: 'Jeu non trouvé dans le magasin' });
}

// fonction pour chercher tous les jeux disponibles dans le magasin, avec la vérification
function getStoreGames(req, res) {
    const games = readGames();
    const storeGames = games.filter(g => !g.username).map(g => g.game);
    if (storeGames.length > 0) {
        return res.json({
            success: true,
            message: 'Jeux trouvés dans le magasin',
            games: storeGames });
    }
    res.json({
        success: false,
        message: 'Aucun jeu trouvé dans le magasin' });
}

// fonction pour ajouter une promotion à un jeu, avec la vérification
function addPromotion(req, res) {
    const { game, promotion } = req.body;
    const games = readGames();
    const index = games.findIndex(g => g.game === game);
    if (index !== -1) {
        games[index].promotion = promotion;
        writeGames(games);
        return res.json({ 
            success: true, 
            message: 'Promotion ajoutée au jeu avec succès' });
    }
    res.json({
        success: false,
        message: 'Jeu non trouvé pour ajouter la promotion' });
}

// si addPromotion, existe, removePromotion, pour supprimer la promotion d'un jeu, avec la vérification
function removePromotion(req, res) {
    const { game } = req.body;
    const games = readGames();
    const index = games.findIndex(g => g.game === game);
    if (index !== -1) {
        delete games[index].promotion;
        writeGames(games);
        return res.json({ 
            success: true, 
            message: 'Promotion supprimée du jeu avec succès' });
    }
    res.json({
        success: false,
        message: 'Jeu non trouvé pour supprimer la promotion' });
}

// fonction pour chercher un jeu par son id, avec la vérification
function getGameById(req, res) {
    const { id } = req.params;
    const games = readGames();
    const game = games.find(g => g.id === id);
    if (game) {
        return res.json({
            success: true,
            message: 'Jeu trouvé',
            game });
    }
    res.json({
        success: false,
        message: 'Jeu non trouvé' });
}

// fonction pour chercher un jeu selon son genre, avec la vérification
function searchGamesByGenre(req, res) {
    const { genre } = req.query;
    const games = readGames();
    const genreGames = games.filter(g => g.genre === genre);
    if (genreGames.length > 0) {
        return res.json({
            success: true,
            message: 'Jeux trouvés pour le genre',
            games: genreGames });
    }
    res.json({
        success: false,
        message: 'Aucun jeu trouvé pour ce genre' });
}

// fonction pour chercher un jeu selon son prix, avec la vérification
function searchGamesByPrice(req, res) {
    const { price } = req.query;
    const games = readGames();
    const priceGames = games.filter(g => g.prix <= price);
    if (priceGames.length > 0) {
        return res.json({
            success: true,
            message: 'Jeux trouvés pour le prix',
            games: priceGames });
    }
    res.json({
        success: false,
        message: 'Aucun jeu trouvé pour ce prix' });
}

// fonction pour chercher un jeu
function searchGames(req, res) {
    const { query } = req.query;
    const games = readGames();
    const searchGames = games.filter(g => g.game && g.game.toLowerCase().includes(query.toLowerCase()));
    if (searchGames.length > 0) {
        return res.json({
            success: true,
            message: 'Jeux trouvés',
            games: searchGames });
    }
    res.json({
        success: false,
        message: 'Aucun jeu trouvé' });
}

// fonctions pour les utilisateurs
function registerUser(req, res) {
    res.json({ success: true, message: 'Utilisateur enregistré' });
}

function loginUser(req, res) {
    res.json({ success: true, message: 'Utilisateur connecté' });
}

function searchUser(req, res) {
    res.json({ success: true, message: 'Utilisateur trouvé' });
}

// on exporte les fonctions pour les utiliser dans les routes
module.exports = {
    addGame,
    removeGame,
    addPromotion,
    removePromotion,
    getStoreGames,
    removeGameFromStore,
    getAllGames,
    getUserGames,
    addGameToStore,
    getGameById,
    searchGamesByGenre,
    searchGamesByPrice,
    searchGames,
    registerUser,
    loginUser,
    searchUser
};
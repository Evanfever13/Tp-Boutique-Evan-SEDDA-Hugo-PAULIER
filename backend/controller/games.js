const fs = require('fs');
const path = require('path');
const { addGameToUser } = require('./users');

const dataPath = path.join(__dirname, '../data/games.json');

function readGames() {
    try {
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        if (Array.isArray(data)) {
            return data;
        }
        return data.games || [];
    } catch (err) {
        console.error('Error reading games.json from', dataPath, ':', err.message);
        return [];
    }
}

function writeGames(games) {
    fs.writeFileSync(dataPath, JSON.stringify(games, null, 2));
}

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

function getGameById(id) {
    const games = readGames();
    const game = games.find(g => g.id === parseInt(id));
    if (game) {
        return {
            success: true,
            message: 'Jeu trouvé pour l\'id',
            game: game };
    }
    return {
        success: false,
        message: 'Aucun jeu trouvé pour cet id' 
    };
}

function getGamesByPrice(price) {
    const games = readGames();
    const priceGames = games.filter(g => g.prix <= price).map(g => g.game);
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

function processPurchase(userEmail, gameId, edition) {
    const games = readGames();
    const gameIndex = games.findIndex(g => g.id === parseInt(gameId));

    if (gameIndex === -1) {
        return { success: false, message: 'Jeu non trouvé' };
    }

    const game = games[gameIndex];

    if (game.stock <= 0) {
        return { success: false, message: 'Stock épuisé pour ce jeu' };
    }

    let price = game.prix;
    const editionLower = edition.toLowerCase();
    if (editionLower !== 'standard') {
        const priceKey = `prix_${editionLower}`;
        if (game[priceKey]) {
            price = game[priceKey];
        }
    }

    const addResult = addGameToUser(userEmail, game.id, price);
    if (!addResult.success) {
        return addResult;
    }

    games[gameIndex].stock -= 1;
    writeGames(games);

    return {
        success: true,
        message: `Jeu acheté avec succès en édition ${edition}. Nouveau solde : ${addResult.newBalance.toFixed(2)}€`,
        stock: games[gameIndex].stock
    };
}

module.exports = {
    getAllGames,
    addGameToStore,
    removeGameFromStore,
    getStoreGames,
    addPromotion,
    removePromotion,
    getGamesByGenre,
    getGamesByPrice,
    getGamebyPage,
    getGameById,
    processPurchase
};
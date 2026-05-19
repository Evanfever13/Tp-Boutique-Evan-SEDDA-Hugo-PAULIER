// ok, ici on va faire du express, c'est un framework pour faire du serveur en nodejs
const express = require('express');
const router = express.Router();
const controller = require('../controller/games');

const cors = require('cors');

router.use(cors());

router.get('/home', controller.getAllGames);
router.post('/home', controller.addGameToStore);
router.delete('/home', controller.removeGameFromStore);

router.get('/games/:id', controller.getGameById);

router.get('/search', controller.searchGames);
router.get('/search/genre', controller.searchGamesByGenre);
router.get('/search/price', controller.searchGamesByPrice);

router.post('/promotions', controller.addPromotion);
router.delete('/promotions', controller.removePromotion);
router.get('/promotions', controller.getStoreGames);

router.post('/users/register', controller.registerUser);
router.post('/users/login', controller.loginUser);
router.get('/users/search', controller.searchUser);

// on exporte le router pour l'utiliser dans le serveur
module.exports = router;


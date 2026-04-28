// ok, ici on va faire du express, c'est un framework pour faire du serveur en nodejs
const express = require('express');
const games = require('../controller/games');
const users = require('../controller/users');
const router = express.Router();

const cors = require('cors');

router.use(cors());

// et là, on va initialiser les routes

router.get('/home', (req, res) => {
	res.json(games.getAllGames());
});

router.post('/home', (req, res) => {
	res.json(games.addGameToStore(req.body.game));
});

router.delete('/home', (req, res) => {
	res.json(games.removeGameFromStore(req.body.game));
});

router.post('/promotions', (req, res) => {
	res.json(games.addPromotion(req.body.game, req.body.promotion));
});

router.delete('/promotions', (req, res) => {
	res.json(games.removePromotion(req.body.game));
});

router.get('/promotions', (req, res) => {
	res.json(games.getStoreGames());
});

router.get('/genres', (req, res) => {
	res.json(games.getGamesByGenre(req.query.genre));
});

router.get('/prices', (req, res) => {
	res.json(games.getGamesByPrice(req.query.price));
});

router.get('/pages', (req, res) => {
	res.json(games.getGamebyPage(req.query.page));
});

// partie utilisateurs
router.post('/users/register', (req, res) => {
	res.json(users.registerUser(req.body.username, req.body.password));
});

router.post('/users/login', (req, res) => {
	res.json(users.loginUser(req.body.username, req.body.password));
});

router.get('/users/search', (req, res) => {
	res.json(users.searchUser(req.query.username));
});

// on exporte le router pour l'utiliser dans le serveur
module.exports = router;


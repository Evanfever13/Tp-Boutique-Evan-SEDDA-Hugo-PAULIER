const express = require('express');
const games = require('../controller/games');
const users = require('../controller/users');
const router = express.Router();

const cors = require('cors');
router.use(cors());

router.get('/home', (req, res) => {
	res.json(games.getAllGames());
});

router.post('/home', (req, res) => {
	res.json(games.addGameToStore(req.body.game));
});

router.delete('/home', (req, res) => {
	res.json(games.removeGameFromStore(req.body.game));
});

router.get('/game/:id', (req, res) => {
	res.json(games.getGameById(req.params.id));
});

router.get('/store', (req, res) => {
	res.json(games.getStoreGames());
});

router.get('/user/games', (req, res) => {
	const userEmail = req.query.email;
	if (!userEmail) {
		return res.status(400).json({ success: false, message: 'Email utilisateur requis.' });
	}
	res.json(users.getUserGames(userEmail));
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

router.post('/buy', (req, res) => {
	const { userEmail, gameId, edition } = req.body;
	if (!userEmail || !gameId) {
		return res.status(400).json({ success: false, message: 'Email utilisateur et ID du jeu requis.' });
	}
	res.json(games.processPurchase(userEmail, gameId, edition));
});


router.post('/users/register', (req, res) => {
	res.json(users.registerUser(req.body.username, req.body.email, req.body.password));
});

router.post('/users/login', (req, res) => {
	const identifier = req.body.email || req.body.username;
	res.json(users.loginUser(identifier, req.body.password));
});

router.get('/users/profile', (req, res) => {
	res.json(users.getUserProfile(req.query.email || req.query.username));
});

router.get('/users/search', (req, res) => {
	res.json(users.searchUser(req.query.username));
});

module.exports = router;

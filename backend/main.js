// le fichier le plus important, c'est celui du serveur, c'est lui qui va faire le lien entre les routes et les fonctions, et qui va écouter les requêtes des clients
const express = require('express');
const app = express();
const router = require('./router/router');
const port = 8080;

app.use(express.json());

// autorise le frontend (port 3000) à charger les images depuis le backend (port 8080)
app.use('/images', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
}, express.static('data/images'));

app.use('/', router);

app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
    console.log(`API disponible sur : http://localhost:${port}/home`);
    console.log(`Images disponibles sur : http://localhost:${port}/images/`);
});
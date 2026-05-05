// le fichier le plus important, c'est celui du serveur, c'est lui qui va faire le lien entre les routes et les fonctions, et qui va écouter les requêtes des clients
const express = require('express');
const app = express();
const router = require('./router/router');
const port = 8080;

app.use(express.json());
app.use('/data', express.static('data'));
app.use('/', router);

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
    console.log(`Lien pour vérifier le backend: http://localhost:${port}/home`);
    console.log(`on va le supp pour la version finale`);
});

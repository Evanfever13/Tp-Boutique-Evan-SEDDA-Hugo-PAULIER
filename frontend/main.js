// serveur Express pour le frontend : il sert tous les fichiers statiques (HTML, CSS, JS, images)
// depuis le dossier frontend, sur le port 3000
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
 
// sert les fichiers statiques depuis la racine du dossier frontend
// (assets/, script/, templates/)
app.use(express.static(path.join(__dirname)));
 
// redirige la racine vers la page de la boutique
app.get('/', (req, res) => {
    res.redirect('/templates/shop.html');
});
 
app.listen(port, () => {
    console.log(`Serveur frontend démarré sur le port ${port}`);
    console.log(`Accéder au site : http://localhost:${port}`);
});
 
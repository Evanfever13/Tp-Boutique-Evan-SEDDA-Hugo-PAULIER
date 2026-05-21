# Tp-Boutique-Evan-SEDDA-Hugo-PAULIER

# Vapeur - Parodie de Steam (Challenge JS)

**Vapeur** est une application web d'e-commerce parodique inspirée de la célèbre plateforme de jeux vidéo Steam. 
Ce projet a été réalisé en binôme dans le cadre du module JS

L'application est entièrement découplée et fonctionne avec deux serveurs distincts : un serveur **Backend** (API REST) et un serveur **Frontend** (Client).

---

## Fonctionnalités du projet

### Frontend (Vapeur Client)
***Le Magasin (Catalogue) :** Affichage d'un catalogue de 20 jeux vidéo uniques. Au survol d'une jaquette, l'image bascule automatiquement sur un screenshot du jeu. Intègre un système de tri et de filtrage (par genre, prix, etc.).
* **Fiche Produit (Détails du jeu) :** Présentation complète du jeu avec un carrousel de screenshots, une description tronquée à 150 caractères (bouton "Lire la suite"), et des suggestions de jeux similaires.
* **Gestion du Panier :** Possibilité d'ajouter un jeu, de modifier les quantités ou de vider son panier avant de valider l'achat
* **Liste de Souhaits (Favoris) :** Ajout, consultation et suppression des jeux favoris
* **Profil & Bibliothèque :** Pages de profil utilisateur et une "Bibliothèque" listant les jeux parodiques possédés

### Backend (Vapeur Serveur)
***API REST Express :** Gestion de l'authentification et des requêtes du magasin via un système de routage dédié
* **Contrôleurs :** Logique métier séparée pour la gestion des jeux (`games.js`) et des utilisateurs (`users.js`).
***Base de données JSON :** Stockage local et persistant des utilisateurs et du catalogue de jeux[cite: 19, 20, 88].Les stocks de clés de jeux se mettent à jour automatiquement lors d'un achat

---

## Technologies utilisées

* **Frontend :** HTML5, CSS3, JavaScript Natif (Vanilla JS - *Aucun framework conformément aux contraintes*)
***Backend :** Node.js, Express
* **Données :** Fichiers JSON (`games.json`, `users.json`)
---

## Structure du Projet

```
TP-BOUTIQUE-EVAN-SEDDA-HUGO-PAULIER/
├── backend/
│   ├── controller/
│   │   ├── games.js            # Logique de gestion des jeux (API)
│   │   └── users.js            # Logique de gestion des profils (API)
│   ├── data/
│   │   ├── images/          # Jaquettes et screenshots des jeux (2 à 3 par produit)
│   │   ├── games.json          # Base de données des 20 jeux parodiques
│   │   └── users.json          # Base de données des utilisateurs de Vapeur
│   ├── router/
│   │   └── router.js           # Définition des endpoints de l'API
│   ├── main.js                 # Point d'entrée du serveur Backend Express
│   └── package.json
├── frontend/
│   ├── assets/
│   │   ├── font/            # Polices d'écriture style gaming
│   │   ├── img/             # Éléments graphiques de l'interface
│   │   └── styles/
│   │       └── index.css       # Design global parodique de Steam (thème sombre)
│   ├── script/              # Logique JavaScript Frontend (DOM & Fetch)
│   │   ├── bibliotheque.js
│   │   ├── favoris.js
│   │   ├── login.js
│   │   ├── pannier.js
│   │   ├── product.js
│   │   ├── profil.js
│   │   └── shop.js
│   ├── templates/           # Vues HTML du site
│   │   ├── about.html
│   │   ├── favoris.html
│   │   ├── library.html
│   │   ├── login.html
│   │   ├── pannier.html
│   │   ├── product.html
│   │   ├── profil.html
│   │   └── shop.html
│   ├── main.js                 # Script principal frontend
│   └── package.json            # Serveur de développement Frontend
├── .gitignore
└── README.md
```
--- 

## 🔧 Installation et Lancement
Pour faire fonctionner Vapeur, vous devez lancer le serveur backend ET le serveur frontend simultanément dans deux terminaux différents.

*** Prérequis***
Avoir installé Node.js sur votre machine.

1. Récupérer le projet
Bash
```
git clone ......
cd TP-BOUTIQUE-EVAN-SEDDA-HUGO-PAULIER
```

2. Lancer l'API Vapeur (Backend)
Ouvrez un premier terminal :

Bash
```
cd backend
npm install
npm start
```
Le serveur backend tourne et est prêt à envoyer les données des jeux.

3. Lancer l'Interface Vapeur (Frontend)
Ouvrez un second terminal :

Bash
```
cd frontend
npm install
npm start
```
Une fois le serveur démarré, ouvrez l'adresse locale affichée dans votre console pour naviguer sur le magasin Vapeur.

# Compte Utilisateur :
Pour tester les fonctionnalités de connexion et d'achat, vous pouvez utiliser le compte de test suivant :
- **Email :**:
 - evan.sedda@ynov.com
 - hugo.paulier@ynov.com
- **Mot de passe :**
    - azerty
    - qwerty
---


## Membres de l'équipe
Étudiant 1 : Evan SEDDA

Étudiant 2 : Hugo PAULIER
# Full-Stack Application (React + Node.js + MongoDB)

Bienvenue dans le dépôt de notre application Full-Stack. Ce projet comprend un frontend développé avec React et un backend en Node.js avec Express et MongoDB.

## 📋 Fonctionnalités

- **Authentification complète** : Inscription, connexion et gestion des sessions avec JSON Web Tokens (JWT).
- **Interface Utilisateur Moderne** : Frontend réactif construit avec React.
- **API RESTful** : Backend robuste gérant les requêtes et la logique métier.
- **Base de données NoSQL** : Intégration avec MongoDB (Atlas ou local).

## 📂 Structure du projet

Ce dépôt est organisé en deux parties principales :

```text
fullstack-app/
│
├── backend/          # API REST Node.js & Express
│   ├── models/       # Modèles Mongoose (ex: User.js)
│   ├── routes/       # Routes de l'API (ex: auth.js)
│   ├── server.js     # Point d'entrée du serveur
│   └── package.json  # Dépendances du backend
│
├── frontend/         # Application cliente React
│   ├── public/       # Fichiers statiques
│   ├── src/          # Code source React (Composants, Pages)
│   └── package.json  # Dépendances du frontend
│
├── Dockerfile        # Configuration pour le déploiement
├── package.json      # Scripts d'orchestration à la racine
└── README.md         # Documentation du projet
```

## 🚀 Instructions d'installation (Local)

Pour exécuter ce projet localement sur votre machine, suivez ces étapes :

### 1. Prérequis

- **Node.js** (v16 ou supérieur recommandé)
- **MongoDB** (installé localement ou un cluster MongoDB Atlas)
- **Git**

### 2. Cloner le dépôt

```bash
git clone https://github.com/Younes552424/fullstackApp.git
cd fullstackApp
```

### 3. Installation des dépendances

À la racine du projet, exécutez la commande suivante pour installer les dépendances du backend ET du frontend en une seule fois (grâce au script `postinstall`) :

```bash
npm install
```

### 4. Configuration de l'environnement

**Backend** :
Créez un fichier `.env` dans le dossier `backend/` et ajoutez vos variables de configuration.
Ne commitez **jamais** ce fichier !

```env
PORT=5000
MONGODB_URL=mongodb://127.0.0.1:27017/fullstack  # Ou votre URL MongoDB Atlas
JWT_SECRET=votre_secret_tres_securise
```

### 5. Démarrer l'application

Vous pouvez démarrer les deux serveurs (frontend et backend) simultanément depuis la racine du projet :

```bash
npm run dev
```

- Le frontend sera accessible sur `http://localhost:3000`
- Le backend (API) écoutera sur `http://localhost:5000`

## ☁️ Déploiement

Ce projet est configuré pour être facilement déployé sur des plateformes comme **Railway**.

1. Le projet inclut un `Dockerfile` multi-stage qui build le frontend et prépare le backend pour la production.
2. Assurez-vous de définir les variables d'environnement (`MONGODB_URL`, `JWT_SECRET`) dans le tableau de bord de votre plateforme d'hébergement.

## 📝 Historique des commits

L'historique complet des modifications et des commits est disponible directement via l'onglet **Commits** de ce dépôt GitHub.

# JO_Frontend

Frontend du site web de **vente de billets pour les Jeux Olympiques de Paris 2024**.  
Développé en **React.js** avec **Vite**, il communique avec l’API Django/DRF (`JO_Backend`).

## Prérequis

- Node.js(https://nodejs.org/) v20.17+
- npm (installé avec Node.js)  


## Installation locale (développement)

1. **Cloner le projet**

git clone https://github.com/ton-compte/JO_Frontend.git

cd JO_Frontend

2. **Installer les dependances**

npm install

3. **Configurer les variables d’environnement**

Créer un fichier .env.local à la racine avec :

VITE_API_URL=http://localhost:8000/api

En production (sur Vercel), la variable VITE_API_URL est configurée pour pointer vers l’API déployée :

VITE_API_URL=https://minguezcaroline.pythonanywhere.com/api/

4. **Lancer le projet en local**

npm run dev

5. **Build et déploiement (Vercel)**

npm run build

Le projet est ensuite automatiquement déployé sur Vercel, avec la variable d’environnement VITE_API_URL définie dans le dashboard Vercel.

## Sécurité

Les échanges entre le frontend et le backend se font exclusivement en HTTPS.

L’authentification est gérée par token via l’API Django REST.

Aucun mot de passe n’est stocké côté front (seul le token est transmis).

## Tests

Les tests sont réalisés avec Vitest : 

npm run test

Des tests unitaires seront ajoutés pour améliorer la qualité du code.

## Evolutions prévues

Interface de scan des billets pour les membres du staff (API déjà disponible côté back).

Ajout de la fonctionnalité mot de passe oublié.

Amélioration de l’UX/UI pour une meilleure ergonomie.

Couverture de tests élargie avec Vitest.

## Etat actuel

Fonctionnel en local et en production.

Tests automatisés : partiellement implémentés avec Vitest.



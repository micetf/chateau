# Le Château des Nombres

Application web permettant de conduire des activités de structuration des nombres.

## Description

Cette application est une version modernisée du "Château des Nombres", un outil pédagogique pour l'apprentissage des nombres en école primaire. L'application permet la manipulation d'objets visuels (caches et masques) sur une image de château, facilitant la compréhension des structures numériques.

## Fonctionnalités

-   Sélection de l'ordre de numérotation (croissant ou décroissant)
-   Création et manipulation de caches colorés par glisser-déposer
-   Création et manipulation de masques avec opérations numériques
-   Suppression d'éléments en les déplaçant sur la corbeille
-   Adaptation aux dimensions de l'écran

## Technologies utilisées

-   React 18
-   Vite
-   Tailwind CSS
-   React Draggable pour la fonctionnalité de glisser-déposer

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/chateau-nombres.git
cd chateau-nombres

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## Structure du projet

```
chateau-nombres/
├── public/             # Fichiers statiques
│   ├── img/            # Images du projet
│   └── img-micetf/     # Images communes à MiCetF
├── src/                # Code source
│   ├── components/     # Composants React
│   ├── utils/          # Utilitaires
│   ├── App.jsx         # Composant principal
│   ├── index.css       # Styles CSS (Tailwind)
│   └── main.jsx        # Point d'entrée
├── index.html          # Page HTML principale
└── ...                 # Fichiers de configuration
```

## Migration depuis la version précédente

Ce projet est une migration de l'ancienne version qui utilisait jQuery et Webpack. Les principales améliorations sont:

-   Utilisation de React pour une meilleure organisation du code
-   Vite comme bundler pour des builds plus rapides
-   Tailwind CSS pour un design moderne et responsive
-   Architecture par composants pour une meilleure maintenabilité
-   Conservation de la logique et des fonctionnalités de l'application originale

## Auteur

Frédéric MISERY <webmaster@micetf.fr> (https://micetf.fr/)

## Licence

MIT

# Le Château des Nombres

Application web pédagogique permettant de conduire des activités de structuration des nombres pour l'école primaire.

![Capture d'écran du Château des Nombres](./screenshot.png)

## Description

Cette application est une version modernisée du "Château des Nombres", un outil pédagogique utilisé pour l'apprentissage des nombres à l'école primaire. L'application permet la manipulation d'objets visuels (caches colorés et masques d'opérations) sur une image de château pour faciliter la compréhension des structures numériques, des relations entre les nombres et des opérations arithmétiques de base.

L'application s'adresse principalement aux enseignants et aux élèves de l'école primaire (cycle 2 et 3).

## Fonctionnalités principales

-   **Château des nombres** : Tableau numérique de 0 à 99 présenté sous forme de château
-   **Caches colorés** : Permettent de masquer des nombres spécifiques pour mettre en évidence des motifs
-   **Masque d'opérations** : Outil visuel montrant les relations entre les nombres (+1, -1, +10, -10)
-   **Ordre personnalisable** : Possibilité de basculer entre l'ordre croissant (0-99) et décroissant (99-0)
-   **Interactions intuitives** : Système de glisser-déposer pour manipuler les éléments
-   **Interface responsive** : S'adapte à différentes tailles d'écran

## Comment utiliser l'application

### Les caches

1. Faites glisser un cache coloré depuis la colonne de gauche
2. Placez-le sur n'importe quel nombre du château pour le masquer
3. Créez autant de caches que nécessaire pour mettre en évidence des motifs numériques
4. Pour supprimer un cache, faites-le glisser sur la poubelle en bas à gauche

### Le masque d'opérations

1. Faites glisser le masque jaune depuis la colonne de droite
2. Placez-le sur le château pour visualiser les relations entre un nombre et ses voisins
3. Le masque indique les opérations +1, -1, +10, -10 par rapport au nombre central
4. Pour supprimer le masque, faites-le glisser sur la poubelle

### Changer l'ordre de numérotation

-   Utilisez le bouton "Ordre" en bas à droite pour basculer entre :
    -   Ordre croissant (0-99) : les nombres augmentent de gauche à droite et de haut en bas
    -   Ordre décroissant (99-0) : les nombres diminuent de gauche à droite et de haut en bas

### Aide contextuelle

-   Cliquez sur le bouton "?" en bas à droite pour afficher l'aide

## Applications pédagogiques

-   **Reconnaissance des nombres** : Identification et lecture des nombres de 0 à 99
-   **Patterns numériques** : Mise en évidence des régularités (multiples, suites)
-   **Opérations de base** : Compréhension visuelle de l'addition et de la soustraction
-   **Valeur positionnelle** : Compréhension des dizaines et des unités
-   **Comparaison de nombres** : Identification des relations "plus grand que" et "plus petit que"

## Technologies utilisées

-   **React 18** : Bibliothèque JavaScript pour construire l'interface utilisateur
-   **Vite** : Outil de build pour un développement rapide
-   **Tailwind CSS** : Framework CSS utilitaire pour le design
-   **React Draggable** : Bibliothèque pour la fonctionnalité de glisser-déposer

## Installation et déploiement

### Prérequis

-   Node.js (v16.0.0 ou supérieur)
-   npm (v7.0.0 ou supérieur)

### Installation pour le développement

```bash
# Cloner le dépôt
git clone https://github.com/micetf/chateau-nombres.git
cd chateau-nombres

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Construction pour la production

```bash
# Générer les fichiers de production
npm run build

# Prévisualiser la version de production localement
npm run preview
```

### Déploiement

Les fichiers de production se trouvent dans le répertoire `dist/` après la construction. Ils peuvent être déployés sur n'importe quel serveur web statique ou service d'hébergement comme Netlify, Vercel ou GitHub Pages.

## Structure du projet

```
chateau-nombres/
├── public/                  # Fichiers statiques
│   ├── img/                 # Images du projet
│   └── img-micetf/          # Images communes à MiCetF
├── src/                     # Code source
│   ├── components/          # Composants React
│   │   ├── Chateau.jsx      # Composant du château des nombres
│   │   ├── DraggableCache.jsx # Composant pour les caches colorés
│   │   ├── DraggableMasque.jsx # Composant pour le masque d'opérations
│   │   ├── Header.jsx       # En-tête de l'application
│   │   ├── HelpOverlay.jsx  # Aide contextuelle
│   │   └── Trash.jsx        # Composant poubelle
│   ├── utils/               # Fonctions utilitaires
│   ├── App.jsx              # Composant principal
│   ├── index.css            # Styles CSS (Tailwind)
│   └── main.jsx             # Point d'entrée
├── index.html               # Page HTML principale
├── tailwind.config.js       # Configuration de Tailwind CSS
├── vite.config.js           # Configuration de Vite
└── package.json             # Dépendances et scripts
```

## Maintenance et contribution

### Comment contribuer

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Normes de code

-   Suivre les conventions ESLint configurées
-   Utiliser les hooks React pour la gestion d'état
-   Maintenir la compatibilité avec les navigateurs modernes
-   Écrire des tests pour les nouvelles fonctionnalités

## Accessibilité

L'application a été conçue en tenant compte des principes d'accessibilité WCAG :

-   Contraste de couleurs suffisant
-   Navigation au clavier possible
-   Textes alternatifs pour les images
-   Structure sémantique du HTML

## Exemples d'utilisation en classe

### Exemple 1 : Découverte des dizaines

1. Mettez l'ordre en mode croissant (0-99)
2. Utilisez un cache rouge pour masquer tous les nombres se terminant par 0
3. Discutez avec les élèves de la position de ces nombres dans le château

### Exemple 2 : Table de multiplication par 5

1. Utilisez un cache bleu pour masquer tous les multiples de 5
2. Demandez aux élèves d'identifier le motif formé
3. Discutez des régularités observées (0, 5 à la fin des nombres)

### Exemple 3 : Opérations avec le masque

1. Placez le masque sur différents nombres
2. Demandez aux élèves de calculer les résultats des opérations indiquées
3. Faites-leur remarquer les relations entre les nombres voisins

## Compatibilité

-   Chrome (dernières 2 versions)
-   Firefox (dernières 2 versions)
-   Safari (dernières 2 versions)
-   Edge (dernières 2 versions)
-   Tablettes et appareils mobiles avec écran d'au moins 768px de large

## Historique et Évolution

Cette version est une refonte complète de l'application originale développée en jQuery. Les principales améliorations incluent :

-   Migration vers React pour une meilleure organisation du code
-   Utilisation de Vite pour des builds plus rapides
-   Implémentation de Tailwind CSS pour un design moderne et responsive
-   Architecture par composants pour une meilleure maintenabilité
-   Amélioration de l'accessibilité et de l'expérience utilisateur

## Licence

MIT

## Auteur

Frédéric MISERY - [MiCetF](https://micetf.fr)

## Contact et Support

Pour toute question ou suggestion, vous pouvez contacter l'auteur via le lien "Contact" dans l'application ou visiter [MiCetF](https://micetf.fr).

Si vous appréciez cet outil, vous pouvez soutenir son développement en utilisant le bouton "Soutenir" dans l'application.

---

© 2025 MiCetF - [https://micetf.fr](https://micetf.fr)

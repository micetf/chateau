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
-   **Annulation/Rétablissement** : Fonctions undo/redo pour naviguer dans l'historique des actions
-   **Progressive Web App (PWA)** : Installation sur l'écran d'accueil et fonctionnement hors-ligne
-   **Optimisation des images** : Formats modernes (WebP, AVIF) avec fallback et redimensionnement adaptatif

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

### Annuler/Rétablir

-   Utilisez les boutons d'annulation et de rétablissement en bas à droite pour :
    -   Revenir à des états précédents (annuler)
    -   Rétablir des actions annulées

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
-   **Tailwind CSS** : Framework CSS utilitaire pour le design responsive et moderne
-   **React Hooks** : Architecture basée sur les hooks React pour la gestion d'état
-   **Context API** : Gestion centralisée de l'état global de l'application
-   **Workbox/PWA** : Service workers pour le fonctionnement hors-ligne et l'installation
-   **Sharp** : Optimisation et transformation des images
-   **Vite-ImageTools** : Génération de formats d'images modernes (WebP, AVIF)
-   **ESLint** : Analyse statique du code pour maintenir la qualité

## Bonnes pratiques implémentées

-   **Architecture modulaire** : Composants réutilisables et séparation des responsabilités
-   **Performance optimisée** :
    -   Mémoisation avec useCallback et useMemo
    -   Optimisation des re-rendus avec React.memo
    -   Lazy loading des images non critiques
-   **Responsive design** : Adaptation complète du layout mobile/desktop
-   **Accessibilité (A11Y)** :
    -   Navigation au clavier
    -   Attributs ARIA
    -   Textes alternatifs
    -   Contrastes suffisants
-   **PWA optimisée** :
    -   Stratégies de cache intelligentes
    -   Détection et notification des mises à jour
    -   Manifeste complet avec screenshots
-   **Images optimisées** :
    -   Formats modernes avec fallback
    -   Tailles adaptatives (responsive images)
    -   Compression optimisée
-   **Sécurité** :
    -   Target="\_blank" avec rel="noopener noreferrer"
    -   Content Security Policy

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

### Scripts disponibles

```bash
# Lancer le serveur de développement
npm run dev

# Optimiser les images (génère les formats WebP et AVIF)
npm run optimize-images

# Générer les icônes pour la PWA
npm run generate-icons

# Construire pour la production (inclut l'optimisation des images)
npm run build

# Prévisualiser la version de production
npm run preview

# Vérifier la qualité du code
npm run lint

# Analyser la taille du bundle
npm run analyze
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
│   │   ├── *.webp           # Images optimisées WebP (générées)
│   │   ├── *.avif           # Images optimisées AVIF (générées)
│   │   └── *.png            # Images originales
├── scripts/                 # Scripts utilitaires
│   ├── optimize-images.js   # Script d'optimisation des images
│   └── generate-icons.js    # Script de génération des icônes PWA
├── src/                     # Code source
│   ├── components/          # Composants React
│   │   ├── common/          # Composants réutilisables
│   │   │   ├── OptimizedImage.jsx   # Gestionnaire d'images optimisé
│   │   │   └── UpdateNotification.jsx # Notification de mise à jour PWA
│   │   ├── Chateau.jsx      # Composant du château des nombres
│   │   ├── Cache.jsx        # Composant de base pour les caches
│   │   ├── DraggableCache.jsx # Composant pour les caches déplaçables
│   │   ├── DraggableMasque.jsx # Composant pour le masque d'opérations
│   │   ├── Header.jsx       # En-tête de l'application
│   │   ├── HelpOverlay.jsx  # Aide contextuelle
│   │   ├── Masque.jsx       # Composant de base pour le masque
│   │   ├── ContactLink.jsx  # Composant pour le lien de contact
│   │   ├── IntuitiveDirectionToggleButton.jsx # Bouton d'ordre
│   │   ├── Trash.jsx        # Composant poubelle
│   │   └── UndoRedoControls.jsx # Contrôles d'annulation/rétablissement
│   ├── contexts/            # Contextes React
│   │   └── ChateauContext.jsx # Contexte global et gestion d'état
│   ├── hooks/               # Hooks personnalisés
│   │   └── useDimensions.js # Hook pour gérer les dimensions
│   ├── service-worker.js    # Configuration du service worker PWA
│   ├── App.jsx              # Composant principal
│   ├── index.css            # Styles CSS (Tailwind)
│   └── main.jsx             # Point d'entrée
├── screenshots/             # Captures d'écran pour le manifest PWA
├── index.html               # Page HTML principale
├── tailwind.config.js       # Configuration de Tailwind CSS
├── postcss.config.js        # Configuration de PostCSS
├── vite.config.js           # Configuration de Vite et plugins
├── package.json             # Dépendances et scripts
└── .gitignore               # Fichiers à ignorer par Git
```

## Performance et optimisations

### Performance web

-   **Core Web Vitals optimisés** :

    -   LCP (Largest Contentful Paint) < 2s grâce au préchargement des ressources critiques
    -   FID (First Input Delay) < 100ms grâce à la séparation du thread principal
    -   CLS (Cumulative Layout Shift) < 0.1 grâce aux dimensions réservées

-   **Optimisations des images** :

    -   Formats modernes (WebP, AVIF) avec fallback automatique
    -   Images responsive servies à la taille optimale
    -   Lazy loading pour les images non critiques
    -   Préchargement des images critiques

-   **Performance JavaScript** :
    -   Code-splitting automatique avec Vite
    -   Minification et tree-shaking
    -   Memoization des fonctions et composants
    -   Debouncing des événements de redimensionnement

### Optimisations PWA

-   **Stratégies de cache avancées** :

    -   Cache-first pour les ressources statiques
    -   Network-first pour les données dynamiques
    -   Préchargement intelligent des ressources

-   **Mise à jour transparente** :

    -   Notification de mise à jour disponible
    -   Mise à jour en arrière-plan
    -   Application de mise à jour en un clic

-   **Expérience hors-ligne complète** :
    -   L'ensemble de l'application fonctionne sans connexion
    -   Synchronisation automatique lors du retour en ligne

## Accessibilité

L'application a été conçue en tenant compte des principes d'accessibilité WCAG :

-   **Structure sémantique** : Utilisation appropriée des éléments HTML5
-   **Navigation au clavier** : Tous les contrôles sont utilisables au clavier
-   **Attributs ARIA** : Rôles, états et propriétés pour les lecteurs d'écran
-   **Contraste suffisant** : Respect des ratios de contraste WCAG AA
-   **Textes alternatifs** : Pour toutes les images et éléments visuels
-   **Taille des éléments interactifs** : Suffisamment grands pour une utilisation tactile
-   **Focus visible** : Indication claire des éléments focalisés

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

### Exemple 4 : Comparaison d'ordres

1. Montrez le château en ordre croissant et laissez les élèves explorer
2. Passez à l'ordre décroissant et demandez aux élèves d'identifier les différences
3. Utilisez le masque dans les deux configurations pour comparer les opérations

## Compatibilité

-   Chrome (dernières 2 versions)
-   Firefox (dernières 2 versions)
-   Safari (dernières 2 versions)
-   Edge (dernières 2 versions)
-   Tablettes et appareils mobiles avec écran d'au moins 375px de large

## Historique et Évolution

Cette version est une refonte complète de l'application originale développée en jQuery. Les principales améliorations incluent :

-   **Architecture moderne** : Migration vers React avec hooks et context API
-   **UX améliorée** : Interface plus intuitive avec feedback visuel amélioré
-   **Responsive design** : Support complet des appareils mobiles et tablettes
-   **PWA complète** : Installation sur l'écran d'accueil et fonctionnement hors-ligne
-   **Performance optimisée** : Chargement rapide et animations fluides
-   **Accessibilité** : Conforme aux bonnes pratiques WCAG
-   **Images optimisées** : Formats modernes et chargement adaptatif

## Licence

MIT

## Auteur

Frédéric MISERY - [MiCetF](https://micetf.fr)

## Contact et Support

Pour toute question ou suggestion, vous pouvez contacter l'auteur via le lien "Contact" dans l'application ou visiter [MiCetF](https://micetf.fr).

Si vous appréciez cet outil, vous pouvez soutenir son développement en utilisant le bouton "Soutenir" dans l'application.

---

© 2025 MiCetF - [https://micetf.fr](https://micetf.fr)

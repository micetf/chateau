// src/components/TeacherGuide.jsx
import React, { useEffect, useRef } from "react";
import { useChateauContext } from "../contexts/ChateauContext";
import ReactMarkdown from "react-markdown";

const TeacherGuide = () => {
    const { showTeacherGuide, toggleTeacherGuide } = useChateauContext();
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    // Gestion de l'échappement avec la touche Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                toggleTeacherGuide();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Focus sur le contenu pour accessibilité
        if (contentRef.current) {
            contentRef.current.focus();
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [toggleTeacherGuide]);

    // Fermer quand on clique en dehors du contenu
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            toggleTeacherGuide();
        }
    };

    // Le contenu du guide pédagogique en markdown
    const guideContent = `# Guide pédagogique simplifié
# Le Château des Nombres

*Un outil numérique simple pour explorer les nombres de 0 à 99*

## À quoi sert cette application ?

Le Château des Nombres permet aux élèves de visualiser, manipuler et comprendre:
- L'organisation des nombres de 0 à 99
- Les régularités dans la suite numérique
- Les relations entre les nombres (+1, -1, +10, -10)
- Les notions de dizaines et d'unités

## Comment l'utiliser en classe ?

### Les essentiels
- **Vidéoprojecteur/TNI**: Pour les démonstrations collectives
- **Tablettes/Ordinateurs**: Pour les manipulations en binômes ou individuelles
- **Durée conseillée**: 15-20 minutes par activité

### Prise en main rapide
1. Familiarisez-vous avec les 3 outils principaux:
   - Les **caches colorés** pour masquer des nombres
   - Le **masque d'opérations** pour visualiser +1, -1, +10, -10
   - Le bouton **ordre** pour passer de 0-99 à 99-0

2. Commencez simple:
   - Explorer le château ensemble
   - Repérer et nommer des nombres
   - Utiliser un seul cache à la fois

## 10 activités clés

### CP-CE1

1. **Chasse aux nombres**
   - Repérer rapidement un nombre dicté
   - Variante: dire le nombre caché par l'enseignant

2. **Le jeu des couleurs**
   - Masquer tous les nombres qui se terminent par 0
   - Observer et verbaliser la colonne créée
   - Faire de même avec 5, puis 2...

3. **Devine mon voisin**
   - Cacher un nombre
   - Demander qui est juste avant/après, 10 de plus/moins

4. **Le chemin mystère**
   - Tracer un chemin avec les caches
   - Les élèves doivent trouver la règle (ex: multiples de 2)

5. **Exploration avec le masque**
   - Placer le masque sur différents nombres
   - Lire et calculer les nombres voisins
   - Vérifier les résultats

### CE2-CM1-CM2

6. **Multiples en couleur**
   - Masquer tous les multiples de 3, puis de 4...
   - Observer les motifs formés
   - Comparer avec les multiples de 2, 5, 10

7. **Les familles de nombres**
   - Créer des groupes (pairs/impairs, multiples/non-multiples)
   - Utiliser les caches de couleurs différentes

8. **Le nombre mystère**
   - "Mon nombre est plus grand que 50, plus petit que 60, et n'est pas multiple de 3"

9. **Avant/après l'ordre inverse**
   - Basculer en mode 99-0
   - Observer comment changent les relations +1/-1, +10/-10
   - Utiliser le masque pour vérifier

10. **Jeu des déplacements**
    - Partir d'un nombre
    - Suivre des instructions (+10, -1, +10, +1...)
    - Trouver le nombre d'arrivée

## Organisation pratique en classe

### En collectif (10-15 min)
- Présenter l'activité sur grand écran
- Faire verbaliser les observations
- Lancer le défi ou la consigne

### En binômes/ateliers (15-20 min)
- Distribuer les tablettes/accéder aux ordinateurs
- Donner une fiche simple de consignes
- Prévoir un support pour noter les découvertes

### En conclusion (5-10 min)
- Partager les découvertes
- Formaliser avec des mots simples
- Faire le lien avec les apprentissages précédents

## Adaptations simples

### Pour les élèves en difficulté
- Se limiter à la plage 0-30
- Donner une fiche modèle
- Proposer des indices visuels

### Pour les élèves avancés
- Créer des défis pour les camarades
- Combiner plusieurs consignes
- Inventer des règles du jeu avec le château

## Exemples de traces écrites

### Trace écrite CP-CE1
> Dans le château des nombres, quand on avance de 1 case vers la droite, le nombre augmente de 1.
> Quand on descend d'une ligne, le nombre augmente de 10.
> Les nombres qui se terminent par 0 sont alignés.

### Trace écrite CE2-CM2
> Les multiples de 2 forment des colonnes alternées.
> Les multiples de 5 se terminent par 0 ou 5.
> Les multiples de 10 sont à la fois multiples de 2 et de 5.

## Évaluation simple

### Observer
- L'élève retrouve-t-il rapidement un nombre donné?
- Peut-il prévoir le résultat d'un déplacement?
- Sait-il décrire un motif ou une régularité?

### Questionner
- "Comment sais-tu que ce nombre est..."
- "Que se passe-t-il quand on..."
- "Pourquoi ces nombres forment-ils..."

## Compléments "papier-crayon"

### Fiches simples associées
- Grille de nombres à colorier selon une règle
- Exercices "Trouve le nombre" à l'aide d'indices
- Jeu de la calculette: effectuer des calculs mentaux

### Matériel complémentaire
- Tableau des nombres de 0 à 99 affiché en classe
- Étiquettes-nombres manipulables
- Cartes à jouer avec nombres et consignes`;

    if (!showTeacherGuide) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm overflow-auto"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="teacher-guide-title"
        >
            <div
                ref={contentRef}
                className="bg-background p-4 sm:p-6 rounded-lg max-w-4xl w-full shadow-lg border border-text-secondary border-opacity-50 max-h-[90vh] overflow-auto"
                tabIndex="-1"
            >
                <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-background pt-1 pb-2 z-10">
                    <h2
                        id="teacher-guide-title"
                        className="text-lg sm:text-xl font-bold text-text-primary"
                    >
                        Guide pédagogique - Le Château des Nombres
                    </h2>
                    <button
                        onClick={toggleTeacherGuide}
                        className="text-text-secondary hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-header"
                        aria-label="Fermer le guide"
                    >
                        ✕
                    </button>
                </div>

                <div className="guide-content text-left !text-text-primary prose prose-invert mx-auto max-w-none">
                    <div
                        className="[&>h1]:text-xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-4 [&>h1]:text-text-secondary [&>h1]:border-b [&>h1]:border-text-secondary/30 [&>h1]:pb-2
                [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mt-5 [&>h2]:mb-3 [&>h2]:text-text-secondary
                [&>h3]:text-base [&>h3]:font-bold [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:text-text-secondary
                [&>p]:mb-4 [&>p]:text-left [&>p]:leading-relaxed
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
                [&>li]:mb-2 [&>li]:text-left
                [&>blockquote]:border-l-4 [&>blockquote]:border-text-secondary/70 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4"
                    >
                        <ReactMarkdown>{guideContent}</ReactMarkdown>
                    </div>
                </div>

                <div className="text-center mt-4 sm:mt-6 sticky bottom-0 pb-2 pt-3 bg-background z-10">
                    <div className="flex justify-between">
                        <button
                            onClick={() => {
                                // Créer un lien vers le fichier PDF statique
                                const pdfUrl =
                                    "/guides/guide-pedagogique-chateau-nombres.pdf";

                                // Option 1: Téléchargement direct
                                const a = document.createElement("a");
                                a.href = pdfUrl;
                                a.download =
                                    "guide-pedagogique-chateau-nombres.pdf"; // Nom du fichier à télécharger
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);

                                // Option 2: Alternative - Ouvrir dans un nouvel onglet
                                // window.open(pdfUrl, '_blank');
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-text-primary px-4 sm:px-6 py-1.5 sm:py-2 rounded-md font-medium transition-colors"
                            aria-label="Télécharger le guide"
                        >
                            Télécharger PDF
                        </button>
                        <button
                            onClick={toggleTeacherGuide}
                            className="bg-header hover:bg-opacity-80 text-text-primary px-4 sm:px-6 py-1.5 sm:py-2 rounded-md font-medium transition-colors"
                            aria-label="Fermer le guide"
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherGuide;

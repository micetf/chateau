// src/components/HelpOverlay.jsx
import React, { useEffect, useRef } from "react";
import { useChateauContext } from "../contexts/ChateauContext";

const HelpOverlay = () => {
    const { toggleHelp } = useChateauContext();
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    // Gestion de l'échappement avec la touche Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                toggleHelp();
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
    }, [toggleHelp]);

    // Fermer quand on clique en dehors du contenu
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            toggleHelp();
        }
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm overflow-auto"
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
        >
            <div
                ref={contentRef}
                className="bg-background p-4 sm:p-6 rounded-lg max-w-2xl w-full shadow-lg border border-text-secondary border-opacity-50 max-h-[90vh] overflow-auto"
                tabIndex="-1"
            >
                {/* En-tête avec titre et bouton de fermeture */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-background pt-1 pb-2 z-10 border-b border-text-secondary/30">
                    <h2
                        id="help-title"
                        className="text-lg sm:text-xl font-bold text-text-primary flex items-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="w-5 h-5 mr-2 text-text-secondary"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Comment utiliser le Château des Nombres
                    </h2>
                    <button
                        onClick={toggleHelp}
                        className="text-text-secondary hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-header"
                        aria-label="Fermer l'aide"
                    >
                        ✕
                    </button>
                </div>

                {/* Contenu de l'aide réorganisé avec Tailwind */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left">
                    <div className="bg-header/30 p-4 rounded-lg">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-2 sm:mb-3 flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-text-primary text-header mr-2 text-sm font-bold">
                                1
                            </span>
                            Les Caches
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-2 pl-8">
                            <li className="list-disc">
                                Faites glisser un cache coloré depuis la colonne
                                de gauche
                            </li>
                            <li className="list-disc">
                                Placez-le sur n'importe quel nombre du château
                            </li>
                            <li className="list-disc">
                                Pour le supprimer, faites-le glisser sur la
                                poubelle en bas à gauche
                            </li>
                        </ul>
                    </div>

                    <div className="bg-header/30 p-4 rounded-lg">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-2 sm:mb-3 flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-text-primary text-header mr-2 text-sm font-bold">
                                2
                            </span>
                            Le Masque
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-2 pl-8">
                            <li className="list-disc">
                                Faites glisser le masque depuis la colonne de
                                droite
                            </li>
                            <li className="list-disc">
                                Placez-le sur le château pour visualiser les
                                opérations (+1, -1, +10, -10)
                            </li>
                            <li className="list-disc">
                                Pour le supprimer, faites-le glisser sur la
                                poubelle
                            </li>
                        </ul>
                    </div>

                    <div className="bg-header/30 p-4 rounded-lg">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-2 sm:mb-3 flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-text-primary text-header mr-2 text-sm font-bold">
                                3
                            </span>
                            Ordre des nombres
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-2 pl-8">
                            <li className="list-disc">
                                Utilisez le bouton "Ordre" en bas à droite pour
                                basculer entre l'ordre croissant (0-99) et
                                décroissant (99-0)
                            </li>
                            <li className="list-disc">
                                Les opérations sur le masque s'adaptent
                                automatiquement à l'ordre choisi
                            </li>
                        </ul>
                    </div>

                    <div className="bg-header/30 p-4 rounded-lg">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-2 sm:mb-3 flex items-center">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-text-primary text-header mr-2 text-sm font-bold">
                                4
                            </span>
                            Annuler / Rétablir
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-2 pl-8">
                            <li className="list-disc">
                                Utilisez les boutons d'annulation et de
                                rétablissement pour revenir à des états
                                précédents ou avancer à nouveau
                            </li>
                            <li className="list-disc">
                                Chaque action (ajout/suppression de cache,
                                changement d'ordre) est enregistrée dans
                                l'historique
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bouton en bas */}
                <div className="text-center mt-6 sm:mt-8 sticky bottom-0 pb-2 pt-3 bg-background z-10">
                    <button
                        onClick={toggleHelp}
                        className="bg-header hover:bg-opacity-80 text-text-primary px-6 sm:px-8 py-2 sm:py-2.5 rounded-md font-medium transition-colors"
                        aria-label="Fermer l'aide"
                    >
                        J'ai compris
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpOverlay;

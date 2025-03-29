import React, { useEffect, useRef } from "react";

const HelpOverlay = ({ onClose }) => {
    const overlayRef = useRef(null);
    const contentRef = useRef(null);

    // Gestion de l'échappement avec la touche Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
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
    }, [onClose]);

    // Fermer quand on clique en dehors du contenu
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
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
                <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-background pt-1 pb-2">
                    <h2
                        id="help-title"
                        className="text-lg sm:text-xl font-bold text-text-primary"
                    >
                        Comment utiliser le Château des Nombres
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-header"
                        aria-label="Fermer l'aide"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-1 sm:mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">1.</span>
                            Les Caches
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-1 sm:space-y-2 pl-5 sm:pl-7">
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

                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-1 sm:mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">2.</span>
                            Le Masque
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-1 sm:space-y-2 pl-5 sm:pl-7">
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

                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-1 sm:mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">3.</span>
                            Ordre des nombres
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-1 sm:space-y-2 pl-5 sm:pl-7">
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

                    <div className="mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-text-secondary mb-1 sm:mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">4.</span>
                            Conseils d'utilisation
                        </h3>
                        <ul className="text-text-primary text-sm sm:text-base space-y-1 sm:space-y-2 pl-5 sm:pl-7">
                            <li className="list-disc">
                                Combinez plusieurs caches pour mettre en
                                évidence des structures numériques
                            </li>
                            <li className="list-disc">
                                Utilisez les couleurs différentes pour
                                distinguer divers concepts
                            </li>
                            <li className="list-disc">
                                Le masque permet de travailler sur les relations
                                entre nombres
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-center mt-4 sm:mt-6 sticky bottom-0 pb-2 pt-3 bg-background">
                    <button
                        onClick={onClose}
                        className="bg-header hover:bg-opacity-80 text-text-primary px-4 sm:px-6 py-1.5 sm:py-2 rounded-md font-medium transition-colors"
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

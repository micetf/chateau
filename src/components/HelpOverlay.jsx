import React, { useState } from "react";

const HelpOverlay = () => {
    const [isVisible, setIsVisible] = useState(true);

    const hideHelp = () => {
        setIsVisible(false);
        localStorage.setItem("chateauHelpShown", "true");
    };

    // Ne pas afficher si l'aide a déjà été vue
    if (!isVisible || localStorage.getItem("chateauHelpShown") === "true") {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-24 bg-header text-text-primary p-2 rounded-full z-50 shadow-md"
                title="Afficher l'aide"
            >
                ?
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-background p-6 rounded-lg max-w-2xl w-full">
                <h2 className="text-xl font-bold text-text-primary mb-4">
                    Comment utiliser le Château des Nombres
                </h2>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-secondary mb-2">
                        Les Caches
                    </h3>
                    <p className="text-text-primary mb-2">
                        1. Faites glisser un cache coloré depuis la colonne de
                        gauche
                    </p>
                    <p className="text-text-primary mb-2">
                        2. Placez-le sur n'importe quel nombre du château
                    </p>
                    <p className="text-text-primary">
                        3. Pour le supprimer, faites-le glisser sur la poubelle
                        en bas à gauche
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-secondary mb-2">
                        Le Masque
                    </h3>
                    <p className="text-text-primary mb-2">
                        1. Faites glisser le masque depuis la colonne de droite
                    </p>
                    <p className="text-text-primary mb-2">
                        2. Placez-le sur le château pour visualiser les
                        opérations (+1, -1, +10, -10)
                    </p>
                    <p className="text-text-primary">
                        3. Pour le supprimer, faites-le glisser sur la poubelle
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-text-secondary mb-2">
                        Ordre des nombres
                    </h3>
                    <p className="text-text-primary">
                        Utilisez le bouton "Ordre" dans l'en-tête pour basculer
                        entre l'ordre croissant (0-99) et décroissant (99-0)
                    </p>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={hideHelp}
                        className="bg-header hover:bg-opacity-80 text-text-primary px-6 py-2 rounded-md font-medium transition-colors"
                    >
                        Compris !
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpOverlay;

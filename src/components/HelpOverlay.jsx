import React from "react";

const HelpOverlay = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-background p-6 rounded-lg max-w-2xl w-full shadow-lg border border-text-secondary border-opacity-50">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-text-primary">
                        Comment utiliser le Château des Nombres
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                        aria-label="Fermer l'aide"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-text-secondary mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">1.</span>
                            Les Caches
                        </h3>
                        <ul className="text-text-primary space-y-2 pl-7">
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

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-text-secondary mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">2.</span>
                            Le Masque
                        </h3>
                        <ul className="text-text-primary space-y-2 pl-7">
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

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-text-secondary mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">3.</span>
                            Ordre des nombres
                        </h3>
                        <ul className="text-text-primary space-y-2 pl-7">
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

                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-text-secondary mb-2 flex items-center">
                            <span className="mr-2 text-text-primary">4.</span>
                            Conseils d'utilisation
                        </h3>
                        <ul className="text-text-primary space-y-2 pl-7">
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

                <div className="text-center mt-6">
                    <button
                        onClick={onClose}
                        className="bg-header hover:bg-opacity-80 text-text-primary px-6 py-2 rounded-md font-medium transition-colors"
                    >
                        J'ai compris
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpOverlay;

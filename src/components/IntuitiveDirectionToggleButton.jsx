import React from "react";

const IntuitiveDirectionToggleButton = ({ ordre, toggleOrdre }) => {
    // Détermine l'état actuel
    const isAscending = ordre === "0-99";

    return (
        <div className="flex flex-col items-center">
            {/* Étiquette explicative au-dessus */}
            <div className="text-text-primary text-xs mb-1">Je compte...</div>

            {/* Bouton sous forme d'interrupteur avec deux états clairement visibles */}
            <div
                onClick={toggleOrdre}
                className="bg-header border-2 border-text-secondary rounded-full p-1 w-40 md:w-48 flex cursor-pointer relative shadow-md hover:border-yellow-300 transition-colors"
                role="button"
                aria-pressed={isAscending}
                tabIndex={0}
                title="Changer l'ordre de numérotation"
                aria-label={`Actuellement: compter en ${
                    isAscending ? "montant" : "descendant"
                }. Cliquer pour changer`}
            >
                {/* Indicateur de sélection qui se déplace */}
                <div
                    className={`absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-full transition-all duration-300 z-0 ${
                        isAscending ? "left-1" : "left-[calc(50%-2px)]"
                    }`}
                />

                {/* Options */}
                <div
                    className={`flex-1 flex items-center justify-center py-1 z-10 ${
                        isAscending
                            ? "text-white font-bold"
                            : "text-text-secondary"
                    }`}
                >
                    <div className="flex items-center">
                        <span className="mr-1">0</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 10l7-7m0 0l7 7m-7-7v18"
                            />
                        </svg>
                        <span className="ml-1">99</span>
                    </div>
                </div>

                <div
                    className={`flex-1 flex items-center justify-center py-1 z-10 ${
                        !isAscending
                            ? "text-white font-bold"
                            : "text-text-secondary"
                    }`}
                >
                    <div className="flex items-center">
                        <span className="mr-1">0</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                        <span className="ml-1">99</span>
                    </div>
                </div>
            </div>

            {/* Label explicatif en dessous */}
            <div className="text-text-primary text-xs mt-1">
                {isAscending ? "En montant" : "En descendant"}
            </div>
        </div>
    );
};

export default IntuitiveDirectionToggleButton;

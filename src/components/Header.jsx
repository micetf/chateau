import { forwardRef } from "react";

export const Header = forwardRef(function Header({}, ref) {
    return (
        <header ref={ref} className="bg-header py-2 px-4 shadow-md">
            <div className="flex justify-between items-center max-w-screen-xl mx-auto">
                {/* Partie gauche - titre et navigation */}
                <div className="flex items-center space-x-2">
                    <a
                        href="https://micetf.fr"
                        className="text-text-primary hover:underline"
                        title="Accueil MiCetF"
                    >
                        MiCetF
                    </a>
                    <div className="flex items-center text-text-secondary text-sm">
                        <span className="mx-2">›</span>
                        <h1 className="text-lg font-bold text-text-primary">
                            Le château des nombres
                        </h1>
                    </div>
                </div>

                {/* Partie droite - boutons */}
                <div className="flex items-center space-x-3">
                    {/* Bouton Don (PayPal) */}
                    <button
                        id="paypal"
                        className="text-text-primary hover:bg-opacity-80 bg-opacity-90 bg-orange-600 px-2 py-1 rounded text-sm transition-colors flex items-center"
                        title="Faire un don"
                    >
                        <span className="mr-1">❤</span>
                        <span className="hidden md:inline">Soutenir</span>
                    </button>

                    {/* Bouton Outils */}
                    <a
                        href="https://micetf.fr/outils"
                        className="hidden sm:block text-text-primary hover:bg-opacity-60 bg-opacity-30 bg-gray-700 px-2 py-1 rounded text-sm transition-colors"
                        title="Outils pédagogiques"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Outils
                    </a>

                    {/* Bouton Index */}
                    <a
                        href="https://micetf.fr/index"
                        className="hidden sm:block text-text-primary hover:bg-opacity-60 bg-opacity-30 bg-gray-700 px-2 py-1 rounded text-sm transition-colors"
                        title="Index alphabétique"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Index
                    </a>

                    {/* Bouton Contact */}
                    <a
                        href="#"
                        id="contact"
                        className="text-text-primary hover:bg-opacity-60 bg-opacity-30 bg-gray-700 px-2 py-1 rounded text-sm transition-colors"
                        title="Contacter le webmaster"
                    >
                        Contact
                    </a>
                </div>
            </div>
        </header>
    );
});

export default Header;

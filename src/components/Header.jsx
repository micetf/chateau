import { forwardRef, useEffect } from "react";

export const Header = forwardRef(function Header({}, ref) {
    // Effet pour ajouter une classe active lors du défilement
    useEffect(() => {
        const handleScroll = () => {
            const header = ref.current;
            if (header) {
                if (window.scrollY > 10) {
                    header.classList.add("shadow-lg");
                    header.classList.remove("shadow-md");
                } else {
                    header.classList.remove("shadow-lg");
                    header.classList.add("shadow-md");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [ref]);

    // Gestionnaire du clic sur le bouton PayPal
    const handlePaypalClick = (e) => {
        e.preventDefault();
        const paypalElement = document.getElementById("paypal");
        if (paypalElement) {
            paypalElement.click();
        }
    };

    return (
        <header
            ref={ref}
            className="bg-header py-2 px-4 shadow-md sticky top-0 z-20 transition-all duration-300"
        >
            <div className="flex justify-between items-center max-w-screen-xl mx-auto">
                {/* Partie gauche - logo et titre */}
                <div className="flex items-center space-x-2">
                    <a
                        href="https://micetf.fr"
                        className="text-text-primary hover:text-text-secondary transition-colors duration-200 flex items-center"
                        title="Accueil MiCetF"
                    >
                        <span className="text-lg font-bold">MiCetF</span>
                    </a>
                    <div className="flex items-center text-text-secondary text-sm">
                        <span className="mx-2">›</span>
                        <h1 className="text-lg font-bold text-text-primary">
                            Le château des nombres
                        </h1>
                    </div>
                </div>

                {/* Partie droite - boutons */}
                <div className="flex items-center space-x-2">
                    {/* Bouton Don (PayPal) intégré à la navbar */}
                    <button
                        onClick={handlePaypalClick}
                        className="bg-orange-600 hover:bg-orange-700 text-text-primary px-3 py-1.5 rounded text-sm transition-colors flex items-center"
                        title="Si vous pensez que cet outil le mérite... Merci !"
                    >
                        <span className="mr-1">❤</span>
                        <span className="hidden md:inline">Faire un don</span>
                    </button>

                    {/* Bouton Outils */}
                    <a
                        href="https://micetf.fr/outils"
                        className="hidden sm:flex items-center bg-gray-700 bg-opacity-30 hover:bg-opacity-60 text-text-primary px-3 py-1.5 rounded text-sm transition-colors"
                        title="Outils pédagogiques"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            className="h-4 w-4 fill-current mr-1"
                        >
                            <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                        </svg>
                        <span className="hidden md:inline">Outils</span>
                    </a>

                    {/* Bouton Index */}
                    <a
                        href="https://micetf.fr/index"
                        className="hidden sm:flex items-center bg-gray-700 bg-opacity-30 hover:bg-opacity-60 text-text-primary px-3 py-1.5 rounded text-sm transition-colors"
                        title="Index alphabétique"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            className="h-4 w-4 fill-current mr-1"
                        >
                            <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zm7-1a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z"></path>
                        </svg>
                        <span className="hidden md:inline">Index</span>
                    </a>

                    {/* Bouton Contact */}
                    <a
                        href="#"
                        id="contact"
                        className="flex items-center bg-gray-700 bg-opacity-30 hover:bg-opacity-60 text-text-primary px-3 py-1.5 rounded text-sm transition-colors"
                        title="Contacter le webmaster"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            className="h-4 w-4 fill-current mr-1"
                        >
                            <path d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z"></path>
                        </svg>
                        <span className="hidden md:inline">Contact</span>
                    </a>
                </div>
            </div>
        </header>
    );
});

export default Header;

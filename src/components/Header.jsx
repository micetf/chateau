import { useState, useEffect, forwardRef } from "react";

export const Header = forwardRef(function Header({}, ref) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Effet pour ajouter une classe active lors du défilement
    useEffect(() => {
        const handleScroll = () => {
            const header = ref.current;
            if (header) {
                if (window.scrollY > 10) {
                    header.classList.add("shadow-lg");
                } else {
                    header.classList.remove("shadow-lg");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [ref]);

    // Gestionnaire pour ouvrir/fermer le menu mobile
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav
            ref={ref}
            className="bg-header py-3 text-text-primary sticky top-0 z-20 transition-all duration-300"
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Logo et titre */}
                    <div className="flex items-center space-x-2">
                        <a
                            href="https://micetf.fr"
                            className="flex items-center text-text-primary hover:text-text-secondary transition-colors duration-200"
                            title="Accueil MiCetF"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-8 h-8 mr-2 text-blue-400"
                            >
                                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z"></path>
                                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z"></path>
                                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z"></path>
                            </svg>
                            <span className="text-xl font-semibold">
                                MiCetF
                            </span>
                        </a>
                        <div className="hidden md:flex items-center">
                            <span className="mx-2 text-text-secondary">›</span>
                            <h1 className="text-xl font-semibold text-text-primary">
                                Le château des nombres
                            </h1>
                        </div>
                    </div>

                    {/* Boutons pour desktop */}
                    <div className="hidden md:flex items-center space-x-4">
                        <div className="flex space-x-2">
                            {/* Bouton Outils */}
                            <a
                                href="https://micetf.fr/outils/"
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200"
                                title="Chercher un outil par thème et domaine"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5 fill-current"
                                >
                                    <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                                </svg>
                                <span className="hidden lg:inline">
                                    Recherche par thème
                                </span>
                            </a>

                            {/* Bouton Index */}
                            <a
                                href="https://micetf.fr/index/"
                                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition-colors duration-200"
                                title="Liste des outils par ordre alphabétique"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5 fill-current"
                                >
                                    <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zm7-1a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span className="hidden lg:inline">
                                    Index A-Z
                                </span>
                            </a>

                            {/* Bouton Contact */}
                            <a
                                href="#"
                                id="contact"
                                className="flex items-center gap-1 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition-colors duration-200"
                                title="Contacter le webmaster"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5 fill-current"
                                >
                                    <path d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z"></path>
                                </svg>
                                <span className="hidden lg:inline">
                                    Contact
                                </span>
                            </a>

                            {/* Bouton PayPal - Formulaire direct comme dans le modèle */}
                            <form
                                action="https://www.paypal.com/cgi-bin/webscr"
                                method="post"
                                target="_top"
                                className="inline-block"
                            >
                                <button
                                    type="submit"
                                    className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-700 text-text-primary px-3 py-2 rounded-md transition-colors duration-200"
                                    title="Si vous pensez que ces outils le méritent... Merci !"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        className="h-5 w-5 fill-current"
                                    >
                                        <path d="m10 3.22-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z"></path>
                                    </svg>
                                    <span className="hidden lg:inline">
                                        Faire un don
                                    </span>
                                </button>
                                <input
                                    type="hidden"
                                    name="cmd"
                                    value="_s-xclick"
                                />
                                <input
                                    type="hidden"
                                    name="hosted_button_id"
                                    value="Q2XYVFP4EEX2J"
                                />
                            </form>
                        </div>
                    </div>

                    {/* Bouton hamburger pour mobile */}
                    <div className="md:hidden flex items-center">
                        <button
                            className="text-text-primary p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            aria-label="Ouvrir le menu"
                            aria-expanded={isMenuOpen}
                            onClick={toggleMenu}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu mobile */}
            {isMenuOpen && (
                <div className="md:hidden px-4 py-3 space-y-2 bg-gray-800 border-t border-gray-700">
                    <h1 className="text-lg font-semibold text-text-primary mb-2">
                        Le château des nombres
                    </h1>
                    <div className="flex flex-col space-y-2">
                        <a
                            href="https://micetf.fr/outils/"
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
                            title="Chercher un outil par thème et domaine"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-5 w-5 fill-current"
                            >
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                            </svg>
                            <span>Recherche par thème</span>
                        </a>
                        <a
                            href="https://micetf.fr/index/"
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                            title="Liste des outils par ordre alphabétique"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-5 w-5 fill-current"
                            >
                                <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zm7-1a1 1 0 00-1 1v12a1 1 0 001 1h2a1 1 0 001-1V4a1 1 0 00-1-1h-2z"></path>
                            </svg>
                            <span>Index A-Z</span>
                        </a>
                        <a
                            href="#"
                            id="contact-mobile"
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                            title="Contacter le webmaster"
                            onClick={(e) => {
                                e.preventDefault();
                                const contactElement =
                                    document.getElementById("contact");
                                if (contactElement) contactElement.click();
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-5 w-5 fill-current"
                            >
                                <path d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z"></path>
                            </svg>
                            <span>Contact</span>
                        </a>
                        {/* Version mobile du bouton PayPal */}
                        <form
                            action="https://www.paypal.com/cgi-bin/webscr"
                            method="post"
                            target="_top"
                        >
                            <button
                                type="submit"
                                className="flex w-full items-center gap-2 px-3 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 transition-colors"
                                title="Si vous pensez que ces outils le méritent... Merci !"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-5 w-5 fill-current"
                                >
                                    <path d="m10 3.22-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z"></path>
                                </svg>
                                <span>Faire un don</span>
                            </button>
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input
                                type="hidden"
                                name="hosted_button_id"
                                value="Q2XYVFP4EEX2J"
                            />
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
});

export default Header;

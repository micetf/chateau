import { forwardRef } from "react";

export const Header = forwardRef(function Header({ toggleOrdre, ordre }, ref) {
    return (
        <header ref={ref} className="flex justify-between items-center px-4">
            <h1>Le château des nombres</h1>
            <div className="flex items-center">
                <button
                    onClick={toggleOrdre}
                    className="mr-4 bg-header hover:bg-opacity-80 text-text-primary px-3 py-1 rounded-md text-sm font-medium transition-colors border border-text-secondary"
                    title="Changer l'ordre de numérotation"
                >
                    Ordre: {ordre}
                </button>
                <p>
                    Créé par{" "}
                    <a
                        href="http://micetf.fr"
                        title="Des Outils Pour La Classe"
                    >
                        MiCetF
                    </a>{" "}
                    -{" "}
                    <a href="#" id="contact">
                        Contact
                    </a>
                </p>
            </div>
        </header>
    );
});
export default Header;

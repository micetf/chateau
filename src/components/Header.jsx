import { forwardRef } from "react";

export const Header = forwardRef(function Header(props, ref) {
    return (
        <header ref={ref}>
            <h1>Le château des nombres</h1>
            <p>
                Créé par{" "}
                <a href="http://micetf.fr" title="Des Outils Pour La Classe">
                    MiCetF
                </a>{" "}
                (2013) -{" "}
                <a href="#" id="contact">
                    Contact
                </a>
            </p>
        </header>
    );
});
export default Header;

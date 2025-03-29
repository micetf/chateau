import { forwardRef } from "react";

export const Header = forwardRef(function Header({ ordre, setOrdre }, ref) {
    const handleChangeOrdre = (e) => {
        setOrdre(e.target.value);
    };

    return (
        <header ref={ref}>
            <h1>Le château des nombres</h1>
            <p>
                Numérotation depuis le{" "}
                <select
                    name="ordre"
                    id="ordre"
                    value={ordre}
                    onChange={handleChangeOrdre}
                    className="mr-2.5"
                >
                    <option value="99-0">premier étage</option>
                    <option value="0-99">dernier étage</option>
                </select>
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

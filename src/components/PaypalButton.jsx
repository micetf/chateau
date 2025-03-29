export default PaypalButton;
import { useEffect } from "react";

export function PaypalButton() {
    useEffect(() => {
        // Créer le formulaire PayPal caché
        const form = document.createElement("form");
        form.action = "https://www.paypal.com/cgi-bin/webscr";
        form.method = "post";
        form.target = "_top";
        form.style.display = "none";

        // Ajouter les champs du formulaire
        const fields = [
            {
                type: "hidden",
                name: "cmd",
                value: "_s-xclick",
            },
            {
                type: "hidden",
                name: "hosted_button_id",
                value: "Q2XYVFP4EEX2J",
            },
            {
                type: "image",
                name: "submit",
            },
        ];

        // Créer et ajouter les champs au formulaire
        fields.forEach((props) => {
            const input = document.createElement("input");
            for (let prop in props) {
                if (props.hasOwnProperty(prop)) {
                    input[prop] = props[prop];
                }
            }
            form.appendChild(input);
        });

        // Ajouter le formulaire au document
        document.body.appendChild(form);

        // Configurer le bouton PayPal
        const paypalButton = document.querySelector("#paypal");
        if (paypalButton) {
            paypalButton.style.cursor = "pointer";
            paypalButton.title =
                "Si vous pensez que cet outil le mérite... Merci !";
            paypalButton.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                form.querySelector("[name=submit]").click();
            });
        }

        // Nettoyage à la désinstallation du composant
        return () => {
            if (form && document.body.contains(form)) {
                document.body.removeChild(form);
            }

            if (paypalButton) {
                paypalButton.removeEventListener("click", () => {});
            }
        };
    }, []);

    // Le bouton PayPal est déjà dans le HTML principal, donc ce composant ne rend rien directement
    return null;
}

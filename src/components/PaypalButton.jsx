import { useEffect } from "react";

export function PaypalButton() {
    useEffect(() => {
        // Créer le formulaire PayPal caché qui sera utilisé par le bouton dans la navbar
        const form = document.createElement("form");
        form.id = "paypal-form";
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
                id: "paypal-submit-btn",
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

        // Récupérer le bouton PayPal de l'index.html et le configurer pour soumettre notre formulaire
        const originalPaypalBtn = document.getElementById("paypal");
        if (originalPaypalBtn) {
            // Utiliser l'élément existant pour activer notre formulaire
            originalPaypalBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const submitBtn = document.getElementById("paypal-submit-btn");
                if (submitBtn) {
                    submitBtn.click();
                }
            });
        }

        // Nettoyage à la désinstallation du composant
        return () => {
            const form = document.getElementById("paypal-form");
            if (form && document.body.contains(form)) {
                document.body.removeChild(form);
            }

            // Nettoyer l'écouteur d'événements sur le bouton original si nécessaire
            if (originalPaypalBtn) {
                originalPaypalBtn.removeEventListener("click", () => {});
            }
        };
    }, []);

    // Ce composant ne rend rien directement, il gère juste le comportement du bouton PayPal
    return null;
}

export default PaypalButton;

import { useEffect } from "react";

export function ContactLink() {
    useEffect(() => {
        // Créer le lien caché pour le contact
        const contactLink = document.createElement("a");
        contactLink.href =
            [
                "mailto:",
                "webmaster",
                "@",
                "micetf.fr",
                "?",
                "subject=Au sujet de ",
            ].join("") + document.location.pathname;
        contactLink.textContent = "Contact";
        contactLink.style.display = "none";
        contactLink.id = "js-micetf-contact";
        document.querySelector("body").appendChild(contactLink);

        // Configuration du lien de contact visible dans la navbar
        const contactElement = document.querySelector("#contact");
        if (contactElement) {
            contactElement.title = "Pour contacter le webmaster...";
            contactElement.addEventListener("click", function (e) {
                e.preventDefault();
                console.log("mail : " + contactLink.href);
                contactLink.click();
            });
        }

        // Configuration du lien de contact dans le menu mobile
        const contactMobileElement = document.querySelector("#contact-mobile");
        if (contactMobileElement) {
            contactMobileElement.title = "Pour contacter le webmaster...";
        }

        // Nettoyage à la désinstallation du composant
        return () => {
            const linkElement = document.querySelector("#js-micetf-contact");
            if (linkElement) {
                linkElement.remove();
            }

            if (contactElement) {
                contactElement.removeEventListener("click", () => {});
            }
        };
    }, []);

    // Ce composant n'affiche rien directement, il gère juste le comportement du lien contact
    return null;
}

export default ContactLink;

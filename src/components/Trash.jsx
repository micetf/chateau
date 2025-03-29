import React, { useEffect, useState } from "react";
import "./Trash.css";

const Trash = () => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        // Activer la poubelle qui est cachée par défaut dans index.html
        const poubelleElement = document.getElementById("poubelle");
        if (poubelleElement) {
            // Rendre la poubelle visible et la positionner en bas à gauche
            poubelleElement.style.visibility = "visible";
            poubelleElement.style.width = "64px";
            poubelleElement.style.height = "64px";
            poubelleElement.style.cursor = "pointer";
            poubelleElement.style.position = "fixed";
            poubelleElement.style.left = "20px";
            poubelleElement.style.bottom = "20px";
            poubelleElement.style.zIndex = "100";
            poubelleElement.title = "Déposez ici les éléments à supprimer";

            // Ajouter une classe pour faciliter la sélection
            poubelleElement.className = "trash-element";

            // Créer un élément zone de drop qui sera plus grand pour faciliter le dépôt
            const dropZone = document.createElement("div");
            dropZone.id = "trash-drop-zone";
            dropZone.style.position = "fixed";
            dropZone.style.left = "0";
            dropZone.style.bottom = "0";
            dropZone.style.width = "120px";
            dropZone.style.height = "120px";
            dropZone.style.backgroundColor = "rgba(26, 53, 64, 0.3)";
            dropZone.style.borderRadius = "60px";
            dropZone.style.zIndex = "50";
            dropZone.style.display = "flex";
            dropZone.style.justifyContent = "center";
            dropZone.style.alignItems = "center";
            dropZone.style.pointerEvents = "none"; // Ne pas bloquer les interactions avec les éléments en dessous
            document.body.appendChild(dropZone);

            // Ajouter les gestionnaires d'événements pour le survol
            poubelleElement.addEventListener("mouseenter", () => {
                setIsActive(true);
                poubelleElement.classList.add("active");
                dropZone.classList.add("highlight");
            });

            poubelleElement.addEventListener("mouseleave", () => {
                setIsActive(false);
                poubelleElement.classList.remove("active");
                dropZone.classList.remove("highlight");
            });
        }

        // Nettoyer lors du démontage du composant
        return () => {
            const dropZone = document.getElementById("trash-drop-zone");
            if (dropZone) {
                document.body.removeChild(dropZone);
            }
        };
    }, []);

    // Ce composant ne rend rien car il manipule directement l'élément poubelle existant
    return null;
};

export default Trash;

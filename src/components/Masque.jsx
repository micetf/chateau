import React from "react";

/**
 * Composant pour le masque d'opérations utilisant une image PNG
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.ordre - L'ordre de numérotation ("0-99" ou "99-0")
 * @param {number} props.size - La taille d'une cellule en pixels
 */
const Masque = ({ ordre = "99-0", size = 50 }) => {
    // Taille totale du masque (3x3 cellules)
    const totalSize = size * 3;

    // Choisir la bonne image en fonction de l'ordre
    const imageName = ordre === "0-99" ? "masque.png" : "masque-inverse.png";

    return (
        <img
            src={`/img/${imageName}`}
            alt={`Masque d'opérations ${ordre}`}
            width={totalSize}
            height={totalSize}
            style={{ pointerEvents: "none" }}
        />
    );
};

export default Masque;

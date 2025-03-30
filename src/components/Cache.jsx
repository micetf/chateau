import React, {memo} from "react";

/**
 * Composant pour les caches colorés utilisant des images PNG
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.color - La couleur du cache (pour sélectionner l'image appropriée)
 * @param {number} props.size - La taille du cache en pixels
 */
const Cache = memo(function Cache({ color, size }) {
    // Enlever le # du code couleur pour l'utiliser dans le nom de fichier
    const colorCode = color.replace("#", "");

    return (
        <img
            src={`/img/cache-${colorCode}.png`}
            alt={`Cache ${colorCode}`}
            width={size}
            height={size}
            style={{ pointerEvents: "none" }}
        />
    );
});

export default Cache;

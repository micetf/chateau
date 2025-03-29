import React from "react";

/**
 * Composant SVG pour les caches colorés
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.color - La couleur du cache
 * @param {number} props.size - La taille du cache en pixels
 * @param {number} props.strokeWidth - L'épaisseur de la bordure (par défaut adaptative)
 */
const CacheSvg = ({ color, size, strokeWidth = null }) => {
    // Si strokeWidth n'est pas spécifié, le calculer en fonction de la taille
    const calculatedStrokeWidth =
        strokeWidth || Math.max(2, Math.round(size * 0.04));

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }} // Désactivation des événements sur le SVG lui-même
        >
            <rect
                x={calculatedStrokeWidth / 2}
                y={calculatedStrokeWidth / 2}
                width={size - calculatedStrokeWidth}
                height={size - calculatedStrokeWidth}
                fill={color}
                stroke="black"
                strokeWidth={calculatedStrokeWidth}
            />
        </svg>
    );
};

export default CacheSvg;

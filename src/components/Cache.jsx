// src/components/Cache.jsx - Version optimisée
import React, { memo } from "react";
import OptimizedImage from "./common/OptimizedImage";

/**
 * Composant pour les caches colorés utilisant des images WebP optimisées avec fallback PNG
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.color - La couleur du cache (pour sélectionner l'image appropriée)
 * @param {number} props.size - La taille du cache en pixels
 */
const Cache = memo(function Cache({ color, size }) {
    // Enlever le # du code couleur pour l'utiliser dans le nom de fichier
    const colorCode = color.replace("#", "");

    return (
        <OptimizedImage
            src={`/img/cache-${colorCode}.webp`}
            alt={`Cache ${colorCode}`}
            width={size}
            height={size}
            style={{ pointerEvents: "none" }}
            // Fallback pour les navigateurs qui ne supportent pas WebP
            onError={() => `/img/cache-${colorCode}.png`}
        />
    );
});

export default Cache;

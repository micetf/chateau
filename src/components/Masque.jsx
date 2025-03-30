// src/components/Masque.jsx - Version optimisée
import React, { memo } from "react";
import OptimizedImage from "./common/OptimizedImage";

const Masque = memo(function Masque({ ordre = "99-0", size = 50 }) {
    // Taille totale du masque (3x3 cellules)
    const totalSize = size * 3;

    // Choisir la bonne image en fonction de l'ordre
    const imageName = ordre === "0-99" ? "masque.webp" : "masque-inverse.webp";

    return (
        <OptimizedImage
            src={`/img/${imageName}`}
            alt={`Masque d'opérations ${ordre}`}
            width={totalSize}
            height={totalSize}
            style={{ pointerEvents: "none" }}
            // Fallback pour les navigateurs qui ne supportent pas WebP
            onError={() => `/img/${imageName.replace(".webp", ".png")}`}
        />
    );
});

export default Masque;

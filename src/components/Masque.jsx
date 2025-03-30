import React, { memo } from "react";

const Masque = memo(function Masque({ ordre = "99-0", size = 50 }) {
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
            style={{
                pointerEvents: "none",
                width: `${totalSize}px`,
                height: `${totalSize}px`,
                objectFit: "contain",
            }}
        />
    );
});

export default Masque;

import React from "react";

/**
 * Composant SVG pour le masque d'opérations
 * Affiche un masque 3x3 avec les opérations +1, -1, +10, -10 autour d'une case centrale
 *
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.ordre - L'ordre de numérotation ("0-99" ou "99-0")
 * @param {number} props.size - La taille d'une cellule en pixels
 * @param {string} props.baseColor - La couleur de fond du masque
 * @param {string} props.accentColor - La couleur de la case centrale
 */
const MasqueSvg = ({
    ordre = "99-0",
    size = 50,
    baseColor = "#FFFF99",
    accentColor = "#FFEE66",
}) => {
    // Adapter les opérations selon l'ordre
    const plusDix = ordre === "0-99" ? "+10" : "-10";
    const moinsDix = ordre === "0-99" ? "-10" : "+10";

    // Calculs des dimensions
    const cellSize = size;
    const totalSize = cellSize * 3;
    const strokeWidth = Math.max(2, cellSize * 0.04); // Bordure adaptative
    const fontSize = Math.max(cellSize * 0.4, 14); // Taille de police adaptative

    return (
        <svg
            width={totalSize}
            height={totalSize}
            viewBox={`0 0 ${totalSize} ${totalSize}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }} // Désactivation des événements sur le SVG lui-même
        >
            {/* Définition de la grille 3x3 */}
            <g>
                {/* Première ligne */}
                <rect
                    x="0"
                    y="0"
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />

                <rect
                    x={cellSize}
                    y="0"
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />
                <text
                    x={cellSize * 1.5}
                    y={cellSize * 0.5}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight="bold"
                >
                    {plusDix}
                </text>

                <rect
                    x={cellSize * 2}
                    y="0"
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />

                {/* Deuxième ligne */}
                <rect
                    x="0"
                    y={cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />
                <text
                    x={cellSize * 0.5}
                    y={cellSize * 1.5}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight="bold"
                >
                    -1
                </text>

                {/* Case centrale transparente avec seulement une bordure */}
                <rect
                    x={cellSize}
                    y={cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill="transparent"
                    stroke="black"
                    strokeWidth={strokeWidth}
                />

                <rect
                    x={cellSize * 2}
                    y={cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />
                <text
                    x={cellSize * 2.5}
                    y={cellSize * 1.5}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight="bold"
                >
                    +1
                </text>

                {/* Troisième ligne */}
                <rect
                    x="0"
                    y={cellSize * 2}
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />

                <rect
                    x={cellSize}
                    y={cellSize * 2}
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />
                <text
                    x={cellSize * 1.5}
                    y={cellSize * 2.5}
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight="bold"
                >
                    {moinsDix}
                </text>

                <rect
                    x={cellSize * 2}
                    y={cellSize * 2}
                    width={cellSize}
                    height={cellSize}
                    fill={baseColor}
                    stroke="black"
                    strokeWidth={strokeWidth}
                />
            </g>
        </svg>
    );
};

export default MasqueSvg;

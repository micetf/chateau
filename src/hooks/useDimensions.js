import { useState, useEffect, useMemo } from "react";

// Hook personnalisé pour gérer toutes les dimensions de l'application
export function useDimensions(windowSize, headerHeight) {
    // Dimensions du château
    const [chateauDimensions, setChateauDimensions] = useState({
        width: 0,
        height: 0,
    });

    // Dimensions d'une cellule
    const [cellSize, setCellSize] = useState(0);

    // Données des cellules (nombre de lignes, colonnes, etc.)
    const [cellData, setCellData] = useState(null);

    // Détermine si l'écran est en mode portrait
    const isPortrait = useMemo(
        () => windowSize.height > windowSize.width,
        [windowSize]
    );

    // Détermine si l'appareil est mobile
    const isMobile = useMemo(() => windowSize.width < 768, [windowSize.width]);

    // Calcule les dimensions optimales du château en fonction de la taille de la fenêtre
    const calculateChateauDimensions = (originalWidth, cellData) => {
        if (
            !originalWidth ||
            typeof originalWidth !== "number" ||
            originalWidth <= 0
        ) {
            console.warn(
                "Largeur invalide reçue:",
                originalWidth,
                "- utilisation d'une valeur par défaut"
            );
            originalWidth = 867; // Valeur par défaut
        }

        // Calcul de l'espace disponible
        const maxHeight = windowSize.height - headerHeight - 40;
        const maxWidth = isPortrait
            ? windowSize.width * 0.9
            : windowSize.width * 0.6;

        const aspectRatio = 65.03 / 86.7; // Rapport hauteur/largeur du SVG

        // Calcul des dimensions optimales
        let adjustedWidth, height;

        if (isPortrait) {
            adjustedWidth = Math.min(maxWidth, originalWidth);
            height = adjustedWidth * aspectRatio;

            if (height > maxHeight) {
                height = maxHeight;
                adjustedWidth = height / aspectRatio;
            }
        } else {
            height = Math.min(maxHeight, originalWidth * aspectRatio);
            adjustedWidth = height / aspectRatio;

            if (adjustedWidth > maxWidth) {
                adjustedWidth = maxWidth;
                height = adjustedWidth * aspectRatio;
            }
        }

        // Mise à jour des dimensions du château
        setChateauDimensions({
            width: adjustedWidth,
            height,
        });

        // Stockage des données des cellules
        if (cellData) {
            setCellData(cellData);
        }

        // Calcul de la taille d'une cellule
        // Utiliser directement la taille fournie par Chateau.jsx, sans limites min/max
        if (cellData && cellData.averageSize) {
            setCellSize(cellData.averageSize);
        } else if (cellData && cellData.cellWidth) {
            // Fallback si averageSize n'est pas défini mais cellWidth l'est
            setCellSize(cellData.cellWidth);
        } else {
            // Fallback avec une valeur proportionnelle à la largeur de l'écran
            // si aucune information de cellule n'est disponible
            setCellSize(Math.max(15, adjustedWidth / 20));
        }
    };

    // Calcul des dimensions dérivées
    const masqueSize = useMemo(() => cellSize * 3, [cellSize]);

    // Configuration du layout en fonction des dimensions
    const layout = useMemo(() => {
        const mainHeight = windowSize.height - headerHeight;

        if (isPortrait && isMobile) {
            // Calcul des hauteurs en mode portrait
            const topRowHeight = Math.max(80, cellSize + 20);
            const bottomRowHeight = Math.max(100, masqueSize + 20);
            const mainAreaHeight = mainHeight - topRowHeight - bottomRowHeight;

            return {
                flexDirection: "column",
                topRowHeight,
                bottomRowHeight,
                mainAreaHeight,
                mainHeight,
            };
        } else {
            // Mode paysage standard
            return {
                flexDirection: "row",
                mainHeight,
            };
        }
    }, [
        isPortrait,
        isMobile,
        cellSize,
        masqueSize,
        windowSize.height,
        headerHeight,
    ]);

    return {
        windowSize,
        headerHeight,
        chateauDimensions,
        cellSize,
        cellData,
        masqueSize,
        isPortrait,
        isMobile,
        layout,
        calculateChateauDimensions,
    };
}

export default useDimensions;

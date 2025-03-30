import { useEffect, useState, useCallback } from "react";

export function Chateau({ ordre, height, onLoad }) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    // Dimensions connues de l'image originale et des fenêtres
    const ORIGINAL_WIDTH = 1024;
    const WINDOW_SIZE = 52;

    // Charger l'image du château en fonction de l'ordre
    useEffect(() => {
        const imagePath =
            ordre === "0-99" ? "/img/chateau-inverse.png" : "/img/chateau.png";

        // Précharger l'image pour obtenir ses dimensions
        const img = new Image();
        img.onload = () => {
            // Calculer les dimensions en respectant le ratio
            const aspectRatio = img.width / img.height;
            const newHeight = height;
            const newWidth = newHeight * aspectRatio;

            setDimensions({
                width: newWidth,
                height: newHeight,
            });

            // Calculer le facteur d'échelle
            const scaleFactor = newWidth / ORIGINAL_WIDTH;

            // Calculer la taille d'une fenêtre mise à l'échelle
            const scaledWindowSize = WINDOW_SIZE * scaleFactor;

            // Notifier le parent avec la taille d'une fenêtre
            if (!isLoaded) {
                onLoad(newWidth, {
                    cellWidth: scaledWindowSize,
                    cellHeight: scaledWindowSize,
                    averageSize: scaledWindowSize,
                });
                setIsLoaded(true);
            }
        };

        img.src = imagePath;
    }, [ordre, height, onLoad, isLoaded]);

    // Fonction pour recalculer les dimensions lors d'un redimensionnement
    const handleResize = useCallback(() => {
        if (isLoaded) {
            // Recalculer les dimensions en respectant le ratio
            const aspectRatio = dimensions.width / dimensions.height;
            const newHeight = height;
            const newWidth = newHeight * aspectRatio;

            setDimensions({
                width: newWidth,
                height: newHeight,
            });

            // Calculer le facteur d'échelle
            const scaleFactor = newWidth / ORIGINAL_WIDTH;

            // Calculer la taille d'une fenêtre mise à l'échelle
            const scaledWindowSize = WINDOW_SIZE * scaleFactor;

            // Notifier le parent des nouvelles dimensions
            onLoad(newWidth, {
                cellWidth: scaledWindowSize,
                cellHeight: scaledWindowSize,
                averageSize: scaledWindowSize,
            });
        }
    }, [isLoaded, dimensions, height, onLoad]);

    // Écouter les événements de redimensionnement
    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    return (
        <div className="flex justify-center w-full">
            <div
                id="chateau-container"
                className="mx-auto relative"
                title="Le château des nombres"
                aria-label="Le château des nombres, tableau de nombres de 0 à 99 arrangés en forme de château"
            >
                {dimensions.width > 0 && (
                    <img
                        src={
                            ordre === "0-99"
                                ? "/img/chateau-inverse.png"
                                : "/img/chateau.png"
                        }
                        alt="Château des nombres"
                        width={dimensions.width}
                        height={dimensions.height}
                        style={{
                            display: "block",
                            width: `${dimensions.width}px`,
                            height: `${dimensions.height}px`,
                            objectFit: "contain",
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Chateau;

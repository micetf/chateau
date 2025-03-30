// src/components/Chateau.jsx - Version optimisée
import { useEffect, useState, useCallback } from "react";
import OptimizedImage from "./common/OptimizedImage";

export function Chateau({ ordre, height, onLoad }) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    // Dimensions connues de l'image originale et des fenêtres
    const ORIGINAL_WIDTH = 1024;
    const WINDOW_SIZE = 52;

    // Déterminer la meilleure taille d'image à charger en fonction de la hauteur demandée
    const getOptimalImagePath = useCallback(
        (baseImage) => {
            // Calculer la largeur approximative nécessaire en fonction de la hauteur et du ratio
            const aspectRatio = 1024 / 666; // Rapport largeur/hauteur de l'image
            const estimatedWidth = height * aspectRatio;

            // Choisir la meilleure taille parmi celles disponibles (400, 600, 800, 1024)
            const availableSizes = [400, 600, 800, 1024];
            let optimalSize = availableSizes[0];

            for (const size of availableSizes) {
                if (size >= estimatedWidth) {
                    optimalSize = size;
                    break;
                }
                optimalSize = size;
            }

            // Construire le chemin d'image avec la taille optimale
            return `/img/${baseImage.replace(".png", "")}-${optimalSize}.webp`;
        },
        [height]
    );

    // Charger l'image du château en fonction de l'ordre
    useEffect(() => {
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

        // Charger l'image pour obtenir ses dimensions (utiliser une image de taille normale)
        const baseImage =
            ordre === "0-99" ? "chateau-inverse.png" : "chateau.png";
        img.src = `/img/${baseImage}`;
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

    const baseImage = ordre === "0-99" ? "chateau-inverse.png" : "chateau.png";
    const imagePath = getOptimalImagePath(baseImage);

    return (
        <div className="flex justify-center w-full">
            <div
                id="chateau-container"
                className="mx-auto relative"
                title="Le château des nombres"
                aria-label="Le château des nombres, tableau de nombres de 0 à 99 arrangés en forme de château"
            >
                {dimensions.width > 0 && (
                    <OptimizedImage
                        src={imagePath}
                        alt="Château des nombres"
                        width={dimensions.width}
                        height={dimensions.height}
                        lazy={false} // L'image principale doit être chargée immédiatement
                        placeholderColor="#1a3540"
                        style={{
                            display: "block",
                            objectFit: "contain",
                        }}
                        // Fallback pour les navigateurs qui ne supportent pas WebP
                        onError={() => {
                            const fallbackSrc = `/img/${baseImage}`;
                            if (imagePath !== fallbackSrc) {
                                return fallbackSrc;
                            }
                            return null;
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default Chateau;

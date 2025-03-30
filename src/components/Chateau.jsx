import { useEffect, useState } from "react";

export function Chateau({ ordre, height, onLoad }) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isLoaded, setIsLoaded] = useState(false);
    const [cellData, setCellData] = useState(null);

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

            // Définir les dimensions des cellules (estimation basée sur les dimensions connues)
            const estimatedCellSize = {
                cellWidth: Math.ceil(newWidth / 10), // 10 colonnes
                cellHeight: Math.ceil(newHeight / 10), // 10 lignes
                averageSize: Math.ceil((newWidth / 10 + newHeight / 10) / 2),
                rows: 10,
                columns: 10,
            };

            setCellData(estimatedCellSize);

            // Notifier le parent que l'image est chargée avec ses dimensions
            if (!isLoaded) {
                onLoad(newWidth, estimatedCellSize);
                setIsLoaded(true);
            }
        };

        img.src = imagePath;
    }, [ordre, height, onLoad, isLoaded]);

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
                        style={{ display: "block" }}
                    />
                )}
            </div>
        </div>
    );
}

export default Chateau;

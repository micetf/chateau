import React from "react";
import DraggableMasque from "./DraggableMasque";

const MasqueColumn = ({
    ordre,
    cellSize,
    headerHeight,
    sectionHeight,
    chateauWidth,
    windowWidth,
}) => {
    // Largeur fixe pour la colonne
    const columnWidth = 120;

    return (
        <div
            className="absolute right-0 top-0 bottom-0 flex flex-col items-center"
            style={{
                width: `${columnWidth}px`,
                minWidth: "80px",
                backgroundColor: "rgba(26, 53, 64, 0.2)",
                borderLeft: "2px dashed rgba(242, 220, 179, 0.5)",
                // Ajout de marges pour éviter le chevauchement avec la navbar
                marginTop: `${headerHeight + 10}px`,
                marginBottom: "80px", // Espace pour la poubelle
                height: `calc(100% - ${headerHeight + 90}px)`,
                pointerEvents: "none", // Important: ne bloque pas les événements
                zIndex: 10,
            }}
        >
            <h3 className="text-sm font-bold text-text-primary mb-6 pointer-events-none">
                Masque
            </h3>

            {cellSize > 0 && (
                <DraggableMasque
                    ordre={ordre}
                    cellSize={cellSize}
                    headerHeight={headerHeight}
                    sectionHeight={sectionHeight}
                    chateauWidth={chateauWidth}
                    windowWidth={windowWidth}
                    columnWidth={columnWidth}
                    columnPosition="right"
                />
            )}
        </div>
    );
};

export default MasqueColumn;

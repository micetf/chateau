import React from "react";
import DraggableCache from "./DraggableCache";

const CacheColumn = ({
    cacheColors,
    cellSize,
    headerHeight,
    sectionHeight,
    chateauWidth,
    windowWidth,
}) => {
    // Calcul explicite des positions Y pour chaque cache
    const cachePositions = cacheColors.map((_, index) => {
        // Position dans la barre latérale
        return 80 + index * (cellSize + 20); // 80px du haut + espacement entre caches
    });

    return (
        <>
            {cellSize > 0 &&
                cacheColors.map((color, index) => (
                    <DraggableCache
                        key={`cache-${index}`}
                        color={color}
                        index={index}
                        cellSize={cellSize}
                        headerHeight={headerHeight}
                        sectionHeight={sectionHeight}
                        chateauWidth={chateauWidth}
                        windowWidth={windowWidth}
                        yPosition={cachePositions[index]} // Position Y explicite
                        xPosition={12 + cellSize / 2} // Centré dans la barre latérale de 24px
                        isSidebarItem={true}
                    />
                ))}
        </>
    );
};

export default CacheColumn;

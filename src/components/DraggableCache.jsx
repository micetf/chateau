import { useState, useEffect, useRef, forwardRef } from "react";
import Draggable from "react-draggable";
import { createCacheImage } from "../utils/imageUtils";

// Composant d'élément déplaçable avec ref forwarding
const DraggableItem = forwardRef(({ children, ...props }, ref) => {
    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    );
});

// Composant d'élément draggable avec sa propre référence
const DraggableCacheItem = ({
    initialPosition,
    cellSize,
    imageUrl,
    index,
    itemId,
    onDragStop,
    bounds,
}) => {
    const nodeRef = useRef(null);

    return (
        <Draggable
            defaultPosition={initialPosition}
            onStop={(e, ui) => onDragStop(e, ui, itemId)}
            bounds={bounds}
            nodeRef={nodeRef}
        >
            <DraggableItem
                ref={nodeRef}
                className="absolute cursor-pointer z-10 shadow-lg"
                style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    border: "2px solid black",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                }}
            >
                <img
                    src={imageUrl}
                    alt={`cache${index}${
                        itemId !== undefined ? `-${itemId}` : ""
                    }`}
                    width={cellSize}
                    height={cellSize}
                    style={{ display: "block" }}
                />
            </DraggableItem>
        </Draggable>
    );
};

// Composant principal à exporter
const DraggableCache = ({
    color,
    index,
    cellSize,
    headerHeight,
    sectionHeight,
    chateauWidth,
    windowWidth,
}) => {
    const [cacheItems, setCacheItems] = useState([]);
    const [cacheImageUrl, setCacheImageUrl] = useState("");
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const nextIdRef = useRef(0);

    // Calculer la position initiale et la mettre à jour lorsque les dimensions changent
    useEffect(() => {
        if (cellSize > 0 && windowWidth > 0 && chateauWidth > 0) {
            // Position du bord gauche du château (centré)
            const chateauLeftEdge = (windowWidth - chateauWidth) / 2;

            // Positionnement au milieu de l'espace à gauche du château
            const x = Math.max(20, chateauLeftEdge / 2 - cellSize / 2);
            const y = index * cellSize + 10 + sectionHeight / 3;

            const newPosition = { x, y };

            console.log(`Position du cache ${index} calculée:`, newPosition);
            setInitialPosition(newPosition);

            // Vider les éléments créés dynamiquement lors d'un changement majeur de taille
            if (cacheItems.length > 0) {
                const currentPos = initialPosition;
                if (Math.abs(currentPos.x - x) > cellSize) {
                    console.log(
                        "Redimensionnement majeur détecté, réinitialisation des caches"
                    );
                    setCacheItems([]);
                }
            }
        }
    }, [
        windowWidth,
        chateauWidth,
        cellSize,
        sectionHeight,
        index,
        cacheItems.length,
    ]);

    // Créer l'image du cache initial
    useEffect(() => {
        const generateCacheImage = () => {
            if (!color) {
                console.error(`Cache ${index}: couleur invalide (${color})`);
                return;
            }

            if (!cellSize || cellSize <= 0) {
                console.warn(
                    `Cache ${index}: taille invalide (${cellSize}), nouvel essai après redimensionnement`
                );
                return;
            }

            console.log(
                `Création du cache ${index} avec couleur=${color}, cellSize=${cellSize}`
            );

            try {
                // Fallback direct au cas où la fonction utilitaire échoue
                const canvas = document.createElement("canvas");
                canvas.width = cellSize;
                canvas.height = cellSize;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    console.error(
                        `Cache ${index}: impossible d'obtenir le contexte 2D`
                    );
                    return;
                }

                // Dessin direct sur le canvas
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, cellSize, cellSize);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 4;
                ctx.strokeRect(0, 0, cellSize, cellSize);

                try {
                    const url = canvas.toDataURL("image/png");
                    console.log(
                        `Cache ${index}: image créée avec succès, début URL:`,
                        url.substring(0, 30) + "..."
                    );
                    setCacheImageUrl(url);
                } catch (e) {
                    console.error(
                        `Cache ${index}: erreur lors de la conversion en URL:`,
                        e
                    );
                }
            } catch (error) {
                console.error(`Cache ${index}: erreur générale:`, error);
            }
        };

        // Essayer de générer l'image seulement si les dimensions sont disponibles
        if (cellSize > 0) {
            generateCacheImage();
        }
    }, [color, cellSize, index]);

    // Vérifier si un item est dans la poubelle
    const isInTrash = (position) => {
        return (
            position.x <= cellSize &&
            position.y + cellSize > sectionHeight - cellSize
        );
    };

    // Gérer l'arrêt du drag
    const handleDragStop = (e, ui, id) => {
        const position = { x: ui.x, y: ui.y };

        if (isInTrash(position)) {
            // Supprimer l'élément
            setCacheItems((prev) => prev.filter((item) => item.id !== id));
        }
    };

    // Créer un nouvel élément
    const createNewItem = () => {
        if (!cacheImageUrl) return;

        const newItem = {
            id: nextIdRef.current,
            x: initialPosition.x,
            y: initialPosition.y,
        };

        nextIdRef.current += 1;
        setCacheItems((prev) => [...prev, newItem]);
    };

    if (!cacheImageUrl || cellSize <= 0) {
        console.log(
            `Pas de rendu du cache ${index}: imageUrl=${Boolean(
                cacheImageUrl
            )}, cellSize=${cellSize}`
        );
        return null;
    }

    return (
        <>
            {/* Élément original qui sert de "fabrique" */}
            <DraggableCacheItem
                initialPosition={initialPosition}
                cellSize={cellSize}
                imageUrl={cacheImageUrl}
                index={index}
                onDragStop={() => createNewItem()}
                bounds="parent"
            />

            {/* Éléments créés dynamiquement */}
            {cacheItems.map((item) => (
                <DraggableCacheItem
                    key={item.id}
                    initialPosition={{ x: item.x, y: item.y }}
                    cellSize={cellSize}
                    imageUrl={cacheImageUrl}
                    index={index}
                    itemId={item.id}
                    onDragStop={handleDragStop}
                    bounds="parent"
                />
            ))}
        </>
    );
};

// Exportations
export { DraggableCache };
export default DraggableCache;

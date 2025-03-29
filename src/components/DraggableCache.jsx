import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

// Composant d'élément draggable
const DraggableCacheItem = ({
    initialPosition,
    cellSize,
    color,
    index,
    itemId,
    onDragStop,
}) => {
    const nodeRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleStart = () => {
        setIsDragging(true);
    };

    const handleStop = (e, ui) => {
        setIsDragging(false);
        onDragStop(e, ui, itemId);
    };

    return (
        <Draggable
            defaultPosition={initialPosition}
            onStart={handleStart}
            onStop={handleStop}
            nodeRef={nodeRef}
            grid={[1, 1]}
            scale={1}
        >
            <div
                ref={nodeRef}
                className="cursor-grab active:cursor-grabbing"
                style={{
                    position: "absolute",
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: color,
                    border: "2px solid black",
                    boxShadow: isDragging
                        ? "0 8px 16px rgba(0,0,0,0.5)"
                        : "0 4px 8px rgba(0,0,0,0.3)",
                    zIndex: isDragging ? 50 : 30,
                    transform: isDragging ? "scale(1.05)" : "scale(1)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    touchAction: "none",
                }}
                data-cache-id={itemId !== undefined ? itemId : "source"}
                data-cache-index={index}
            />
        </Draggable>
    );
};

// Composant principal
const DraggableCache = ({
    color,
    index,
    cellSize,
    sectionHeight,
    initialX = 30,
    initialY = 100,
    trashPosition,
}) => {
    const [cacheItems, setCacheItems] = useState([]);
    const [initialPosition, setInitialPosition] = useState({
        x: initialX,
        y: initialY,
    });
    const nextIdRef = useRef(0);

    // Mettre à jour la position initiale si les props changent
    useEffect(() => {
        setInitialPosition({ x: initialX, y: initialY });
    }, [initialX, initialY]);

    // Vérifier si un item est dans la poubelle
    const isInTrash = (position) => {
        if (!trashPosition) return false;

        const distance = Math.sqrt(
            Math.pow(position.x - trashPosition.x, 2) +
                Math.pow(position.y - trashPosition.y, 2)
        );

        return distance < cellSize * 1.5; // Rayon de la zone de détection de la poubelle
    };

    // Gérer l'arrêt du drag
    const handleDragStop = (e, ui, id) => {
        const position = { x: ui.x, y: ui.y };

        // Si c'est l'élément source (sans id), créer un nouvel élément
        if (id === undefined) {
            createNewItem();
            return;
        }

        // Si c'est un élément créé et qu'il est sur la poubelle, le supprimer
        if (isInTrash(position)) {
            setCacheItems((prev) => prev.filter((item) => item.id !== id));
        }
    };

    // Créer un nouvel élément
    const createNewItem = () => {
        const newItem = {
            id: nextIdRef.current,
            x: initialPosition.x,
            y: initialPosition.y,
        };

        nextIdRef.current += 1;
        setCacheItems((prev) => [...prev, newItem]);
    };

    if (cellSize <= 0) {
        return null;
    }

    return (
        <>
            {/* Élément original qui sert de "fabrique" */}
            <DraggableCacheItem
                initialPosition={initialPosition}
                cellSize={cellSize}
                color={color}
                index={index}
                onDragStop={handleDragStop}
            />

            {/* Éléments créés dynamiquement */}
            {cacheItems.map((item) => (
                <DraggableCacheItem
                    key={item.id}
                    initialPosition={{ x: item.x, y: item.y }}
                    cellSize={cellSize}
                    color={color}
                    index={index}
                    itemId={item.id}
                    onDragStop={handleDragStop}
                />
            ))}
        </>
    );
};

export default DraggableCache;

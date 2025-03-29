import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

// Composant d'élément draggable pour le masque
const DraggableMasqueItem = ({
    initialPosition,
    cellSize,
    ordre,
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

    const masqueSize = cellSize * 3;

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
                    width: `${masqueSize}px`,
                    height: `${masqueSize}px`,
                    boxShadow: isDragging
                        ? "0 8px 16px rgba(0,0,0,0.5)"
                        : "0 4px 8px rgba(0,0,0,0.3)",
                    zIndex: isDragging ? 50 : 30,
                    transform: isDragging ? "scale(1.05)" : "scale(1)",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    touchAction: "none",
                    backgroundColor: "#FFFF99",
                    border: "2px solid black",
                    display: "grid",
                    gridTemplateColumns: `repeat(3, 1fr)`,
                    gridTemplateRows: `repeat(3, 1fr)`,
                }}
                data-masque-id={itemId !== undefined ? itemId : "source"}
            >
                {/* Grille 3x3 pour le masque */}
                <div className="border border-black"></div>
                <div className="border border-black flex items-center justify-center font-bold">
                    {ordre === "0-99" ? "+10" : "-10"}
                </div>
                <div className="border border-black"></div>

                <div className="border border-black flex items-center justify-center font-bold">
                    -1
                </div>
                <div className="border border-black bg-yellow-300"></div>
                <div className="border border-black flex items-center justify-center font-bold">
                    +1
                </div>

                <div className="border border-black"></div>
                <div className="border border-black flex items-center justify-center font-bold">
                    {ordre === "0-99" ? "-10" : "+10"}
                </div>
                <div className="border border-black"></div>
            </div>
        </Draggable>
    );
};

// Composant principal du masque
const DraggableMasque = ({
    ordre,
    cellSize,
    sectionHeight,
    initialX = 30,
    initialY = 100,
    trashPosition,
}) => {
    const [masqueItems, setMasqueItems] = useState([]);
    const [initialPosition, setInitialPosition] = useState({
        x: initialX,
        y: initialY,
    });
    const nextIdRef = useRef(0);

    // Mettre à jour la position initiale si les props changent
    useEffect(() => {
        setInitialPosition({ x: initialX, y: initialY });
    }, [initialX, initialY, ordre]);

    // Vérifier si un item est dans la poubelle
    const isInTrash = (position) => {
        if (!trashPosition) return false;

        const distance = Math.sqrt(
            Math.pow(position.x - trashPosition.x, 2) +
                Math.pow(position.y - trashPosition.y, 2)
        );

        return distance < cellSize * 2; // Rayon plus grand pour le masque car il est plus grand
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
            setMasqueItems((prev) => prev.filter((item) => item.id !== id));
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
        setMasqueItems((prev) => [...prev, newItem]);
    };

    if (cellSize <= 0) {
        return null;
    }

    return (
        <>
            {/* Élément original qui sert de "fabrique" */}
            <DraggableMasqueItem
                initialPosition={initialPosition}
                cellSize={cellSize}
                ordre={ordre}
                onDragStop={handleDragStop}
            />

            {/* Éléments créés dynamiquement */}
            {masqueItems.map((item) => (
                <DraggableMasqueItem
                    key={item.id}
                    initialPosition={{ x: item.x, y: item.y }}
                    cellSize={cellSize}
                    ordre={ordre}
                    itemId={item.id}
                    onDragStop={handleDragStop}
                />
            ))}
        </>
    );
};

export default DraggableMasque;

import React, { useState, useRef, useEffect } from "react";

function DraggableCache({ color, size, initialX, initialY, isSource = false }) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [clones, setClones] = useState([]);
    const cacheRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });
    const nextIdRef = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            // Calculer la nouvelle position en tenant compte du décalage
            const newX = e.clientX - offset.current.x;
            const newY = e.clientY - offset.current.y;

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            if (isDragging && isSource) {
                // Si c'est une source, créer un clone et revenir à la position initiale
                const newId = nextIdRef.current++;
                setClones([
                    ...clones,
                    {
                        id: newId,
                        x: position.x,
                        y: position.y,
                        color: color,
                    },
                ]);
                setPosition({ x: initialX, y: initialY });
            }
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, isSource, clones, position, initialX, initialY, color]);

    const handleMouseDown = (e) => {
        if (!cacheRef.current) return;

        // Calculer le décalage entre la position du clic et le coin de l'élément
        const rect = cacheRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        setIsDragging(true);
    };

    // Rendu des clones (uniquement si c'est une source)
    const cloneElements = isSource
        ? clones.map((clone) => (
              <DraggableCache
                  key={clone.id}
                  color={clone.color}
                  size={size}
                  initialX={clone.x}
                  initialY={clone.y}
                  isSource={false}
              />
          ))
        : null;

    return (
        <>
            <div
                ref={cacheRef}
                onMouseDown={handleMouseDown}
                style={{
                    position: "absolute",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    border: "2px solid black",
                    boxShadow: isDragging
                        ? "0 8px 16px rgba(0,0,0,0.5)"
                        : "0 4px 8px rgba(0,0,0,0.3)",
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none",
                    zIndex: isDragging ? 150 : 100,
                    transform: isDragging ? "scale(1.05)" : "scale(1)",
                    transition: isDragging
                        ? "none"
                        : "box-shadow 0.2s, transform 0.2s",
                    userSelect: "none",
                }}
            />
            {cloneElements}
        </>
    );
}

export default DraggableCache;

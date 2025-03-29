import React, { useState, useRef, useEffect } from "react";

function DraggableMasque({ cellSize, initialX, initialY, isSource = false }) {
    const masqueSize = cellSize * 3;
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [clones, setClones] = useState([]);
    const masqueRef = useRef(null);
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
    }, [isDragging, isSource, clones, position, initialX, initialY]);

    const handleMouseDown = (e) => {
        if (!masqueRef.current) return;

        // Calculer le décalage entre la position du clic et le coin de l'élément
        const rect = masqueRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        setIsDragging(true);
    };

    // Rendu des clones (uniquement si c'est une source)
    const cloneElements = isSource
        ? clones.map((clone) => (
              <DraggableMasque
                  key={clone.id}
                  cellSize={cellSize}
                  initialX={clone.x}
                  initialY={clone.y}
                  isSource={false}
              />
          ))
        : null;

    return (
        <>
            <div
                ref={masqueRef}
                onMouseDown={handleMouseDown}
                style={{
                    position: "absolute",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${masqueSize}px`,
                    height: `${masqueSize}px`,
                    backgroundColor: "#FFFF99",
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
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                }}
            >
                <div className="border border-black"></div>
                <div className="border border-black flex items-center justify-center font-bold">
                    -10
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
                    +10
                </div>
                <div className="border border-black"></div>
            </div>
            {cloneElements}
        </>
    );
}

export default DraggableMasque;

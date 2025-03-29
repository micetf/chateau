import React, { useState, useRef, useEffect } from "react";

function DraggableMasque({
    cellSize,
    initialX,
    initialY,
    isSource = false,
    ordre = "99-0",
    isSidebarItem = false,
}) {
    const masqueSize = cellSize * 3;
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [clones, setClones] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const masqueRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });
    const nextIdRef = useRef(0);

    // Mettre à jour la position si les coordonnées initiales changent
    useEffect(() => {
        if (isSource) {
            setPosition({ x: initialX, y: initialY });
        }
    }, [initialX, initialY, isSource]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            // Calculer la nouvelle position en tenant compte du décalage
            const newX = e.clientX - offset.current.x;
            const newY = e.clientY - offset.current.y;

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = (e) => {
            if (!isDragging) return;

            // Vérifier si on a déposé sur la poubelle
            if (isOverTrash(e.clientX, e.clientY)) {
                if (!isSource) {
                    // Si ce n'est pas une source, on le supprime
                    setIsVisible(false);
                }
            } else if (isDragging && isSource) {
                // Si c'est une source et qu'on n'est pas sur la poubelle, créer un clone
                const newId = nextIdRef.current++;
                const newX = e.clientX - offset.current.x;
                const newY = e.clientY - offset.current.y;

                setClones([
                    ...clones,
                    {
                        id: newId,
                        x: newX,
                        y: newY,
                    },
                ]);
            }

            // Si c'est une source, revenir à la position initiale
            if (isSource) {
                setPosition({ x: initialX, y: initialY });
            }

            setIsDragging(false);
        };

        // Fonction pour vérifier si les coordonnées sont au-dessus de la poubelle
        const isOverTrash = (x, y) => {
            const trashElement = document.querySelector(".trash-element");
            if (!trashElement) return false;

            const trashRect = trashElement.getBoundingClientRect();

            // Zone de détection élargie pour faciliter le drop
            const buffer = 30;
            return (
                x >= trashRect.left - buffer &&
                x <= trashRect.right + buffer &&
                y >= trashRect.top - buffer &&
                y <= trashRect.bottom + buffer
            );
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

        e.preventDefault(); // Empêcher la sélection de texte

        // Calculer le décalage entre la position du clic et le coin de l'élément
        const rect = masqueRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        setIsDragging(true);

        // S'assurer que l'élément en cours de glissement est au-dessus des autres
        if (masqueRef.current) {
            masqueRef.current.style.zIndex = "1000";
        }
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
                  ordre={ordre}
              />
          ))
        : null;

    // Si l'élément a été supprimé, ne rien rendre
    if (!isVisible) return null;

    // Adapter le texte selon l'ordre
    const plusDix = ordre === "0-99" ? "+10" : "-10";
    const moinsDix = ordre === "0-99" ? "-10" : "+10";

    // Style pour centrer l'élément dans la barre latérale si nécessaire
    let styleModifier = {};

    if (isSidebarItem) {
        styleModifier = {
            left: "50%",
            transform: isDragging
                ? "translate(-50%, 0) scale(1.05)"
                : "translate(-50%, 0)",
            transformOrigin: "center",
        };
    } else {
        styleModifier = {
            transform: isDragging ? "scale(1.05)" : "scale(1)",
            transformOrigin: "center",
        };
    }

    return (
        <>
            <div
                ref={masqueRef}
                className="draggable-masque"
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
                    zIndex: isDragging ? 150 : isSource ? 50 : 100,
                    ...styleModifier,
                    transition: isDragging
                        ? "none"
                        : "box-shadow 0.2s, transform 0.2s",
                    userSelect: "none",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(3, 1fr)",
                }}
                title={
                    isSource
                        ? "Glisser pour créer un masque"
                        : "Glisser ou déposer dans la poubelle pour supprimer"
                }
            >
                <div className="border border-black"></div>
                <div className="border border-black flex items-center justify-center font-bold">
                    {plusDix}
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
                    {moinsDix}
                </div>
                <div className="border border-black"></div>
            </div>
            {cloneElements}
        </>
    );
}

export default DraggableMasque;

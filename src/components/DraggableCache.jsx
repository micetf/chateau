import React, { useState, useRef, useEffect } from "react";
import CacheSvg from "./CacheSvg";

function DraggableCache({
    color,
    size,
    initialX,
    initialY,
    isSource = false,
    isSidebarItem = false,
}) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [clones, setClones] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const cacheRef = useRef(null);
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
                    // Animation de suppression
                    if (cacheRef.current) {
                        cacheRef.current.classList.add("deleting");
                        setTimeout(() => {
                            setIsVisible(false);
                        }, 300);
                    } else {
                        setIsVisible(false);
                    }
                }
            } else if (isDragging && isSource) {
                // Si c'est une source et qu'on n'est pas sur la poubelle, créer un clone
                const newId = nextIdRef.current++;

                // Calculer la position exacte pour le nouveau clone
                const newX = e.clientX - offset.current.x;
                const newY = e.clientY - offset.current.y;

                setClones([
                    ...clones,
                    {
                        id: newId,
                        x: newX,
                        y: newY,
                        color: color,
                    },
                ]);
            }

            // Si c'est une source, revenir à la position initiale
            if (isSource) {
                setPosition({ x: initialX, y: initialY });
            }

            setIsDragging(false);
            document.body.style.cursor = "default";
        };

        // Fonction pour vérifier si les coordonnées sont au-dessus de la poubelle
        const isOverTrash = (x, y) => {
            const trashElement = document.querySelector(".trash-element");
            if (!trashElement) return false;

            const trashRect = trashElement.getBoundingClientRect();

            // Zone de détection élargie pour faciliter le drop
            const buffer = 40;
            return (
                x >= trashRect.left - buffer &&
                x <= trashRect.right + buffer &&
                y >= trashRect.top - buffer &&
                y <= trashRect.bottom + buffer
            );
        };

        if (isDragging) {
            // Ajouter les événements au document entier
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            // Modifier le curseur pour tout le document pendant le dragging
            document.body.style.cursor = "grabbing";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "default";
        };
    }, [isDragging, isSource, clones, color, initialX, initialY]);

    const handleMouseDown = (e) => {
        if (!cacheRef.current) return;

        e.preventDefault(); // Empêcher la sélection de texte
        e.stopPropagation(); // Empêcher la propagation vers des éléments parents

        // Calculer le décalage entre la position du clic et le coin de l'élément
        const rect = cacheRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        setIsDragging(true);

        // S'assurer que l'élément en cours de glissement est au-dessus des autres
        if (cacheRef.current) {
            cacheRef.current.style.zIndex = "1000";
        }
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

    // Si l'élément a été supprimé, ne rien rendre
    if (!isVisible) return null;

    return (
        <>
            <div
                ref={cacheRef}
                className="draggable-cache"
                onMouseDown={handleMouseDown}
                style={{
                    position: "fixed", // Utiliser fixed pour se positionner par rapport au viewport
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    boxShadow: isDragging
                        ? "0 8px 16px rgba(0,0,0,0.5)"
                        : "0 4px 8px rgba(0,0,0,0.3)",
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none",
                    zIndex: isDragging ? 1000 : isSource ? 100 : 500,
                    transition: isDragging
                        ? "none"
                        : "box-shadow 0.2s, transform 0.2s",
                    transform: isDragging ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    pointerEvents: "auto", // S'assurer que l'élément capture les événements souris
                    userSelect: "none",
                }}
                title={
                    isSource
                        ? "Glisser pour créer un cache"
                        : "Glisser ou déposer dans la poubelle pour supprimer"
                }
            >
                <CacheSvg color={color} size={size} />
            </div>
            {cloneElements}
        </>
    );
}

export default DraggableCache;

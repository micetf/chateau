import React, { useState, useRef, useEffect, useCallback } from "react";
import Cache from "./Cache";

function DraggableCache({
    color,
    size,
    initialX,
    initialY,
    isSource = false,
    isSidebarItem = false,
    dimensionsContext = null, // Nouveau paramètre pour le contexte de dimensions
}) {
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [clones, setClones] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const cacheRef = useRef(null);
    const parentRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });
    const nextIdRef = useRef(0);

    // Stocker les dimensions initiales pour la mise à l'échelle
    const initialDimensionsRef = useRef({
        cellSize: size,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
    });

    // Obtenir la référence au parent
    useEffect(() => {
        if (cacheRef.current && isSource) {
            parentRef.current = cacheRef.current.parentElement;
        }
    }, [isSource]);

    // Mettre à jour la position si les coordonnées initiales changent
    useEffect(() => {
        if (isSource) {
            setPosition({ x: initialX, y: initialY });
        }
    }, [initialX, initialY, isSource]);

    // Fonction pour vérifier si les coordonnées sont au-dessus de la poubelle
    const isOverTrash = useCallback((x, y) => {
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
    }, []);

    // Mettre à jour les dimensions des clones lors d'un redimensionnement
    useEffect(() => {
        if (!dimensionsContext || clones.length === 0) return;

        // Calculer le facteur d'échelle
        const scaleFactorX =
            window.innerWidth / initialDimensionsRef.current.windowWidth;
        const scaleFactorY =
            window.innerHeight / initialDimensionsRef.current.windowHeight;

        // Mettre à jour les positions des clones
        setClones((prevClones) =>
            prevClones.map((clone) => ({
                ...clone,
                // Mettre à l'échelle les positions en fonction du redimensionnement de la fenêtre
                x: clone.originalX ? clone.originalX * scaleFactorX : clone.x,
                y: clone.originalY ? clone.originalY * scaleFactorY : clone.y,
            }))
        );
    }, [dimensionsContext, window.innerWidth, window.innerHeight]);

    // Fonction pour gérer la fin d'un glisser-déposer
    const handleDragEnd = useCallback(
        (clientX, clientY) => {
            if (!isDragging) return;

            // Vérifier si on a déposé sur la poubelle
            if (isOverTrash(clientX, clientY)) {
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
                const newX = clientX - offset.current.x;
                const newY = clientY - offset.current.y;

                // Stocker les positions normalisées pour la mise à l'échelle
                const normalizedX = newX / window.innerWidth;
                const normalizedY = newY / window.innerHeight;

                setClones((prev) => [
                    ...prev,
                    {
                        id: newId,
                        x: newX,
                        y: newY,
                        color: color,
                        originalX: newX,
                        originalY: newY,
                        normalizedX,
                        normalizedY,
                    },
                ]);
            }

            // Si c'est une source, revenir à la position initiale
            if (isSource) {
                setPosition({ x: initialX, y: initialY });
            }

            setIsDragging(false);
            document.body.style.cursor = "default";
        },
        [isDragging, isSource, color, initialX, initialY, isOverTrash]
    );

    // Gestionnaire pour souris
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            // Calculer la nouvelle position en tenant compte du décalage
            const newX = e.clientX - offset.current.x;
            const newY = e.clientY - offset.current.y;

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = (e) => {
            handleDragEnd(e.clientX, e.clientY);
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
            if (!isDragging) {
                document.body.style.cursor = "default";
            }
        };
    }, [isDragging, handleDragEnd]);

    // Gestionnaires d'événements souris
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

    // Gestionnaires d'événements tactiles
    const handleTouchStart = (e) => {
        if (!cacheRef.current) return;

        // Empêcher le comportement par défaut comme le défilement
        e.preventDefault();
        e.stopPropagation();

        // Récupérer le premier point de contact
        const touch = e.touches[0];

        // Calculer le décalage entre le toucher et le coin de l'élément
        const rect = cacheRef.current.getBoundingClientRect();
        offset.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };

        setIsDragging(true);

        // S'assurer que l'élément est au-dessus des autres
        if (cacheRef.current) {
            cacheRef.current.style.zIndex = "1000";
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;

        // Empêcher le défilement pendant le glissement
        e.preventDefault();

        // Obtenir les coordonnées du toucher
        const touch = e.touches[0];

        // Calculer la nouvelle position
        const newX = touch.clientX - offset.current.x;
        const newY = touch.clientY - offset.current.y;

        setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = (e) => {
        if (!isDragging) return;

        // Si nous avons des changements (touches restantes), utiliser leur position
        // Sinon utiliser la dernière position connue
        let clientX, clientY;

        if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            // Utiliser la position actuelle comme fallback
            const rect = cacheRef.current.getBoundingClientRect();
            clientX = rect.left + rect.width / 2;
            clientY = rect.top + rect.height / 2;
        }

        handleDragEnd(clientX, clientY);
    };

    // Utiliser les dimensions actuelles du contexte
    const currentSize = dimensionsContext ? dimensionsContext.cellSize : size;

    // Rendu des clones (uniquement si c'est une source)
    const cloneElements = isSource
        ? clones.map((clone) => (
              <DraggableCache
                  key={clone.id}
                  color={clone.color}
                  size={currentSize}
                  initialX={clone.x}
                  initialY={clone.y}
                  isSource={false}
                  dimensionsContext={dimensionsContext}
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
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: "fixed", // Utiliser fixed pour se positionner par rapport au viewport
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${currentSize}px`,
                    height: `${currentSize}px`,
                    boxShadow: isDragging
                        ? "0 8px 16px rgba(0,0,0,0.5)"
                        : "0 4px 8px rgba(0,0,0,0.3)",
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none", // Important pour éviter les comportements par défaut sur mobile
                    zIndex: isDragging ? 1000 : isSource ? 100 : 500,
                    transition: isDragging
                        ? "none"
                        : "box-shadow 0.2s, transform 0.2s",
                    transform: isDragging ? "scale(1.05)" : "scale(1)",
                    transformOrigin: "center",
                    pointerEvents: "auto", // S'assurer que l'élément capture les événements souris
                    userSelect: "none",
                    WebkitUserSelect: "none", // Pour Safari
                    WebkitTouchCallout: "none", // Désactiver le menu contextuel sur iOS
                }}
                title={
                    isSource
                        ? "Glisser pour créer un cache"
                        : "Glisser ou déposer dans la poubelle pour supprimer"
                }
                aria-label={
                    isSource
                        ? `Cache ${color} - glisser pour créer`
                        : `Cache ${color} - glisser ou déposer dans la poubelle pour supprimer`
                }
                role="button"
                tabIndex={0} // Permettre la navigation au clavier
            >
                <Cache color={color} size={currentSize} />
            </div>
            {cloneElements}
        </>
    );
}

export default DraggableCache;

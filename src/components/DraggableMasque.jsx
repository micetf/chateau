import React, { useState, useRef, useEffect, useCallback } from "react";
import Masque from "./Masque";

function DraggableMasque({
    cellSize,
    initialX,
    initialY,
    isSource = false,
    ordre = "99-0",
    isSidebarItem = false,
}) {
    // Garantir que la taille du cellSize est raisonnable pour éviter un masque trop grand
    const adjustedCellSize = Math.min(cellSize, 50);
    const masqueSize = adjustedCellSize * 3;

    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [clones, setClones] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    const masqueRef = useRef(null);
    const parentRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });
    const nextIdRef = useRef(0);
    const [absolutePosition, setAbsolutePosition] = useState({ x: 0, y: 0 });

    // Obtenir la référence au parent
    useEffect(() => {
        if (masqueRef.current && isSource) {
            parentRef.current = masqueRef.current.parentElement;
        }
    }, [isSource]);

    // Calculer la position absolue initiale lorsque le composant est monté
    useEffect(() => {
        if (masqueRef.current && isSource && isSidebarItem) {
            const rect = masqueRef.current.getBoundingClientRect();
            const parentRect =
                masqueRef.current.parentElement.getBoundingClientRect();

            // Positionner au centre du parent
            const centerX =
                parentRect.left + (parentRect.width - masqueSize) / 2;
            const centerY =
                parentRect.top + (parentRect.height - masqueSize) / 2;

            setAbsolutePosition({ x: centerX, y: centerY });
        }
    }, [isSource, isSidebarItem, masqueSize]);

    // Mettre à jour la position si la position absolue change
    useEffect(() => {
        if (isSource && !isDragging) {
            setPosition({ x: absolutePosition.x, y: absolutePosition.y });
        }
    }, [absolutePosition, isSource, isDragging]);

    // Mettre à jour la position si les coordonnées initiales changent
    useEffect(() => {
        if (!isSource && !isDragging) {
            setPosition({ x: initialX, y: initialY });
        }
    }, [initialX, initialY, isSource, isDragging]);

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

    // Fonction commune pour gérer la fin d'un glisser-déposer
    const handleDragEnd = useCallback(
        (clientX, clientY) => {
            if (!isDragging) return;

            // Vérifier si on a déposé sur la poubelle
            if (isOverTrash(clientX, clientY)) {
                if (!isSource) {
                    // Si ce n'est pas une source, on le supprime
                    if (masqueRef.current) {
                        // Animation de suppression
                        masqueRef.current.classList.add("deleting");
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

                setClones((prev) => [
                    ...prev,
                    {
                        id: newId,
                        x: newX,
                        y: newY,
                    },
                ]);
            }

            // Si c'est une source, revenir à la position initiale
            if (isSource) {
                setPosition(absolutePosition);
            }

            setIsDragging(false);
            document.body.style.cursor = "default";
        },
        [isDragging, isSource, absolutePosition, isOverTrash]
    );

    // Gestionnaires d'événements souris
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

    // Gérer le redimensionnement de la fenêtre
    useEffect(() => {
        const handleResize = () => {
            if (masqueRef.current && isSource && isSidebarItem) {
                const parentRect =
                    masqueRef.current.parentElement.getBoundingClientRect();

                // Recalculer le centrage
                const centerX =
                    parentRect.left + (parentRect.width - masqueSize) / 2;
                const centerY =
                    parentRect.top + (parentRect.height - masqueSize) / 2;

                setAbsolutePosition({ x: centerX, y: centerY });
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isSource, isSidebarItem, masqueSize]);

    // Gestionnaire d'événement souris
    const handleMouseDown = (e) => {
        if (!masqueRef.current) return;

        e.preventDefault(); // Empêcher la sélection de texte
        e.stopPropagation(); // Empêcher la propagation vers des éléments parents

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

    // Gestionnaires d'événements tactiles
    const handleTouchStart = (e) => {
        if (!masqueRef.current) return;

        // Empêcher le comportement par défaut comme le défilement
        e.preventDefault();
        e.stopPropagation();

        // Récupérer le premier point de contact
        const touch = e.touches[0];

        // Calculer le décalage entre le toucher et le coin de l'élément
        const rect = masqueRef.current.getBoundingClientRect();
        offset.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };

        setIsDragging(true);

        // S'assurer que l'élément est au-dessus des autres
        if (masqueRef.current) {
            masqueRef.current.style.zIndex = "1000";
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
            const rect = masqueRef.current.getBoundingClientRect();
            clientX = rect.left + rect.width / 2;
            clientY = rect.top + rect.height / 2;
        }

        handleDragEnd(clientX, clientY);
    };

    // Rendu des clones (uniquement si c'est une source)
    const cloneElements = isSource
        ? clones.map((clone) => (
              <DraggableMasque
                  key={clone.id}
                  cellSize={adjustedCellSize}
                  initialX={clone.x}
                  initialY={clone.y}
                  isSource={false}
                  ordre={ordre}
              />
          ))
        : null;

    // Si l'élément a été supprimé, ne rien rendre
    if (!isVisible) return null;

    return (
        <>
            <div
                ref={masqueRef}
                className="draggable-masque"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: "fixed", // Utiliser fixed pour se positionner par rapport au viewport
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    width: `${masqueSize}px`,
                    height: `${masqueSize}px`,
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
                        ? "Glisser pour créer un masque"
                        : "Glisser ou déposer dans la poubelle pour supprimer"
                }
                aria-label={
                    isSource
                        ? `Masque d'opérations - glisser pour créer`
                        : `Masque d'opérations - glisser ou déposer dans la poubelle pour supprimer`
                }
                role="button"
                tabIndex={0} // Permettre la navigation au clavier
            >
                <Masque
                    ordre={ordre}
                    size={adjustedCellSize}
                    baseColor="#FFFF99"
                    accentColor="#FFEE66"
                />
            </div>
            {cloneElements}
        </>
    );
}

export default DraggableMasque;

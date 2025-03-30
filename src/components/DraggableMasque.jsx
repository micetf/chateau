import React, { useState, useRef, useEffect, useCallback } from "react";
import Masque from "./Masque";
import { useChateauContext } from "../contexts/ChateauContext";

function DraggableMasque({
    cellSize: propCellSize,
    initialX,
    initialY,
    isSource = false,
    ordre: propOrdre,
    isSidebarItem = false,
    id: propId = null, // ID optionnel passé en prop
}) {
    // Utiliser le contexte
    const {
        cellSize: contextCellSize,
        masqueSize: contextMasqueSize,
        ordre: contextOrdre,
        addMasque,
        moveMasque,
        removeMasque,
    } = useChateauContext();

    // Utiliser l'ordre du contexte si non spécifié en prop
    const activeOrdre = propOrdre || contextOrdre;

    // Utiliser les dimensions du contexte ou les props par défaut
    const currentCellSize = contextCellSize || propCellSize;
    const activeMasqueSize = contextMasqueSize || currentCellSize * 3;

    // États locaux pour le drag-and-drop
    const [position, setPosition] = useState({ x: initialX, y: initialY });
    const [isDragging, setIsDragging] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    // Références
    const masqueRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });

    // Générer un ID unique pour cet élément
    const [id] = useState(
        propId || (isSource ? "source-masque" : `masque-${Date.now()}`)
    );

    // Synchroniser les positions initiales uniquement lors du montage ou si c'est une source
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

    // Fonction pour gérer la fin d'un glisser-déposer
    const handleDragEnd = useCallback(
        (clientX, clientY) => {
            if (!isDragging) return;

            // Calculer la nouvelle position
            const newX = clientX - offset.current.x;
            const newY = clientY - offset.current.y;

            // Vérifier si on a déposé sur la poubelle
            if (isOverTrash(clientX, clientY)) {
                if (!isSource) {
                    // Si ce n'est pas une source, on le supprime
                    if (masqueRef.current) {
                        // Animation de suppression
                        masqueRef.current.classList.add("deleting");
                        setTimeout(() => {
                            setIsVisible(false);
                            removeMasque(id);
                        }, 300);
                    } else {
                        setIsVisible(false);
                        removeMasque(id);
                    }
                }
            } else if (isDragging && isSource) {
                // Si c'est une source et qu'on n'est pas sur la poubelle, créer un nouveau masque
                // Ajouter le masque à l'état global via le contexte
                addMasque(newX, newY);

                // Revenir à la position initiale
                setPosition({ x: initialX, y: initialY });
            } else if (!isSource) {
                // Si ce n'est pas une source et qu'on n'est pas sur la poubelle,
                // mettre à jour sa position dans l'état local et global
                setPosition({ x: newX, y: newY });
                moveMasque(id, newX, newY);
            }

            setIsDragging(false);
            document.body.style.cursor = "default";
        },
        [
            isDragging,
            isSource,
            initialX,
            initialY,
            isOverTrash,
            addMasque,
            moveMasque,
            removeMasque,
            id,
        ]
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

    // Si l'élément a été supprimé, ne rien rendre
    if (!isVisible) return null;

    return (
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
                width: `${activeMasqueSize}px`,
                height: `${activeMasqueSize}px`,
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
            data-masque-id={id} // Ajouter un attribut de données pour faciliter la sélection
        >
            <Masque ordre={activeOrdre} size={currentCellSize} />
        </div>
    );
}

export default DraggableMasque;

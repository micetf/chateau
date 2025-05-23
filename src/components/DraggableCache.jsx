import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import Cache from "./Cache";
import { useChateauContext } from "../contexts/ChateauContext";

const DraggableCache = memo(
    function DraggableCache({
        color,
        size,
        initialX,
        initialY,
        isSource = false,
        isSidebarItem = false,
        id: propId = null, // ID optionnel passé en prop
    }) {
        // Utiliser le contexte
        const { cellSize, addCache, moveCache, removeCache } =
            useChateauContext();

        // États locaux pour le drag-and-drop
        const [position, setPosition] = useState({ x: initialX, y: initialY });
        const [isDragging, setIsDragging] = useState(false);
        const [isVisible, setIsVisible] = useState(true);

        // Références
        const cacheRef = useRef(null);
        const offset = useRef({ x: 0, y: 0 });

        // Générer un ID unique pour cet élément
        const [id] = useState(
            propId || (isSource ? `source-${color}` : `cache-${Date.now()}`)
        );

        // Mettre à jour la position lorsque les coordonnées initiales changent
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
                        // Animation de suppression
                        if (cacheRef.current) {
                            cacheRef.current.classList.add("deleting");
                            setTimeout(() => {
                                setIsVisible(false);
                                removeCache(id);
                            }, 300);
                        } else {
                            setIsVisible(false);
                            removeCache(id);
                        }
                    }
                } else if (isDragging && isSource) {
                    // Si c'est une source et qu'on n'est pas sur la poubelle, créer un nouveau cache
                    // Ajouter le cache à l'état global via le contexte
                    addCache(color, newX, newY);

                    // Revenir à la position initiale
                    setPosition({ x: initialX, y: initialY });
                } else if (!isSource) {
                    // Si ce n'est pas une source et qu'on n'est pas sur la poubelle,
                    // mettre à jour sa position dans l'état local et global
                    setPosition({ x: newX, y: newY });
                    moveCache(id, newX, newY);
                }

                setIsDragging(false);
                document.body.style.cursor = "default";
            },
            [
                isDragging,
                isSource,
                color,
                initialX,
                initialY,
                isOverTrash,
                addCache,
                moveCache,
                removeCache,
                id,
            ]
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

        // Utiliser la taille du contexte ou celle passée en prop
        const currentSize = cellSize || size;

        // Si l'élément a été supprimé, ne rien rendre
        if (!isVisible) return null;

        return (
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
                data-cache-id={id} // Ajouter un attribut de données pour faciliter la sélection
            >
                <Cache color={color} size={currentSize} />
            </div>
        );
    },
    (prevProps, nextProps) => {
        // Fonction de comparaison personnalisée pour optimiser les re-rendus
        // Si elle retourne true, le composant ne sera pas re-rendu
        return (
            prevProps.color === nextProps.color &&
            prevProps.size === nextProps.size &&
            prevProps.initialX === nextProps.initialX &&
            prevProps.initialY === nextProps.initialY &&
            prevProps.isSource === nextProps.isSource &&
            prevProps.id === nextProps.id &&
            // Pour les sources, on vérifie uniquement si la position a changé significativement
            // pour éviter des re-rendus à chaque pixel
            !(
                prevProps.isSource &&
                Math.abs(prevProps.initialX - nextProps.initialX) > 1
            ) &&
            !(
                prevProps.isSource &&
                Math.abs(prevProps.initialY - nextProps.initialY) > 1
            )
        );
    }
);

export default DraggableCache;

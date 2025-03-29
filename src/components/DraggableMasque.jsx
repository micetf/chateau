import { useState, useEffect, useRef, forwardRef } from "react";
import Draggable from "react-draggable";
import { createMasqueImage } from "../utils/imageUtils";

// Composant d'élément déplaçable avec ref forwarding
const DraggableItem = forwardRef(({ children, ...props }, ref) => {
    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    );
});

// Composant d'élément draggable avec sa propre référence
const DraggableMasqueItem = ({
    initialPosition,
    cellSize,
    imageUrl,
    itemId,
    onDragStop,
    bounds,
}) => {
    const nodeRef = useRef(null);

    return (
        <Draggable
            defaultPosition={initialPosition}
            onStop={(e, ui) => onDragStop(e, ui, itemId)}
            bounds={bounds}
            nodeRef={nodeRef}
        >
            <DraggableItem
                ref={nodeRef}
                className="absolute cursor-pointer z-10 shadow-lg"
                style={{
                    width: `${cellSize * 3}px`,
                    height: `${cellSize * 3}px`,
                    border: "2px solid black",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                }}
            >
                <img
                    src={imageUrl}
                    alt={`masque${itemId !== undefined ? `-${itemId}` : ""}`}
                    width={cellSize * 3}
                    height={cellSize * 3}
                    style={{ display: "block" }}
                />
            </DraggableItem>
        </Draggable>
    );
};

// Composant principal à exporter
const DraggableMasque = ({
    ordre,
    cellSize,
    headerHeight,
    sectionHeight,
    chateauWidth,
    windowWidth,
}) => {
    const [masqueItems, setMasqueItems] = useState([]);
    const [masqueImageUrl, setMasqueImageUrl] = useState("");
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const nextIdRef = useRef(0);

    // Calculer la position initiale et la mettre à jour lorsque les dimensions changent
    useEffect(() => {
        if (cellSize > 0 && windowWidth > 0 && chateauWidth > 0) {
            // Position du bord gauche du château (centré)
            const chateauLeftEdge = (windowWidth - chateauWidth) / 2;
            // Position du bord droit du château
            const chateauRightEdge = chateauLeftEdge + chateauWidth;

            // Taille du masque (3x cellSize)
            const masqueWidth = cellSize * 3;

            // Positionnement à droite, avec marge de sécurité pour éviter de sortir de l'écran
            const x = Math.min(
                windowWidth - masqueWidth - 20, // Ne pas dépasser l'écran
                chateauRightEdge + 20 // Juste à droite du château avec une marge
            );

            const newPosition = {
                x,
                y: 10 + sectionHeight / 3,
            };

            console.log("Position du masque calculée:", {
                windowWidth,
                chateauWidth,
                chateauLeftEdge,
                chateauRightEdge,
                position: newPosition,
            });

            setInitialPosition(newPosition);

            // Vider les éléments créés dynamiquement lors d'un changement majeur de taille
            if (masqueItems.length > 0) {
                const currentPos = initialPosition;
                if (Math.abs(currentPos.x - x) > cellSize) {
                    console.log(
                        "Redimensionnement majeur détecté, réinitialisation des masques"
                    );
                    setMasqueItems([]);
                }
            }
        }
    }, [
        windowWidth,
        chateauWidth,
        cellSize,
        sectionHeight,
        masqueItems.length,
    ]);

    // Créer l'image du masque quand l'ordre ou la taille change
    useEffect(() => {
        const generateMasqueImage = () => {
            if (!ordre) {
                console.error(`Masque: ordre invalide (${ordre})`);
                return;
            }

            if (!cellSize || cellSize <= 0) {
                console.warn(
                    `Masque: taille invalide (${cellSize}), nouvel essai après redimensionnement`
                );
                return;
            }

            console.log(
                `Création du masque avec ordre=${ordre}, cellSize=${cellSize}`
            );

            try {
                // Fallback direct au cas où la fonction utilitaire échoue
                const canvas = document.createElement("canvas");
                const width = cellSize * 3;
                const height = cellSize * 3;
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    console.error(
                        `Masque: impossible d'obtenir le contexte 2D`
                    );
                    return;
                }

                // Configuration du style
                ctx.fillStyle = "#FFFF00";
                ctx.lineWidth = 4;
                ctx.strokeStyle = "black";

                // Fonction pour dessiner une zone
                const drawZone = (x, y, text = "") => {
                    ctx.fillRect(x, y, cellSize, cellSize);
                    ctx.strokeRect(x, y, cellSize, cellSize);

                    if (text) {
                        ctx.save();
                        ctx.fillStyle = "black";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "middle";
                        const fontSize = Math.max(12, Math.floor(cellSize / 3));
                        ctx.font = `bold ${fontSize}px Arial`;
                        ctx.fillText(text, x + cellSize / 2, y + cellSize / 2);
                        ctx.restore();
                    }
                };

                // Dessiner les cellules
                // Première ligne
                drawZone(0, 0);
                drawZone(cellSize, 0, ordre === "0-99" ? "+10" : "-10");
                drawZone(2 * cellSize, 0);

                // Ligne du milieu
                drawZone(0, cellSize, "-1");
                // Zone centrale
                ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
                ctx.strokeRect(cellSize, cellSize, cellSize, cellSize);
                drawZone(2 * cellSize, cellSize, "+1");

                // Dernière ligne
                drawZone(0, 2 * cellSize);
                drawZone(
                    cellSize,
                    2 * cellSize,
                    ordre === "0-99" ? "-10" : "+10"
                );
                drawZone(2 * cellSize, 2 * cellSize);

                try {
                    const url = canvas.toDataURL("image/png");
                    console.log(
                        `Masque: image créée avec succès, début URL:`,
                        url.substring(0, 30) + "..."
                    );
                    setMasqueImageUrl(url);
                } catch (e) {
                    console.error(
                        `Masque: erreur lors de la conversion en URL:`,
                        e
                    );
                }
            } catch (error) {
                console.error(`Masque: erreur générale:`, error);
            }
        };

        // Essayer de générer l'image seulement si les dimensions sont disponibles
        if (cellSize > 0) {
            generateMasqueImage();
        }
    }, [ordre, cellSize]);

    // Vérifier si un item est dans la poubelle
    const isInTrash = (position) => {
        return (
            position.x <= cellSize &&
            position.y + cellSize * 3 > sectionHeight - cellSize
        );
    };

    // Gérer l'arrêt du drag
    const handleDragStop = (e, ui, id) => {
        const position = { x: ui.x, y: ui.y };

        if (isInTrash(position)) {
            // Supprimer l'élément
            setMasqueItems((prev) => prev.filter((item) => item.id !== id));
        }
    };

    // Créer un nouvel élément
    const createNewItem = () => {
        if (!masqueImageUrl) return;

        const newItem = {
            id: nextIdRef.current,
            x: initialPosition.x,
            y: initialPosition.y,
        };

        nextIdRef.current += 1;
        setMasqueItems((prev) => [...prev, newItem]);
    };

    // Conditions de rendu plus verbeuses pour diagnostiquer les problèmes
    if (!masqueImageUrl) {
        console.log("Pas de rendu du masque: URL d'image vide");
        return null;
    }

    if (cellSize <= 0) {
        console.log("Pas de rendu du masque: cellSize <= 0");
        return null;
    }

    console.log("Rendu du masque avec position:", initialPosition);

    return (
        <>
            {/* Élément original qui sert de "fabrique" */}
            <DraggableMasqueItem
                initialPosition={initialPosition}
                cellSize={cellSize}
                imageUrl={masqueImageUrl}
                onDragStop={() => createNewItem()}
                bounds="parent"
            />

            {/* Éléments créés dynamiquement */}
            {masqueItems.map((item) => (
                <DraggableMasqueItem
                    key={item.id}
                    initialPosition={{ x: item.x, y: item.y }}
                    cellSize={cellSize}
                    imageUrl={masqueImageUrl}
                    itemId={item.id}
                    onDragStop={handleDragStop}
                    bounds="parent"
                />
            ))}
        </>
    );
};

// Exportations
export { DraggableMasque };
export default DraggableMasque;

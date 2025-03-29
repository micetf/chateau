import { useState, useEffect, useRef } from "react";
import Chateau from "./components/Chateau";
import Header from "./components/Header";
import ContactLink from "./components/ContactLink";
import PaypalButton from "./components/PaypalButton";
import DraggableCache from "./components/DraggableCache";
import DraggableMasque from "./components/DraggableMasque";
import HelpOverlay from "./components/HelpOverlay";
import Trash from "./components/Trash";

function App() {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const headerRef = useRef(null);
    const leftColumnRef = useRef(null);
    const rightColumnRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [chateauDimensions, setChateauDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [cellSize, setCellSize] = useState(0);
    const [ordre, setOrdre] = useState("99-0");
    const [showHelp, setShowHelp] = useState(false);

    // États pour les positions des éléments
    const [cachePositions, setCachePositions] = useState([]);
    const [masquePosition, setMasquePosition] = useState({ x: 0, y: 0 });

    // Couleurs des caches
    const cacheColors = ["#FF9117", "#B33514", "#FF5700", "#0079B3", "#00FFEA"];

    // Gestion du redimensionnement de la fenêtre
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Mise à jour des dimensions après le rendu
    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [windowSize]);

    // Gérer le chargement de l'image du château
    const handleChateauLoad = (width) => {
        if (!width || typeof width !== "number" || width <= 0) {
            console.warn(
                "Largeur invalide reçue:",
                width,
                "- utilisation d'une valeur par défaut"
            );
            width = 867; // Valeur par défaut si la largeur est invalide
        }

        console.log("Château chargé avec une largeur de:", width);

        // Calculer les dimensions du château
        const maxHeight = windowSize.height - headerHeight - 40;
        const aspectRatio = 65.03 / 86.7; // Rapport hauteur/largeur du SVG original
        const height = Math.min(maxHeight, width * aspectRatio);
        const adjustedWidth = height / aspectRatio;

        setChateauDimensions({
            width: adjustedWidth,
            height: height,
        });

        // Calculer la taille d'une cellule en fonction de la taille du château
        const newCellSize = Math.max(
            30,
            Math.round((adjustedWidth / width) * 50)
        );
        setCellSize(newCellSize);

        // Forcer un recalcul des positions après un court délai pour s'assurer que
        // les dimensions des colonnes sont correctement mises à jour
        setTimeout(() => {
            if (leftColumnRef.current && rightColumnRef.current) {
                // Déclencher un recalcul forcé des positions
                setWindowSize((prev) => ({ ...prev }));
            }
        }, 100);
    };

    // Calcul des positions des caches et du masque après chaque mise à jour de dimensions
    // Utilisez useEffect au lieu de useLayoutEffect pour éviter la boucle infinie
    useEffect(() => {
        // Ne calculer les positions que si toutes les références et dimensions sont disponibles
        if (
            !leftColumnRef.current ||
            !rightColumnRef.current ||
            cellSize <= 0 ||
            !chateauDimensions.width
        ) {
            return;
        }

        // Calculer les positions des caches
        const leftColumnRect = leftColumnRef.current.getBoundingClientRect();

        // Hauteur totale occupée par tous les caches (5 caches contigus)
        const totalCachesHeight = cellSize * cacheColors.length;

        // Position de départ pour centrer verticalement l'ensemble des caches
        const startY =
            leftColumnRect.top +
            (leftColumnRect.height - totalCachesHeight) / 2;

        // Calcul de la position horizontale (centre de la colonne)
        const centerX =
            leftColumnRect.left + (leftColumnRect.width - cellSize) / 2;

        // Calculer la position de chaque cache
        const positions = cacheColors.map((_, index) => {
            return {
                x: centerX,
                y: startY + index * cellSize, // Positionnement contigu
            };
        });

        // Ne mettre à jour l'état que si les positions ont changé
        if (JSON.stringify(positions) !== JSON.stringify(cachePositions)) {
            setCachePositions(positions);
        }

        // Calculer la position du masque
        const rightColumnRect = rightColumnRef.current.getBoundingClientRect();
        const masqueSize = cellSize * 3;

        // Calculer le centre de la colonne droite
        const masqueCenterX =
            rightColumnRect.left + (rightColumnRect.width - masqueSize) / 2;
        const masqueCenterY =
            rightColumnRect.top + (rightColumnRect.height - masqueSize) / 2;

        const newMasquePosition = { x: masqueCenterX, y: masqueCenterY };

        // Ne mettre à jour l'état que si la position a changé
        if (
            JSON.stringify(newMasquePosition) !== JSON.stringify(masquePosition)
        ) {
            setMasquePosition(newMasquePosition);
        }
    }, [windowSize, cellSize, chateauDimensions, headerHeight]);

    // Toggle de l'ordre des nombres (0-99 ou 99-0)
    const toggleOrdre = () => {
        setOrdre((prev) => (prev === "0-99" ? "99-0" : "0-99"));
    };

    // Toggle pour l'aide
    const toggleHelp = () => {
        setShowHelp((prev) => !prev);
    };

    // Calcul de la hauteur disponible pour le contenu principal
    const mainHeight = windowSize.height - headerHeight;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header avec navigation et boutons */}
            <Header ref={headerRef} />

            {/* Contenu principal */}
            <main
                className="flex flex-1 relative overflow-hidden"
                style={{
                    height: `${mainHeight}px`,
                }}
            >
                {/* Structure à trois colonnes */}
                <div className="flex w-full h-full">
                    {/* Colonne gauche - Caches (sans titre) */}
                    <div
                        ref={leftColumnRef}
                        className="flex items-center justify-center"
                        style={{
                            width:
                                chateauDimensions.width > 0
                                    ? `calc((100% - ${chateauDimensions.width}px) / 2)`
                                    : "20%",
                            backgroundColor: "rgba(26, 53, 64, 0.3)",
                            borderRight: "2px dashed rgba(242, 220, 179, 0.5)",
                            minWidth: "100px",
                            position: "relative",
                            zIndex: 50,
                        }}
                    >
                        {/* Les caches - positionnés au centre, empilés verticalement */}
                        {cellSize > 0 &&
                            cachePositions.length === cacheColors.length &&
                            cacheColors.map((color, index) => (
                                <DraggableCache
                                    key={`cache-source-${index}`}
                                    color={color}
                                    size={cellSize}
                                    initialX={cachePositions[index].x}
                                    initialY={cachePositions[index].y}
                                    isSource={true}
                                    isSidebarItem={true}
                                />
                            ))}
                    </div>

                    {/* Colonne centrale - Château */}
                    <div
                        className="flex items-center justify-center"
                        style={{
                            width:
                                chateauDimensions.width > 0
                                    ? `${chateauDimensions.width}px`
                                    : "60%",
                            zIndex: 10,
                            position: "relative",
                        }}
                    >
                        <Chateau
                            ordre={ordre}
                            height={mainHeight - 40}
                            onLoad={handleChateauLoad}
                        />
                    </div>

                    {/* Colonne droite - Masque (sans titre) */}
                    <div
                        ref={rightColumnRef}
                        className="flex items-center justify-center"
                        style={{
                            width:
                                chateauDimensions.width > 0
                                    ? `calc((100% - ${chateauDimensions.width}px) / 2)`
                                    : "20%",
                            backgroundColor: "rgba(26, 53, 64, 0.3)",
                            borderLeft: "2px dashed rgba(242, 220, 179, 0.5)",
                            minWidth: "100px",
                            position: "relative",
                            zIndex: 50,
                        }}
                    >
                        {/* Le masque - positionné au centre */}
                        {cellSize > 0 && masquePosition.x > 0 && (
                            <DraggableMasque
                                cellSize={cellSize}
                                initialX={masquePosition.x}
                                initialY={masquePosition.y}
                                isSource={true}
                                ordre={ordre}
                                isSidebarItem={true}
                            />
                        )}
                    </div>
                </div>

                {/* Boutons flottants en position fixe */}
                <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-3 z-50">
                    {/* Sélecteur d'ordre */}
                    <button
                        onClick={toggleOrdre}
                        className="bg-header hover:bg-opacity-80 text-text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors border border-text-secondary shadow-md"
                        title="Changer l'ordre de numérotation"
                    >
                        Ordre: {ordre}
                    </button>

                    {/* Bouton d'aide */}
                    <button
                        onClick={toggleHelp}
                        className="bg-header hover:bg-opacity-80 text-text-primary w-10 h-10 rounded-full text-lg font-bold transition-colors border border-text-secondary shadow-md flex items-center justify-center"
                        title="Afficher l'aide"
                    >
                        ?
                    </button>
                </div>
            </main>

            {/* Composants utilitaires */}
            <Trash />
            <ContactLink />
            <PaypalButton />

            {/* Aide conditionnelle */}
            {showHelp && <HelpOverlay onClose={toggleHelp} />}
        </div>
    );
}

export default App;

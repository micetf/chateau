import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
    const [cellDimensions, setCellDimensions] = useState(null);
    const [ordre, setOrdre] = useState("99-0");
    const [showHelp, setShowHelp] = useState(false);

    // États dérivés pour la responsivité
    const isMobile = useMemo(() => windowSize.width < 768, [windowSize.width]);
    const isPortrait = useMemo(
        () => windowSize.height > windowSize.width,
        [windowSize]
    );

    // États pour les positions des éléments
    const [cachePositions, setCachePositions] = useState([]);
    const [masquePosition, setMasquePosition] = useState({ x: 0, y: 0 });

    // Couleurs des caches
    const cacheColors = ["#B33514", "#FF9117", "#FF5700", "#0079B3", "#00FFEA"];

    // Gestionnaire de redimensionnement optimisé
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        const debouncedResize = () => {
            clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(handleResize, 100);
        };

        window.addEventListener("resize", debouncedResize);
        handleResize(); // Initial call

        return () => {
            clearTimeout(window.resizeTimeout);
            window.removeEventListener("resize", debouncedResize);
        };
    }, []);

    // Mise à jour de la hauteur du header
    useEffect(() => {
        if (headerRef.current) {
            const height = headerRef.current.offsetHeight;
            setHeaderHeight(height);
        }
    }, [windowSize]);

    // Calcul optimisé du layout
    const layoutStyle = useMemo(() => {
        const mainHeight = windowSize.height - headerHeight;

        if (isPortrait && isMobile) {
            // Calcul des hauteurs en mode portrait
            const topRowHeight = Math.max(80, cellSize + 20);
            const bottomRowHeight = Math.max(100, cellSize * 3 + 20);
            const mainAreaHeight = mainHeight - topRowHeight - bottomRowHeight;

            return {
                flexDirection: "column",
                topRowHeight,
                bottomRowHeight,
                mainAreaHeight,
                mainHeight,
            };
        } else {
            // Mode paysage standard
            return {
                flexDirection: "row",
                mainHeight,
            };
        }
    }, [isPortrait, isMobile, cellSize, windowSize.height, headerHeight]);

    // Gestionnaire de chargement du château optimisé
    const handleChateauLoad = useCallback(
        (width, cellData) => {
            if (!width || typeof width !== "number" || width <= 0) {
                console.warn(
                    "Largeur invalide reçue:",
                    width,
                    "- utilisation d'une valeur par défaut"
                );
                width = 867; // Valeur par défaut
            }

            // Stocker les dimensions des cellules
            if (cellData) {
                setCellDimensions(cellData);
            }

            // Calcul des dimensions du château
            const maxHeight = windowSize.height - headerHeight - 40;
            const maxWidth = isPortrait
                ? windowSize.width * 0.9
                : windowSize.width * 0.6;

            const aspectRatio = 65.03 / 86.7; // Rapport hauteur/largeur du SVG

            // Calcul des dimensions optimales
            let adjustedWidth, height;

            if (isPortrait) {
                adjustedWidth = Math.min(maxWidth, width);
                height = adjustedWidth * aspectRatio;

                if (height > maxHeight) {
                    height = maxHeight;
                    adjustedWidth = height / aspectRatio;
                }
            } else {
                height = Math.min(maxHeight, width * aspectRatio);
                adjustedWidth = height / aspectRatio;

                if (adjustedWidth > maxWidth) {
                    adjustedWidth = maxWidth;
                    height = adjustedWidth * aspectRatio;
                }
            }

            setChateauDimensions({
                width: adjustedWidth,
                height,
            });

            // Calcul de la taille d'une cellule
            let newCellSize;

            if (cellData && cellData.averageSize) {
                const scaleFactor = adjustedWidth / width;
                newCellSize = Math.ceil(cellData.averageSize * scaleFactor);

                newCellSize = Math.min(
                    Math.max(24, newCellSize),
                    isMobile ? 40 : 60
                );
            } else {
                newCellSize = Math.min(
                    Math.max(24, Math.round((adjustedWidth / width) * 50)),
                    isMobile ? 40 : 60
                );
            }

            setCellSize(newCellSize);

            // Recalcul après délai pour laisser le DOM se mettre à jour
            requestAnimationFrame(() => {
                if (leftColumnRef.current && rightColumnRef.current) {
                    calculatePositions();
                }
            });
        },
        [windowSize, headerHeight, isPortrait, isMobile]
    );

    // Fonction séparée pour calculer les positions des éléments
    const calculatePositions = useCallback(() => {
        if (
            !leftColumnRef.current ||
            !rightColumnRef.current ||
            cellSize <= 0
        ) {
            return;
        }

        // Calcul des positions des caches
        const leftColumnRect = leftColumnRef.current.getBoundingClientRect();
        const spacing = Math.max(5, Math.round(cellSize * 0.1));

        if (isPortrait && isMobile) {
            // Disposition horizontale pour mobile en portrait
            const totalCachesWidth =
                (cellSize + spacing) * cacheColors.length - spacing;
            const startX =
                leftColumnRect.left +
                (leftColumnRect.width - totalCachesWidth) / 2;
            const centerY =
                leftColumnRect.top + (leftColumnRect.height - cellSize) / 2;

            const positions = cacheColors.map((_, index) => ({
                x: startX + index * (cellSize + spacing),
                y: centerY,
            }));

            setCachePositions(positions);
        } else {
            // Disposition verticale standard
            const totalCachesHeight =
                (cellSize + spacing) * cacheColors.length - spacing;
            const startY =
                leftColumnRect.top +
                (leftColumnRect.height - totalCachesHeight) / 2;
            const centerX =
                leftColumnRect.left + (leftColumnRect.width - cellSize) / 2;

            const positions = cacheColors.map((_, index) => ({
                x: centerX,
                y: startY + index * (cellSize + spacing),
            }));

            setCachePositions(positions);
        }

        // Calcul de la position du masque
        const rightColumnRect = rightColumnRef.current.getBoundingClientRect();
        const masqueSize = cellSize * 3;
        const adjustedMasqueSize = Math.min(
            masqueSize,
            rightColumnRect.width * 0.9,
            rightColumnRect.height * 0.8
        );
        const adjustedCellSize = adjustedMasqueSize / 3;

        const masqueCenterX =
            rightColumnRect.left +
            (rightColumnRect.width - adjustedMasqueSize) / 2;
        const masqueCenterY =
            rightColumnRect.top +
            (rightColumnRect.height - adjustedMasqueSize) / 2;

        setMasquePosition({
            x: masqueCenterX,
            y: masqueCenterY,
            cellSize: adjustedCellSize,
        });
    }, [cellSize, cacheColors.length, isPortrait, isMobile]);

    // Recalcul des positions lorsque les dimensions/orientation changent
    useEffect(() => {
        calculatePositions();
    }, [
        calculatePositions,
        windowSize,
        cellSize,
        chateauDimensions,
        headerHeight,
        isPortrait,
        isMobile,
    ]);

    // Toggle de l'ordre des nombres
    const toggleOrdre = useCallback(() => {
        setOrdre((prev) => (prev === "0-99" ? "99-0" : "0-99"));
    }, []);

    // Toggle pour l'aide
    const toggleHelp = useCallback(() => {
        setShowHelp((prev) => !prev);
    }, []);

    // Afficher l'aide au premier chargement
    useEffect(() => {
        const hasVisitedBefore = localStorage.getItem("chateau_visited");
        if (!hasVisitedBefore) {
            setTimeout(() => {
                setShowHelp(true);
                localStorage.setItem("chateau_visited", "true");
            }, 1000);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header avec navigation et boutons */}
            <Header ref={headerRef} />

            {/* Contenu principal */}
            <main
                className={`flex flex-1 relative overflow-hidden`}
                style={{
                    height: `${layoutStyle.mainHeight}px`,
                    flexDirection: layoutStyle.flexDirection,
                }}
            >
                {isPortrait && isMobile ? (
                    // Layout pour mobile en portrait
                    <>
                        {/* Rangée supérieure - Caches */}
                        <div
                            ref={leftColumnRef}
                            className="flex items-center justify-center w-full bg-header bg-opacity-30 border-b border-dashed border-text-primary border-opacity-50 relative z-50"
                            style={{
                                height: `${layoutStyle.topRowHeight}px`,
                            }}
                        >
                            {/* Les caches - positionnés horizontalement */}
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

                        {/* Zone centrale - Château */}
                        <div
                            className="flex items-center justify-center w-full relative z-10"
                            style={{
                                height: `${layoutStyle.mainAreaHeight}px`,
                            }}
                        >
                            <Chateau
                                ordre={ordre}
                                height={layoutStyle.mainAreaHeight - 20}
                                onLoad={handleChateauLoad}
                            />
                        </div>

                        {/* Rangée inférieure - Masque */}
                        <div
                            ref={rightColumnRef}
                            className="flex items-center justify-center w-full bg-header bg-opacity-30 border-t border-dashed border-text-primary border-opacity-50 relative z-50"
                            style={{
                                height: `${layoutStyle.bottomRowHeight}px`,
                            }}
                        >
                            {/* Le masque */}
                            {cellSize > 0 && masquePosition.x > 0 && (
                                <DraggableMasque
                                    cellSize={
                                        masquePosition.cellSize || cellSize
                                    }
                                    initialX={masquePosition.x}
                                    initialY={masquePosition.y}
                                    isSource={true}
                                    ordre={ordre}
                                    isSidebarItem={true}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    // Layout standard en colonnes
                    <div className="flex w-full h-full">
                        {/* Colonne gauche - Caches */}
                        <div
                            ref={leftColumnRef}
                            className="flex items-center justify-center bg-header bg-opacity-30 border-r border-dashed border-text-primary border-opacity-50 relative z-50"
                            style={{
                                width:
                                    chateauDimensions.width > 0
                                        ? `calc((100% - ${chateauDimensions.width}px) / 2)`
                                        : "20%",
                                minWidth: isMobile ? "80px" : "100px",
                            }}
                        >
                            {/* Les caches */}
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
                            className="flex items-center justify-center relative z-10"
                            style={{
                                width:
                                    chateauDimensions.width > 0
                                        ? `${chateauDimensions.width}px`
                                        : "60%",
                            }}
                        >
                            <Chateau
                                ordre={ordre}
                                height={layoutStyle.mainHeight - 40}
                                onLoad={handleChateauLoad}
                            />
                        </div>

                        {/* Colonne droite - Masque */}
                        <div
                            ref={rightColumnRef}
                            className="flex items-center justify-center bg-header bg-opacity-30 border-l border-dashed border-text-primary border-opacity-50 relative z-50"
                            style={{
                                width:
                                    chateauDimensions.width > 0
                                        ? `calc((100% - ${chateauDimensions.width}px) / 2)`
                                        : "20%",
                                minWidth: isMobile ? "80px" : "100px",
                            }}
                        >
                            {/* Le masque */}
                            {cellSize > 0 && masquePosition.x > 0 && (
                                <DraggableMasque
                                    cellSize={
                                        masquePosition.cellSize || cellSize
                                    }
                                    initialX={masquePosition.x}
                                    initialY={masquePosition.y}
                                    isSource={true}
                                    ordre={ordre}
                                    isSidebarItem={true}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Boutons flottants adaptés pour mobile */}
                <div
                    className={`fixed ${
                        isMobile
                            ? "bottom-4 right-4 gap-3"
                            : "bottom-6 right-6 gap-4"
                    } flex flex-col items-end z-50`}
                >
                    {/* Sélecteur d'ordre */}
                    <button
                        onClick={toggleOrdre}
                        className="bg-header hover:bg-opacity-80 text-text-primary px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors border border-text-secondary shadow-md min-w-[100px] md:min-w-[120px] h-10 md:h-12"
                        title="Changer l'ordre de numérotation"
                        aria-label={`Ordre actuel: ${ordre}. Cliquer pour changer`}
                    >
                        Ordre: {ordre}
                    </button>

                    {/* Bouton d'aide */}
                    <button
                        onClick={toggleHelp}
                        className="bg-header hover:bg-opacity-80 text-text-primary w-10 h-10 md:w-12 md:h-12 rounded-full text-lg font-bold transition-colors border border-text-secondary shadow-md flex items-center justify-center"
                        title="Afficher l'aide"
                        aria-label="Ouvrir l'aide"
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

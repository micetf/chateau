import { useState, useEffect, useRef, useCallback } from "react";
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
    const [isMobile, setIsMobile] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);

    // États pour les positions des éléments
    const [cachePositions, setCachePositions] = useState([]);
    const [masquePosition, setMasquePosition] = useState({ x: 0, y: 0 });

    // Couleurs des caches
    const cacheColors = ["#B33514", "#FF9117", "#FF5700", "#0079B3", "#00FFEA"];

    // Détecter l'orientation et le type d'appareil
    useEffect(() => {
        const checkOrientation = () => {
            const portrait = window.innerHeight > window.innerWidth;
            setIsPortrait(portrait);
        };

        const checkDevice = () => {
            // Détecter si on est sur mobile/tablette
            const mobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ) || window.innerWidth < 768;
            setIsMobile(mobile);
        };

        checkOrientation();
        checkDevice();

        window.addEventListener("resize", checkOrientation);
        window.addEventListener("resize", checkDevice);

        return () => {
            window.removeEventListener("resize", checkOrientation);
            window.removeEventListener("resize", checkDevice);
        };
    }, []);

    // Gestion du redimensionnement de la fenêtre de manière optimisée
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Utiliser un debounce pour éviter trop d'appels lors du redimensionnement
        let timeoutId;
        const debouncedResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, 100);
        };

        window.addEventListener("resize", debouncedResize);
        handleResize();

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", debouncedResize);
        };
    }, []);

    // Mise à jour des dimensions après le rendu
    useEffect(() => {
        if (headerRef.current) {
            setHeaderHeight(headerRef.current.offsetHeight);
        }
    }, [windowSize]);

    // Gérer le chargement de l'image du château avec un callback mémorisé
    const handleChateauLoad = useCallback(
        (width, cellData) => {
            if (!width || typeof width !== "number" || width <= 0) {
                console.warn(
                    "Largeur invalide reçue:",
                    width,
                    "- utilisation d'une valeur par défaut"
                );
                width = 867; // Valeur par défaut si la largeur est invalide
            }

            // Stocker les dimensions des cellules pour les utiliser plus tard
            if (cellData) {
                setCellDimensions(cellData);
                console.log("Dimensions des cellules détectées:", cellData);
            }

            // Calculer les dimensions du château en tenant compte de l'orientation
            const maxHeight = windowSize.height - headerHeight - 40;
            const maxWidth = isPortrait
                ? windowSize.width * 0.9 // Prendre plus de place en portrait
                : windowSize.width * 0.6; // Limiter en paysage

            const aspectRatio = 65.03 / 86.7; // Rapport hauteur/largeur du SVG original

            // Calculer la taille optimale en respectant les contraintes
            let adjustedWidth, height;

            if (isPortrait) {
                // En portrait, on maximise la largeur
                adjustedWidth = Math.min(maxWidth, width);
                height = adjustedWidth * aspectRatio;

                // Vérifier que la hauteur ne dépasse pas
                if (height > maxHeight) {
                    height = maxHeight;
                    adjustedWidth = height / aspectRatio;
                }
            } else {
                // En paysage, on calcule en fonction de la hauteur
                height = Math.min(maxHeight, width * aspectRatio);
                adjustedWidth = height / aspectRatio;

                // Vérifier que la largeur ne dépasse pas
                if (adjustedWidth > maxWidth) {
                    adjustedWidth = maxWidth;
                    height = adjustedWidth * aspectRatio;
                }
            }

            setChateauDimensions({
                width: adjustedWidth,
                height: height,
            });

            // Calculer la taille d'une cellule en fonction des dimensions réelles détectées
            let newCellSize;

            if (cellData && cellData.averageSize) {
                // Calculer le facteur d'échelle entre le SVG original et la taille affichée
                const scaleFactor = adjustedWidth / width;

                // Appliquer le facteur d'échelle aux dimensions des cellules
                newCellSize = Math.ceil(cellData.averageSize * scaleFactor);

                // Assurer que la taille reste dans des limites raisonnables
                newCellSize = Math.min(
                    Math.max(
                        24, // Taille minimum
                        newCellSize
                    ),
                    isMobile ? 40 : 60 // Taille maximum selon le device
                );
            } else {
                // Fallback au calcul précédent si les dimensions des cellules ne sont pas disponibles
                newCellSize = Math.min(
                    Math.max(
                        24, // Taille minimum
                        Math.round((adjustedWidth / width) * 50)
                    ),
                    isMobile ? 40 : 60 // Taille maximum selon le device
                );
            }

            setCellSize(newCellSize);
            console.log("Nouvelle taille de cellule calculée:", newCellSize);

            // Recalcul des positions après un court délai
            setTimeout(() => {
                if (leftColumnRef.current && rightColumnRef.current) {
                    // Déclencher un recalcul forcé des positions
                    setWindowSize((prev) => ({ ...prev }));
                }
            }, 100);
        },
        [windowSize, headerHeight, isPortrait, isMobile]
    );

    // Calcul des positions des caches et du masque
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

        // Adapter la disposition en fonction de l'orientation
        if (isPortrait && isMobile) {
            // En portrait sur mobile, disposer les caches horizontalement en haut
            const leftColumnRect =
                leftColumnRef.current.getBoundingClientRect();

            // Espacement adaptatif entre les caches
            const spacing = Math.max(5, Math.round(cellSize * 0.1));

            // Largeur totale occupée par tous les caches côte à côte avec espacement
            const totalCachesWidth =
                (cellSize + spacing) * cacheColors.length - spacing;

            // Position de départ pour centrer horizontalement l'ensemble des caches
            const startX =
                leftColumnRect.left +
                (leftColumnRect.width - totalCachesWidth) / 2;

            // Position verticale (centré dans la colonne)
            const centerY =
                leftColumnRect.top + (leftColumnRect.height - cellSize) / 2;

            // Calculer la position de chaque cache
            const positions = cacheColors.map((_, index) => {
                return {
                    x: startX + index * (cellSize + spacing), // Positionnement horizontal avec espacement
                    y: centerY,
                };
            });

            setCachePositions(positions);
        } else {
            // Disposition verticale standard
            const leftColumnRect =
                leftColumnRef.current.getBoundingClientRect();

            // Espacement adaptatif entre les caches
            const spacing = Math.max(5, Math.round(cellSize * 0.1));

            // Hauteur totale occupée par tous les caches avec espacement
            const totalCachesHeight =
                (cellSize + spacing) * cacheColors.length - spacing;

            // Position de départ pour centrer verticalement
            const startY =
                leftColumnRect.top +
                (leftColumnRect.height - totalCachesHeight) / 2;

            // Position horizontale (centré dans la colonne)
            const centerX =
                leftColumnRect.left + (leftColumnRect.width - cellSize) / 2;

            // Calculer la position de chaque cache
            const positions = cacheColors.map((_, index) => {
                return {
                    x: centerX,
                    y: startY + index * (cellSize + spacing), // Positionnement vertical avec espacement
                };
            });

            setCachePositions(positions);
        }

        // Calculer la position du masque
        const rightColumnRect = rightColumnRef.current.getBoundingClientRect();
        const masqueSize = cellSize * 3;

        // S'assurer que le masque ne dépasse pas les limites de la colonne
        const adjustedMasqueSize = Math.min(
            masqueSize,
            rightColumnRect.width * 0.9,
            rightColumnRect.height * 0.8
        );

        // Recalculer la taille d'une cellule du masque si nécessaire
        const adjustedCellSize = adjustedMasqueSize / 3;

        // Calculer le centre de la colonne droite
        const masqueCenterX =
            rightColumnRect.left +
            (rightColumnRect.width - adjustedMasqueSize) / 2;
        const masqueCenterY =
            rightColumnRect.top +
            (rightColumnRect.height - adjustedMasqueSize) / 2;

        const newMasquePosition = {
            x: masqueCenterX,
            y: masqueCenterY,
            cellSize: adjustedCellSize, // Stocker la taille ajustée pour le masque
        };

        setMasquePosition(newMasquePosition);
    }, [
        windowSize,
        cellSize,
        chateauDimensions,
        headerHeight,
        isPortrait,
        isMobile,
        cacheColors.length,
    ]);

    // Toggle de l'ordre des nombres (0-99 ou 99-0)
    const toggleOrdre = () => {
        setOrdre((prev) => (prev === "0-99" ? "99-0" : "0-99"));
    };

    // Toggle pour l'aide
    const toggleHelp = () => {
        setShowHelp((prev) => !prev);
    };

    // Afficher automatiquement l'aide au premier chargement
    useEffect(() => {
        // Vérifier si c'est la première visite
        const hasVisitedBefore = localStorage.getItem("chateau_visited");
        if (!hasVisitedBefore) {
            // Montrer l'aide après un court délai pour laisser l'app se charger
            setTimeout(() => {
                setShowHelp(true);
                // Marquer comme visité
                localStorage.setItem("chateau_visited", "true");
            }, 1000);
        }
    }, []);

    // Calcul de la hauteur disponible pour le contenu principal
    const mainHeight = windowSize.height - headerHeight;

    // Calcul du layout en fonction de l'orientation
    const layoutStyle =
        isPortrait && isMobile
            ? {
                  // Disposition pour mode portrait sur mobile
                  flexDirection: "column",
                  // La première ligne contient les caches
                  topRowHeight: Math.max(80, cellSize + 20),
                  // La dernière ligne contient le masque
                  bottomRowHeight: Math.max(100, cellSize * 3 + 20),
                  // La partie centrale contient le château
                  mainAreaHeight:
                      mainHeight - 2 * Math.max(100, cellSize * 3 + 20),
              }
            : {
                  // Disposition standard en colonnes
                  flexDirection: "row",
              };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header avec navigation et boutons */}
            <Header ref={headerRef} />

            {/* Contenu principal */}
            <main
                className="flex flex-1 relative overflow-hidden"
                style={{
                    height: `${mainHeight}px`,
                    flexDirection: layoutStyle.flexDirection,
                }}
            >
                {isPortrait && isMobile ? (
                    // Layout pour mobile en portrait
                    <>
                        {/* Rangée supérieure - Caches */}
                        <div
                            ref={leftColumnRef}
                            className="flex items-center justify-center w-full"
                            style={{
                                height: `${layoutStyle.topRowHeight}px`,
                                backgroundColor: "rgba(26, 53, 64, 0.3)",
                                borderBottom:
                                    "2px dashed rgba(242, 220, 179, 0.5)",
                                position: "relative",
                                zIndex: 50,
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
                            className="flex items-center justify-center w-full"
                            style={{
                                height: `${layoutStyle.mainAreaHeight}px`,
                                zIndex: 10,
                                position: "relative",
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
                            className="flex items-center justify-center w-full"
                            style={{
                                height: `${layoutStyle.bottomRowHeight}px`,
                                backgroundColor: "rgba(26, 53, 64, 0.3)",
                                borderTop:
                                    "2px dashed rgba(242, 220, 179, 0.5)",
                                position: "relative",
                                zIndex: 50,
                            }}
                        >
                            {/* Le masque - positionné au centre avec taille ajustée */}
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
                            className="flex items-center justify-center"
                            style={{
                                width:
                                    chateauDimensions.width > 0
                                        ? `calc((100% - ${chateauDimensions.width}px) / 2)`
                                        : "20%",
                                minWidth: isMobile ? "80px" : "100px",
                                backgroundColor: "rgba(26, 53, 64, 0.3)",
                                borderRight:
                                    "2px dashed rgba(242, 220, 179, 0.5)",
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

                        {/* Colonne droite - Masque */}
                        <div
                            ref={rightColumnRef}
                            className="flex items-center justify-center"
                            style={{
                                width:
                                    chateauDimensions.width > 0
                                        ? `calc((100% - ${chateauDimensions.width}px) / 2)`
                                        : "20%",
                                minWidth: isMobile ? "80px" : "100px",
                                backgroundColor: "rgba(26, 53, 64, 0.3)",
                                borderLeft:
                                    "2px dashed rgba(242, 220, 179, 0.5)",
                                position: "relative",
                                zIndex: 50,
                            }}
                        >
                            {/* Le masque - positionné au centre avec taille ajustée */}
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

                {/* Boutons flottants en position fixe, adaptés pour mobile */}
                <div
                    className={`fixed ${
                        isMobile ? "bottom-2 right-2" : "bottom-4 right-4"
                    } flex flex-col items-end space-y-2 z-50`}
                >
                    {/* Sélecteur d'ordre */}
                    <button
                        onClick={toggleOrdre}
                        className="bg-header hover:bg-opacity-80 text-text-primary px-2 py-1 rounded-md text-sm font-medium transition-colors border border-text-secondary shadow-md"
                        title="Changer l'ordre de numérotation"
                        aria-label={`Ordre actuel: ${ordre}. Cliquer pour changer`}
                    >
                        Ordre: {ordre}
                    </button>

                    {/* Bouton d'aide */}
                    <button
                        onClick={toggleHelp}
                        className="bg-header hover:bg-opacity-80 text-text-primary w-8 h-8 md:w-10 md:h-10 rounded-full text-lg font-bold transition-colors border border-text-secondary shadow-md flex items-center justify-center"
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

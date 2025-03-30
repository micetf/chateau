import { useRef, useEffect, useCallback } from "react";
import DebugPanel from "./components/DebugPanel"; // En haut de votre fichier App.jsx
import Chateau from "./components/Chateau";
import Header from "./components/Header";
import ContactLink from "./components/ContactLink";
import DraggableCache from "./components/DraggableCache";
import DraggableMasque from "./components/DraggableMasque";
import HelpOverlay from "./components/HelpOverlay";
import Trash from "./components/Trash";
import UndoRedoControls from "./components/UndoRedoControls";
import UpdateNotification from "./components/common/UpdateNotification";
import { useChateauContext } from "./contexts/ChateauContext";

function App() {
    // Utilisation du contexte au lieu des états locaux
    const {
        ordre,
        showHelp,
        windowSize,
        headerHeight,
        chateauDimensions,
        cellSize,
        masqueSize,
        isPortrait,
        isMobile,
        cacheColors,
        cachePositions,
        masquePosition,
        // Caches et masques créés par l'utilisateur
        caches,
        masques,
        // Actions
        toggleOrdre,
        toggleHelp,
        setHeaderHeight,
        updateChateauDimensions,
        calculatePositions,
    } = useChateauContext();

    const headerRef = useRef(null);
    const leftColumnRef = useRef(null);
    const rightColumnRef = useRef(null);

    // Mise à jour de la hauteur du header quand il change
    useEffect(() => {
        if (headerRef.current) {
            const height = headerRef.current.offsetHeight;
            setHeaderHeight(height);
        }
    }, [windowSize, setHeaderHeight]);

    // Recalculer les positions chaque fois que les dimensions changent
    useEffect(() => {
        if (leftColumnRef.current && rightColumnRef.current && cellSize > 0) {
            const leftColumnRect =
                leftColumnRef.current.getBoundingClientRect();
            const rightColumnRect =
                rightColumnRef.current.getBoundingClientRect();

            calculatePositions(leftColumnRect, rightColumnRect);
        }
    }, [
        cellSize,
        chateauDimensions,
        headerHeight,
        isPortrait,
        isMobile,
        calculatePositions,
    ]);

    // Gestionnaire de chargement du château
    const handleChateauLoad = useCallback(
        (width, cellData) => {
            updateChateauDimensions(width, width * 0.6503, cellData); // 0.6503 est le ratio hauteur/largeur

            // Recalcul après délai pour laisser le DOM se mettre à jour
            requestAnimationFrame(() => {
                if (leftColumnRef.current && rightColumnRef.current) {
                    const leftColumnRect =
                        leftColumnRef.current.getBoundingClientRect();
                    const rightColumnRect =
                        rightColumnRef.current.getBoundingClientRect();

                    calculatePositions(leftColumnRect, rightColumnRect);
                }
            });
        },
        [updateChateauDimensions, calculatePositions]
    );

    // Afficher l'aide au premier chargement
    useEffect(() => {
        const hasVisitedBefore = localStorage.getItem("chateau_visited");
        if (!hasVisitedBefore) {
            setTimeout(() => {
                toggleHelp();
                localStorage.setItem("chateau_visited", "true");
            }, 1000);
        }
    }, [toggleHelp]);

    // Calcul dynamique du layout
    const layout = (() => {
        const mainHeight = windowSize.height - headerHeight;

        if (isPortrait && isMobile) {
            // Mode portrait sur mobile
            const topRowHeight = Math.max(80, cellSize + 20);
            const bottomRowHeight = Math.max(100, masqueSize + 20);
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
    })();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header avec navigation et boutons */}
            <Header ref={headerRef} />

            {/* Contenu principal */}
            <main
                className={`flex flex-1 relative overflow-hidden`}
                style={{
                    height: `${layout.mainHeight}px`,
                    flexDirection: layout.flexDirection,
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
                                height: `${layout.topRowHeight}px`,
                            }}
                        >
                            {/* Les caches - positionnés horizontalement */}
                            {cellSize > 0 &&
                                cachePositions.length === cacheColors.length &&
                                cacheColors.map((color, index) => (
                                    <DraggableCache
                                        key={`cache-source-${color}`}
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
                                height: `${layout.mainAreaHeight}px`,
                            }}
                        >
                            <Chateau
                                ordre={ordre}
                                height={layout.mainAreaHeight - 20}
                                onLoad={handleChateauLoad}
                            />

                            {/* Rendu des caches créés par l'utilisateur */}
                            {caches.map((cache) => (
                                <DraggableCache
                                    key={cache.id}
                                    id={cache.id}
                                    color={cache.color}
                                    size={cache.size}
                                    initialX={cache.x}
                                    initialY={cache.y}
                                    isSource={false}
                                />
                            ))}

                            {/* Rendu des masques créés par l'utilisateur */}
                            {masques.map((masque) => (
                                <DraggableMasque
                                    key={masque.id}
                                    id={masque.id}
                                    cellSize={masque.cellSize}
                                    initialX={masque.x}
                                    initialY={masque.y}
                                    isSource={false}
                                    ordre={ordre}
                                />
                            ))}
                        </div>

                        {/* Rangée inférieure - Masque */}
                        <div
                            ref={rightColumnRef}
                            className="flex items-center justify-center w-full bg-header bg-opacity-30 border-t border-dashed border-text-primary border-opacity-50 relative z-50"
                            style={{
                                height: `${layout.bottomRowHeight}px`,
                            }}
                        >
                            {/* Le masque */}
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
                                        key={`cache-source-${color}`}
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
                                height={layout.mainHeight - 40}
                                onLoad={handleChateauLoad}
                            />

                            {/* Rendu des caches créés par l'utilisateur */}
                            {caches.map((cache) => (
                                <DraggableCache
                                    key={cache.id}
                                    id={cache.id}
                                    color={cache.color}
                                    size={cache.size}
                                    initialX={cache.x}
                                    initialY={cache.y}
                                    isSource={false}
                                />
                            ))}

                            {/* Rendu des masques créés par l'utilisateur */}
                            {masques.map((masque) => (
                                <DraggableMasque
                                    key={masque.id}
                                    id={masque.id}
                                    cellSize={masque.cellSize}
                                    initialX={masque.x}
                                    initialY={masque.y}
                                    isSource={false}
                                    ordre={ordre}
                                />
                            ))}
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
                )}

                {/* Boutons flottants */}
                <div
                    className={`fixed ${
                        isMobile
                            ? "bottom-4 right-4 gap-3"
                            : "bottom-6 right-6 gap-4"
                    } flex flex-col items-end z-50`}
                >
                    {/* Contrôles Undo/Redo */}
                    <UndoRedoControls />

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

            {/* Aide conditionnelle */}
            {showHelp && <HelpOverlay />}
            <UpdateNotification />
            <DebugPanel />
        </div>
    );
}

export default App;

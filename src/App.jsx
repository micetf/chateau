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
import IntuitiveDirectionToggleButton from "./components/IntuitiveDirectionToggleButton";
import TeacherGuide from "./components/TeacherGuide";
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
        toggleTeacherGuide,
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
                    <IntuitiveDirectionToggleButton
                        ordre={ordre}
                        toggleOrdre={toggleOrdre}
                    />

                    {/* Groupe de boutons d'aide et guide enseignant */}
                    <div className="flex space-x-3">
                        {/* Bouton guide enseignant */}
                        <button
                            onClick={toggleTeacherGuide}
                            className="bg-blue-600 hover:bg-blue-700 text-text-primary w-10 h-10 md:w-12 md:h-12 rounded-full text-lg transition-colors border border-blue-500 shadow-md flex items-center justify-center"
                            title="Guide pédagogique pour enseignants"
                            aria-label="Ouvrir le guide pédagogique"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 md:w-6 md:h-6"
                            >
                                <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.963 8.963 0 00-4.25 1.065V16.82zM9.25 4.065A8.963 8.963 0 005 3c-.85 0-1.673.118-2.454.339A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />
                            </svg>
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
                </div>
            </main>

            {/* Composants utilitaires */}
            <Trash />
            <ContactLink />
            <TeacherGuide />
            {/* Aide conditionnelle */}
            {showHelp && <HelpOverlay />}
            <UpdateNotification />
            {/* <DebugPanel /> */}
        </div>
    );
}

export default App;

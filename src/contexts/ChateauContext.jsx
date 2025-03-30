import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from "react";

// Définition de l'état initial
const initialState = {
    // Configurations générales
    ordre: "99-0",
    showHelp: false,

    // Dimensions et mise en page
    windowSize: { width: window.innerWidth, height: window.innerHeight },
    headerHeight: 0,
    chateauDimensions: { width: 0, height: 0 },
    cellSize: 0,
    masqueSize: 0,
    isPortrait: window.innerHeight > window.innerWidth,
    isMobile: window.innerWidth < 768,

    // Éléments interactifs
    caches: [], // Caches placés sur le château
    masques: [], // Masques placés sur le château

    // Sources pour le drag-and-drop
    cacheColors: ["#B33514", "#FF9117", "#FF5700", "#0079B3", "#00FFEA"],
    cachePositions: [], // Positions des sources de caches dans la colonne de gauche
    masquePosition: { x: 0, y: 0 }, // Position de la source du masque dans la colonne de droite

    // Historique pour undo/redo
    history: [],
    historyIndex: -1,
};

// Types d'actions
const actions = {
    SET_ORDRE: "SET_ORDRE",
    TOGGLE_HELP: "TOGGLE_HELP",
    SET_WINDOW_SIZE: "SET_WINDOW_SIZE",
    SET_HEADER_HEIGHT: "SET_HEADER_HEIGHT",
    SET_CHATEAU_DIMENSIONS: "SET_CHATEAU_DIMENSIONS",
    CALCULATE_POSITIONS: "CALCULATE_POSITIONS",
    ADD_CACHE: "ADD_CACHE",
    MOVE_CACHE: "MOVE_CACHE",
    REMOVE_CACHE: "REMOVE_CACHE",
    ADD_MASQUE: "ADD_MASQUE",
    MOVE_MASQUE: "MOVE_MASQUE",
    REMOVE_MASQUE: "REMOVE_MASQUE",
    ADD_TO_HISTORY: "ADD_TO_HISTORY",
    UNDO: "UNDO",
    REDO: "REDO",
};

// Réducteur qui gère toutes les mises à jour d'état
function chateauReducer(state, action) {
    switch (action.type) {
        case actions.SET_ORDRE:
            return { ...state, ordre: action.payload };

        case actions.TOGGLE_HELP:
            return { ...state, showHelp: !state.showHelp };

        case actions.SET_WINDOW_SIZE:
            return {
                ...state,
                windowSize: action.payload,
                isPortrait: action.payload.height > action.payload.width,
                isMobile: action.payload.width < 768,
            };

        case actions.SET_HEADER_HEIGHT:
            return { ...state, headerHeight: action.payload };

        case actions.SET_CHATEAU_DIMENSIONS: {
            const { width, height, cellData } = action.payload;

            // Calcul de la taille des cellules basé sur les données du château
            let newCellSize = 0;
            if (cellData) {
                if (cellData.averageSize) {
                    newCellSize = cellData.averageSize;
                } else if (cellData.cellWidth) {
                    newCellSize = cellData.cellWidth;
                } else {
                    newCellSize = Math.max(15, width / 20);
                }
            }

            // Calcul de la taille du masque (3x3 cellules)
            const newMasqueSize = newCellSize * 3;

            return {
                ...state,
                chateauDimensions: { width, height },
                cellSize: newCellSize,
                masqueSize: newMasqueSize,
            };
        }

        case actions.CALCULATE_POSITIONS: {
            const { leftColumn, rightColumn } = action.payload;

            // Calcul des positions des caches
            let newCachePositions = [];
            if (leftColumn && state.cellSize > 0) {
                const spacing = Math.max(5, Math.round(state.cellSize * 0.1));

                if (state.isPortrait && state.isMobile) {
                    // Disposition horizontale pour mobile en portrait
                    const totalCachesWidth =
                        (state.cellSize + spacing) * state.cacheColors.length -
                        spacing;
                    const startX =
                        leftColumn.left +
                        (leftColumn.width - totalCachesWidth) / 2;
                    const centerY =
                        leftColumn.top +
                        (leftColumn.height - state.cellSize) / 2;

                    newCachePositions = state.cacheColors.map((_, index) => ({
                        x: startX + index * (state.cellSize + spacing),
                        y: centerY,
                    }));
                } else {
                    // Disposition verticale standard
                    const totalCachesHeight =
                        (state.cellSize + spacing) * state.cacheColors.length -
                        spacing;
                    const startY =
                        leftColumn.top +
                        (leftColumn.height - totalCachesHeight) / 2;
                    const centerX =
                        leftColumn.left +
                        (leftColumn.width - state.cellSize) / 2;

                    newCachePositions = state.cacheColors.map((_, index) => ({
                        x: centerX,
                        y: startY + index * (state.cellSize + spacing),
                    }));
                }
            }

            // Calcul de la position du masque
            let newMasquePosition = { ...state.masquePosition };
            if (rightColumn && state.cellSize > 0) {
                newMasquePosition = {
                    x:
                        rightColumn.left +
                        (rightColumn.width - state.masqueSize) / 2,
                    y:
                        rightColumn.top +
                        (rightColumn.height - state.masqueSize) / 2,
                    cellSize: state.cellSize,
                };
            }

            return {
                ...state,
                cachePositions: newCachePositions,
                masquePosition: newMasquePosition,
            };
        }

        case actions.ADD_CACHE: {
            const { color, x, y } = action.payload;
            const newCache = {
                id: `cache-${Date.now()}`, // Identifiant unique
                color: color,
                x: x,
                y: y,
                size: state.cellSize,
            };

            const newState = {
                ...state,
                caches: [...state.caches, newCache],
            };

            // Ajouter à l'historique automatiquement
            const historyEntry = {
                caches: [...newState.caches],
                masques: [...newState.masques],
                ordre: newState.ordre,
            };

            return {
                ...newState,
                history: [
                    ...state.history.slice(0, state.historyIndex + 1),
                    historyEntry,
                ],
                historyIndex: state.historyIndex + 1,
            };
        }

        case actions.MOVE_CACHE: {
            const { id, x, y } = action.payload;
            return {
                ...state,
                caches: state.caches.map((cache) =>
                    cache.id === id ? { ...cache, x, y } : cache
                ),
            };
        }

        case actions.REMOVE_CACHE: {
            const newState = {
                ...state,
                caches: state.caches.filter(
                    (cache) => cache.id !== action.payload
                ),
            };

            // Ajouter à l'historique automatiquement
            const historyEntry = {
                caches: [...newState.caches],
                masques: [...newState.masques],
                ordre: newState.ordre,
            };

            return {
                ...newState,
                history: [
                    ...state.history.slice(0, state.historyIndex + 1),
                    historyEntry,
                ],
                historyIndex: state.historyIndex + 1,
            };
        }

        case actions.ADD_MASQUE: {
            const { x, y } = action.payload;
            const newMasque = {
                id: `masque-${Date.now()}`, // Identifiant unique
                x: x,
                y: y,
                cellSize: state.cellSize,
            };

            const newState = {
                ...state,
                masques: [...state.masques, newMasque],
            };

            // Ajouter à l'historique automatiquement
            const historyEntry = {
                caches: [...newState.caches],
                masques: [...newState.masques],
                ordre: newState.ordre,
            };

            return {
                ...newState,
                history: [
                    ...state.history.slice(0, state.historyIndex + 1),
                    historyEntry,
                ],
                historyIndex: state.historyIndex + 1,
            };
        }

        case actions.MOVE_MASQUE: {
            const { id, x, y } = action.payload;
            return {
                ...state,
                masques: state.masques.map((masque) =>
                    masque.id === id ? { ...masque, x, y } : masque
                ),
            };
        }

        case actions.REMOVE_MASQUE: {
            const newState = {
                ...state,
                masques: state.masques.filter(
                    (masque) => masque.id !== action.payload
                ),
            };

            // Ajouter à l'historique automatiquement
            const historyEntry = {
                caches: [...newState.caches],
                masques: [...newState.masques],
                ordre: newState.ordre,
            };

            return {
                ...newState,
                history: [
                    ...state.history.slice(0, state.historyIndex + 1),
                    historyEntry,
                ],
                historyIndex: state.historyIndex + 1,
            };
        }

        case actions.ADD_TO_HISTORY: {
            // Capture de l'état actuel pour l'historique
            const currentState = {
                caches: [...state.caches],
                masques: [...state.masques],
                ordre: state.ordre,
            };

            // Tronquer l'historique si nous sommes au milieu
            const newHistory = state.history.slice(0, state.historyIndex + 1);

            return {
                ...state,
                history: [...newHistory, currentState],
                historyIndex: state.historyIndex + 1,
            };
        }

        case actions.UNDO: {
            if (state.historyIndex <= 0) return state;

            const previousState = state.history[state.historyIndex - 1];

            return {
                ...state,
                caches: [...previousState.caches],
                masques: [...previousState.masques],
                ordre: previousState.ordre,
                historyIndex: state.historyIndex - 1,
            };
        }

        case actions.REDO: {
            if (state.historyIndex >= state.history.length - 1) return state;

            const nextState = state.history[state.historyIndex + 1];

            return {
                ...state,
                caches: [...nextState.caches],
                masques: [...nextState.masques],
                ordre: nextState.ordre,
                historyIndex: state.historyIndex + 1,
            };
        }

        default:
            return state;
    }
}

// Création du contexte
const ChateauContext = createContext();

// Hook personnalisé pour utiliser le contexte
export function useChateauContext() {
    const context = useContext(ChateauContext);
    if (!context) {
        throw new Error(
            "useChateauContext doit être utilisé à l'intérieur d'un ChateauProvider"
        );
    }
    return context;
}

// Composant Provider
export function ChateauProvider({ children }) {
    const [state, dispatch] = useReducer(chateauReducer, initialState);

    // Méthodes exposées par le contexte

    // Changement d'ordre (croissant/décroissant)
    const toggleOrdre = useCallback(() => {
        const newOrdre = state.ordre === "0-99" ? "99-0" : "0-99";
        dispatch({ type: actions.SET_ORDRE, payload: newOrdre });
        // Ajouter à l'historique
        dispatch({ type: actions.ADD_TO_HISTORY });
    }, [state.ordre]);

    // Afficher/masquer l'aide
    const toggleHelp = useCallback(() => {
        dispatch({ type: actions.TOGGLE_HELP });
    }, []);

    // Gestionnaire de redimensionnement de la fenêtre
    const handleWindowResize = useCallback((width, height) => {
        dispatch({
            type: actions.SET_WINDOW_SIZE,
            payload: { width, height },
        });
    }, []);

    // Mise à jour de la hauteur du header
    const setHeaderHeight = useCallback((height) => {
        dispatch({ type: actions.SET_HEADER_HEIGHT, payload: height });
    }, []);

    // Mise à jour des dimensions du château
    const updateChateauDimensions = useCallback((width, height, cellData) => {
        dispatch({
            type: actions.SET_CHATEAU_DIMENSIONS,
            payload: { width, height, cellData },
        });
    }, []);

    // Calcul des positions des éléments (caches et masque)
    const calculatePositions = useCallback((leftColumn, rightColumn) => {
        dispatch({
            type: actions.CALCULATE_POSITIONS,
            payload: { leftColumn, rightColumn },
        });
    }, []);

    // Gestion des caches
    const addCache = useCallback((color, x, y) => {
        dispatch({
            type: actions.ADD_CACHE,
            payload: { color, x, y },
        });
    }, []);

    const moveCache = useCallback((id, x, y) => {
        dispatch({
            type: actions.MOVE_CACHE,
            payload: { id, x, y },
        });
    }, []);

    const removeCache = useCallback((id) => {
        dispatch({
            type: actions.REMOVE_CACHE,
            payload: id,
        });
    }, []);

    // Gestion des masques
    const addMasque = useCallback((x, y) => {
        dispatch({
            type: actions.ADD_MASQUE,
            payload: { x, y },
        });
    }, []);

    const moveMasque = useCallback((id, x, y) => {
        dispatch({
            type: actions.MOVE_MASQUE,
            payload: { id, x, y },
        });
    }, []);

    const removeMasque = useCallback((id) => {
        dispatch({
            type: actions.REMOVE_MASQUE,
            payload: id,
        });
    }, []);

    // Gestion de l'historique
    const undo = useCallback(() => {
        dispatch({ type: actions.UNDO });
    }, []);

    const redo = useCallback(() => {
        dispatch({ type: actions.REDO });
    }, []);

    // Écouteur pour les changements de taille de fenêtre
    useEffect(() => {
        const handleResize = () => {
            clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(() => {
                handleWindowResize(window.innerWidth, window.innerHeight);
            }, 100);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            clearTimeout(window.resizeTimeout);
            window.removeEventListener("resize", handleResize);
        };
    }, [handleWindowResize]);

    // Initialisation de l'historique
    useEffect(() => {
        // Ajouter l'état initial à l'historique
        if (state.history.length === 0) {
            dispatch({
                type: actions.ADD_TO_HISTORY,
            });
        }
    }, []);

    // Initialisation de l'historique au premier rendu
    useEffect(() => {
        if (state.history.length === 0 && state.historyIndex === -1) {
            // Créer un état initial vide dans l'historique
            const initialHistoryState = {
                caches: [],
                masques: [],
                ordre: state.ordre,
            };

            dispatch({
                type: actions.ADD_TO_HISTORY,
                payload: initialHistoryState,
            });
        }
    }, [state.history.length, state.historyIndex, state.ordre]);

    // Valeur exposée par le contexte
    const contextValue = {
        // État
        ...state,

        // Actions
        toggleOrdre,
        toggleHelp,
        setHeaderHeight,
        updateChateauDimensions,
        calculatePositions,
        addCache,
        moveCache,
        removeCache,
        addMasque,
        moveMasque,
        removeMasque,
        undo,
        redo,
    };

    return (
        <ChateauContext.Provider value={contextValue}>
            {children}
        </ChateauContext.Provider>
    );
}

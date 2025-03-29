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
    const [headerHeight, setHeaderHeight] = useState(0);
    const [chateauWidth, setChateauWidth] = useState(0);
    const [cellSize, setCellSize] = useState(0);
    const [ordre, setOrdre] = useState("99-0");
    const [showHelp, setShowHelp] = useState(false);

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
        if (width && typeof width === "number" && width > 0) {
            setChateauWidth(width);
            const newCellSize = Math.max(30, Math.round((width / 867) * 50));
            setCellSize(newCellSize);
        }
    };

    // Toggle de l'ordre des nombres (0-99 ou 99-0)
    const toggleOrdre = () => {
        setOrdre((prev) => (prev === "0-99" ? "99-0" : "0-99"));
    };

    // Toggle pour l'aide
    const toggleHelp = () => {
        setShowHelp((prev) => !prev);
    };

    const sectionHeight = windowSize.height - headerHeight;

    // Augmenter la largeur des colonnes latérales
    const sideColumnWidth = Math.min(
        160,
        Math.max(100, windowSize.width * 0.15)
    );

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header avec navigation et boutons */}
            <Header ref={headerRef} />

            {/* Contenu principal */}
            <main
                className="flex flex-1 relative"
                style={{
                    height: `${sectionHeight}px`,
                    overflow: "hidden",
                }}
            >
                {/* Colonne gauche - Caches */}
                <div
                    className="flex flex-col items-center relative"
                    style={{
                        width: `${sideColumnWidth}px`,
                        minWidth: "120px",
                        backgroundColor: "rgba(26, 53, 64, 0.3)",
                        borderRight: "2px dashed rgba(242, 220, 179, 0.5)",
                    }}
                >
                    <h3 className="text-sm font-bold text-text-primary mt-4 mb-6">
                        Caches
                    </h3>

                    {/* Distribution verticale des caches */}
                    {cellSize > 0 &&
                        cacheColors.map((color, index) => {
                            const yPosition = 80 + index * (cellSize + 20);
                            return (
                                <div
                                    key={`cache-container-${index}`}
                                    style={{ position: "relative" }}
                                >
                                    <DraggableCache
                                        key={`cache-source-${index}`}
                                        color={color}
                                        size={cellSize}
                                        initialX={sideColumnWidth / 2}
                                        initialY={yPosition}
                                        isSource={true}
                                        isSidebarItem={true}
                                    />
                                </div>
                            );
                        })}
                </div>

                {/* Colonne centrale - Château */}
                <div className="flex-1 flex items-center justify-center">
                    <Chateau
                        ordre={ordre}
                        height={sectionHeight - 40}
                        onLoad={handleChateauLoad}
                    />
                </div>

                {/* Colonne droite - Masque */}
                <div
                    className="flex flex-col items-center relative"
                    style={{
                        width: `${sideColumnWidth}px`,
                        minWidth: "120px",
                        backgroundColor: "rgba(26, 53, 64, 0.3)",
                        borderLeft: "2px dashed rgba(242, 220, 179, 0.5)",
                    }}
                >
                    <h3 className="text-sm font-bold text-text-primary mt-4 mb-6">
                        Masque
                    </h3>

                    {/* Masque source */}
                    {cellSize > 0 && (
                        <div style={{ position: "relative" }}>
                            <DraggableMasque
                                cellSize={cellSize}
                                initialX={sideColumnWidth / 2}
                                initialY={100}
                                isSource={true}
                                ordre={ordre}
                                isSidebarItem={true}
                            />
                        </div>
                    )}
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

import { useState, useEffect, useRef } from "react";
import Chateau from "./components/Chateau";
import Header from "./components/Header";
import ContactLink from "./components/ContactLink";
import PaypalButton from "./components/PaypalButton";
import DraggableCache from "./components/DraggableCache";
import DraggableMasque from "./components/DraggableMasque";

function App() {
    const [ordre, setOrdre] = useState("99-0");
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [chateauWidth, setChateauWidth] = useState(0);
    const [cellSize, setCellSize] = useState(0);

    // Gestion du redimensionnement de la fenêtre
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        // Appel initial pour s'assurer d'avoir les bonnes dimensions
        handleResize();

        window.addEventListener("resize", handleResize);
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
        // S'assurer que la largeur est un nombre valide
        if (width && typeof width === "number" && width > 0) {
            setChateauWidth(width);
            // Calculer la taille des cellules en fonction de la largeur du château
            const newCellSize = Math.max(30, Math.round((width / 867) * 50));
            setCellSize(newCellSize);
        } else {
            console.error("Largeur de château invalide:", width);
        }
    };

    const sectionHeight = windowSize.height - headerHeight;

    // Les couleurs pour les caches
    const cacheColors = ["#FF9117", "#B33514", "#FF5700", "#0079B3", "#00FFEA"];

    // Calculer les dimensions pour le centrage
    const mainAreaWidth = windowSize.width;
    const sideColumnWidth = Math.min(150, Math.max(100, mainAreaWidth * 0.15));
    const centerAreaWidth = mainAreaWidth - sideColumnWidth * 2;

    // Calculer les positions des caches
    const cachePositions = cacheColors.map((_, index) => {
        const y = 100 + index * (cellSize + 22); // Espacement vertical
        return {
            x: sideColumnWidth / 2, // Centré dans la colonne gauche
            y: y,
        };
    });

    // Calculer la position du masque
    const masquePosition = {
        x: mainAreaWidth - sideColumnWidth / 2 - cellSize * 1.5, // Centré dans la colonne droite
        y: 100, // En haut avec un espacement
    };

    // Calculer la position de la poubelle
    const trashPosition = {
        x: sideColumnWidth / 2, // Centré dans la colonne gauche
        y: sectionHeight - 80, // En bas avec un espacement
    };

    // Calculer la position du bouton d'inversion
    const switchButtonPosition = {
        x: mainAreaWidth - sideColumnWidth / 2, // Centré dans la colonne droite
        y: sectionHeight - 80, // En bas avec un espacement
    };

    return (
        <>
            <Header ref={headerRef} ordre={ordre} setOrdre={setOrdre} />

            <div
                className="relative"
                style={{
                    height: `${sectionHeight}px`,
                    userSelect: "none", // Empêche la sélection de texte lors du glisser-déposer
                }}
            >
                {/* Zone centrale pour le château */}
                <div className="flex justify-center items-center h-full">
                    <Chateau
                        ordre={ordre}
                        height={sectionHeight - 40}
                        onLoad={handleChateauLoad}
                    />
                </div>

                {cellSize > 0 && (
                    <>
                        {/* Titre des caches */}
                        <div
                            className="absolute text-text-primary font-semibold"
                            style={{
                                left: `${sideColumnWidth / 2 - 20}px`,
                                top: "20px",
                                textAlign: "center",
                            }}
                        >
                            Caches
                        </div>

                        {/* Caches */}
                        {cacheColors.map((color, index) => (
                            <DraggableCache
                                key={`cache-${index}`}
                                color={color}
                                index={index}
                                cellSize={cellSize}
                                headerHeight={headerHeight}
                                sectionHeight={sectionHeight}
                                chateauWidth={chateauWidth}
                                windowWidth={windowSize.width}
                                initialX={cachePositions[index].x}
                                initialY={cachePositions[index].y}
                                trashPosition={trashPosition}
                            />
                        ))}

                        {/* Titre du masque */}
                        <div
                            className="absolute text-text-primary font-semibold"
                            style={{
                                right: `${sideColumnWidth / 2 - 25}px`,
                                top: "20px",
                                textAlign: "center",
                            }}
                        >
                            Masque
                        </div>

                        {/* Masque */}
                        <DraggableMasque
                            ordre={ordre}
                            cellSize={cellSize}
                            headerHeight={headerHeight}
                            sectionHeight={sectionHeight}
                            chateauWidth={chateauWidth}
                            windowWidth={windowSize.width}
                            initialX={masquePosition.x}
                            initialY={masquePosition.y}
                            trashPosition={trashPosition}
                        />

                        {/* Poubelle */}
                        <div
                            className="absolute flex flex-col items-center"
                            style={{
                                left: `${trashPosition.x - cellSize}px`,
                                bottom: `20px`,
                            }}
                        >
                            <img
                                id="poubelle"
                                src="/img/poubelle.png"
                                alt="Poubelle"
                                width={cellSize * 1.5}
                                className="mb-1"
                            />
                            <div className="text-xs text-text-primary">
                                Supprimer
                            </div>
                        </div>

                        {/* Bouton d'inversion */}
                        <button
                            className="absolute px-3 py-2 bg-header rounded text-text-primary text-xs font-bold hover:bg-opacity-80 transition-colors"
                            style={{
                                right: `${sideColumnWidth / 2 - 40}px`,
                                bottom: `20px`,
                            }}
                            onClick={() =>
                                setOrdre(ordre === "0-99" ? "99-0" : "0-99")
                            }
                        >
                            {ordre === "0-99" ? "↓ 0 à 99 ↓" : "↑ 99 à 0 ↑"}
                        </button>
                    </>
                )}
            </div>

            <ContactLink />
            <PaypalButton />
        </>
    );
}

export default App;

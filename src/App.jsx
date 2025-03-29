import { useState, useEffect, useRef } from "react";
import Chateau from "./components/Chateau";
import Header from "./components/Header";
import ContactLink from "./components/ContactLink";
import PaypalButton from "./components/PaypalButton";
import DraggableCache from "./components/DraggableCache";
import DraggableMasque from "./components/DraggableMasque";

function App() {
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
        if (width && typeof width === "number" && width > 0) {
            setChateauWidth(width);
            const newCellSize = Math.max(30, Math.round((width / 867) * 50));
            setCellSize(newCellSize);
        }
    };

    const sectionHeight = windowSize.height - headerHeight;
    const cacheColors = ["#FF9117", "#B33514", "#FF5700", "#0079B3", "#00FFEA"];
    const sideColumnWidth = Math.min(
        150,
        Math.max(100, windowSize.width * 0.15)
    );

    // Calculer la position initiale pour chaque cache
    const getCachePosition = (index) => {
        return {
            x: sideColumnWidth / 2 - (cellSize ? cellSize / 2 : 0),
            y: 100 + index * (cellSize ? cellSize + 20 : 60),
        };
    };

    // Calculer la position initiale pour le masque
    const getMasquePosition = () => {
        return {
            x:
                windowSize.width -
                sideColumnWidth / 2 -
                (cellSize ? cellSize * 1.5 : 45),
            y: 100,
        };
    };

    return (
        <>
            <Header ref={headerRef} />

            <div
                className="relative"
                style={{
                    height: `${sectionHeight}px`,
                    overflow: "hidden",
                    userSelect: "none",
                }}
            >
                {/* Disposition en trois colonnes */}
                <div className="flex h-full">
                    {/* Colonne gauche - Caches */}
                    <div
                        style={{
                            width: `${sideColumnWidth}px`,
                            minWidth: "100px",
                        }}
                    >
                        <div className="h-10"></div>
                        {/* Les caches sources sont placés directement dans App */}
                    </div>

                    {/* Colonne centrale - Château */}
                    <div className="flex-grow flex justify-center items-center">
                        <Chateau
                            ordre="99-0" // Valeur fixe maintenant
                            height={sectionHeight - 40}
                            onLoad={handleChateauLoad}
                        />
                    </div>

                    {/* Colonne droite */}
                    <div
                        style={{
                            width: `${sideColumnWidth}px`,
                            minWidth: "100px",
                        }}
                    >
                        <div className="h-10"></div>
                        {/* Le masque source est placé directement dans App */}
                    </div>
                </div>

                {/* Éléments draggables sources */}
                {cellSize > 0 && (
                    <>
                        {/* Caches sources */}
                        {cacheColors.map((color, index) => (
                            <DraggableCache
                                key={index}
                                color={color}
                                size={cellSize}
                                initialX={getCachePosition(index).x}
                                initialY={getCachePosition(index).y}
                                isSource={true}
                            />
                        ))}

                        {/* Masque source */}
                        <DraggableMasque
                            cellSize={cellSize}
                            initialX={getMasquePosition().x}
                            initialY={getMasquePosition().y}
                            isSource={true}
                        />
                    </>
                )}
            </div>

            <ContactLink />
            <PaypalButton />
        </>
    );
}

export default App;

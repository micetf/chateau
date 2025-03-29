import { useState, useEffect, useRef } from "react";
import Chateau from "./components/Chateau";
import Header from "./components/Header";
import ContactLink from "./components/ContactLink";
import PaypalButton from "./components/PaypalButton";
import DraggableCache from "./components/DraggableCache";
import DraggableMasque from "./components/DraggableMasque";
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
    const [ordre, setOrdre] = useState("99-0"); // État pour l'ordre (99-0 par défaut)

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

    // Toggle de l'ordre des nombres (0-99 ou 99-0)
    const toggleOrdre = () => {
        setOrdre((prev) => (prev === "0-99" ? "99-0" : "0-99"));
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
            x: 10 + sideColumnWidth / 2 - (cellSize ? cellSize / 2 : 0),
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
            <Header ref={headerRef} toggleOrdre={toggleOrdre} ordre={ordre} />

            <div
                className="relative mx-auto"
                style={{
                    height: `${sectionHeight}px`,
                    maxWidth: "1200px",
                    overflow: "hidden",
                    userSelect: "none",
                    backgroundColor: "#536e7d",
                }}
            >
                {/* Disposition en trois colonnes */}
                <div className="flex h-full">
                    {/* Colonne gauche - Caches */}
                    <div
                        style={{
                            width: `${sideColumnWidth}px`,
                            minWidth: "100px",
                            backgroundColor: "rgba(26, 53, 64, 0.3)",
                            borderRight: "2px dashed rgba(242, 220, 179, 0.5)",
                        }}
                    >
                        <div className="h-10 text-center">
                            <h3 className="text-sm font-bold text-text-primary mt-4">
                                Caches
                            </h3>
                        </div>
                    </div>

                    {/* Colonne centrale - Château */}
                    <div className="flex-grow flex justify-center items-center relative">
                        <Chateau
                            ordre={ordre}
                            height={sectionHeight - 40}
                            onLoad={handleChateauLoad}
                        />
                    </div>

                    {/* Colonne droite */}
                    <div
                        style={{
                            width: `${sideColumnWidth}px`,
                            minWidth: "100px",
                            backgroundColor: "rgba(26, 53, 64, 0.3)",
                            borderLeft: "2px dashed rgba(242, 220, 179, 0.5)",
                        }}
                    >
                        <div className="h-10 text-center">
                            <h3 className="text-sm font-bold text-text-primary mt-4">
                                Masques
                            </h3>
                        </div>
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
                            ordre={ordre}
                        />
                    </>
                )}
            </div>

            <ContactLink />
            <PaypalButton />
            <Trash />
        </>
    );
}

export default App;

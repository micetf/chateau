import { useState, useEffect, useRef } from "react";
import Chateau from "./components/Chateau";
import Header from "./components/Header";
import DraggableCache from "./components/DraggableCache";
import DraggableMasque from "./components/DraggableMasque";
import ContactLink from "./components/ContactLink";
import PaypalButton from "./components/PaypalButton";

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

    // Vérification de la compatibilité canvas
    useEffect(() => {
        console.log("Vérification de la compatibilité canvas");
        try {
            const canvas = document.createElement("canvas");
            canvas.width = 10;
            canvas.height = 10;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                console.error("Le contexte 2D n'est pas pris en charge");
                return;
            }

            ctx.fillStyle = "red";
            ctx.fillRect(0, 0, 10, 10);

            const dataUrl = canvas.toDataURL();
            console.log(
                "Test canvas réussi:",
                dataUrl.substring(0, 30) + "..."
            );

            // Tester spécifiquement la création d'un cache
            const testCellSize = 20;
            const testColor = "#FF0000";
            console.log(
                `Test de création d'un cache: taille=${testCellSize}, couleur=${testColor}`
            );

            const testCanvas = document.createElement("canvas");
            testCanvas.width = testCellSize;
            testCanvas.height = testCellSize;

            const testCtx = testCanvas.getContext("2d");
            testCtx.fillStyle = testColor;
            testCtx.fillRect(0, 0, testCellSize, testCellSize);
            testCtx.strokeStyle = "black";
            testCtx.lineWidth = 2;
            testCtx.strokeRect(0, 0, testCellSize, testCellSize);

            const testCacheUrl = testCanvas.toDataURL("image/png");
            console.log(
                "Test de création de cache réussi:",
                testCacheUrl.substring(0, 30) + "..."
            );
        } catch (error) {
            console.error("Erreur lors du test canvas:", error);
        }
    }, []);

    // Gestion du redimensionnement de la fenêtre
    useEffect(() => {
        const handleResize = () => {
            console.log(
                "Fenêtre redimensionnée:",
                window.innerWidth,
                window.innerHeight
            );
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
        console.log("Château chargé avec largeur:", width);
        // S'assurer que la largeur est un nombre valide
        if (width && typeof width === "number" && width > 0) {
            setChateauWidth(width);
            // Calculer la taille des cellules en fonction de la largeur du château
            const newCellSize = Math.max(10, Math.round((width / 1024) * 50));
            console.log("Nouvelle taille de cellule:", newCellSize);
            setCellSize(newCellSize);
        } else {
            console.error("Largeur de château invalide:", width);
        }
    };

    const sectionHeight = windowSize.height - headerHeight;

    // Les couleurs pour les caches
    const cacheColors = ["#FF9117", "#B33514", "#FF5700", "#0079B3", "#00FFEA"];

    return (
        <>
            <Header ref={headerRef} ordre={ordre} setOrdre={setOrdre} />

            <section
                className="relative flex flex-col items-center"
                style={{ height: `${sectionHeight}px` }}
            >
                <Chateau
                    ordre={ordre}
                    height={sectionHeight}
                    onLoad={handleChateauLoad}
                />

                {cellSize > 0 && (
                    <>
                        {/* Repères visuels pour le débogage (à retirer en production) */}
                        {process.env.NODE_ENV !== "production" && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div
                                    className="absolute border border-red-500 opacity-30"
                                    style={{
                                        left: `${
                                            (windowSize.width - chateauWidth) /
                                            2
                                        }px`,
                                        width: `${chateauWidth}px`,
                                        height: "100%",
                                    }}
                                />
                            </div>
                        )}

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
                            />
                        ))}

                        {/* Masque */}
                        <DraggableMasque
                            ordre={ordre}
                            cellSize={cellSize}
                            headerHeight={headerHeight}
                            sectionHeight={sectionHeight}
                            chateauWidth={chateauWidth}
                            windowWidth={windowSize.width}
                        />

                        <div
                            className="fixed bottom-2 left-2 flex items-center justify-center"
                            style={{
                                width: `${cellSize * 1.5}px`,
                                height: `${cellSize * 1.5}px`,
                                border: "2px dashed #ff5700",
                                borderRadius: "8px",
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <img
                                id="poubelle"
                                src="/img/poubelle.png"
                                alt="Poubelle"
                                width={cellSize}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </>
                )}
            </section>

            <ContactLink />
            <PaypalButton />
        </>
    );
}

export default App;

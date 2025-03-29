import { useRef, useEffect, useState, useMemo } from "react";

export function Chateau({ ordre, height, onLoad }) {
    const containerRef = useRef(null);
    const [svgData, setSvgData] = useState({
        original: null,
        inverse: null,
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Charger le contenu SVG une seule fois
    useEffect(() => {
        const loadSvg = async () => {
            try {
                const response = await fetch("/src/components/chateau.svg");
                if (!response.ok) {
                    throw new Error(
                        `Erreur lors du chargement du SVG: ${response.status}`
                    );
                }
                const svgText = await response.text();

                // Créer une version inversée du SVG en utilisant un parseur de chaînes
                // plutôt que de manipuler le DOM pour une meilleure performance
                const inverseText = createInverseSvg(svgText);

                setSvgData({
                    original: svgText,
                    inverse: inverseText,
                });
            } catch (error) {
                console.error("Erreur lors du chargement du SVG:", error);
            }
        };

        loadSvg();
    }, []);

    // Fonction pour créer une version inversée du SVG sans manipulation DOM
    const createInverseSvg = (svgText) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        const svgElement = svgDoc.documentElement;

        // Récupérer tous les éléments texte avec des nombres
        const allTexts = Array.from(svgElement.querySelectorAll("text")).filter(
            (text) => {
                const tspan = text.querySelector("tspan");
                return tspan && /^\d{1,2}$/.test(tspan.textContent.trim());
            }
        );

        // Organiser les textes par colonnes (chaque colonne représente les unités)
        const columns = [];
        for (let digit = 0; digit < 10; digit++) {
            columns[digit] = [];
        }

        // Remplir les colonnes en fonction du dernier chiffre du nombre
        allTexts.forEach((text) => {
            const tspan = text.querySelector("tspan");
            const num = parseInt(tspan.textContent, 10);
            const digit = num % 10;
            columns[digit].push({
                element: text,
                tspan: tspan,
                value: num,
                x: parseFloat(tspan.getAttribute("x")),
            });
        });

        // Trier chaque colonne par valeur numérique (de bas en haut)
        columns.forEach((column) => {
            column.sort((a, b) => a.value - b.value);
        });

        // Pour créer la version inversée
        columns.forEach((column) => {
            if (column.length < 2) return; // Ignorer les colonnes vides ou avec un seul élément

            // Stocker les positions X d'origine du premier et du dernier élément
            const firstX = column[0].x;
            const lastX = column[column.length - 1].x;

            // Inverser les valeurs pour toute la colonne
            const values = column.map((item) => item.value);
            const reversedValues = [...values].reverse();

            // Mettre à jour les valeurs
            for (let i = 0; i < column.length; i++) {
                column[i].tspan.textContent = reversedValues[i].toString();
            }

            // Permuter les positions X du premier et du dernier élément si nécessaire
            column[0].tspan.setAttribute("x", lastX.toString());
            column[column.length - 1].tspan.setAttribute(
                "x",
                firstX.toString()
            );
        });

        // Convertir le SVG modifié en chaîne
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svgDoc);
    };

    // Sélectionner le SVG à afficher en fonction de l'ordre
    const svgContent = useMemo(() => {
        if (!svgData.original || !svgData.inverse) return null;
        return ordre === "0-99" ? svgData.inverse : svgData.original;
    }, [ordre, svgData]);

    // Gérer l'affichage du SVG quand son contenu est disponible
    useEffect(() => {
        if (!svgContent || !containerRef.current) return;

        // Nettoyer le contenu précédent
        containerRef.current.innerHTML = "";

        // Créer un élément div temporaire pour parser le SVG
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = svgContent;
        const svgElement = tempDiv.querySelector("svg");

        if (svgElement) {
            // Ajuster la hauteur du SVG
            svgElement.style.height = `${height}px`;
            svgElement.style.width = "auto";
            svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");

            // Ajouter au DOM après avoir configuré
            containerRef.current.appendChild(svgElement);

            // Créer un observateur de redimensionnement
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width } = entry.contentRect;
                    if (width > 0 && !isLoaded) {
                        // Trouver et mesurer les dimensions des cellules
                        setTimeout(() => {
                            const cellData = measureCellDimensions(svgElement);
                            onLoad(width, cellData);
                            setIsLoaded(true);
                            resizeObserver.disconnect();
                        }, 50); // Court délai pour s'assurer que le SVG est rendu
                    }
                }
            });

            resizeObserver.observe(svgElement);

            // Mesurer immédiatement et après un court délai
            setTimeout(() => {
                const { width } = svgElement.getBoundingClientRect();
                if (width > 0 && !isLoaded) {
                    const cellData = measureCellDimensions(svgElement);
                    onLoad(width, cellData);
                    setIsLoaded(true);
                    resizeObserver.disconnect();
                }
            }, 50);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [svgContent, height, onLoad, isLoaded]);

    // Fonction pour mesurer les dimensions des cellules du château
    const measureCellDimensions = (svgElement) => {
        try {
            // Récupérer tous les éléments texte représentant des nombres
            const textElements = Array.from(
                svgElement.querySelectorAll("text")
            ).filter(
                (text) =>
                    text.querySelector("tspan") &&
                    /^\d{1,2}$/.test(
                        text.querySelector("tspan").textContent.trim()
                    )
            );

            if (textElements.length === 0) {
                console.warn("Aucune cellule trouvée dans le SVG");
                return { cellWidth: 30, cellHeight: 30, averageSize: 30 };
            }

            // Mesurer l'espacement horizontal et vertical entre les cellules
            let minXDistance = Infinity;
            let minYDistance = Infinity;

            // Calculer la distance minimale horizontale et verticale
            for (let i = 0; i < textElements.length; i++) {
                const rectI = textElements[i].getBoundingClientRect();
                for (let j = i + 1; j < textElements.length; j++) {
                    const rectJ = textElements[j].getBoundingClientRect();

                    // Calculer la distance horizontale si les éléments sont sur la même ligne
                    if (Math.abs(rectI.top - rectJ.top) < 5) {
                        const xDist = Math.abs(rectI.left - rectJ.left);
                        if (xDist > 5 && xDist < minXDistance) {
                            // Ignorer les distances trop petites
                            minXDistance = xDist;
                        }
                    }

                    // Calculer la distance verticale si les éléments sont dans la même colonne
                    if (Math.abs(rectI.left - rectJ.left) < 5) {
                        const yDist = Math.abs(rectI.top - rectJ.top);
                        if (yDist > 5 && yDist < minYDistance) {
                            // Ignorer les distances trop petites
                            minYDistance = yDist;
                        }
                    }
                }
            }

            // Calculer la taille moyenne des cellules (largeur des nombres + espacement)
            const avgWidth =
                textElements.reduce(
                    (acc, el) => acc + el.getBoundingClientRect().width,
                    0
                ) / textElements.length;

            // Estimer la taille de cellule appropriée
            const cellWidth =
                minXDistance !== Infinity ? minXDistance : avgWidth * 1.5;
            const cellHeight =
                minYDistance !== Infinity ? minYDistance : avgWidth * 1.5;

            // Calculer la taille moyenne à utiliser comme référence
            const averageSize = Math.ceil((cellWidth + cellHeight) / 2);

            return {
                cellWidth: Math.ceil(cellWidth),
                cellHeight: Math.ceil(cellHeight),
                averageSize: averageSize,
                // Inclure le nombre de lignes et colonnes si possible
                rows: 10,
                columns: 10,
            };
        } catch (error) {
            console.error("Erreur lors de la mesure des cellules:", error);
            return { cellWidth: 30, cellHeight: 30, averageSize: 30 };
        }
    };

    return (
        <div className="flex justify-center w-full">
            <div
                ref={containerRef}
                id="chateau-container"
                className="mx-auto relative"
                title="Le château des nombres"
                aria-label="Le château des nombres, tableau de nombres de 0 à 99 arrangés en forme de château"
            />
        </div>
    );
}

export default Chateau;

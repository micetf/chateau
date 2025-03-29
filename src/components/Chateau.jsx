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

            // Utiliser ResizeObserver pour détecter les changements de taille
            const resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width } = entry.contentRect;
                    if (width > 0 && !isLoaded) {
                        onLoad(width);
                        setIsLoaded(true);
                        resizeObserver.disconnect();
                    }
                }
            });

            resizeObserver.observe(svgElement);

            // Mesurer immédiatement et après un court délai
            setTimeout(() => {
                const { width } = svgElement.getBoundingClientRect();
                if (width > 0 && !isLoaded) {
                    onLoad(width);
                    setIsLoaded(true);
                    resizeObserver.disconnect();
                }
            }, 50);

            return () => {
                resizeObserver.disconnect();
            };
        }
    }, [svgContent, height, onLoad, isLoaded]);

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

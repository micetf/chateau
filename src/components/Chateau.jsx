import { useRef, useEffect, useState } from "react";

export function Chateau({ ordre, height, onLoad }) {
    const containerRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [svgContent, setSvgContent] = useState(null);
    const [originalSvg, setOriginalSvg] = useState(null);
    const [inverseSvg, setInverseSvg] = useState(null);

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
                setOriginalSvg(svgText);

                // Créer une version inversée du SVG
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
                const svgElement = svgDoc.documentElement;

                // Récupérer tous les éléments texte avec des nombres
                const allTexts = Array.from(
                    svgElement.querySelectorAll("text")
                ).filter((text) => {
                    const tspan = text.querySelector("tspan");
                    return tspan && /^\d{1,2}$/.test(tspan.textContent.trim());
                });

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
                        column[i].tspan.textContent =
                            reversedValues[i].toString();
                    }

                    // Permuter les positions X du premier et du dernier élément
                    column[0].tspan.setAttribute("x", lastX.toString());
                    column[column.length - 1].tspan.setAttribute(
                        "x",
                        firstX.toString()
                    );
                });

                // Convertir le SVG modifié en chaîne
                const serializer = new XMLSerializer();
                const inverseSvgText = serializer.serializeToString(svgDoc);
                setInverseSvg(inverseSvgText);

                // Définir le contenu initial en fonction de l'ordre
                setSvgContent(ordre === "0-99" ? inverseSvgText : svgText);
            } catch (error) {
                console.error("Erreur lors du chargement du SVG:", error);
            }
        };

        loadSvg();
    }, []);

    // Mettre à jour le SVG lorsque l'ordre change
    useEffect(() => {
        if (originalSvg && inverseSvg) {
            setSvgContent(ordre === "0-99" ? inverseSvg : originalSvg);
        }
    }, [ordre, originalSvg, inverseSvg]);

    // Gérer l'affichage du SVG quand son contenu est disponible
    useEffect(() => {
        if (!svgContent || !containerRef.current) return;

        // Injecter le SVG dans le DOM
        containerRef.current.innerHTML = svgContent;
        const svgElement = containerRef.current.querySelector("svg");

        if (svgElement) {
            // Ajuster la hauteur du SVG
            svgElement.style.height = `${height}px`;
            svgElement.style.width = "auto";

            // Calculer la largeur et notifier le parent
            setTimeout(() => {
                const width = svgElement.getBoundingClientRect().width;
                if (width > 0) {
                    console.log("SVG chargé, largeur:", width);
                    onLoad(width);
                    setIsLoaded(true);
                } else {
                    // Fallback si la largeur est 0
                    console.warn(
                        "Largeur du SVG est 0, utilisation de la valeur par défaut"
                    );
                    onLoad(867); // Valeur par défaut basée sur la largeur naturelle du SVG
                    setIsLoaded(true);
                }
            }, 50);
        }
    }, [svgContent, height, onLoad]);

    return (
        <div className="flex justify-center w-full">
            <div
                ref={containerRef}
                id="chateau-container"
                className="mx-auto"
                title="Le château des nombres"
            />
        </div>
    );
}

export default Chateau;

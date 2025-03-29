/**
 * Crée une image de cache colorée
 * @param {string} color - Couleur du cache
 * @param {number} cellSize - Taille de la cellule
 * @returns {string} URL de l'image générée
 */
export function createCacheImage(color, cellSize) {
    console.log(
        `Tentative de création de cache: couleur=${color}, cellSize=${cellSize}`
    );

    try {
        // Vérification stricte des paramètres
        if (!color) {
            console.error("Couleur manquante pour createCacheImage:", color);
            return "";
        }

        if (!cellSize || isNaN(cellSize) || cellSize <= 0) {
            console.error(
                "Taille de cellule invalide pour createCacheImage:",
                cellSize
            );
            return "";
        }

        const canvas = document.createElement("canvas");

        // Créer un canvas avec des dimensions sûres
        const size = Math.round(cellSize);
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        // Assurons-nous que le contexte existe
        if (!ctx) {
            console.error("Impossible d'obtenir le contexte 2D du canvas");
            return "";
        }

        // Dessiner un rectangle coloré avec bordure
        try {
            // Fond coloré
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, size, size);

            // Bordure
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
            ctx.strokeRect(0, 0, size, size);

            // Convertir en URL d'image
            const imageUrl = canvas.toDataURL("image/png");
            console.log(
                "Cache créé avec succès, URL:",
                imageUrl.substring(0, 30) + "..."
            );
            return imageUrl;
        } catch (e) {
            console.error("Erreur lors du dessin sur le canvas:", e);
            return "";
        }
    } catch (e) {
        console.error("Erreur générale lors de la création du cache:", e);
        return "";
    }
}

/**
 * Crée une image de masque complexe
 * @param {string} ordre - Ordre de numérotation (0-99 ou 99-0)
 * @param {number} cellSize - Taille de la cellule
 * @returns {string} URL de l'image générée
 */
export function createMasqueImage(ordre, cellSize) {
    // Vérification stricte des paramètres
    if (!ordre || !cellSize || cellSize <= 0) {
        console.error("Paramètres invalides pour createMasqueImage:", {
            ordre,
            cellSize,
        });
        return "";
    }

    try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            console.error("Impossible d'obtenir le contexte 2D du canvas");
            return "";
        }

        // Dimensions du canvas
        const canvasWidth = cellSize * 3;
        const canvasHeight = cellSize * 3;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        console.log("Création du masque avec dimensions:", {
            canvasWidth,
            canvasHeight,
        });

        // Configuration du style
        ctx.fillStyle = "#FFFF00";
        ctx.lineWidth = 4;
        ctx.strokeStyle = "black";

        // Fonction pour dessiner une zone
        const drawZone = (x, y, text = "") => {
            ctx.fillRect(x, y, cellSize, cellSize);
            ctx.strokeRect(x, y, cellSize, cellSize);

            if (text) {
                ctx.save();
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                // Utiliser une taille de police adaptée mais pas trop petite
                const fontSize = Math.max(12, Math.floor(cellSize / 3));
                ctx.font = `bold ${fontSize}px Arial`;
                ctx.fillText(text, x + cellSize / 2, y + cellSize / 2);
                ctx.restore();
            }
        };

        // Dessiner les cellules une par une
        try {
            // Première ligne
            drawZone(0, 0);
            drawZone(cellSize, 0, ordre === "0-99" ? "+10" : "-10");
            drawZone(2 * cellSize, 0);

            // Ligne du milieu
            drawZone(0, cellSize, "-1");
            // Zone centrale sans texte
            ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
            ctx.strokeRect(cellSize, cellSize, cellSize, cellSize);
            drawZone(2 * cellSize, cellSize, "+1");

            // Dernière ligne
            drawZone(0, 2 * cellSize);
            drawZone(cellSize, 2 * cellSize, ordre === "0-99" ? "-10" : "+10");
            drawZone(2 * cellSize, 2 * cellSize);

            // Convertir en image
            const imageUrl = canvas.toDataURL("image/png");
            console.log(
                "Masque créé avec succès",
                imageUrl.substring(0, 30) + "..."
            );
            return imageUrl;
        } catch (e) {
            console.error("Erreur lors du dessin du masque:", e);
            return "";
        }
    } catch (e) {
        console.error("Erreur générale lors de la création du masque:", e);
        return "";
    }
}

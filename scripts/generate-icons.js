// scripts/generate-icons.js
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Chemin de base
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const publicImgDir = path.join(rootDir, "public", "img");

// Fonction pour garantir l'existence du dossier
async function ensureDir(dirPath) {
    try {
        await fs.access(dirPath);
    } catch (error) {
        await fs.mkdir(dirPath, { recursive: true });
    }
}

// Génération des icônes
async function generateIcons() {
    console.log("Génération des icônes PWA...");

    // S'assurer que le dossier existe
    await ensureDir(publicImgDir);

    // Chemin de l'icône source
    const sourceIcon = path.join(publicImgDir, "icon-512.png");

    try {
        // Vérifier que l'icône source existe
        await fs.access(sourceIcon);
        console.log("✅ Icône source trouvée:", sourceIcon);

        // 1. Générer l'icône 192x192
        await sharp(sourceIcon)
            .resize(192, 192)
            .toFile(path.join(publicImgDir, "icon-192.png"));
        console.log("✅ Généré: icon-192.png");

        // 2. Générer les icônes maskable
        // Pour les icônes maskable, nous devons réduire l'image à environ 80%
        // de la taille du canevas et la centrer.

        // Icône maskable 192x192
        await sharp(sourceIcon)
            .resize(154, 154) // 80% de 192x192
            .extend({
                top: 19,
                bottom: 19,
                left: 19,
                right: 19,
                background: { r: 83, g: 110, b: 125, alpha: 1 }, // #536e7d (couleur de fond de votre app)
            })
            .toFile(path.join(publicImgDir, "icon-maskable-192.png"));
        console.log("✅ Généré: icon-maskable-192.png");

        // Icône maskable 512x512
        await sharp(sourceIcon)
            .resize(410, 410) // 80% de 512x512
            .extend({
                top: 51,
                bottom: 51,
                left: 51,
                right: 51,
                background: { r: 83, g: 110, b: 125, alpha: 1 }, // #536e7d
            })
            .toFile(path.join(publicImgDir, "icon-maskable-512.png"));
        console.log("✅ Généré: icon-maskable-512.png");

        console.log("Toutes les icônes ont été générées avec succès!");
    } catch (error) {
        console.error("❌ Erreur lors de la génération des icônes:", error);
        throw error; // Propager l'erreur pour arrêter l'exécution en cas d'échec
    }
}

// Conversion des captures d'écran
async function convertScreenshots() {
    console.log("\nConversion des captures d'écran...");

    // Créer le dossier screenshots s'il n'existe pas
    const screenshotsDir = path.join(rootDir, "screenshots");
    await ensureDir(screenshotsDir);

    // Définir les captures d'écran sources et leurs destinations
    const screenshotsSource = [
        {
            source: path.join(screenshotsDir, "narrow.png"),
            dest: "screenshot-narrow.webp",
            width: 540,
            height: 720,
        },
        {
            source: path.join(screenshotsDir, "wide.png"),
            dest: "screenshot-wide.webp",
            width: 1024,
            height: 600,
        },
    ];

    let allConverted = true;

    for (const screenshot of screenshotsSource) {
        try {
            await fs.access(screenshot.source);

            await sharp(screenshot.source)
                .resize(screenshot.width, screenshot.height, {
                    fit: "cover",
                    position: "center",
                })
                .webp({ quality: 80 })
                .toFile(path.join(publicImgDir, screenshot.dest));

            console.log(`✅ Généré: ${screenshot.dest}`);
        } catch (error) {
            if (error.code === "ENOENT") {
                console.warn(
                    `⚠️ Fichier source ${path.basename(
                        screenshot.source
                    )} non trouvé.`
                );
                console.warn(
                    `   Créez une capture d'écran ${path.basename(
                        screenshot.source
                    )} dans le dossier /screenshots`
                );
                console.warn(
                    `   Dimensions requises: ${screenshot.width}x${screenshot.height}`
                );
            } else {
                console.error(
                    `❌ Erreur lors de la conversion de ${path.basename(
                        screenshot.source
                    )}: ${error.message}`
                );
            }
            allConverted = false;
        }
    }

    if (!allConverted) {
        console.log("\n⚠️ Instructions pour les captures d'écran:");
        console.log("1. Ouvrez votre application dans le navigateur");
        console.log("2. Utilisez le mode de développement responsive (F12)");
        console.log("3. Configurez les dimensions:");
        console.log("   - Pour narrow.png: 540×720px");
        console.log("   - Pour wide.png: 1024×600px");
        console.log(
            "4. Prenez des captures d'écran et sauvegardez-les dans le dossier /screenshots"
        );
        console.log(
            "5. Relancez cette commande pour générer les fichiers WebP"
        );
    }

    return allConverted;
}

// Fonction principale
async function main() {
    try {
        // Assurer que le dossier screenshots existe
        await ensureDir(path.join(rootDir, "screenshots"));

        // Générer les icônes
        await generateIcons();

        // Convertir les captures d'écran
        const screenshotsConverted = await convertScreenshots();

        if (screenshotsConverted) {
            console.log(
                "\n✅ Toutes les ressources ont été générées avec succès!"
            );
        } else {
            console.log(
                "\n⚠️ Certaines ressources n'ont pas pu être générées."
            );
            console.log(
                "   Une fois les captures d'écran créées, relancez cette commande."
            );
        }
    } catch (error) {
        console.error(
            "\n❌ Une erreur est survenue lors de la génération des ressources:",
            error
        );
        process.exit(1);
    }
}

// Exécuter le script
main();

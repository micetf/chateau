// scripts/optimize-images.js
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// Chemin de base
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const tempDir = path.join(rootDir, "temp-img-optimize");

// Configuration
const IMAGE_DIRS = ["img"]; // Suppression de img-micetf qui n'est plus nécessaire
const FORMATS = ["webp", "avif"]; // Formats modernes à générer
const SIZES = {
    // Tailles à générer pour les images responsive
    "chateau.png": [400, 600, 800, 1024],
    "chateau-inverse.png": [400, 600, 800, 1024],
    // Pour les autres, nous conservons uniquement la taille originale
};

// Options de compression par format
const COMPRESSION_OPTIONS = {
    webp: { quality: 80, lossless: false },
    avif: { quality: 65, lossless: false },
    png: { compressionLevel: 9, quality: 80 },
    jpg: { quality: 85 },
    jpeg: { quality: 85 },
};

/**
 * Crée un dossier temporaire pour le traitement
 */
async function setupTempDir() {
    try {
        // Vérifier si le dossier temporaire existe et le supprimer s'il existe
        try {
            await fs.access(tempDir);
            // Supprimer le dossier temporaire récursivement
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch (err) {
            // Le dossier n'existe pas, c'est normal
        }

        // Créer un nouveau dossier temporaire
        await fs.mkdir(tempDir, { recursive: true });
        console.log("✅ Dossier temporaire créé:", tempDir);
    } catch (error) {
        console.error(
            "❌ Erreur lors de la création du dossier temporaire:",
            error
        );
        throw error;
    }
}

/**
 * Nettoie le dossier temporaire
 */
async function cleanupTempDir() {
    try {
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log("✅ Dossier temporaire supprimé");
    } catch (error) {
        console.error(
            "❌ Erreur lors de la suppression du dossier temporaire:",
            error
        );
    }
}

/**
 * Extrait le nom du fichier sans extension
 * @param {string} filename Nom du fichier avec extension
 * @returns {string} Nom du fichier sans extension
 */
function getBaseName(filename) {
    // Trouver la position du premier point dans le nom du fichier
    const dotIndex = filename.indexOf(".");
    if (dotIndex === -1) return filename;
    return filename.substring(0, dotIndex);
}

/**
 * Optimise une image avec Sharp
 * @param {string} inputPath Chemin de l'image source
 * @param {string} outputDir Répertoire de destination
 * @param {string} filename Nom du fichier
 * @param {number|null} width Largeur cible (null = conserver la taille originale)
 */
async function optimizeImage(inputPath, outputDir, filename, width = null) {
    try {
        // Extraire le nom de base et l'extension
        const extname = path.extname(filename).toLowerCase();
        const basename = getBaseName(filename);

        // Créer le répertoire de sortie s'il n'existe pas
        await fs.mkdir(outputDir, { recursive: true });

        // Charger l'image
        const pipeline = sharp(inputPath);
        const metadata = await pipeline.metadata();

        // Calculer le nom de fichier pour les versions redimensionnées
        let outputBasename = basename;
        let resizedPipeline = pipeline;

        // Redimensionner si nécessaire
        if (width) {
            // Si width est spécifié, redimensionner même si la source est plus petite
            // (éviter le problème où les grandes tailles ne sont pas générées)
            resizedPipeline = pipeline.resize(width, null, {
                fit: "inside",
                withoutEnlargement: false, // Permettre d'agrandir si nécessaire
            });

            // Ajouter le suffixe de taille
            outputBasename = `${basename}-${width}`;
            console.log(`🔄 Redimensionnement à ${width}px: ${outputBasename}`);
        }

        // Déterminer le format d'origine
        const originalFormat = extname.replace(".", "").toLowerCase();

        // Générer le format original optimisé (seulement pour png, jpg, jpeg)
        if (["png", "jpg", "jpeg"].includes(originalFormat)) {
            const tempOutputPath = path.join(
                tempDir,
                `${outputBasename}-temp.${originalFormat}`
            );
            const finalOutputPath = path.join(
                outputDir,
                `${outputBasename}${extname}`
            );

            // Générer d'abord dans le dossier temporaire
            await resizedPipeline
                .clone()
                [originalFormat](COMPRESSION_OPTIONS[originalFormat] || {})
                .toFile(tempOutputPath);

            // Puis copier vers la destination finale (évite le problème d'entrée/sortie identiques)
            await fs.copyFile(tempOutputPath, finalOutputPath);
            console.log(`✅ Optimisé: ${outputBasename}${extname}`);
        }

        // Générer les formats modernes
        for (const format of FORMATS) {
            const options = COMPRESSION_OPTIONS[format] || {};
            const outputPath = path.join(
                outputDir,
                `${outputBasename}.${format}`
            );

            await resizedPipeline.clone()[format](options).toFile(outputPath);
            console.log(`✅ Converti: ${outputBasename}.${format}`);
        }
    } catch (error) {
        console.error(
            `❌ Erreur lors de l'optimisation de ${inputPath}:`,
            error
        );
    }
}

/**
 * Parcourt un répertoire à la recherche d'images
 * @param {string} dir Répertoire à parcourir
 */
async function processDirectory(dir) {
    try {
        const files = await fs.readdir(dir);

        // Traiter les fichiers de manière séquentielle pour éviter les problèmes d'asynchrone
        for (const file of files) {
            const inputPath = path.join(dir, file);
            const stats = await fs.stat(inputPath);

            if (stats.isDirectory()) {
                // Récursion dans les sous-répertoires
                await processDirectory(inputPath);
            } else {
                // Vérifier si c'est une image et éviter de traiter les formats déjà optimisés
                const ext = path.extname(file).toLowerCase();
                const isAlreadyOptimized =
                    file.includes(".webp") || file.includes(".avif");

                if (
                    [".png", ".jpg", ".jpeg", ".gif"].includes(ext) &&
                    !isAlreadyOptimized
                ) {
                    // Vérifier si cette image doit être générée en plusieurs tailles
                    const sizes = SIZES[file] || [null]; // null = taille originale

                    // Traiter chaque taille de manière séquentielle pour être sûr que tout est généré
                    for (const size of sizes) {
                        await optimizeImage(inputPath, dir, file, size);
                    }
                }
            }
        }
    } catch (error) {
        console.error(`❌ Erreur lors du parcours de ${dir}:`, error);
    }
}

/**
 * Fonction principale
 */
async function main() {
    console.log("🔍 Début de l'optimisation des images...");

    try {
        // Configuration du dossier temporaire
        await setupTempDir();

        // Traiter chaque répertoire d'images de manière séquentielle
        for (const imageDir of IMAGE_DIRS) {
            const dirPath = path.join(publicDir, imageDir);
            try {
                await fs.access(dirPath);
                console.log(`🖼️ Traitement du répertoire: ${imageDir}`);
                await processDirectory(dirPath);
            } catch (error) {
                console.warn(`⚠️ Répertoire non trouvé: ${dirPath}`);
                console.log(`🔧 Création du répertoire ${imageDir}...`);
                try {
                    await fs.mkdir(dirPath, { recursive: true });
                    console.log(`✅ Répertoire ${imageDir} créé avec succès.`);
                } catch (mkdirError) {
                    console.error(
                        `❌ Impossible de créer le répertoire ${imageDir}: ${mkdirError}`
                    );
                }
            }
        }

        console.log("✨ Optimisation des images terminée!");
    } finally {
        // Nettoyage du dossier temporaire, même en cas d'erreur
        await cleanupTempDir();
    }
}

// Exécuter le script
main().catch(console.error);

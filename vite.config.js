import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";

// Plugin pour copier le SVG dans le dossier public durant le build
const copyChateauSvgPlugin = () => {
    return {
        name: "copy-chateau-svg",
        buildStart() {
            // Seulement pour le build de production
            if (process.env.NODE_ENV === "production") {
                const srcPath = resolve(
                    __dirname,
                    "src/components/chateau.svg"
                );
                const destDir = resolve(__dirname, "public/img");
                const destPath = resolve(destDir, "chateau.svg");

                // Créer le répertoire de destination s'il n'existe pas
                if (!existsSync(dirname(destPath))) {
                    mkdirSync(dirname(destPath), { recursive: true });
                }

                // Copier le fichier
                try {
                    copyFileSync(srcPath, destPath);
                    console.log(
                        "chateau.svg copié avec succès dans public/img/"
                    );
                } catch (error) {
                    console.error(
                        "Erreur lors de la copie de chateau.svg:",
                        error
                    );
                }
            }
        },
    };
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), copyChateauSvgPlugin()],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
    },
    publicDir: "public",
    server: {
        open: true,
    },
});

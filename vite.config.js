// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { imagetools } from "vite-imagetools";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    assetsInclude: ["**/*.pdf"],
    plugins: [
        react(),
        imagetools({
            defaultDirectives: new URLSearchParams([
                ["format", "webp;avif;original"], // Générer des formats modernes en plus de l'original
                ["quality", "80"], // Qualité par défaut
                ["lossless", "false"], // Compression avec perte
                ["optimize", "true"], // Optimiser les images
            ]),
        }),
        VitePWA({
            registerType: "prompt",
            strategies: "generateSW",
            srcDir: "src",
            filename: "service-worker.js",
            workbox: {
                globPatterns: [
                    "**/*.{js,css,html,png,jpg,jpeg,gif,svg,webp,avif,ico}",
                ],
                // Stratégie de cache pour les images
                runtimeCaching: [
                    {
                        urlPattern:
                            /^https:\/\/micetf\.fr\/.*\.(png|jpg|jpeg|svg|gif|webp|avif)$/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "chateau-images",
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
                            },
                        },
                    },
                ],
            },
            manifest: {
                name: "Le Château des Nombres",
                short_name: "Château",
                description:
                    "Application pédagogique pour l'apprentissage des nombres",
                theme_color: "#536e7d",
                background_color: "#1a3540",
                start_url: "./",
                icons: [
                    {
                        src: "./img/icon-192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "./img/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            devOptions: {
                enabled: true,
            },
        }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: "dist",
        assetsDir: "assets",
        emptyOutDir: true,
        // Configuration de compression et d'optimisation des ressources statiques
        rollupOptions: {
            output: {
                manualChunks: {
                    "react-vendor": ["react", "react-dom", "react-draggable"],
                    "ui-vendor": ["jquery", "jquery-ui"],
                },
                // Nommage intelligent des fichiers pour un meilleur cache
                entryFileNames: "assets/[name]-[hash].js",
                chunkFileNames: "assets/[name]-[hash].js",
                assetFileNames: "assets/[name]-[hash].[ext]",
            },
        },
        // Activer la minification et l'optimisation des CSS
        cssCodeSplit: true,
        cssMinify: true,
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    publicDir: "public",
    server: {
        open: true,
    },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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

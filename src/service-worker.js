// src/service-worker.js
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { setCacheNameDetails } from "workbox-core";

// Définir des noms de cache personnalisés
setCacheNameDetails({
    prefix: "chateau",
    suffix: "v1",
    precache: "app-shell",
    runtime: "runtime",
});

// Utiliser le manifest généré par Workbox/vite-plugin-pwa
self.__WB_MANIFEST = self.__WB_MANIFEST || [];
precacheAndRoute(self.__WB_MANIFEST);

// Gestion des URLs de navigation (pour le SPA)
const handler = createHandlerBoundToURL("/index.html");
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);

// Cache pour les images optimisées (WebP, AVIF) - stratégie Cache First
registerRoute(
    ({ request, url }) =>
        request.destination === "image" &&
        (url.pathname.endsWith(".webp") || url.pathname.endsWith(".avif")),
    new CacheFirst({
        cacheName: "chateau-optimized-images",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
            }),
        ],
    })
);

// Cache pour les images principales du château - stratégie Cache First
registerRoute(
    ({ url }) =>
        url.pathname.includes("/img/chateau") ||
        url.pathname.includes("/img/masque") ||
        url.pathname.includes("/img/cache-"),
    new CacheFirst({
        cacheName: "chateau-app-images",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
            }),
        ],
    })
);

// Pour les autres ressources statiques - stratégie Stale While Revalidate
registerRoute(
    ({ request }) =>
        request.destination === "script" ||
        request.destination === "style" ||
        request.destination === "font",
    new StaleWhileRevalidate({
        cacheName: "chateau-static-resources",
        plugins: [
            new ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
            }),
        ],
    })
);

// Notification d'installation
self.addEventListener("install", (event) => {
    self.skipWaiting(); // Activer immédiatement le nouveau service worker
});

// Notification quand le service worker prend le contrôle
self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());

    // Nettoyer les anciens caches si nécessaire
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return (
                            cacheName.startsWith("chateau-") &&
                            !cacheName.endsWith("-v1")
                        );
                    })
                    .map((cacheName) => {
                        return caches.delete(cacheName);
                    })
            );
        })
    );
});

// Gérer les messages depuis l'application
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

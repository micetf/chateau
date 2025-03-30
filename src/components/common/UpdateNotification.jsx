// src/components/common/UpdateNotification.jsx
import { useState, useEffect } from "react";

function UpdateNotification() {
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        // Écouter les mises à jour du service worker
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;

                    newWorker.addEventListener("statechange", () => {
                        if (
                            newWorker.state === "installed" &&
                            navigator.serviceWorker.controller
                        ) {
                            // Une mise à jour est disponible
                            setUpdateAvailable(true);
                        }
                    });
                });
            });

            // Écouter les messages du service worker
            navigator.serviceWorker.addEventListener("message", (event) => {
                if (event.data && event.data.type === "UPDATE_AVAILABLE") {
                    setUpdateAvailable(true);
                }
            });
        }
    }, []);

    const handleUpdate = () => {
        if ("serviceWorker" in navigator) {
            // Envoyer un message au service worker pour passer à la nouvelle version
            navigator.serviceWorker.ready.then((registration) => {
                registration.waiting.postMessage({ type: "SKIP_WAITING" });
            });

            // Recharger la page après une courte pause
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    };

    if (!updateAvailable) return null;

    return (
        <div className="fixed bottom-16 right-6 bg-header text-text-primary px-4 py-3 rounded-lg shadow-lg z-50 max-w-xs border border-text-secondary animate-fade-in">
            <p className="mb-2">Une mise à jour est disponible !</p>
            <div className="flex justify-end">
                <button
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                >
                    Mettre à jour
                </button>
            </div>
        </div>
    );
}

export default UpdateNotification;

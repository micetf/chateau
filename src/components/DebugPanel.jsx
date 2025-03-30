import React, { useState } from "react";
import { useChateauContext } from "../contexts/ChateauContext";

function DebugPanel() {
    const [isVisible, setIsVisible] = useState(false);
    const context = useChateauContext();

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed top-20 right-2 z-50 p-1 bg-header text-text-primary text-xs rounded opacity-30 hover:opacity-100"
            >
                Debug
            </button>
        );
    }

    return (
        <div className="fixed top-20 right-2 z-50 bg-header text-text-primary p-2 rounded-md text-xs shadow-lg max-w-sm max-h-96 overflow-auto">
            <div className="flex justify-between mb-2">
                <h3 className="font-bold">État global</h3>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-text-secondary hover:text-text-primary"
                >
                    ✕
                </button>
            </div>

            <div>
                <h4 className="font-semibold">Général</h4>
                <div className="ml-2">
                    <p>Ordre: {context.ordre}</p>
                    <p>
                        Histoire: {context.historyIndex + 1}/
                        {context.history.length}
                    </p>
                </div>

                <h4 className="font-semibold mt-2">Dimensions</h4>
                <div className="ml-2">
                    <p>Cellule: {context.cellSize}px</p>
                    <p>Masque: {context.masqueSize}px</p>
                    <p>Portrait: {context.isPortrait ? "Oui" : "Non"}</p>
                    <p>Mobile: {context.isMobile ? "Oui" : "Non"}</p>
                </div>

                <h4 className="font-semibold mt-2">Éléments</h4>
                <div className="ml-2">
                    <p>Caches: {context.caches.length}</p>
                    <p>Masques: {context.masques.length}</p>
                </div>
            </div>
        </div>
    );
}

export default DebugPanel;

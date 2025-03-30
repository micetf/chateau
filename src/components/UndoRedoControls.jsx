import React from "react";
import { useChateauContext } from "../contexts/ChateauContext";

function UndoRedoControls() {
    const { history, historyIndex, undo, redo, isMobile } = useChateauContext();

    // Déterminer si les boutons doivent être désactivés
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    return (
        <div className="flex gap-2 mb-2">
            <button
                onClick={undo}
                disabled={!canUndo}
                className={`bg-header hover:bg-opacity-80 text-text-primary px-2 py-1 rounded-md text-sm md:text-base font-medium transition-colors border border-text-secondary shadow-md h-10 md:h-12 w-10 md:w-12 flex items-center justify-center
          ${!canUndo ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Annuler la dernière action"
                aria-label="Annuler"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                >
                    <path d="M9 14L4 9l5-5" />
                    <path d="M4 9h11a4 4 0 0 1 0 8h-1" />
                </svg>
            </button>

            <button
                onClick={redo}
                disabled={!canRedo}
                className={`bg-header hover:bg-opacity-80 text-text-primary px-2 py-1 rounded-md text-sm md:text-base font-medium transition-colors border border-text-secondary shadow-md h-10 md:h-12 w-10 md:w-12 flex items-center justify-center
          ${!canRedo ? "opacity-50 cursor-not-allowed" : ""}`}
                title="Rétablir l'action annulée"
                aria-label="Rétablir"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                >
                    <path d="M15 14l5-5-5-5" />
                    <path d="M20 9H9a4 4 0 0 0 0 8h1" />
                </svg>
            </button>
        </div>
    );
}

export default UndoRedoControls;

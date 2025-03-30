import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChateauProvider } from "./contexts/ChateauContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ChateauProvider>
            <App />
        </ChateauProvider>
    </React.StrictMode>
);

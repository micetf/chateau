/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#536e7d",
                header: "#1a3540",
                "text-primary": "#f2dcb3",
                "text-secondary": "#f2b28d",
                "blue-400": "#60a5fa",
                "blue-600": "#2563eb",
                "blue-700": "#1d4ed8",
                "yellow-600": "#ca8a04",
                "yellow-700": "#a16207",
                "gray-600": "#4b5563",
                "gray-700": "#374151",
                "gray-800": "#1f2937",
            },
        },
    },
    plugins: [],
};

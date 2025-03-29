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
            },
        },
    },
    plugins: [],
};

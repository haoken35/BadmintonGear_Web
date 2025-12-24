/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                poppins: ["var(--font-poppins)", "sans-serif"],
                montserrat: ["var(--font-montserrat)", "sans-serif"],
            },
            colors: {
                primary: "#FF8200", // Màu chính
                background: "#F5F5F5", // Màu nền
                text: "#252B42",
                text2: "#737374",
                text3: "#FF8200"
            },
        },
        plugins: [],
    }
};

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				circular: ['"Flow Circular"', "sans-serif"],
				"source-code": ['"Source Code Pro"', "monospace"],
				"work-sans": ['"Work Sans"', "sans-serif"],
			},
		},
	},
	plugins: [],
};

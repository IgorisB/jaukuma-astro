/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Main colors
				primary: {
					DEFAULT: '#333F48', // Dark blue-gray
					light: '#4A5A66',
					dark: '#1A2229',
				},
				secondary: {
					DEFAULT: '#D6D2C4', // Light beige
					light: '#EBE9E0',
					dark: '#BFB9A9',
				},
				// Additional colors
				additional: {
					red: '#A45248',
					blue: '#166886',
					green: '#6A7866',
				},
				// Auxiliary colors
				aux: {
					cream: '#EFDBB2',
					peach: '#EACBBB',
					mint: '#BFCEC2',
					sky: '#B9C9CC',
					tan: '#BAA58D',
				},
				light: '#F3F1E8',
			},
			fontFamily: {
				serif: ['Playfair Display', 'Times New Roman', 'serif'],
				sans: ['Source Sans Pro', 'Verdana', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
			},
			fontSize: {
				// Custom responsive text sizes (base mobile sizes)
				'main-title': '2.5rem', // 40px mobile
				'accent-title': '2.5rem', // 40px mobile
				'section-title': '2.5rem', // 40px mobile
				'item-title': '1.5rem', // 24px mobile
			},
			maxWidth: {
				'page': '1536px', // var(--max-page-width)
			},
			minWidth: {
				'page': '376px', // var(--min-page-width)
			},
			screens: {
				'xs': '376px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			},
			zIndex: {
				'1': '1',
				'2': '2',
				'3': '3',
				'1000': '1000',
				'sticky': '99999',
				'mobile-menu': '99999',
				'sticky-header': '999999',
			},
			keyframes: {
				bounce: {
					'0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
					'40%': { transform: 'translateY(-10px)' },
					'60%': { transform: 'translateY(-5px)' },
				},
			},
			animation: {
				'bounce': 'bounce 2s infinite',
			},
			boxShadow: {
				'page': '-10px 0 20px rgba(0, 0, 0, 0.2), 10px 0 20px rgba(0, 0, 0, 0.2)',
			},
		},
	},
	plugins: [],
}

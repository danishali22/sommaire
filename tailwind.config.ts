import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
    content: [
        './app/**/*.{ts,tsx}',     // Next.js App Router
        './pages/**/*.{ts,tsx}',   // If using Pages Router
        './components/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',     // Optional: if your components are in /src
    ],
    theme: {
        extend: {},
    },
    plugins: [animate],
}
export default config

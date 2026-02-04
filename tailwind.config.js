import designSystem from '@iniguezmarc/design-system/tailwind.preset';

/** @type {import('tailwindcss').Config} */
export default {
    presets: [designSystem],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@iniguezmarc/design-system/dist/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}

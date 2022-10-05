const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        screens: {
            '2xs': '400px',
            xs: '475px',
            ...defaultTheme.screens,
        },
        colors: {
            red: colors.red,
            green: colors.green,
            sky: colors.sky,
            gray: colors.stone,
            white: colors.white,
            black: colors.black,
        },
    },
}

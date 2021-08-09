const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        screens: {
            xs: '475px',
            ...defaultTheme.screens,
        },
        colors: {
            red: colors.red,
            green: colors.green,
            sky: colors.sky,
            gray: colors.warmGray,
            white: colors.white,
            black: colors.black,
        },
    },
}

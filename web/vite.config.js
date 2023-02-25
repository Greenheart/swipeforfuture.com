import { sveltekit } from '@sveltejs/kit/vite'
import { resolve } from 'path'
import { setDefaultResultOrder } from 'dns'

setDefaultResultOrder('verbatim')

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit()],
    resolve: {
        alias: {
            $components: resolve('./src/components'),
            $util: resolve('./src/util'),
            $game: resolve('./src/game'),
            $shared: resolve('../shared'),
        },
    },
    server: {
        port: 3000,
    },
}

export default config

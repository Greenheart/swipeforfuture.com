import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
import { resolve } from 'path'
import { setDefaultResultOrder } from 'dns'

setDefaultResultOrder('verbatim')

/** @type {import('vite').UserConfig} */
const config = {
    plugins: [sveltekit(), Icons({ compiler: 'svelte' })],
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

import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
export default {
    preprocess: [
        preprocess({
            postcss: true,
        }),
    ],
    kit: {
        adapter: adapter(),
        trailingSlash: 'never',
    },
}

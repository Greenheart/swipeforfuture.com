<script lang="ts">
    export let href = ''
    export let external = false
    const additionalProps = external ? { rel: 'noopener noreferrer', target: '_blank' } : {'sveltekit:prefetch': true }
</script>

<a {href} {...$$props} {...additionalProps}>
    <slot />
</a>

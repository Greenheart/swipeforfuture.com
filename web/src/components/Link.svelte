<script lang="ts">
    export let href = ''
    export let external = false
    const additionalProps = external
        ? {
              rel: 'noopener noreferrer',
              target: '_blank',
              'data-sveltekit-prefetch': 'off',
          }
        : {}
</script>

<a {href} {...$$props} {...additionalProps}>
    <slot />
</a>

<script lang="ts" context="module">
    import { fade, fly } from 'svelte/transition'
    import { beforeUpdate, tick } from 'svelte'

    import { Card } from '$components'
    import type { CardPresentation } from '$game/Types'
    import type { SwipeDirection } from '$util/constants'

    const imageSize =
        'w-[60vmin] h-[60vmin] 2xs:w-[85vmin] 2xs:h-[85vmin] max-w-[400px] max-h-[400px] rounded-lg'
</script>

<script lang="ts">
    export let card: CardPresentation
    export let onSwipe: (direction: SwipeDirection) => void

    beforeUpdate(async () => {
        await tick()
    })
</script>

<div
    class="flex flex-col items-center justify-center text-white 2xs:text-lg xs:text-xl font-light max-w-prose m-auto card"
>
    <div class="h-36 2xs:h-44 xs:h-56 xs:py-4 text-center px-4 xs:px-8">
        {#key card}
            <div class="w-full h-full grid place-items-center">
                <p in:fly={{ duration: 200, delay: 200, y: -5 }}>
                    {card.text}
                </p>
            </div>
        {/key}
    </div>

    <div class="{imageSize} relative">
        <div class="absolute z-0 {imageSize} top-0 left-0 bg-gray-900" />
        <Card {onSwipe} actions={card.actions} {imageSize}>
            {#key card}
                <div
                    in:fly={{ duration: 200, y: -5 }}
                    style="background-image: url({card.image})"
                    class="bg-no-repeat bg-center {imageSize} z-10 bg-cover"
                />
            {/key}
        </Card>
    </div>

    <div class="h-14 text-center my-2 xs:my-4">
        {#key card}
            <div class="h-full" in:fade={{ duration: 200, delay: 200 }}>
                <h2>{card.title}</h2>
                <p class="text-gray-300">{card.location}</p>
            </div>
        {/key}
    </div>
</div>

<style>
    /*
     * Improve browser rendering performance by specifying that the size and layout
     * of the childrens within the card won't affect other parts of the page.
     * Less work for the browser = better performance.
     * https://developer.mozilla.org/en-US/docs/Web/CSS/contain
     */
    .card {
        contain: size, layout;
    }
</style>

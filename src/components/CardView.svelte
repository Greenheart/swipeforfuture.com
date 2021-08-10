<script lang="ts" context="module">
    import type { CardPresentation } from '$game/Types'
    import Card from '$components/Card.svelte'
</script>

<script lang="ts">
    import type { SwipeDirection } from '$util/constants'

    export let card: CardPresentation
    export let onSwipe: (direction: SwipeDirection) => void

    const imageSize =
        'w-[85vmin] h-[85vmin] max-w-[400px] max-h-[400px] rounded-lg'
</script>

<div
    class="flex flex-col items-center justify-center text-white font-light max-w-prose px-4 m-auto"
>
    <p class="text-center py-4 h-40 flex place-items-center">{card.text}</p>
    <div class="{imageSize} relative">
        <div class="absolute z-0 {imageSize} top-0 left-0 bg-gray-900" />
        <Card {onSwipe}>
            <div
                style="background-image: url({card.image})"
                class="bg-no-repeat bg-center {imageSize} z-10"
            />
        </Card>
    </div>
    <h2 class="mt-8">{card.title}</h2>
    <p class="text-gray-300">{card.location}</p>
</div>

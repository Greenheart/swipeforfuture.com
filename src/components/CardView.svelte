<script lang="ts" context="module">
    import Card from '$components/Card.svelte'
    import type { CardPresentation } from '$game/Types'
    import type { SwipeDirection } from '$util/constants'
</script>

<script lang="ts">
    export let card: CardPresentation
    export let onSwipe: (direction: SwipeDirection) => Promise<void>

    const imageSize =
        'w-[85vmin] h-[85vmin] max-w-[400px] max-h-[400px] rounded-lg'
</script>

<div
    class="flex flex-col items-center justify-center text-white xs:text-lg font-light max-w-prose m-auto"
>
    <p class="text-center py-4 h-48 xs:h-64 flex place-items-center px-4 xs:px-8">{card.text}</p>
    <div class="{imageSize} relative">
        <div class="absolute z-0 {imageSize} top-0 left-0 bg-gray-900" />
        <Card {onSwipe}>
            <div
                style="background-image: url({card.image})"
                class="bg-no-repeat bg-center {imageSize} z-10 bg-cover"
            />
        </Card>
    </div>
    <h2 class="mt-8">{card.title}</h2>
    <p class="text-gray-300">{card.location}</p>
</div>

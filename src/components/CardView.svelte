<script lang="ts" context="module">
    import Card from '$components/Card.svelte'
    import type { CardPresentation } from '$game/Types'
    import type { SwipeDirection } from '$util/constants'
</script>

<script lang="ts">
    export let card: CardPresentation
    export let onSwipe: (direction: SwipeDirection) => Promise<void>

    const imageSize =
        'w-[60vmin] h-[60vmin] 2xs:w-[85vmin] 2xs:h-[85vmin] max-w-[400px] max-h-[400px] rounded-lg'
</script>

<div
    class="flex flex-col items-center justify-center text-white 2xs:text-lg xs:text-xl font-light max-w-prose m-auto"
>
    <p class="text-center xs:py-4 h-36 2xs:h-44 xs:h-56 flex place-items-center px-4 xs:px-8">{card.text}</p>
    <div class="{imageSize} relative">
        <div class="absolute z-0 {imageSize} top-0 left-0 bg-gray-900" />
        <Card {onSwipe}>
            <div
                style="background-image: url({card.image})"
                class="bg-no-repeat bg-center {imageSize} z-10 bg-cover"
            />
        </Card>
    </div>
    <h2 class="mt-2 xs:mt-4">{card.title}</h2>
    <p class="text-gray-300 mb-2 xs:mb-4">{card.location}</p>
</div>

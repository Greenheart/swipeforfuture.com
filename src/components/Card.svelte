<script lang="ts" context="module">
    import { spring } from 'svelte/motion'

    import {
        SwipeDirection,
        SWIPE_THRESHOLD,
        SWIPE_DELAY,
        SWIPE_OPACITY_FACTOR,
    } from '$util/constants'
    import { pannable } from '$util/pannable'
    import type { CardPresentation } from '$game/Types'

    const transition = `transition: transform ${SWIPE_DELAY}ms ease-out`
</script>

<script lang="ts">
    export let onSwipe: (direction: SwipeDirection) => Promise<void>
    export let actions: CardPresentation['actions']
    export let imageSize: string
    let isMovingOut = false
    let response = ''
    let dir: SwipeDirection | undefined
    let opacity = 0

    const coords = spring(
        { x: 0, y: 0 },
        {
            stiffness: 0.2,
            damping: 0.4,
        },
    )

    function handlePanStart() {
        coords.stiffness = coords.damping = 1
    }

    function handlePanMove(event: PanEvent) {
        coords.update(($coords) => ({
            x: $coords.x + event.detail.dx,
            y: $coords.y + event.detail.dy,
        }))

        if (event.detail.totalDeltaX > 0) {
            response = actions.right.description
            dir = SwipeDirection.Right
            opacity = event.detail.totalDeltaX * SWIPE_OPACITY_FACTOR
        } else if (event.detail.totalDeltaX < 0) {
            response = actions.left.description
            dir = SwipeDirection.Left
            opacity = Math.abs(event.detail.totalDeltaX * SWIPE_OPACITY_FACTOR)
        }
    }

    async function handlePanEnd(event: PanEvent) {
        response = ''
        dir = undefined
        opacity = 0

        if (event.detail.totalDeltaX > SWIPE_THRESHOLD) {
            isMovingOut = true
            $coords.x = 200 + window.innerHeight * SwipeDirection.Right
            await onSwipe(SwipeDirection.Right)
            isMovingOut = false
        } else if (event.detail.totalDeltaX < -SWIPE_THRESHOLD) {
            isMovingOut = true
            $coords.x = 200 + window.innerHeight * SwipeDirection.Left
            await onSwipe(SwipeDirection.Left)
            isMovingOut = false
        } else {
            coords.stiffness = 0.2
            coords.damping = 0.8
        }

        coords.set({ x: 0, y: 0 })
    }
</script>

<div
    class="shadow-md rounded-md cursor-move select-none relative"
    use:pannable
    on:panstart={handlePanStart}
    on:panmove={handlePanMove}
    on:panend={handlePanEnd}
    style="transform:
        translate3d({$coords.x}px, {$coords.y}px, 0)
        rotate({$coords.x * 0.05}deg);
        {isMovingOut ? transition : ''}"
>
<!-- TODO: tweak styles for how the action descriptions are displayed -->
    {#if response && dir}
        <div class="absolute overflow-hidden {imageSize}">
            <div
                class="absolute -top-56 {dir === SwipeDirection.Left
                    ? '-right-40 text-right'
                    : '-left-40'} bg-gray-800 bg-opacity-50 text-md w-[180%] h-80 p-4 overflow-hidden"
                style="transform: rotate({$coords.x * -0.05}deg); opacity: {opacity}"
            >
                <span class="relative top-60 {dir === SwipeDirection.Left
                    ? 'right-40'
                    : 'left-40'}">{response}</span>
            </div>
        </div>
    {/if}

    <slot />
</div>

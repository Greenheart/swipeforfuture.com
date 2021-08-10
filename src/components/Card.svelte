<script lang="ts" context="module">
    import { spring } from 'svelte/motion'

    import { SwipeDirection, SWIPE_THRESHOLD, SWIPE_DELAY } from '$util/constants'
    import { pannable } from '$util/pannable'

    const transition = `transition: transform ${SWIPE_DELAY}ms ease-out`
</script>

<script lang="ts">
    export let onSwipe: (direction: SwipeDirection) => Promise<void>
    let isMovingOut = false

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
    }

    async function handlePanEnd(event: PanEvent) {
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
    class="shadow-xl rounded-md cursor-move select-none bg-gray-700"
    use:pannable
    on:panstart={handlePanStart}
    on:panmove={handlePanMove}
    on:panend={handlePanEnd}
    style="transform:
        translate3d({$coords.x}px,{$coords.y}px, 0)
        rotate({$coords.x * 0.05}deg);
        {isMovingOut ? transition : ''}"
>
    <slot />
</div>

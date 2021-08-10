<script lang="ts" context="module">
    import { spring } from 'svelte/motion'

    import { SwipeDirection } from '$util/constants'
</script>

<script lang="ts">
    import { pannable } from '$util/pannable'

    export let onSwipe: (direction: SwipeDirection) => void
    export let threshold = 100

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

    function handlePanEnd(event: PanEvent) {
        // TODO: Add animation to let card move to the selected side and continue out of the viewport.
        // TODO: Then unmount the card component.
        if (event.detail.totalDeltaX > threshold) {
            onSwipe(SwipeDirection.Right)
        } else if (event.detail.totalDeltaX < -threshold) {
            onSwipe(SwipeDirection.Left)
        }

        coords.stiffness = 0.2
        coords.damping = 0.8
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
        rotate({$coords.x * 0.05}deg)"
>
    <slot />
</div>

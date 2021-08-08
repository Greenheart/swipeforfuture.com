<script lang="ts">
    import { spring } from 'svelte/motion'

    import { pannable } from '$util/pannable'
    import type { PanMoveEvent } from '$util/pannable'

    const THRESHOLD = 150

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

    function handlePanMove(event: PanMoveEvent) {
        if (event.detail.totalDeltaX > THRESHOLD) {
            console.log('right')
        } else if (event.detail.totalDeltaX < -THRESHOLD) {
            console.log('left')
        }
        coords.update(($coords) => ({
            x: $coords.x + event.detail.dx,
            y: $coords.y + event.detail.dy,
        }))
    }

    function handlePanEnd() {
        coords.stiffness = 0.2
        coords.damping = 0.8
        coords.set({ x: 0, y: 0 })
    }
</script>

<div
    class="box"
    use:pannable
    on:panstart={handlePanStart}
    on:panmove={handlePanMove}
    on:panend={handlePanEnd}
    style="transform:
		translate({$coords.x}px,{$coords.y}px)
		rotate({$coords.x * 0.17}deg)"
/>

<style>
    .box {
        --width: 150px;
        --height: 200px;
        position: absolute;
        width: var(--width);
        height: var(--height);
        left: calc(50% - var(--width) / 2);
        top: calc(50% - var(--height) / 2);
        border-radius: 4px;
        background-color: #ff3e00;
        cursor: move;
    }
</style>

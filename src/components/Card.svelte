<script lang="ts">
    import { spring } from 'svelte/motion'

    import { pannable } from '$util/pannable'

    const THRESHOLD = 100

    let side = ''

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
        if (event.detail.totalDeltaX > THRESHOLD) {
            console.log('right')
            side = 'right'
        } else if (event.detail.totalDeltaX < -THRESHOLD) {
            console.log('left')
            side = 'left'
        }

        coords.stiffness = 0.2
        coords.damping = 0.8
        coords.set({ x: 0, y: 0 })
    }
</script>

<div
    class="grid place-items-center shadow-xl rounded-md cursor-move select-none font-bold text-white text-xl w-[300px] h-[400px]"
    class:bg-gray-700={side === ''}
    class:bg-red-700={side === 'left'}
    class:bg-green-700={side === 'right'}
    use:pannable
    on:panstart={handlePanStart}
    on:panmove={handlePanMove}
    on:panend={handlePanEnd}
    style="transform:
		translate({$coords.x}px,{$coords.y}px)
		rotate({$coords.x * 0.12}deg)"
>
    <slot />
</div>

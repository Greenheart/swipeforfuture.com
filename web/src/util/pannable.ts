export default function pannable(node: HTMLElement) {
    let lastX: number
    let lastY: number
    let startX: number
    let startY: number

    function getPanEvent(
        type: 'panstart' | 'panmove' | 'panend',
        clientX: number,
        clientY: number,
    ): PanEvent {
        if (type === 'panstart') {
            startX = clientX
            startY = clientY
        }

        const detail: PanEvent['detail'] = {
            // Current position of the cursor.
            x: clientX,
            y: clientY,
            // Delta position since the last `panmove` event.
            dx: clientX - lastX,
            dy: clientY - lastY,
            // Starting position from the `panstart` event.
            startY,
            startX,
            // Total delta position compared to the `panstart` event.
            totalDeltaX: clientX - startX,
            totalDeltaY: clientY - startY,
        }

        lastX = clientX
        lastY = clientY

        return new CustomEvent(type, { detail })
    }

    function handleMousedown(e: MouseEvent) {
        node.dispatchEvent(getPanEvent('panstart', e.clientX, e.clientY))

        window.addEventListener('pointermove', handleMousemove)
        window.addEventListener('pointerup', handleMouseup)
    }

    function handleMousemove(e: MouseEvent) {
        node.dispatchEvent(getPanEvent('panmove', e.clientX, e.clientY))
    }

    function handleMouseup(e: MouseEvent) {
        node.dispatchEvent(getPanEvent('panend', e.clientX, e.clientY))

        window.removeEventListener('pointermove', handleMousemove)
        window.removeEventListener('pointerup', handleMouseup)
    }

    node.addEventListener('pointerdown', handleMousedown)

    return {
        destroy() {
            node.removeEventListener('pointerdown', handleMousedown)
        },
    }
}

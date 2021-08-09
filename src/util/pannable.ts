export function pannable(node: HTMLElement) {
    let lastX: number
    let lastY: number
    let startX: number
    let startY: number

    function getPanEvent(type: 'panstart' | 'panmove' | 'panend', clientX: number, clientY: number): PanEvent {
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

    function handleMousedown(event: MouseEvent) {
        node.dispatchEvent(getPanEvent('panstart', event.clientX, event.clientY))

        window.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mouseup', handleMouseup)
    }

    function handleMousemove(event: MouseEvent) {
        node.dispatchEvent(getPanEvent('panmove', event.clientX, event.clientY))
    }

    function handleMouseup(event: MouseEvent) {
        node.dispatchEvent(getPanEvent('panend', event.clientX, event.clientY))

        window.removeEventListener('mousemove', handleMousemove)
        window.removeEventListener('mouseup', handleMouseup)
    }

    node.addEventListener('mousedown', handleMousedown)

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown)
        },
    }
}

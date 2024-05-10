/**
 *  a 3 px border around the canvas to see the edges
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 */
export function renderBorder(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    context.strokeStyle = 'red';
    context.lineWidth = 5;
    context.strokeRect(0, 0, canvas.width, canvas.height);
}
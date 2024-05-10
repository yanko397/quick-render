import { StatusText } from "interfaces.js";

/**
 * Renders the status text on the canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {StatusText} dto
 */
export function renderStatusText(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, dto: StatusText) {
    function makeStatus(name: string, value: string | number, extra: string = '') {
        return `${name}`.padEnd(15, ' ') + '|' + `${value}`.padStart(8, ' ') + ` | ${extra}`;
    }

    // status text
    const statusTexts = [
        makeStatus('time', dto.baseData.time),
        makeStatus('canvas.width', canvas.width),
        makeStatus('canvas.height', canvas.height),
        makeStatus(
            'speed',
            dto.dvdRectangle.currentSpeed.toFixed(2),
            '='.repeat(Math.max(0, Math.floor(dto.dvdRectangle.currentSpeed * 2)))
        ),
    ];
    for (let i = 0; i < statusTexts.length; i++) {
        context.font = `bold ${dto.baseData.fontSize}px monospace`;
        context.fillText(statusTexts[i], 10, dto.baseData.fontSize + i * dto.baseData.fontSize);
    }
}
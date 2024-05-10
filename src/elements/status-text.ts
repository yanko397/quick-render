import { StatusText } from "@types";

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

    const speed = dto.dvdRectangle.currentSpeed || dto.dvdRectangle.baseSpeed;
    const statusTexts = [
        makeStatus('time', dto.baseData.time),
        makeStatus('canvas.width', canvas.width),
        makeStatus('canvas.height', canvas.height),
        makeStatus('speed', speed.toFixed(2), '='.repeat(Math.max(0, Math.floor(speed * 2)))
        ),
    ];

    for (let i = 0; i < statusTexts.length; i++) {
        context.font = `bold ${dto.baseData.fontSize}px monospace`;
        context.fillText(statusTexts[i], 10, dto.baseData.fontSize + i * dto.baseData.fontSize);
    }
}
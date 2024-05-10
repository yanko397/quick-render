import { BaseData, StatusText } from "@types";

/**
 * Renders the status text on the canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {StatusText} dto
 */
export function renderStatusText(context: CanvasRenderingContext2D, baseData: BaseData, dto: StatusText) {
    function makeStatus(name: string, value: string | number, extra: string = '') {
        return `${name}`.padEnd(15, ' ') + '|' + `${value}`.padStart(8, ' ') + ` | ${extra}`;
    }

    const speed = dto.dvdLogo.currentSpeed || dto.dvdLogo.baseSpeed;
    const statusTexts = [
        makeStatus('ticks', dto.baseData.ticks),
        makeStatus('canvas width', baseData.width()),
        makeStatus('  real width', baseData.width() * baseData.ratio()),
        makeStatus('canvas height', baseData.height()),
        makeStatus('  real height', baseData.height() * baseData.ratio()),
        makeStatus('speed', speed.toFixed(2), '='.repeat(Math.max(0, Math.floor(speed * 2)))
        ),
    ];

    for (let i = 0; i < statusTexts.length; i++) {
        context.font = `bold ${dto.baseData.fontSize}px monospace`;
        context.fillStyle = '#aaaaaa';
        context.fillText(statusTexts[i], 10, dto.baseData.fontSize + i * dto.baseData.fontSize);
    }
}
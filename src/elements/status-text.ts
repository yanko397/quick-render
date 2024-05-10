import { BaseData, StatusEntry } from "interfaces";

/**
 * Renders the status text on the canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {StatusText} dto
 */
export function renderStatusText(context: CanvasRenderingContext2D, baseData: BaseData, entries: StatusEntry[]) {
    function makeStatus(entry: StatusEntry) {
        return `${entry.name}`.padEnd(24, ' ')
            + '|' + `${entry.value}`.padStart(15, ' ')
            + (entry.extra !== undefined ? `  ${entry.extra}` : '');
    }

    const statusTexts = entries.map(makeStatus);

    for (let i = 0; i < statusTexts.length; i++) {
        context.font = `bold ${baseData.fontSize}px monospace`;
        context.fillStyle = '#aaaaaa';
        context.fillText(statusTexts[i], 10, baseData.fontSize + i * baseData.fontSize);
    }
}
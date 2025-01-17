import { Screen, StatusEntry } from "interfaces";

export class StatusText {

    constructor(
        public baseData: Screen,
    ) { }

    /**
     * Renders the status text on the canvas.
     *
     * @param {CanvasRenderingContext2D} context
     * @param {StatusEntry[]} entries
     */
    draw(context: CanvasRenderingContext2D, entries: StatusEntry[]) {
        function makeStatus(entry: StatusEntry) {
            let value = typeof entry.value === 'function' ? entry.value() : entry.value;
            return `${entry.name}`.padEnd(28, ' ')
                + '|' + `${value}`.padStart(15, ' ')
                + (entry.extra !== undefined ? `  ${entry.extra}` : '');
        }

        const statusTexts = entries.map(makeStatus);

        for (let i = 0; i < statusTexts.length; i++) {
            context.font = `bold ${this.baseData.fontSize}px monospace`;
            context.fillStyle = '#aaaaaa';
            context.fillText(statusTexts[i], 10, this.baseData.fontSize + i * this.baseData.fontSize);
        }
    }
}
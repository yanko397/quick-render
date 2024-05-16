import { Area, Screen, Point } from "interfaces";
import { Printable } from "./printable";

type Options = {
    pos: () => Point,
    width: number,
    height: number,

    right: boolean,
    down: boolean,
    baseSpeed: number,

    boostRatio: number,
    image?: HTMLImageElement,
};

export class DVDLogo extends Printable implements Area {

    currentSpeed?: () => number;

    constructor(
        public baseData: Screen,
        public options: Options,
    ) { super(); }

    /**
     * Renders the DVD logo on the canvas.
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context: CanvasRenderingContext2D) {
        const { pos, width, height, right, down, baseSpeed, boostRatio, image } = this.options;

        const currentPos = pos();
        const canvasWidth = this.baseData.width();
        const canvasHeight = this.baseData.height();

        // faster the further away from the borders
        const currentSpeed = baseSpeed
            + boostRatio * Math.min(currentPos.x, canvasWidth - currentPos.x - width, currentPos.y, canvasHeight - currentPos.y - height);
        this.currentSpeed = () => currentSpeed;

        // bounce off the borders
        this.options.right = (currentPos.x >= canvasWidth - width) ? false : (currentPos.x <= 0) ? true : right;
        this.options.down = (currentPos.y >= canvasHeight - height) ? false : (currentPos.y <= 0) ? true : down;

        // update currentPosition
        currentPos.x += this.options.right ? currentSpeed : -currentSpeed;
        currentPos.y += this.options.down ? currentSpeed : -currentSpeed;

        // ensure the logo is within the canvas
        currentPos.x = Math.max(currentPos.x, 0);
        currentPos.x = Math.min(currentPos.x, canvasWidth - width);
        currentPos.y = Math.max(currentPos.y, 0);
        currentPos.y = Math.min(currentPos.y, canvasHeight - height);

        if (image) {
            context.drawImage(image, currentPos.x, currentPos.y, width, height);
        }

        // update saved position
        this.options.pos = () => currentPos;

        // update status text
        this.entries = [{
            name: 'dvd speed',
            value: currentSpeed.toFixed(1),
            extra: '='.repeat(Math.max(0, Math.floor(currentSpeed * 2)))
        }];
    }
}

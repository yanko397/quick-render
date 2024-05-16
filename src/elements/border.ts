import { Screen } from "interfaces";

export class Border {

    constructor(
        public baseData: Screen,
    ) { };

    /**
     *  a 3 px border around the canvas to see the edges
     *
     * @param {CanvasRenderingContext2D} context
     */
    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = 'red';
        context.lineWidth = 5;
        context.strokeRect(0, 0, this.baseData.width(), this.baseData.height());
    }
}

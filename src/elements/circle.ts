import { Point } from "interfaces";
import { Printable } from "./printable";

type Options = {
    pos: () => Point,
    radius: () => number,
    color: string,
    lineWidth: number,
};

export class Circle extends Printable {
    constructor(
        public options: Options,
    ) { super(); }

    draw(context: CanvasRenderingContext2D) {
        const { pos, radius, color, lineWidth } = this.options;
        const currentPos = pos();

        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.arc(currentPos.x, currentPos.y, radius(), 0, Math.PI * 2);
        context.stroke();
    }
};
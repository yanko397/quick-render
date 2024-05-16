import { Screen, Dot, Point } from "interfaces";
import { Printable } from "./printable";

type Options = {
    pos: () => Point,
    radius: number,
    color: string,
    speed: () => number,
    circleCenter: () => Point,
    circleRadius: () => number,
    direction: 'clockwise' | 'counter-clockwise',
};

export class CircleDot extends Printable implements Dot {

    constructor(
        public baseData: Screen,
        public options: Options,
    ) { super(); }

    draw(context: CanvasRenderingContext2D) {
        const { pos, radius, color, speed, circleCenter, circleRadius, direction } = this.options;

        const currentPos = pos();
        const currentSpeed = speed();

        // update position
        const theta = (direction == 'clockwise' ? 1 : -1) * currentSpeed / circleRadius() * this.baseData.tick;
        currentPos.x = circleCenter().x + circleRadius() * Math.cos(theta);
        currentPos.y = circleCenter().y + circleRadius() * Math.sin(theta);

        // render the circle dot
        context.fillStyle = color;
        context.beginPath();
        context.arc(currentPos.x, currentPos.y, radius, 0, Math.PI * 2);
        context.fill();

        // update saved position
        this.options.pos = () => currentPos;

        // update status text
        this.entries = [
            { name: 'circle dot speed', value: currentSpeed },
            { name: 'circle dot currentPosition', value: `(${currentPos.x.toFixed()}, ${currentPos.y.toFixed()})` },
        ];
    }
}

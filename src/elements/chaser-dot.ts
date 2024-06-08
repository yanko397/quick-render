import { Dot, Point } from "interfaces";
import { Printable } from "./printable";

type Options = {
    pos: () => Point,
    radius: number,
    color: string,
    speed: () => number,
    target?: () => Point
};

export class ChaserDot extends Printable implements Dot {

    constructor(
        public options: Options,
    ) { super(); }

    draw(context: CanvasRenderingContext2D) {
        const { pos, radius, color, speed, target } = this.options;

        let currentPos = structuredClone(pos());

        // update position
        if (target) {
            const currentTarget = target();
            const dx = currentTarget.x - currentPos.x;
            const dy = currentTarget.y - currentPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const currentSpeed = Math.min(speed(), distance);
            const angle = Math.atan2(dy, dx);
            currentPos.x += currentSpeed * Math.cos(angle);
            currentPos.y += currentSpeed * Math.sin(angle);
        }

        // render the chaser dot
        context.fillStyle = color;
        context.beginPath();
        context.arc(currentPos.x, currentPos.y, radius, 0, Math.PI * 2);
        context.fill();

        // update saved position
        this.options.pos = () => currentPos;
    }
}

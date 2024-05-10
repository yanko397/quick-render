import { BaseData, CircleDot } from "@types";

export function renderCircleDot(context: CanvasRenderingContext2D, baseData: BaseData, dto: CircleDot) {
    // update position
    const theta = (dto.right ? 1 : -1) * dto.speed / dto.circleRadius() * baseData.tick;
    dto.pos.x = dto.circleCenter().x + dto.circleRadius() * Math.cos(theta);
    dto.pos.y = dto.circleCenter().y + dto.circleRadius() * Math.sin(theta);

    // render the circle dot
    context.fillStyle = dto.color;
    context.beginPath();
    context.arc(dto.pos.x, dto.pos.y, dto.radius, 0, Math.PI * 2);
    context.fill();

    // update status text
    dto.entries = [
        { name: 'circle dot speed', value: dto.speed },
        { name: 'circle dot position', value: `(${dto.pos.x.toFixed(2)}, ${dto.pos.y.toFixed(2)})` },
    ];
}

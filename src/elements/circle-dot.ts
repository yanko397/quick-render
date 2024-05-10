import { BaseData, CircleDot } from "@types";

export function renderCircleDot(context: CanvasRenderingContext2D, baseData: BaseData, dto: CircleDot) {
    dto.x ||= 0;
    dto.y ||= 0;

    // update position
    const theta = (dto.right ? 1 : -1) * dto.speed / dto.circleRadius() * baseData.ticks;
    dto.x = dto.circleCenter().x + dto.circleRadius() * Math.cos(theta);
    dto.y = dto.circleCenter().y + dto.circleRadius() * Math.sin(theta);

    // render the circle dot
    context.fillStyle = dto.color;
    context.beginPath();
    context.arc(dto.x, dto.y, dto.radius, 0, Math.PI * 2);
    context.fill();
}

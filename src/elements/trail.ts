import { Trail } from "interfaces";

export function renderTrail(context: CanvasRenderingContext2D, dto: Trail) {
    while (dto.points.length > dto.maxLength) {
        dto.points.shift();
    }

    for (const point of dto.points) {
        context.fillStyle = dto.color;
        context.beginPath();
        context.arc(point.x, point.y, dto.radius, 0, Math.PI * 2);
        context.fill();
    }
}
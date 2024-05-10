import { Circle } from "@types";

export function renderCircle(context: CanvasRenderingContext2D, dto: Circle) {
    context.strokeStyle = dto.color;
    context.lineWidth = dto.lineWidth;
    context.beginPath();
    context.arc(dto.center().x, dto.center().y, dto.radius(), 0, Math.PI * 2);
    context.stroke();
}
import { ChaserDot } from "interfaces";

export function renderChaserDot(context: CanvasRenderingContext2D, dto: ChaserDot) {
    // update position
    if (dto.target?.x && dto.target?.y) {
        const dx = dto.target.x - dto.pos.x;
        const dy = dto.target.y - dto.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.min(dto.speed, distance);
        const angle = Math.atan2(dy, dx);
        dto.pos.x += speed * Math.cos(angle);
        dto.pos.y += speed * Math.sin(angle);
    }

    // render the chaser dot
    context.fillStyle = dto.color;
    context.beginPath();
    context.arc(dto.pos.x, dto.pos.y, dto.radius, 0, Math.PI * 2);
    context.fill();
}

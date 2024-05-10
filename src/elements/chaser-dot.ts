import { ChaserDot } from "@types";

export function renderChaserDot(context: CanvasRenderingContext2D, dto: ChaserDot) {
    // update position
    if (dto.target.x && dto.target.y) {
        const dx = dto.target.x - dto.x;
        const dy = dto.target.y - dto.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.min(dto.speed, distance);
        const angle = Math.atan2(dy, dx);
        dto.x += speed * Math.cos(angle);
        dto.y += speed * Math.sin(angle);
    }

    // render the chaser dot
    context.fillStyle = dto.color;
    context.beginPath();
    context.arc(dto.x, dto.y, dto.radius, 0, Math.PI * 2);
    context.fill();
}

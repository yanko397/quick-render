import { DVDRectangle } from "@types";

/**
 * Renders a DVD rectangle on the canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {DVDRectangle} dto
 */
export function renderDvdRectangle(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, dto: DVDRectangle) {
    // faster the further away from the borders
    dto.currentSpeed = dto.baseSpeed
        + dto.boostRatio * Math.min(dto.x, canvas.width - dto.x - dto.size, dto.y, canvas.height - dto.y - dto.size);

    // bounce off the borders
    dto.right = (dto.x >= canvas.width - dto.size) ? false : (dto.x <= 0) ? true : dto.right;
    dto.down = (dto.y >= canvas.height - dto.size) ? false : (dto.y <= 0) ? true : dto.down;

    // update position
    dto.x += dto.right ? dto.currentSpeed : -dto.currentSpeed;
    dto.y += dto.down ? dto.currentSpeed : -dto.currentSpeed;

    // ensure the rectangle is within the canvas
    dto.x = Math.max(dto.x, 0);
    dto.x = Math.min(dto.x, canvas.width - dto.size);
    dto.y = Math.max(dto.y, 0);
    dto.y = Math.min(dto.y, canvas.height - dto.size);

    context.fillRect(dto.x, dto.y, dto.size, dto.size);
}

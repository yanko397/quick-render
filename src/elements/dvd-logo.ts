import { DVDLogo as DVDLogo } from "@types";

/**
 * Renders the DVD logo on the canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {DVDLogo} dto
 */
export function renderDvdLogo(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, dto: DVDLogo) {
    // faster the further away from the borders
    dto.currentSpeed = dto.baseSpeed
        + dto.boostRatio * Math.min(dto.x, canvas.width - dto.x - dto.width, dto.y, canvas.height - dto.y - dto.height);

    // bounce off the borders
    dto.right = (dto.x >= canvas.width - dto.width) ? false : (dto.x <= 0) ? true : dto.right;
    dto.down = (dto.y >= canvas.height - dto.height) ? false : (dto.y <= 0) ? true : dto.down;

    // update position
    dto.x += dto.right ? dto.currentSpeed : -dto.currentSpeed;
    dto.y += dto.down ? dto.currentSpeed : -dto.currentSpeed;

    // ensure the logo is within the canvas
    dto.x = Math.max(dto.x, 0);
    dto.x = Math.min(dto.x, canvas.width - dto.width);
    dto.y = Math.max(dto.y, 0);
    dto.y = Math.min(dto.y, canvas.height - dto.height);

    if (dto.image) {
        context.drawImage(dto.image, dto.x, dto.y, dto.width, dto.height);
    } else {
        // context.fillRect(dto.x, dto.y, dto.width, dto.height);
    }
}

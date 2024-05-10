import { BaseData, DVDLogo as DVDLogo } from "@types";

/**
 * Renders the DVD logo on the canvas.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 * @param {DVDLogo} dto
 */
export function renderDvdLogo(context: CanvasRenderingContext2D, baseData: BaseData, dto: DVDLogo) {
    const width = baseData.width();
    const height = baseData.height();

    // faster the further away from the borders
    dto.currentSpeed = dto.baseSpeed
        + dto.boostRatio * Math.min(dto.pos.x, width - dto.pos.x - dto.width, dto.pos.y, height - dto.pos.y - dto.height);

    // bounce off the borders
    dto.right = (dto.pos.x >= width - dto.width) ? false : (dto.pos.x <= 0) ? true : dto.right;
    dto.down = (dto.pos.y >= height - dto.height) ? false : (dto.pos.y <= 0) ? true : dto.down;

    // update position
    dto.pos.x += dto.right ? dto.currentSpeed : -dto.currentSpeed;
    dto.pos.y += dto.down ? dto.currentSpeed : -dto.currentSpeed;

    // ensure the logo is within the canvas
    dto.pos.x = Math.max(dto.pos.x, 0);
    dto.pos.x = Math.min(dto.pos.x, width - dto.width);
    dto.pos.y = Math.max(dto.pos.y, 0);
    dto.pos.y = Math.min(dto.pos.y, height - dto.height);

    if (dto.image) {
        context.drawImage(dto.image, dto.pos.x, dto.pos.y, dto.width, dto.height);
    } else {
        // context.fillRect(dto.x, dto.y, dto.width, dto.height);
    }

    // update status text
    dto.entries = [{
        name: 'dvd speed',
        value: dto.currentSpeed.toFixed(2),
        extra: '='.repeat(Math.max(0, Math.floor(dto.currentSpeed * 2)))
    }];
}

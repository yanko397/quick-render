import { BaseData, Trailable } from "interfaces";

export function renderTrails(context: CanvasRenderingContext2D, baseData: BaseData, dtos: Trailable[]) {
    const od: ImageData = baseData.overlay();
    for (const dto of dtos) {
        // offset the position to the center of the object if width and height exist
        let x = Math.floor(dto.pos.x) + Math.floor((dto.width ?? 0) / 2);
        let y = Math.floor(dto.pos.y) + Math.floor((dto.height ?? 0) / 2);

        // try to get the color from the object with 50% opacity (default is white with 50% opacity)
        const color = { r: 255, g: 255, b: 255, a: 127 };
        if (dto.color) {
            const rgba = dto.color.match(/\d+/g);
            if (rgba && rgba.length >= 3) {
                color.r = parseInt(rgba[0]);
                color.g = parseInt(rgba[1]);
                color.b = parseInt(rgba[2]);
                color.a = rgba.length > 3 ? Math.floor(parseInt(rgba[3]) / 2) : 127;
            }
        }

        // color pixel at current position
        const index = (x + y * baseData.width()) * 4;
        od.data[index + 0] = color.r;
        od.data[index + 1] = color.g;
        od.data[index + 2] = color.b;
        od.data[index + 3] = color.a;
    }

    // render the trail layer
    createImageBitmap(od).then(img => context.drawImage(img, 0, 0));
}
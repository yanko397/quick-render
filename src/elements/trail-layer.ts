import { BaseData, Trailable } from "interfaces";

export class TrailLayer {

    constructor(
        public baseData: BaseData,
        public trailables: Trailable[],
    ) { }

    draw(context: CanvasRenderingContext2D) {
        const od: ImageData = this.baseData.overlay();
        for (const trailable of this.trailables) {
            const { pos, width, height, color } = trailable.options;

            const currentPos = pos();

            // offset the position to the center of the object if width and height exist
            let x = Math.floor(currentPos.x) + Math.floor((width ?? 0) / 2);
            let y = Math.floor(currentPos.y) + Math.floor((height ?? 0) / 2);

            // try to get the color from the object with 50% opacity (default is white with 50% opacity)
            const trailColor = { r: 255, g: 255, b: 255, a: 127 };
            if (color) {
                const rgba = color.match(/\d+/g);
                if (rgba && rgba.length >= 3) {
                    trailColor.r = parseInt(rgba[0]);
                    trailColor.g = parseInt(rgba[1]);
                    trailColor.b = parseInt(rgba[2]);
                    trailColor.a = rgba.length > 3 ? Math.floor(parseInt(rgba[3]) / 2) : 127;
                }
            }

            // color pixel at current position
            const index = (x + y * this.baseData.width()) * 4;
            od.data[index + 0] = trailColor.r;
            od.data[index + 1] = trailColor.g;
            od.data[index + 2] = trailColor.b;
            od.data[index + 3] = trailColor.a;
        }

        // render the trail layer
        createImageBitmap(od).then(img => context.drawImage(img, 0, 0));
    }
}

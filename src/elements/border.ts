import { BaseData } from "interfaces";

/**
 *  a 3 px border around the canvas to see the edges
 *
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} context
 */
export function renderBorder(context: CanvasRenderingContext2D, baseData: BaseData) {
    context.strokeStyle = 'red';
    context.lineWidth = 5;
    context.strokeRect(0, 0, baseData.width(), baseData.height());
}
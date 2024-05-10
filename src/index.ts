import { renderBorder, renderDvdRectangle, renderStatusText } from "@elements";
import { BaseData, DVDRectangle, StatusText } from "@types";

function animate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const baseData: BaseData = {
        ticks: 0,
        fontSize: 18,
    };
    const dvdRectangle: DVDRectangle = {
        x: 0,
        y: 0,
        right: true,
        down: true,
        baseSpeed: 0.3,
        boostRatio: 0.04,
        width: 150,
        height: 50, // gets overwritten by the image's aspect ratio
    };
    const statusTextDto: StatusText = {
        baseData: baseData,
        dvdRectangle: dvdRectangle,
    };

    let image = new Image();
    image.src = 'dvd-logo.svg';
    image.onload = () => {
        dvdRectangle.image = image;
        dvdRectangle.height = image.height * dvdRectangle.width / image.width;
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderBorder(canvas, context);
        renderDvdRectangle(canvas, context, dvdRectangle);
        renderStatusText(canvas, context, statusTextDto);

        baseData.ticks++;
        requestAnimationFrame(draw);
    }
    draw();
}

function main() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    window.dispatchEvent(new Event('resize'));

    if (context) {
        animate(canvas, context);
    } else {
        throw new Error('Unable to get 2d context');
    }
}

document.addEventListener('DOMContentLoaded', main);

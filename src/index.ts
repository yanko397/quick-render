import { DVDRectangle, StatusText } from "interfaces.js";
import { renderDvdRectangle } from "./bodies/dvd-rectangle.js";
import { renderStatusText } from "./bodies/status-text.js";
import { renderBorder } from "./bodies/border.js";

function animate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const baseData = {
        time: 0,
        fontSize: 25,
    };
    const dvdRectangle: DVDRectangle = {
        x: 0,
        y: 0,
        right: true,
        down: true,
        baseSpeed: 0.3,
        currentSpeed: 0.3,
        boostRatio: 0.05,
        size: 20,
    };
    const statusTextDto: StatusText = {
        baseData: baseData,
        dvdRectangle: dvdRectangle,
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderBorder(canvas, context);
        renderDvdRectangle(canvas, context, dvdRectangle);
        renderStatusText(canvas, context, statusTextDto);

        requestAnimationFrame(draw);
        baseData.time++;
    }

    draw();
}

function main() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }

    // Call any drawing or animation functions here
    if (context) {
        animate(canvas, context);
    } else {
        throw new Error('Unable to get 2d context');
    }

    // Initial call to resizeCanvas
    resizeCanvas();

    // Listen for window resize events
    window.addEventListener('resize', resizeCanvas);
}

document.addEventListener('DOMContentLoaded', main);

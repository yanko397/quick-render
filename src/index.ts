import { renderBorder, renderChaserDot, renderCircle, renderCircleDot, renderDvdLogo, renderStatusText } from "@elements";
import { BaseData, ChaserDot, Circle, CircleDot, DVDLogo, StatusText } from "@types";

function animate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const baseData: BaseData = {
        ticks: 0,
        fontSize: 18,
        width: () => window.innerWidth,
        height: () => window.innerHeight,
        ratio: () => Math.ceil(window.devicePixelRatio),
    };
    const dvdLogo: DVDLogo = {
        x: 0,
        y: 0,
        right: true,
        down: true,
        baseSpeed: 0.3,
        boostRatio: 0.04,
        width: 150,
        height: 50, // gets overwritten by the image's aspect ratio
    };
    const circle: Circle = {
        center: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
        radius: () => Math.min(baseData.width(), baseData.height()) / 2 - 30,
        color: 'blue',
        lineWidth: 1,
    };
    const circleDot: CircleDot = {
        circleCenter: circle.center,
        radius: 20,
        circleRadius: circle.radius,
        color: 'green',
        speed: 3,
        right: true,
    };
    const chaserDot: ChaserDot = {
        x: baseData.width() / 2,
        y: baseData.height() / 2,
        radius: 10,
        color: 'red',
        speed: circleDot.speed * 0.5,
        target: circleDot,
    };
    const statusTextDto: StatusText = {
        baseData: baseData,
        dvdLogo: dvdLogo,
    };

    let image = new Image();
    image.src = 'dvd-logo.svg';
    image.onload = () => {
        dvdLogo.image = image;
        dvdLogo.height = image.height * dvdLogo.width / image.width;
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // renderBorder(context, baseData);
        renderStatusText(context, baseData, statusTextDto);
        renderCircle(context, circle);
        renderCircleDot(context, baseData, circleDot);
        renderChaserDot(context, chaserDot);
        renderDvdLogo(context, baseData, dvdLogo);

        baseData.ticks++;
        requestAnimationFrame(draw);
    }
    draw();
}

function main() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    window.addEventListener('resize', () => {
        // resize canvas to fit the window and scale it up for retina displays
        const ratio = Math.ceil(window.devicePixelRatio);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
    });
    window.dispatchEvent(new Event('resize'));

    if (context) {
        animate(canvas, context);
    } else {
        throw new Error('Unable to get 2d context');
    }
}

document.addEventListener('DOMContentLoaded', main);

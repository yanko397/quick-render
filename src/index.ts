import { renderBorder, renderChaserDot, renderCircle, renderCircleDot, renderDvdLogo, renderStatusText } from "@elements";
import { BaseData, ChaserDot, Circle, CircleDot, DVDLogo, StatusEntry } from "interfaces";

function animate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const baseData: BaseData = {
        tick: 0,
        fontSize: 12,
        width: () => window.innerWidth,
        height: () => window.innerHeight,
        ratio: () => Math.ceil(window.devicePixelRatio),
    };
    const dvdLogo: DVDLogo = {
        pos: { x: 0, y: 0 },
        right: true,
        down: true,
        baseSpeed: 0.3,
        boostRatio: 0.04,
        width: 150,
        height: 50,
    };
    const circle: Circle = {
        center: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
        radius: () => Math.min(baseData.width(), baseData.height()) / 2 - 30,
        color: 'blue',
        lineWidth: 1,
    };
    const circleDot: CircleDot = {
        pos: { x: 0, y: 0 },
        circleCenter: circle.center,
        radius: 20,
        circleRadius: circle.radius,
        color: 'green',
        speed: 3,
        direction: 'clockwise',
    };
    const chaserDot: ChaserDot = {
        pos: { x: baseData.width() / 2, y: baseData.height() / 2 },
        radius: 10,
        color: 'red',
        speed: circleDot.speed * 0.5,
        target: circleDot.pos,
    };

    let image = new Image();
    image.src = 'dvd-logo.svg';
    image.onload = () => {
        dvdLogo.image = image;
        dvdLogo.height = image.height * dvdLogo.width / image.width;
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderCircle(context, circle);
        renderCircleDot(context, baseData, circleDot);
        renderChaserDot(context, chaserDot);

        renderDvdLogo(context, baseData, dvdLogo);

        const statusEntries: StatusEntry[] = [
            { name: 'tick', value: baseData.tick },
            { name: 'cancas size', value: `${baseData.width()} x ${baseData.height()}` },
            { name: 'real size', value: `${baseData.width() * baseData.ratio()} x ${baseData.height() * baseData.ratio()}` },
            ...(circle.entries || []),
            ...(circleDot.entries || []),
            ...(chaserDot.entries || []),
            ...(dvdLogo.entries || []),
        ]
        renderStatusText(context, baseData, statusEntries);
        // renderBorder(context, baseData);

        baseData.tick++;
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

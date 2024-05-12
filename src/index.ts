import { renderBorder, renderChaserDot, renderCircle, renderCircleDot, renderDvdLogo, renderStatusText, renderTrails } from "@elements";
import { Area, BaseData, ChaserDot, Circle, CircleDot, DVDLogo, StatusEntry } from "@interfaces";

function getCenter(dto: Area) {
    return () => ({
        x: dto.pos.x + dto.width / 2,
        y: dto.pos.y + dto.height / 2
    });
}

function animate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, overlay: () => ImageData) {
    const baseData: BaseData = {
        tick: 0,
        fontSize: 12,
        width: () => window.innerWidth,
        height: () => window.innerHeight,
        ratio: () => Math.ceil(window.devicePixelRatio),
        overlay: overlay,
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
    const dvdChaser: ChaserDot = {
        pos: { x: baseData.width() / 2, y: baseData.height() / 2 },
        radius: 10,
        color: 'rgba(255,0,0,255)',
        speed: () => dvdLogo.currentSpeed ? dvdLogo.currentSpeed() : 1 * 0.5,
        target: getCenter(dvdLogo),
    };
    const dvdChaser2: ChaserDot = {
        pos: { x: baseData.width() / 2, y: baseData.height() / 2 },
        radius: 10,
        color: 'rgba(255,255,0,255)',
        speed: () => 2,
        target: getCenter(dvdLogo),
    };
    const circle: Circle = {
        center: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
        radius: () => Math.min(baseData.width(), baseData.height()) / 2 - 30,
        color: 'rgba(0,0,255,255)',
        lineWidth: 1,
    };
    const circleDot: CircleDot = {
        pos: { x: 0, y: 0 },
        circleCenter: circle.center,
        radius: 20,
        circleRadius: circle.radius,
        color: 'rgba(0,255,0,255)',
        speed: () => 3,
        direction: 'clockwise',
    };
    const chaserDot: ChaserDot = {
        pos: { x: baseData.width() / 2, y: baseData.height() / 2 },
        radius: 10,
        color: 'rgba(255,0,0,255)',
        speed: () => circleDot.speed() * 0.5,
        target: () => circleDot.pos,
    };

    let image = new Image();
    image.src = 'dvd-logo.svg';
    image.onload = () => {
        dvdLogo.image = image;
        dvdLogo.height = image.height * dvdLogo.width / image.width;
    };

    let recently = performance.now();
    let ticksPerSecond = 0;

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderTrails(context, baseData, [circleDot, chaserDot, dvdLogo, dvdChaser, dvdChaser2]);

        // renderCircleDot(context, baseData, circleDot);
        // renderChaserDot(context, chaserDot);

        renderDvdLogo(context, baseData, dvdLogo);
        renderChaserDot(context, dvdChaser);
        renderChaserDot(context, dvdChaser2);

        const now = performance.now();
        if (baseData.tick % 50 === 0) {
            const elapsed = now - recently;
            ticksPerSecond = 50 / (elapsed / 1000);
            recently = now;
        }

        const statusEntries: StatusEntry[] = [
            { name: 'tick', value: baseData.tick },
            { name: 'ticks per second', value: ticksPerSecond.toFixed(1) },
            { name: 'canvas size', value: `${baseData.width()} x ${baseData.height()}` },
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
    if (!context) {
        throw new Error('Unable to get 2d context');
    }

    let overlayData: ImageData = context.createImageData(window.innerWidth, window.innerHeight);

    window.addEventListener('resize', () => {
        // resize canvas to fit the window and scale it up for retina displays
        const ratio = Math.ceil(window.devicePixelRatio);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0);
        // reset overlay data
        overlayData = context.createImageData(window.innerWidth, window.innerHeight);
    });
    window.dispatchEvent(new Event('resize'));

    animate(canvas, context, () => overlayData);
}

document.addEventListener('DOMContentLoaded', main);

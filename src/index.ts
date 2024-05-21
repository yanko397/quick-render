import { ChaserDot, Circle, CircleDot, DVDLogo, StatusText, TrailLayer } from "@elements";
import { Area, Screen, Shape, StatusEntry, Trailable } from "@interfaces";

function getCenter(dto: Area) {
    const pos = dto.options.pos();
    return {
        x: pos.x + dto.options.width / 2,
        y: pos.y + dto.options.height / 2,
    };
}

function animate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, overlay: () => ImageData) {
    const baseData: Screen = {
        tick: 0,
        fontSize: 12,
        width: () => window.innerWidth,
        height: () => window.innerHeight,
        ratio: () => Math.ceil(window.devicePixelRatio),
        overlay: overlay,
    };
    const dvdLogo = new DVDLogo(baseData, {
        pos: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
        right: true,
        down: true,
        baseSpeed: 0.3,
        boostRatio: 0.04,
        width: 150,
        height: 50,
    });
    const dvdChaserDynamic = new ChaserDot({
        pos: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
        radius: 10,
        color: 'rgba(255,0,0,255)',
        speed: () => dvdLogo.currentSpeed ? dvdLogo.currentSpeed() : 1 * 0.5,
        target: () => getCenter(dvdLogo),
    });
    const dvdChaserStatic = new ChaserDot({
        pos: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
        radius: 10,
        color: 'rgba(255,255,0,255)',
        speed: () => 2,
        target: () => getCenter(dvdLogo),
    });
    const circle = new Circle({
        pos: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
        radius: () => Math.min(baseData.width(), baseData.height()) / 2 - 30,
        color: 'rgba(0,0,255,255)',
        lineWidth: 1,
    });
    const circleDot = new CircleDot(baseData, {
        pos: () => ({ x: 0, y: 0 }),
        circleCenter: circle.options.pos,
        radius: 20,
        circleRadius: circle.options.radius,
        color: 'rgba(0,255,0,255)',
        speed: () => 3,
        direction: 'clockwise',
    });
    const circleChasers = []
    for (let i = 255; i >= 0; i--) {
        // if (i % 10 !== 0) continue;
        circleChasers.push(new ChaserDot({
            pos: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
            radius: 10,
            color: `rgba(100,${i},100,255)`,
            speed: () => Math.log(circleDot.options.speed() * i) / circleDot.options.radius * 10,
            target: () => circleDot.options.pos(),
        }));
    }
    const elements: (Shape & Trailable)[] = [
        // dvdLogo,
        // dvdChaserDynamic,
        // dvdChaserStatic,
        // circle,
        circleDot,
        ...circleChasers,
    ];

    const trails = new TrailLayer(baseData, elements);
    const statusText = new StatusText(baseData);

    let image = new Image();
    image.src = 'dvd-logo.svg';
    image.onload = () => {
        dvdLogo.options.image = image;
        dvdLogo.options.height = image.height * dvdLogo.options.width / image.width;
    };

    let recently = performance.now();
    let ticksPerSecond = 0;

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

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
            ...(circle.entries),
            ...(circleDot.entries),
            ...(dvdChaserDynamic.entries),
            ...(dvdLogo.entries),
        ]

        statusText.draw(context, statusEntries);
        elements.forEach(element => element.draw(context));
        trails.draw(context);

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

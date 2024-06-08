import { ChaserDot, Circle, CircleDot, DVDLogo, Printable, StatusText, TrailLayer } from "@elements";
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
    const image = new Image();
    image.src = 'dvd-logo.svg';
    image.onload = () => {
        dvdLogo.options.image = image;
        dvdLogo.options.height = image.height * dvdLogo.options.width / image.width;
    };
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
    circleDot.draw(context); // initialize circleDot position

    const chaserCount = 200;
    const circleChasers: ChaserDot[] = Array.from({ length: chaserCount }, (_, i) => {
        const maxSpeed = circleDot.options.speed();
        const minSpeed = 0.3;
        const speedDecrement = (maxSpeed - minSpeed) / (chaserCount - 1);

        const chaserDot = new ChaserDot({
            pos: circleDot.options.pos,
            radius: 10,
            color: `rgba(100,${255 - i * (255 / (chaserCount - 1))},100,255)`,
            speed: () => maxSpeed - i * speedDecrement,
        });

        chaserDot.options.target = i > 0
            ? () => circleChasers[i - 1].options.pos()
            : () => circleDot.options.pos();

        if (i === 0 || i === chaserCount - 1) {
            chaserDot.entries.push({ name: `chaser #${i + 1} speed`, value: () => chaserDot.options.speed().toPrecision(1) });
        }

        return chaserDot;
    });

    const elements: (Shape & Trailable & Printable)[] = [
        circleDot,
        ...circleChasers,
    ];

    const trails = new TrailLayer(baseData, elements);
    const statusText = new StatusText(baseData);

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

            ...(elements.map(element => element.entries).flat()),
        ];

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

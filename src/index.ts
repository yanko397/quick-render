
function animate(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    let time = 0;
    let x = 0;
    let y = 0;
    let right = true;
    let down = true;
    let speed = 0.3;
    const rectSize = 20;
    const fontSize = 25;

    function draw() {
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 3 px border around the canvas to see the edges
        context.strokeStyle = 'red';
        context.lineWidth = 5;
        context.strokeRect(0, 0, canvas.width, canvas.height);

        // faster the further away from the borders
        speed = 0.3 + 0.05 * Math.min(x, canvas.width - x - rectSize, y, canvas.height - y - rectSize);

        // bounce off the borders
        right = (x >= canvas.width - rectSize) ? false : (x <= 0) ? true : right;
        down = (y >= canvas.height - rectSize) ? false : (y <= 0) ? true : down;

        // update position
        x += right ? speed : -speed;
        y += down ? speed : -speed;

        // ensure the rectangle is within the canvas
        x = Math.max(x, 0)
        x = Math.min(x, canvas.width - rectSize)
        y = Math.max(y, 0)
        y = Math.min(y, canvas.height - rectSize)

        context.fillRect(x, y, rectSize, rectSize);

        function makeStatus(name: string, value: string | number, extra: string = '') {
            return `${name}`.padEnd(15, ' ') + '|' + `${value}`.padStart(8, ' ') +  ` | ${extra}`;
        }

        // status text
        const statusTexts = [
            makeStatus('time', time),
            makeStatus('canvas.width', canvas.width),
            makeStatus('canvas.height', canvas.height),
            makeStatus('speed', speed.toFixed(2), '='.repeat(Math.max(0, Math.floor(speed * 2)))),
        ];
        for (let i = 0; i < statusTexts.length; i++) {
            context.font = `bold ${fontSize}px monospace`;
            context.fillText(statusTexts[i], 10, fontSize + i * fontSize);
        }

        requestAnimationFrame(draw);
        time++;
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

(function () {
    'use strict';

    class Printable {
        constructor() {
            this.entries = [];
        }
    }

    class DVDLogo extends Printable {
        constructor(baseData, options) {
            super();
            this.baseData = baseData;
            this.options = options;
        }
        /**
         * Renders the DVD logo on the canvas.
         *
         * @param {CanvasRenderingContext2D} context
         */
        draw(context) {
            const { pos, width, height, right, down, baseSpeed, boostRatio, image } = this.options;
            const currentPos = pos();
            const canvasWidth = this.baseData.width();
            const canvasHeight = this.baseData.height();
            // faster the further away from the borders
            const currentSpeed = baseSpeed
                + boostRatio * Math.min(currentPos.x, canvasWidth - currentPos.x - width, currentPos.y, canvasHeight - currentPos.y - height);
            this.currentSpeed = () => currentSpeed;
            // bounce off the borders
            this.options.right = (currentPos.x >= canvasWidth - width) ? false : (currentPos.x <= 0) ? true : right;
            this.options.down = (currentPos.y >= canvasHeight - height) ? false : (currentPos.y <= 0) ? true : down;
            // update currentPosition
            currentPos.x += this.options.right ? currentSpeed : -currentSpeed;
            currentPos.y += this.options.down ? currentSpeed : -currentSpeed;
            // ensure the logo is within the canvas
            currentPos.x = Math.max(currentPos.x, 0);
            currentPos.x = Math.min(currentPos.x, canvasWidth - width);
            currentPos.y = Math.max(currentPos.y, 0);
            currentPos.y = Math.min(currentPos.y, canvasHeight - height);
            if (image) {
                context.drawImage(image, currentPos.x, currentPos.y, width, height);
            }
            // update saved position
            this.options.pos = () => currentPos;
            // update status text
            this.entries = [{
                    name: 'dvd speed',
                    value: currentSpeed.toFixed(1),
                    extra: '='.repeat(Math.max(0, Math.floor(currentSpeed * 2)))
                }];
        }
    }

    class Circle extends Printable {
        constructor(options) {
            super();
            this.options = options;
        }
        draw(context) {
            const { pos, radius, color, lineWidth } = this.options;
            const currentPos = pos();
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            context.beginPath();
            context.arc(currentPos.x, currentPos.y, radius(), 0, Math.PI * 2);
            context.stroke();
        }
    }

    class CircleDot extends Printable {
        constructor(baseData, options) {
            super();
            this.baseData = baseData;
            this.options = options;
        }
        draw(context) {
            const { pos, radius, color, speed, circleCenter, circleRadius, direction } = this.options;
            const currentPos = pos();
            const currentSpeed = speed();
            // update position
            const theta = (direction == 'clockwise' ? 1 : -1) * currentSpeed / circleRadius() * this.baseData.tick;
            currentPos.x = circleCenter().x + circleRadius() * Math.cos(theta);
            currentPos.y = circleCenter().y + circleRadius() * Math.sin(theta);
            // render the circle dot
            context.fillStyle = color;
            context.beginPath();
            context.arc(currentPos.x, currentPos.y, radius, 0, Math.PI * 2);
            context.fill();
            // update saved position
            this.options.pos = () => currentPos;
            // update status text
            this.entries = [
                { name: 'circle dot speed', value: currentSpeed },
                { name: 'circle dot currentPosition', value: `(${currentPos.x.toFixed()}, ${currentPos.y.toFixed()})` },
            ];
        }
    }

    class ChaserDot extends Printable {
        constructor(options) {
            super();
            this.options = options;
        }
        draw(context) {
            const { pos, radius, color, speed, target } = this.options;
            const currentPos = pos();
            // update position
            if (target) {
                const currentTarget = target();
                const dx = currentTarget.x - currentPos.x;
                const dy = currentTarget.y - currentPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const currentSpeed = Math.min(speed(), distance);
                const angle = Math.atan2(dy, dx);
                currentPos.x += currentSpeed * Math.cos(angle);
                currentPos.y += currentSpeed * Math.sin(angle);
            }
            // render the chaser dot
            context.fillStyle = color;
            context.beginPath();
            context.arc(currentPos.x, currentPos.y, radius, 0, Math.PI * 2);
            context.fill();
            // update saved position
            this.options.pos = () => currentPos;
        }
    }

    class StatusText {
        constructor(baseData) {
            this.baseData = baseData;
        }
        /**
         * Renders the status text on the canvas.
         *
         * @param {CanvasRenderingContext2D} context
         * @param {StatusEntry[]} entries
         */
        draw(context, entries) {
            function makeStatus(entry) {
                return `${entry.name}`.padEnd(24, ' ')
                    + '|' + `${entry.value}`.padStart(15, ' ')
                    + (entry.extra !== undefined ? `  ${entry.extra}` : '');
            }
            const statusTexts = entries.map(makeStatus);
            for (let i = 0; i < statusTexts.length; i++) {
                context.font = `bold ${this.baseData.fontSize}px monospace`;
                context.fillStyle = '#aaaaaa';
                context.fillText(statusTexts[i], 10, this.baseData.fontSize + i * this.baseData.fontSize);
            }
        }
    }

    class TrailLayer {
        constructor(baseData, trailables) {
            this.baseData = baseData;
            this.trailables = trailables;
        }
        draw(context) {
            const od = this.baseData.overlay();
            for (const trailable of this.trailables) {
                const { pos, width, height, color } = trailable.options;
                const currentPos = pos();
                // offset the position to the center of the object if width and height exist
                let x = Math.floor(currentPos.x) + Math.floor((width !== null && width !== void 0 ? width : 0) / 2);
                let y = Math.floor(currentPos.y) + Math.floor((height !== null && height !== void 0 ? height : 0) / 2);
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

    function getCenter(dto) {
        const pos = dto.options.pos();
        return {
            x: pos.x + dto.options.width / 2,
            y: pos.y + dto.options.height / 2,
        };
    }
    function animate(canvas, context, overlay) {
        const baseData = {
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
        const circleChaser = new ChaserDot({
            pos: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
            radius: 10,
            color: 'rgba(0,255,255,255)',
            speed: () => circleDot.options.speed() * 0.5,
            target: () => circleDot.options.pos(),
        });
        const elements = [
            dvdLogo,
            dvdChaserDynamic,
            dvdChaserStatic,
            // circle,
            circleDot,
            circleChaser,
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
            const statusEntries = [
                { name: 'tick', value: baseData.tick },
                { name: 'ticks per second', value: ticksPerSecond.toFixed(1) },
                { name: 'canvas size', value: `${baseData.width()} x ${baseData.height()}` },
                { name: 'real size', value: `${baseData.width() * baseData.ratio()} x ${baseData.height() * baseData.ratio()}` },
                ...(circle.entries),
                ...(circleDot.entries),
                ...(dvdChaserDynamic.entries),
                ...(dvdLogo.entries),
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
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Unable to get 2d context');
        }
        let overlayData = context.createImageData(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', () => {
            var _a;
            // resize canvas to fit the window and scale it up for retina displays
            const ratio = Math.ceil(window.devicePixelRatio);
            canvas.width = window.innerWidth * ratio;
            canvas.height = window.innerHeight * ratio;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            (_a = canvas.getContext('2d')) === null || _a === void 0 ? void 0 : _a.setTransform(ratio, 0, 0, ratio, 0, 0);
            // reset overlay data
            overlayData = context.createImageData(window.innerWidth, window.innerHeight);
        });
        window.dispatchEvent(new Event('resize'));
        animate(canvas, context, () => overlayData);
    }
    document.addEventListener('DOMContentLoaded', main);

})();

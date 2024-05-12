(function () {
    'use strict';

    /**
     * Renders the DVD logo on the canvas.
     *
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} context
     * @param {DVDLogo} dto
     */
    function renderDvdLogo(context, baseData, dto) {
        const width = baseData.width();
        const height = baseData.height();
        // faster the further away from the borders
        const currentSpeed = dto.baseSpeed
            + dto.boostRatio * Math.min(dto.pos.x, width - dto.pos.x - dto.width, dto.pos.y, height - dto.pos.y - dto.height);
        dto.currentSpeed = () => currentSpeed;
        // bounce off the borders
        dto.right = (dto.pos.x >= width - dto.width) ? false : (dto.pos.x <= 0) ? true : dto.right;
        dto.down = (dto.pos.y >= height - dto.height) ? false : (dto.pos.y <= 0) ? true : dto.down;
        // update position
        dto.pos.x += dto.right ? currentSpeed : -currentSpeed;
        dto.pos.y += dto.down ? currentSpeed : -currentSpeed;
        // ensure the logo is within the canvas
        dto.pos.x = Math.max(dto.pos.x, 0);
        dto.pos.x = Math.min(dto.pos.x, width - dto.width);
        dto.pos.y = Math.max(dto.pos.y, 0);
        dto.pos.y = Math.min(dto.pos.y, height - dto.height);
        if (dto.image) {
            context.drawImage(dto.image, dto.pos.x, dto.pos.y, dto.width, dto.height);
        }
        // update status text
        dto.entries = [{
                name: 'dvd speed',
                value: currentSpeed.toFixed(1),
                extra: '='.repeat(Math.max(0, Math.floor(currentSpeed * 2)))
            }];
    }

    /**
     * Renders the status text on the canvas.
     *
     * @param {HTMLCanvasElement} canvas
     * @param {CanvasRenderingContext2D} context
     * @param {StatusText} dto
     */
    function renderStatusText(context, baseData, entries) {
        function makeStatus(entry) {
            return `${entry.name}`.padEnd(24, ' ')
                + '|' + `${entry.value}`.padStart(15, ' ')
                + (entry.extra !== undefined ? `  ${entry.extra}` : '');
        }
        const statusTexts = entries.map(makeStatus);
        for (let i = 0; i < statusTexts.length; i++) {
            context.font = `bold ${baseData.fontSize}px monospace`;
            context.fillStyle = '#aaaaaa';
            context.fillText(statusTexts[i], 10, baseData.fontSize + i * baseData.fontSize);
        }
    }

    function renderChaserDot(context, dto) {
        // update position
        if (dto.target) {
            const target = dto.target();
            const dx = target.x - dto.pos.x;
            const dy = target.y - dto.pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = Math.min(dto.speed(), distance);
            const angle = Math.atan2(dy, dx);
            dto.pos.x += speed * Math.cos(angle);
            dto.pos.y += speed * Math.sin(angle);
        }
        // render the chaser dot
        context.fillStyle = dto.color;
        context.beginPath();
        context.arc(dto.pos.x, dto.pos.y, dto.radius, 0, Math.PI * 2);
        context.fill();
    }

    function renderTrails(context, baseData, dtos) {
        var _a, _b;
        const od = baseData.overlay();
        for (const dto of dtos) {
            // offset the position to the center of the object if width and height exist
            let x = Math.floor(dto.pos.x) + Math.floor(((_a = dto.width) !== null && _a !== void 0 ? _a : 0) / 2);
            let y = Math.floor(dto.pos.y) + Math.floor(((_b = dto.height) !== null && _b !== void 0 ? _b : 0) / 2);
            // try to get the color from the object with 50% opacity (default is white with 50% opacity)
            const color = { r: 255, g: 255, b: 255, a: 127 };
            if (dto.color) {
                const rgba = dto.color.match(/\d+/g);
                if (rgba && rgba.length >= 3) {
                    color.r = parseInt(rgba[0]);
                    color.g = parseInt(rgba[1]);
                    color.b = parseInt(rgba[2]);
                    color.a = rgba.length > 3 ? Math.floor(parseInt(rgba[3]) / 2) : 127;
                }
            }
            // color pixel at current position
            const index = (x + y * baseData.width()) * 4;
            od.data[index + 0] = color.r;
            od.data[index + 1] = color.g;
            od.data[index + 2] = color.b;
            od.data[index + 3] = color.a;
        }
        // render the trail layer
        createImageBitmap(od).then(img => context.drawImage(img, 0, 0));
    }

    function getCenter(dto) {
        return () => ({
            x: dto.pos.x + dto.width / 2,
            y: dto.pos.y + dto.height / 2
        });
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
        const dvdLogo = {
            pos: { x: 0, y: 0 },
            right: true,
            down: true,
            baseSpeed: 0.3,
            boostRatio: 0.04,
            width: 150,
            height: 50,
        };
        const dvdChaser = {
            pos: { x: baseData.width() / 2, y: baseData.height() / 2 },
            radius: 10,
            color: 'rgba(255,0,0,255)',
            speed: () => dvdLogo.currentSpeed ? dvdLogo.currentSpeed() : 1 * 0.5,
            target: getCenter(dvdLogo),
        };
        const dvdChaser2 = {
            pos: { x: baseData.width() / 2, y: baseData.height() / 2 },
            radius: 10,
            color: 'rgba(255,255,0,255)',
            speed: () => 2,
            target: getCenter(dvdLogo),
        };
        const circle = {
            center: () => ({ x: baseData.width() / 2, y: baseData.height() / 2 }),
            radius: () => Math.min(baseData.width(), baseData.height()) / 2 - 30,
            color: 'rgba(0,0,255,255)',
            lineWidth: 1,
        };
        const circleDot = {
            pos: { x: 0, y: 0 },
            circleCenter: circle.center,
            radius: 20,
            circleRadius: circle.radius,
            color: 'rgba(0,255,0,255)',
            speed: () => 3,
            direction: 'clockwise',
        };
        const chaserDot = {
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
            const statusEntries = [
                { name: 'tick', value: baseData.tick },
                { name: 'ticks per second', value: ticksPerSecond.toFixed(1) },
                { name: 'canvas size', value: `${baseData.width()} x ${baseData.height()}` },
                { name: 'real size', value: `${baseData.width() * baseData.ratio()} x ${baseData.height() * baseData.ratio()}` },
                ...(circle.entries || []),
                ...(circleDot.entries || []),
                ...(chaserDot.entries || []),
                ...(dvdLogo.entries || []),
            ];
            renderStatusText(context, baseData, statusEntries);
            // renderBorder(context, baseData);
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

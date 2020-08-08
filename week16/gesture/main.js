function enableGesture(element) {
    let contexts = Object.create(null);
    let MOUSE_SYMBOL = Symbol('mouse');

    if (document.ontouchstart !== null) {
        element.addEventListener('mousedown', (event) => {
            contexts[MOUSE_SYMBOL] = Object.create(null);
            start(event, contexts[MOUSE_SYMBOL]);
            let mousemove = (event) => {
                move(event, contexts[MOUSE_SYMBOL]);
            };
            let mouseend = (event) => {
                end(event, contexts[MOUSE_SYMBOL]);
                document.removeEventListener('mouseup', mouseend);
                document.removeEventListener('mousemove', mousemove);
            };

            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseend);
        });
    }
    element.addEventListener('touchstart', (e) => {
        for (let touch of e.changedTouches) {
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier]);
        }
    });

    element.addEventListener('touchmove', (e) => {
        for (let touch of e.changedTouches) {
            move(touch, contexts[touch.identifier]);
        }
    });

    element.addEventListener('touchend', (e) => {
        for (let touch of e.changedTouches) {
            console.log(touch);

            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });

    element.addEventListener('touchcancel', (e) => {
        for (let touch of e.changedTouches) {
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });

    let start = (point, ctx) => {
        element.dispatchEvent(
            new CustomEvent('start', {
                startX: ctx.startX,
                startY: ctx.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            })
        );

        ctx.moves = [];
        ctx.startX = point.clientX;
        ctx.startY = point.clientY;
        ctx.isTap = true;
        ctx.isPan = false;
        ctx.isPress = false;
        ctx.handleTimer = setTimeout(() => {
            if (ctx.isPan) {
                return;
            } else {
                ctx.isTap = false;
                ctx.isPan = false;
                ctx.isPress = true;
            }
            element.dispatchEvent(new CustomEvent('pressstart', {}));
        }, 500);

        element.dispatchEvent(
            new CustomEvent('start', {
                startX: ctx.startX,
                startY: ctx.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            })
        );
        // console.log(ctx);
        // console.log('start');
    };

    let move = (point, ctx) => {
        // console.log(ctx);
        let dx = point.clientX - ctx.startX;
        let dy = point.clientY - ctx.startY;
        if (dx ** 2 + dy ** 2 > 100 && !ctx.isPan) {
            if (ctx.isPress) {
                // console.log('cancelPress');
                element.dispatchEvent(new CustomEvent('presscancel', {}));
            }
            ctx.isTap = false;
            ctx.isPan = true;
            ctx.isPress = false;
            element.dispatchEvent(
                new CustomEvent('panstart', {
                    startX: ctx.startX,
                    startY: ctx.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                })
            );
            // console.log('panstart');
        }

        if (ctx.isPan) {
            ctx.moves.push({
                dx,
                dy,
                t: Date.now(),
            });

            ctx.moves = ctx.moves.filter(
                (record) => Date.now() - record.t < 300
            );

            let e = new CustomEvent('pan');
            Object.assign(e, {
                startX: ctx.startX,
                startY: ctx.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            });
            element.dispatchEvent(e);
            // console.log(e);
            console.log('pan');
        }
    };

    let end = (point, ctx) => {
        let dx = point.clientX - ctx.startX;
        let dy = point.clientY - ctx.startY;
        if (ctx.isPan) {
            let record = ctx.moves[0];
            let speed = Math.sqrt(
                ((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
                    (Date.now() - record.t)
            );
            let isFlick = speed > 2.5;
            if (isFlick) {
                // console.log('flick');
                element.dispatchEvent(
                    new CustomEvent('flick', {
                        startX: ctx.startX,
                        startY: ctx.startY,
                        clientX: point.clientX,
                        clientY: point.clientY,
                        speed,
                    })
                );
            }

            element.dispatchEvent(
                new CustomEvent('panedn', {
                    startX: ctx.startX,
                    startY: ctx.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    isFlick,
                    speed,
                })
            );
        }
        // console.log(ctx);
        if (ctx.isTap) {
            element.dispatchEvent(new CustomEvent('tap', {}));
            // console.log('tap');
        }
        if (ctx.isPan) {
            // console.log('paned');
            element.dispatchEvent(new CustomEvent('panned', {}));
        }
        if (ctx.isPress) {
            console.log('isPressed');
            element.dispatchEvent(new CustomEvent('pressend', {}));
        }
        console.log('end');
    };

    let cancel = (point, ctx) => {
        element.dispatchEvent(new CustomEvent('pressend', {}));
        clearTimeout(ctx.handleTimer);

        // console.log(point);
    };
}

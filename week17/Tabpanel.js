import { Timeline, Animation, ease } from './animation';
import { enableGesture } from './gesture';

export class Panel {
    constructor() {
        // console.log(config);
        this.children = [];
        this.attributes = new Map();
    }

    setAttribute(name, value) {
        // console.log(name, value);
        this[name] = value;
    }

    appendChild(child) {
        // console.log('child=>', child);
        this.children.push(child);
    }

    render() {
        let children = this.images.map((url) => {
            let ele = <img src={url} />;
            ele.addEventListener('dragstart', (e) => e.preventDefault());
            return ele;
        });
        let root = <div class="carousel">{children}</div>;

        let pos = 0;

        let timeline = new Timeline();

        timeline.start();

        let nextPic = () => {
            let nextPos = (pos + 1) % this.images.length;

            let current = children[pos];
            let next = children[nextPos];

            let currentAnimation = new Animation(
                current.style,
                'transform',
                (v) => `translateX(${v}%)`,
                -100 * pos,
                -100 - 100 * pos,
                500,
                0,
                ease
            );

            let nextAnimation = new Animation(
                next.style,
                'transform',
                (v) => `translateX(${v}%)`,
                100 - 100 * nextPos,
                -100 * nextPos,
                500,
                0,
                ease
            );
            timeline.add(currentAnimation);
            timeline.add(nextAnimation);
            // current.style.transition = 'ease 0s';
            // next.style.transition = 'ease 0s';

            // current.style.transform = `translateX(${-100 * pos}%)`;
            // next.style.transform = `translateX(${100 - 100 * nextPos}%)`;

            // requestAnimationFrame(function () {
            //     requestAnimationFrame(function () {
            //         // current.style.transition = 'ease 0.6s';
            //         // next.style.transition = 'ease 0.6s';
            //         // current.style.transform = `translateX(${
            //         //     -100 - 100 * pos
            //         // }%)`;
            //         // next.style.transform = `translateX(${-100 * nextPos}%)`;

            //         pos = nextPos;
            //         nextPic();
            //         // setTimeout(nextPic, 3000);
            //     });
            // });

            setTimeout(() => {
                pos = nextPos;
                nextPic();
            }, 3000);
        };
        nextPic();
        return root;
    }
    mountTo(parent) {
        this.render().mountTo(parent);
    }
}

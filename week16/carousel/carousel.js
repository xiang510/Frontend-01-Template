import { Timeline, Animation, ease } from "./animation";
import { enableGesture } from "./gesture";

export class Carousel {
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
    let nextPicStop = null;

    let children = this.images.map((url, currentPosition) => {
      let lastPos =
        (currentPosition - 1 + this.images.length) % this.images.length;
      let nextPos = (currentPosition + 1) % this.images.length;
      let offset = 0;
      let onStart = () => {
        timeline.pause();
        clearTimeout(nextPicStop);
        let currentEle = this.children[currentPosition];
        let currentSpace = Number(
          currentEle.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]
        );
        offset = currentSpace + 500 * currentPosition;
      };

      let onPan = (e) => {
        let lastElement = this.children[lastPos];
        let currentElement = this.children[currentPosition];
        let nextElement = this.children[nextPos];
        let dx = e.clientX - e.startX;

        let currentSpace = -500 * currentPosition + offset + dx;
        let lastSpace = -500 - 500 * currentPosition + offset + dx;
        let nextSpace = 500 - 500 * currentPosition + offset + dx;

        lastElement.style.transform = `translateX(${lastSpace}px)`;
        currentElement.style.transform = `translateX(${currentSpace}px)`;
        nextElement.style.transform = `translateX(${nextSpace}px)`;
      };

      let onPaned = (e) => {
        let direction = 0;
        let dx = e.clientX - e.startX;

        if (dx + offset > 250) {
          direction = 1;
        } else if (dx + offset < -250) {
          direction = -1;
        }

        timeline.restart();
        let lastElement = this.children[lastPos];
        let currentElement = this.children[currentPosition];
        let nextElement = this.children[nextPos];

        let lastAnimation = new Animation(
          lastElement.style,
          "transform",
          (v) => `translateX(${v}%)`,
          -100 - 100 * lastPos + offset + dx,
          -100 - 100 * lastPos + direction * 100,
          500,
          0,
          ease
        );
        let currentAnimation = new Animation(
          currentElement.style,
          "transform",
          (v) => `translateX(${v}%)`,
          -100 * currentPosition + offset + dx,
          -100 * currentPosition + direction * 100,
          500,
          0,
          ease
        );
        let nextAnimation = new Animation(
          nextElement.style,
          "transform",
          (v) => `translateX(${v}%)`,
          100 - 100 * nextPos + offset + dx,
          100 - 100 * nextPos + direction * 100,
          500,
          0,
          ease
        );

        timeline.add(lastAnimation);
        timeline.add(currentAnimation);
        timeline.add(nextAnimation);

        pos = (pos - direction + this.images.length) % this.images.length;

        nextPicStop = setTimeout(nextPic, 3000);
      };

      let ele = (
        <img
          src={url}
          onStart={onStart}
          onPan={onPan}
          onPaned={onPaned}
          enableGesture={true}
        />
      );
      ele.addEventListener("dragstart", (e) => e.preventDefault());
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
        "transform",
        (v) => `translateX(${v}%)`,
        -100 * pos,
        -100 - 100 * pos,
        500,
        0,
        ease
      );

      let nextAnimation = new Animation(
        next.style,
        "transform",
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

      nextPicStop = setTimeout(() => {
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

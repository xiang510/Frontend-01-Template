function create(Cls, attributes, ...children) {
    let o;
    if (typeof Cls === 'string') {
        o = new Wraper(Cls);
    } else {
        o = new Cls({ timer: {} });
    }

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    let visit = (children) => {
        for (let child of children) {
            if (typeof child === 'string') {
                child = new Text(child);
            } else if (typeof child === 'object' && child instanceof Array) {
                visit(child);
                continue;
            }
            o.appendChild(child);
        }
    };
    visit(children);

    return o;
}

class Text {
    constructor(text) {
        this.children = [];
        this.root = document.createTextNode(text);
    }

    mountTo(parent) {
        parent.appendChild(this.root);

        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }
}

class Wraper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        // console.log(name, value);
        this.root.setAttribute(name, value);
    }
    get style() {
        return this.root.style;
    }
    appendChild(child) {
        this.children.push(child);
    }
    addEventListener() {
        this.root.addEventListener(...arguments);
    }
    mountTo(parent) {
        parent.appendChild(this.root);

        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }
}

export { create, Text, Wraper };

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

    for (let child of children) {
        if (typeof child === 'string') {
            child = new Text(child);
        }
        o.appendChild(child);
    }
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

    appendChild(child) {
        this.children.push(child);
    }
    mountTo(parent) {
        parent.appendChild(this.root);

        for (let child of this.children) {
            child.mountTo(this.root);
        }
    }
}
class MyComponent {
    constructor() {
        // console.log(config);
        this.children = [];
        this.attributes = new Map();
    }

    setAttribute(name, value) {
        // console.log(name, value);
        this.attributes.set(name, value);
    }

    appendChild(child) {
        // console.log('child=>', child);
        this.children.push(child);
    }

    render() {
        return (
            <div>
                <div>header</div>
                {this.slot}
                <div>footer</div>
            </div>
        );
    }
    mountTo(parent) {
        this.slot = <div></div>;
        for (let child of this.children) {
            this.slot.appendChild(child);
        }
        this.render().mountTo(parent);
    }
}

let component = (
    <MyComponent title="title" props="property">
        <div>11</div>
        <p>22</p>
        <div>33</div>
    </MyComponent>
);

component.mountTo(document.getElementById('root'));

console.log(component);

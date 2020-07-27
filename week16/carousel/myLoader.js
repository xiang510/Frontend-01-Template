const parse = require('./parseHTML');

module.exports = function (source, map) {
    let tree = parse.parseHTML(source);
    // console.log(tree.children[2].children[0].content);
    let template = null;
    let script = null;

    for (let node of tree.children) {
        if (node.tagName === 'template') {
            template = node;
        } else if (node.tagName === 'script') {
            script = node.children[0].content;
        }
    }

    let visit = (node) => {
        let attrs = {};
        if (node.type === 'text') {
            return JSON.stringify(node.content);
        }
        for (let attribute of node.attributes) {
            attrs[attribute] = attribute.value;
        }
        let children = node.children.map((node) => visit(node));
        return `create(${JSON.stringify(node.tagName)}, ${JSON.stringify(
            attrs
        )}, ${JSON.stringify(children)})`;
    };

    let r = `
    import { create } from './create.js';
    export class Carousel {
        setAttribute(name, value) {
            // console.log(name, value);
            this.name = value;
        }
        render() {
            return ${visit(template)}
        }
        mountTo(parent) {
           
            this.render().mountTo(parent);
        }
    }

    `;

    console.log(r);
    return '';
};

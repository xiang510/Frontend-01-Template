const css = require('css');

module.exports = class ParserCSS {
    constructor() {
        this.rules = [];
    }

    addCSSRules(text) {
        let ast = css.parse(text);
        this.rules.push(...ast.stylesheet.rules);
    } 

    computeCSS(element) {
        
    }
}
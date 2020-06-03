var CssSelectorParser = require('css-selector-parser').CssSelectorParser,
    parser = new CssSelectorParser();

parser.registerSelectorPseudos('has');
parser.registerNestingOperators('>', '+', '~');
parser.registerAttrEqualityMods('^', '$', '*', '~');
parser.enableSubstitutes();

let pattern = parser.parse('#wrap div > a');
// console.log(JSON.stringify(parser.parse('#wrap div > a'), false, '    '));

let parents = [];
let rules = [];

function getParent(e) {
    parents.push(e);
    if (!!e.parentElement) {
        getParent(e.parentElement);
    }
}

// keep thinking
function getRules(pattern) {
    if (!pattern) return;
}
function match(element) {
    getParent(element);
}

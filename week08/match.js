var CssSelectorParser = require('css-selector-parser').CssSelectorParser,
    parser = new CssSelectorParser();

parser.registerSelectorPseudos('has');
parser.registerNestingOperators('>', '+', '~');
parser.registerAttrEqualityMods('^', '$', '*', '~');
parser.enableSubstitutes();

// console.log(JSON.stringify(parser.parse('#wrap div > a'), false, '    '));

/* 

    {
        "type": "ruleSet",
        "rule": {
            "id": "wrap",
            "type": "rule",
            "rule": {
                "tagName": "div",
                "nestingOperator": null,
                "type": "rule",
                "rule": {
                    "tagName": "a",
                    "nestingOperator": ">",
                    "type": "rule"
                }
            }
        }
    }

*/

let pattern = null;
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
function match(selector, element) {

    pattern = parser.parse(selector);
    
    getParent(element);
}


match('#wrap div > a', null)

var CssSelectorParser = require("css-selector-parser").CssSelectorParser,
  parser = new CssSelectorParser();

parser.registerSelectorPseudos("has");
parser.registerNestingOperators(">", "+", "~");
parser.registerAttrEqualityMods("^", "$", "*", "~");
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

  if (pattern.rule) {
    let item = pattern.rule;
    let keys = Object.keys(item);
    let rule = {};
    keys.forEach((k) => {
      if (k !== "rule") {
        rule[k] = item[k];
      }
    });
    rules.push(rule);
    getRules(item);
  }
}

function getMatchCount(targetEle, index) {
  let matchRule = rules[0];

  if (
    matchRule.nestingOperator &&
    targetEle.parentElement.tagName === rules[index + 1].tagName
  ) {
    if (matchRule.tagName && matchRule.tagName === targetEle.tagName) {
      rules.shift();
      return 1;
    }
  } else {
    if (matchRule.tagName && matchRule.tagName === targetEle.tagName) {
      rules.shift();
      return 1;
    } else {
      if (matchRule.id === targetEle.id) {
        rules.shift();
        return 1;
      }
    }
  }
}

function match(selector, element) {
  pattern = parser.parse(selector);
  getRules(pattern);
  rules.reverse();
  getParent(element);
  for (let i = 0; i < parents.length; i++) {
    isMatchCount += getMatchCount(parents[i], i);
  }
  console.log(rules);

  return !rules.length;
}

match("#wrap div > a", null);

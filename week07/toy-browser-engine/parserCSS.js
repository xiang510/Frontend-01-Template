const css = require("css");

module.exports = class ParserCSS {
  constructor() {
    this.rules = [];
  }

  addCSSRules(text) {
    let ast = css.parse(text);
    this.rules.push(...ast.stylesheet.rules);
  }

  match(element, selector) {
    if (!element || !selector) {
      return false;
    }

    if (selector.charAt(0) === "#") {
      let attr = element.attributes.filter((attr) => attr.name === "id")[0];
      if (attr && attr.value === selector.replace("#", "")) {
        return true;
      }
    } else if (selector.charAt(0) === ".") {
      let attr = element.attributes.filter((attr) => attr.name === "class")[0];
      if (attr && attr.value === selector.replace(".", "")) {
        return true;
      }
    } else {
      if (element.tagName === selector) {
        return true;
      }
    }

    return false;
  }

  specificity(selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(" ");

    for (let part of selectorParts) {
      if (part.charAt(0) === "#") {
        p[1] += 1;
      } else if (part.charAt(0) === ".") {
        p[2] += 1;
      } else {
        p[3] += 1;
      }
    }

    return p;
  }

  compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
      return sp1[0] - sp2[0];
    }

    if (sp1[1] - sp2[1]) {
      return sp1[1] - sp2[1];
    }

    if (sp1[2] - sp2[2]) {
      return sp1[2] - sp2[2];
    }

    return (sp1[3] = sp2[3]);
  }

  computeCSS(element) {
    let elements = element.parent.slice().reverse();

    if (element.computedStyle) {
      element.computedStyle = {};
    }

    for (let rule of rules) {
      let selectorParts = rule.selector[0].split(" ").reverse();

      if (!this.match(element, selectorParts[0])) continue;
      let matched = false;
      let j = 1;
      for (let i = 0; i < elements.length; i++) {
        if (this.match(elements[i], selectorParts[j])) {
          j++;
        }
      }

      if (j >= selectorParts.length) {
        matched = true;
      }
      if (matched) {
        // 成功匹配
        let sp = this.specificity(rule.selectors[0]);
        let computedStyle = element.computedStyle;

        for (let declaration of rule.declarations) {
          if (!computedStyle[declaration.property]) {
            computedStyle[declaration.property] = {};
          }
          if (!computedStyle[declaration.property].specificity) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
          } else if (
            this.compare(computedStyle[declaration.property].specificity, sp) <
            0
          ) {
            computedStyle[declaration.property].value = declaration.value;
            computedStyle[declaration.property].specificity = sp;
          }
        }
      }
    }
  }
};

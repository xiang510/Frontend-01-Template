function parse(source) {
    let stack = [];
    for (let c of source) {
        if (c === '(' || c === '[') {
            stack.push(c);
        }

        if (c === ')') {
            if (stack[stack.length - 1] === '(') {
                stack.pop();
            } else {
                return false;
            }
        }
    }

    if (stack.length) {
        return false;
    } else {
        return true;
    }
}

parse('x(a[b]c)y');

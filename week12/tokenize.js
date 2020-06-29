var reg = /([0-9\.])|([ ])|([\r\n])|([\+])|([\-])|([\*])|([\/])/g;
var dict = ['Number', ' Whitespace', 'LineTerminator', '+', '-', '*', '/'];

function* tokenize(source) {
    var result = null;
    var lastIndex = 0;

    while (true) {
        lastIndex = reg.lastIndex;
        result = reg.exec(source);
        if (!result) {
            break;
        }
        let token = {
            type: null,
            value: null,
        };

        for (let i = 0; i < dict.length; i++) {
            if (result[i + 1]) {
                token.type = dict[i];
            }
        }

        token.value = result[0];

        yield token;
    }

    yield { type: 'EOF' };
}

function Expression(source) {
    if (source[0].type === 'AdditiveExpression' && source[1].type === 'EOF') {
        let node = {
            type: 'Expression',
            children: [source.shift(), source.shift()],
        };
        source.unshift(node);
        return node;
    }
    AdditiveExpression(source);
    return Expression(source);
}

function AdditiveExpression(source) {
    if (source[0].type === 'Number') {
        MultipicativeExpression(source);
        return AdditiveExpression(source);
    }

    if (source[0].type === 'MultipicativeExpression') {
        let node = {
            type: 'AdditiveExpression',
            children: [source.shift()],
        };

        source.unshift(node);
        return AdditiveExpression(source);
    }

    if (
        source[0].type === 'AdditiveExpression' &&
        source.length > 1 &&
        source[1].type === '+'
    ) {
        let node = {
            type: 'AdditiveExpression',
            children: [source.shift(), source.shift()],
        };
        MultipicativeExpression(source);
        node.children.push(source.unshift());
        source.unshift(node);

        return AdditiveExpression(source);
    }

    if (
        source[0].type === 'AdditiveExpression' &&
        source.length > 1 &&
        source[1].type === '-'
    ) {
        let node = {
            type: 'AdditiveExpression',
            children: [source.shift(), source.shift()],
        };
        MultipicativeExpression(source);
        node.children.push(source.unshift());
        source.unshift(node);

        return AdditiveExpression(source);
    }
    if (source[0].type === 'AdditiveExpression') {
        return source[0];
    }
}

function MultipicativeExpression(source) {
    if (source[0].type === 'Number') {
        let node = {
            type: 'MultipicativeExpression',
            children: source.shift(),
        };
        source.unshift(node);
        return MultipicativeExpression(source);
    }

    if (
        source[0].type === 'MultipicativeExpression' &&
        source.length > 1 &&
        source[1].type === '*'
    ) {
        let node = {
            type: 'MultipicativeExpression',
            children: [source.shift(), source.shift(), source.shift()],
        };
        source.unshift(node);
        return MultipicativeExpression(source);
    }

    if (
        source[0].type === 'MultipicativeExpression' &&
        source.length > 1 &&
        source[1].type === '/'
    ) {
        let node = {
            type: 'MultipicativeExpression',
            children: [source.shift(), source.shift(), source.shift()],
        };
        source.unshift(node);

        return MultipicativeExpression(source);
    }

    if (source[0].type === 'MultipicativeExpression') {
        return source[0];
    }
}

let source = [];
for (let token of tokenize('10 * 25')) {
    // console.log(token);
    if (token.type !== 'Whitespace' && token.type !== 'LineTerminator') {
        source.push(token);
    }
}
// console.log(source);

console.log(JSON.stringify(MultipicativeExpression(source), null, '    '));

var parse = require('../src/parseHTML');
var assert = require('assert');

describe('Parse test', function () {
    it('div parse', function () {
        let doc = parse.parseHTML('<div></div>');
        let div = doc.children[0];
        console.log(div);
        assert.equal(div.tagName, 'div');
        assert.equal(div.children.length, 0);
        assert.equal(div.type, 'element');
        // assert.equal(div.attributes.length, 0);
    });
});

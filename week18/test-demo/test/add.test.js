var assert = require('assert');
var add = require('../src/add');

// describe('Array', function () {
//     describe('#indexOf()', function () {
//         it('should return -1 when the value is not present', function () {
//             assert.equal([1, 2, 3].indexOf(4), -1);
//         });
//     });
// });
describe('Add', function () {
    it('add(1, 2) should be 3.', function () {
        assert.equal(add.add(1, 2), 3);
    });
});

var assert = require('assert');

describe('Some initial test', function() {
    it('Passed test', function() {
        assert.equal("Hello".length, 5);
    })
    it('Failed test', function() {
        assert.equal("world".length, 3);
    })
})
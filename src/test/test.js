import {GameField} from "../index.js"
var assert = require('assert');

describe('Game logic tests', function() {
    it('Spread game field left and up, change shift', function() {
        let game = new GameField();
        assert.equal(game.width, 5);
        assert.equal(game.height, 5);
        game.turn(0, 0);
        assert.equal(game.width, 7);
        assert.equal(game.moves[0].row, 2);
        assert.equal(game.moves[0].column, 2);
    });
    it('Spread game field right and down, without change shift', function() {
        let game = new GameField();
        game.turn(4, 4);
        assert.equal(game.width, 6);
        assert.equal(game.height, 6);
    })
})
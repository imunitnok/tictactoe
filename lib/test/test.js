"use strict";

var _index = require("../index.js");

var assert = require('assert');

describe('Game logic tests', function () {
  it('Spread game field left and up, change shift', function () {
    var game = new _index.GameField();
    assert.equal(game.width, 5);
    assert.equal(game.height, 5);
    game.turn(0, 0);
    assert.equal(game.width, 7);
    assert.equal(game.moves[0].shift.up, 2);
    assert.equal(game.moves[0].shift.left, 2);
    assert.equal(game.moves[0].row, 2);
    assert.equal(game.moves[0].column, 2);
  });
  it('Spread game field right and down, without change shift', function () {
    var game = new _index.GameField();
    game.turn(3, 3);
    assert.equal(game.width, 6);
    assert.equal(game.height, 6);
  });
});
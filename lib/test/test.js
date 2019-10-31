"use strict";

var _gamefield = require("../gamefield.js");

var assert = require('assert');

describe('Game logic tests', function () {
  it('Spread game field left and up, change shift', function () {
    var game = new _gamefield.GameField();
    assert.equal(game.getFieldSize().width, 5);
    assert.equal(game.getFieldSize().height, 5);
    game.turn(0, 0);
    assert.equal(game.getFieldSize().width, 8);
    assert.equal(game.moves[0].row, 3);
    assert.equal(game.moves[0].column, 3);
  });
  it('Spread game field right and down, without change shift', function () {
    var game = new _gamefield.GameField();
    game.turn(4, 4);
    assert.equal(game.getFieldSize().width, 6);
    assert.equal(game.getFieldSize().height, 6);
  });
});
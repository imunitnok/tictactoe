"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameField = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEF_INIT_WIDTH = 5;
var DEF_INIT_HEIGHT = 5;
var DEF_PLAYERS_NUM = 2;

var GameField =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @this {GameField}
   * @param {number} width Initial width of game field 
   * @param {number} height Initial height of game field 
   * @param {number} playersNumber Number of players
   */
  function GameField() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEF_INIT_WIDTH;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEF_INIT_HEIGHT;
    var playersNumber = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEF_PLAYERS_NUM;

    _classCallCheck(this, GameField);

    /**@readonly */
    this._width = width;
    /**@readonly */

    this._height = height;
    /**@private */

    this._state = [];

    for (var i = 0; i < height; i++) {
      this._state.push([]);

      for (var j = 0; j < width; j++) {
        this._state[i].push({});
      }
    }
    /**@readonly */


    this._player = 0;
    /**@private */

    this._playersNumber = playersNumber;
    /**@readonly */

    this._moves = [];
    /**@private */

    this._shift = {
      up: 0,
      left: 0
    };
  }
  /**
   * Returns current player
   * @returns {numder} Height of game field
   */


  _createClass(GameField, [{
    key: "getSize",

    /**
     * @typedef {Object} Size
     * @property {number} width Width of game field
     * @property {number} height Height of game field
     * 
     * Returns size of game field
     * @returns {Size} Current size of game field
     */
    value: function getSize() {
      return {
        width: this.width,
        height: this.height
      };
    }
    /**
     * @typedef {Object} Move
     * @property {number} row Move row
     * @property {number} column Move column
     * @property {number} player Player who made the move
     * 
     * Returns array of steps in order of committing
     * @returns {Move[]} Array of commited moves
     */

  }, {
    key: "_resizeField",

    /**
     * Resize game field.
     * The playing field should be two rows larger
     * than the farthest sign puted by the players.
     */
    value: function _resizeField(row, column) {
      var width = this.width;
      var height = this.height;

      for (var j = 0; j < 2 - column; j++) {
        for (var i = 0; i < height; i++) {
          this._state[i].unshift({});
        }
      }

      var shift = {
        up: 2 - column > 0 ? 2 - column : 0,
        left: 2 - row > 0 ? 2 - row : 0
      };
      this._shift += shift;
      width += shift.left;
      height += shift.up;

      for (var _i = 0; _i < 2 - row; _i++) {
        this._state.unshift([]);

        for (var _j = 0; _j < width; _j++) {
          this._state[0].push({});
        }
      }

      column = 2 - column > 0 ? 2 - column : column;
      row = 2 - row > 0 ? 2 - row : row;

      for (var _j2 = width; _j2 < column + 3; _j2++) {
        for (var _i2 = 0; _i2 < height; _i2++) {
          this._state[_i2].push({});
        }
      }

      width = width < column + 3 ? column + 3 : width;

      for (var _i3 = height; _i3 < row + 3; _i3++) {
        this._state.push([]);

        for (var _j3 = 0; _j3 < width; _j3++) {
          this._state[_i3].push({});
        }
      }

      height = height < row + 3 ? row + 3 : height;
      this._width = width;
      this._height = height;
      return {
        row: row,
        column: column,
        shift: shift
      };
    }
    /**
     * Calculate length of line in given direction
     * @param {number} rdir Horizontal movemnt direction:
     *          1 from left to right,
     *          0 stay,
     *          -1 reverse direction
     * @param {number} cdir Vertical movemnt direction:
     *          1 way down,
     *          0 stay,
     *          -1 way up
     */

  }, {
    key: "_checkDir",
    value: function _checkDir(row, column, rdir, cdir) {
      var player = this.player;
      var state = this._state;
      var i = row,
          j = column;

      while (state[i][j].field != undefined && state[i][j].field == player) {
        state[i][j].left = state[i - rdir][j - cdir].field == player ? state[i - rdir][j - cdir].left + 1 : 1;
        i += rdir;
        j += cdir;
      }
    }
    /**
     * Calculate additional inforamtion.
     * This information is required to determine the winner.
     */

  }, {
    key: "_calculateState",
    value: function _calculateState(row, column) {
      this._checkDir(row, column, 0, 1);

      this._checkDir(row, column, 1, 1);

      this._checkDir(row, column, 1, 0);

      this._checkDir(row, column, 1, -1);
    }
    /**
     * Put current player sign to (row, column) position
     * 
     * @param {number} row Row number from up side 
     * @param {number} column Column number from left side 
     */

  }, {
    key: "turn",
    value: function turn(row, column) {
      var tmp = this._resizeField(row, column);

      row = tmp.row;
      column = tmp.column;
      var player = this.player;

      this._moves.push({
        row: row,
        column: column,
        player: player,
        shift: tmp.shift
      });

      if (this._state[row][column].field != undefined) return;
      this._state[row][column].field = this.player;

      this._calculateState(row, column);

      this._player = (this.player + 1) % this._playersNumber;
    }
  }, {
    key: "player",
    get: function get() {
      return this._player;
    }
    /**
     * Get width of game field
     * @returns {number} Width of game field
     */

  }, {
    key: "width",
    get: function get() {
      return this._width;
    }
    /**
     * Returns height of game field
     * @returns {number} Height of game field
     */

  }, {
    key: "height",
    get: function get() {
      return this._height;
    }
  }, {
    key: "moves",
    get: function get() {
      return this._moves;
    }
  }]);

  return GameField;
}();

exports.GameField = GameField;
var game = new GameField();
game;
game.turn(0, 0);

var showField = function showField(game) {
  var tbody = document.getElementById("board").firstElementChild;

  for (var i = 0; i < game.height; i++) {
    var tr = document.createElement("tr");

    for (var j = 0; j < game.width; j++) {
      var td = document.createElement("td");
      tr.append(td);
    }

    tbody.append(tr);
  }

  for (var move in game.moves) {
    tbody.rows[move.row + move.shift.up].cells[move.column + move.shift.left].InnerHtml = "<div class=\"player".concat(move.player, "\"></div>");
  }
};
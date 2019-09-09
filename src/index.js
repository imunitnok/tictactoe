"use strict";

import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

//import "./style.css"

const DEF_INIT_WIDTH = 5;
const DEF_INIT_HEIGHT = 5;
const DEF_PLAYERS_NUM = 2;
const DEF_GROW_SHIFT = 2;

export class GameField {

    /**
     * @constructor
     * @this {GameField}
     * @param {number} width Initial width of game field 
     * @param {number} height Initial height of game field 
     * @param {number} playersNumber Number of players
     */
    constructor(width = DEF_INIT_WIDTH, height = DEF_INIT_HEIGHT,
                    plNum = DEF_PLAYERS_NUM, grow = DEF_GROW_SHIFT) {

        /**@private */ this._width = width;
        /**@private */ this._height = height;
        /**@private */ this._grow = grow;

        let tmp = this.constructor._initField(this._height, this._width);
        /**@private */ this._field = tmp.field;
        /**@private */ this._state = tmp.state;

        /**@readonly */ this._player = 0;
        /**@private */ this._plNum = plNum;

        /**@readonly */ this._moves = [];
    }

    /**
     * @typedef {Object} State
     *
     * @private
     * 
     * Creates empty game field with
     * @param {number} height The height of initial game field
     * @param {number} width The width of initial game field
     * @returns {number[], State[]} Initial game field state 
     * with empty State objects and undefined values of field array  
     */
    static _initField(height, width) {
        let field = [], state = [];
        for (let i = 0; i < height + 2; i++) {
            field.push([]);
            state.push([]);
            for (let j = 0; j < width + 2; j++) {
                field[i].push(undefined);
                state[i].push({})
            }
        }
        return {field, state}
    }

    _shiftMoves(shift) {
        let moves = this._moves;
        for(let move of moves) {
            move.row += shift.up;
            move.column += shift.left;
        }
    }

    _putMoves() {
        let moves = this._moves;
        for(let move of moves) {
            this._field[move.row][move.column] = move.player;
        }
        for(let i = 1; i <= this._height; i++) {
            for(let j = 1; j <= this._width; j++) {
                if(this._field !== undefined) {
                    this._calculateState(i, j);
                }
            }
        }
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
    get moves() {
        return this._moves;
    }

    getFieldSize() {
        return {height: this._height, width: this._width};
    }

    /**
     * Resize game field.
     * The playing field should be on this._grow larger
     * than the farthest sign puted by the players.
     */
    _resizeField(row, column) {
        let grow = this._grow;
        let field = this._field;
        let shift = {
            up: row - grow <= 0 ? grow - row + 1 : 0,
            left: column - grow <= 0 ? grow - column + 1 : 0
        };

        let height = row + grow > this._height ? row + grow : this._height;
        let width = column + grow > this._width ? column + grow : this._width;
        
        height += shift.up;
        width += shift.left;

        let tmp = this.constructor._initField(height, width);
        this._field = tmp.field;
        this._state = tmp.state;

        this._height = height;
        this._width = width;

        return shift;
    }

    /**
     * Calculate length of line in given direction
     * @param {number} rdir Horizontal movement direction:
     *          1 from left to right,
     *          0 stay,
     *          -1 reverse direction
     * @param {number} cdir Vertical movemnt direction:
     *          1 way down,
     *          0 stay,
     *          -1 way up
     */
    _checkDir(row, column, rdir, cdir) {
        let player = this._field[row][column];
        let state = this._state;
        let field = this._field;

        let i = row, j = column;
        while (field[i][j] != undefined && field[i][j] == player) {
            state[i][j][`dir${rdir}${cdir}`] = field[i-rdir][j-cdir] == player ?
                state[i-rdir][j-cdir][`dir${rdir}${cdir}`] + 1 : 1;
            i += rdir; j += cdir;
        }
    }

    /**
     * Calculate additional inforamtion.
     * This information is required to determine the winner.
     */
    _calculateState(row, column) {

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
     * @returns {boolean} True if turn succed, false if turn failed
     */
    turn(row, column) {
        let player = this._player;
        if (this._field[row][column] != undefined) return false;
        this._field[row][column] = player;

        let shift = this._resizeField(row, column);

        this._moves.push({row, column, player});
        this._shiftMoves(shift);
        this._putMoves();

        this._player = (player + 1) % this._plNum;

        return true;
    }
}

class GameTicTacToe {
    /**
     * @constructor
     * @this {GameTicTacToe}
     * 
     * @param {NodeElement} board Container in that shows game field 
     * @param {GameField} field Object that describes current game state, default create new game state
     */
    constructor(uiBoard, board = undefined) {
        
        this._board = board || new GameField();
        this._uiBoard = uiBoard;

    }

    get board() {
        return this._board;
    }

    /**
     * Set innerHTML of board element to empty string. After that puts (shows as table) current game state in board element.
     * 
     * @returns {GameTicTacToe} Current game object
     */
    showField() {
        this._uiBoard.innerHTML = "";
        let size = this.board.getFieldSize();
        for(let i = 0; i < size.height; i++) {
            let tr = document.createElement("tr");
            for(let j = 0; j < size.width; j++) {
                let td = document.createElement("td");
                td.append(document.createElement("div"));
                tr.append(td);
            }
            this._uiBoard.append(tr);
        }

        let shift = {up: 0, left: 0}
        for (let move of this.board.moves) {

            let row = this._uiBoard.rows[move.row - 1];
            let cell = row.cells[move.column - 1];
            cell = cell.getElementsByTagName("div")[0];

            let div = document.createElement("div");
            div.classList.add("player");
            div.classList.add(`player${move.player}`);
            cell.append(div);
        }
        return this;
    }
}

let startGame = function() {
    let board = document.getElementById("board");
    board.style.height = window.innerHeight + "px";
    let div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.height = window.innerHeight + "px";
    div.style.width = "0px";
    div.style.verticalAlign = "middle";
    board.append(div);
    board = board.firstElementChild;

    let game = new GameTicTacToe(board);
    game.showField();

    board.addEventListener("mousedown", (ev) => {
        console.log(ev.target);
        let el = ev.target.parentNode;
        if(el.localName == "td") {
            let tr = el.parentNode;
            let row = tr.rowIndex;
            let column = el.cellIndex;
            game.board.turn(row + 1, column + 1);
            game.showField();
        }
        ev.stopPropagation();
    });

    document.removeEventListener("DOMContentLoaded", startGame);
}

if(document.readyState !== "lading") {
    startGame();
} else {
    document.addEventListener("DOMContentLoaded", startGame);
}
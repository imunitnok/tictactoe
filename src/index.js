"use strict";
import "./style.css"
import { strict } from "assert";

const DEF_INIT_WIDTH = 5;
const DEF_INIT_HEIGHT = 5;
const DEF_PLAYERS_NUM = 2;

class GameField {

    /**
     * @constructor
     * @this {GameField}
     * @param {number} width Initial width of game field 
     * @param {number} height Initial height of game field 
     * @param {number} playersNumber Number of players
     */
    constructor(width = DEF_INIT_WIDTH, height = DEF_INIT_HEIGHT,
                    playersNumber = DEF_PLAYERS_NUM) {

        /**@readonly */ this._width = width;
        /**@readonly */ this._height = height;

        /**@private */ this._state = [];
        for (let i = 0; i < height; i++) {
            this._state.push([]);
            for (let j = 0; j < width; j++) {
                this._state[i].push({})
            }
        }

        /**@readonly */ this._player = 0;
        /**@private */ this._playersNumber = playersNumber;
    }

    /**
     * Return current player
     * @return {numder} Height of game field
     */
    get player() {
        return this._player;
    }
    
    /**
     * Get width of game field
     * @return {number} Width of game field
     */
    get width() {
        return this._width;
    }

    /**
     * Return height of game field
     * @return {number} Height of game field
     */
    get height() {
        return this._height;
    }

    /**
     * @typedef {Object} Size
     * @property {number} width Width of game field
     * @property {number} height Height of game field
     * 
     * Return size of game field
     * @return {Size} Current size of game field
     */
    getSize() {
        return {
            width: this.width,
            height: this.height
        }
    }

    /**
     * Resize game field.
     * The playing field should be two rows larger
     * than the farthest sign puted by the players.
     */
    _resizeField(row, column) {
        let width = this.width;
        let height = this.height;

        for (let j = 0; j < 3 - column; j++) {
            for (let i = 0; i < height; i++) {
                this._state[i].unshift({});
            }
        }

        width = 3 - column > 0 ? width + 3 - column : width;
        height = 3 - row > 0 ? height + 3 - row : height;

        for (let i = 0; i < 3 - row; i++) {
            this._state.unshift([]);
            for (let j = 0; j < width; j++) {
                this._state[0].push({});
            }
        }

        column = 3 - column > 0 ? 3 - column : column;
        row = 3 - row > 0 ? 3 - row : row;

        for (let j = width; j < column + 3; j++) {
            for (let i = 0; i < height; i++) {
                this._state[i].unshift({});
            }
        }
        width = width <= column + 3 ? column + 3 : width;

        for (let i = height; i < row + 3; i++) {
            this._state.push([]);
            for (let j = 0; j < width; j++) {
                this._state[i].push({});
            }
        }
        height = height <= row + 3 ? row + 3 : height;

        this._width = width;
        this._height = height;
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
    _checkDir(row, column, rdir, cdir) {
        let player = this.player;
        let state = this._state;

        let i = row, j = column;
        while (state[i][j].field != undefined && state[i][j].field == player) {
            state[i][j].left = state[i-rdir][j-cdir].field == player ?
                state[i-rdir][j-cdir].left + 1 : 1;
            i += rdir; j += cdir;
        }
    }

    /**
     * Calculate additional inforamtion.
     * This information is required to determine the winner.
     */
    _calculateState(row, column) {
        let player = this.player;
        let state = this._state;

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
    turn(row, column) {
        this._resizeField(row, column); 

        if (this._state[row][column].field != undefined) return;
        this._state[row][column].field = this.player;
    
        this._calculateState(row, column);
        this.player = (this.player + 1) % this._playersNumber;
    }
}

let game = new GameField();

let tbody = document.getElementById("board").firstElementCild.firstElementChild.innerHTML = "There will be a TicTacToe game";
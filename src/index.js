"use strict";
import "./style.css"
import { strict } from "assert";

const MAX_WIDTH = 100;
const MAX_HEIGHT = 100;
const DEF_INIT_WIDTH = 5;
const DEF_INIT_HEIGHT = 5;
const DEF_PLAYERS_NUM = 2;

class GameField {
    constructor(width = DEF_INIT_WIDTH, height = DEF_INIT_HEIGHT,
                    maxWidth = MAX_WIDTH, maxHeight = MAX_HEIGHT,
                    playersNumber = DEF_PLAYERS_NUM) {
        this.width = width;
        this.height = height;

        this.max = {
            width : maxWidth,
            height : maxHeight
        }

        this.state = [];
        for (let i = 0; i < height; i++) {
            this.state.push([]);
            for (let j = 0; j < width; j++) {
                this.state[i].push({})
            }
        }

        this.player = 0;
        this.playersNumber = playersNumber;
    }

    turn(row, column) {
        let width = this.width;
        let height = this.height;
        let player = this.player;

        for (let j = 0; j < 3 - column; j++) {
            for (let i = 0; i < height; i++) {
                this.state[i].unshift({});
            }
        }

        width = 3 - column > 0 ? width + 3 - column : width;
        height = 3 - row > 0 ? height + 3 - row : height;

        for (let i = 0; i < 3 - row; i++) {
            this.state.unshift([]);
            for (let j = 0; j < width; j++) {
                this.state[0].push({});
            }
        }

        column = 3 - column > 0 ? 3 - column : column;
        row = 3 - row > 0 ? 3 - row : row;

        for (let j = width; j < column + 3; j++) {
            for (let i = 0; i < height; i++) {
                this.state[i].unshift({});
            }
        }
        width = width <= column + 3 ? column + 3 : width;

        for (let i = height; i < row + 3; i++) {
            this.state.push([]);
            for (let j = 0; j < width; j++) {
                this.state[i].push({});
            }
        }
        height = height <= row + 3 ? row + 3 : height;

        this.width = width;
        this.height = height;

        if (this.state[row][column].field != undefined) return;
        this.state[row][column].field = player;
    
        this.calculate(row, column);
        this.player = (player + 1) % this.playersNumber;
    }

    calculate(row, column) {
        let player = this.player;
        let state = this.state;

        let i = row, j = column;
        while (state[i][j].field != undefined && state[i][j].field == player) {
            state[i][j].left = state[i][j-1].field == player ? state[i][j-1].left+1 : 1;
            j++;
        }

        i = row; j = column;
        while (state[i][j].field != undefined && state[i][j].field == player) {
            state[i][j].upLeft = state[i-1][j-1].field == player ? state[i-1][j-1].upLeft+1 : 1;
            i++; j++;
        }

        i = row; j = column;
        while (state[i][j].field != undefined && state[i][j].field == player) {
            state[i][j].up = state[i-1][j].field == player ? state[i-1][j].up+1 : 1;
            i++;
        }
        
        i = row; j = column;
        while (state[i][j].field != undefined && state[i][j].field == player) {
            state[i][j].upRight = state[i-1][j+1].field == player ? state[i-1][j+1].upRight+1 : 1;
            i++; j--;
        }
    }
}

let game = new GameField();

let tbody = document.getElementById("board").firstElementCild.firstElementChild.innerHTML = "There will be a TicTacToe game";
"use strict";

var _gameui = require("./gameui");

var startGame = function startGame() {
  var body = document.getElementsByTagName("body")[0];
  body.style.height = window.innerHeight + "px";
  var board = document.getElementById("board");
  var table = board.getElementsByClassName("table")[0];
  var progress = board.getElementsByClassName("progress-bar")[0].firstElementChild;
  var tableContainer = board.getElementsByClassName("table-container")[0];
  tableContainer.style.height = body.offsetHeight - 20 + "px";
  var crutch = board.getElementsByClassName("crutch")[0];
  crutch.style.height = body.offsetHeight - 20 + "px";
  var game = new _gameui.GameTicTacToe(table, document.createElement.bind(document), progress);
  game.showField();
  board.addEventListener("mousedown", function (ev) {
    var el = ev.target.parentNode;

    if (el.localName == "td") {
      var tr = el.parentNode;
      var row = tr.rowIndex;
      var column = el.cellIndex;
      if (game.board.turn(row + 1, column + 1)) game.showField();
    }

    ev.stopPropagation();
  });
  document.removeEventListener("DOMContentLoaded", startGame);
};

if (document.readyState !== "lading") {
  startGame();
} else {
  document.addEventListener("DOMContentLoaded", startGame);
}
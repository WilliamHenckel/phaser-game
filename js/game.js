/* global Phaser, bootState, loadState, menuState, trophyState, helpState, characterState, difficultyState, levelState, playState */
let canvasHeight;
let antialias;

if (window.innerWidth <= 800) {
  canvasHeight = 700;
  antialias = true;
} else {
  canvasHeight = 640;
  antialias = false;
}

var game = new Phaser.Game(
  800,
  window.canvasHeight,
  Phaser.AUTO,
  "gameDiv",
  null,
  false,
  window.antialias
);

var textColor = "#ffffff";
var textColorBlack = "#000000";
var textFont = "VT323";
var fontxl = "50px " + textFont;
var fontl = "30px " + textFont;
var fontm = "25px " + textFont;
var fonts = "20px " + textFont;

var WebFontConfig = {
  google: {
    families: ["VT323"],
  },
};

game.global = { score: 0 };
game.conf = {};

game.state.add("boot", bootState);
game.state.add("load", loadState);
game.state.add("menu", menuState);
game.state.add("trophy", trophyState);
game.state.add("help", helpState);
game.state.add("character", characterState);
game.state.add("difficulty", difficultyState);
game.state.add("level", levelState);
game.state.add("play", playState);

game.state.start("boot");

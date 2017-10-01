/* global Phaser, game */
var bootState = {
  preload: function () {
    game.load.image('progressBar', 'assets/progressBar.png');
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },

  create: function () {
    game.stage.backgroundColor = '#313131';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('load');
  }
};

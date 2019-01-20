/* global Phaser, game */
var bootState = {
  preload: function () {
    game.load.image('progressBar', 'assets/progressBar.png');
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
  },

  create: function () {
    if (game.device.desktop === false) {
      document.body.style.backgroundColor = '#313131';
    }

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.windowConstraints.bottom = 'visual';
    game.scale.pageAlignHorizontally = false;
    game.scale.pageAlignVertically = false;

    game.stage.backgroundColor = '#313131';
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('load');
  }
};

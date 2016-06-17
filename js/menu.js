var menuState = {

  create: function() {
    game.add.image(0, 0, 'background');

    var nameLabel = game.add.text(game.world.centerX, -50, 'Boo\'s Adventures',{font: fontxl, fill: textColor});
    nameLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();

    var text = 'Score : ' + game.global.score + '\nRecord : ' + localStorage.getItem('bestScore');
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text, {font: fontm, fill: textColor, align: 'center'});
    scoreLabel.anchor.setTo(0.5, 0.5);

    var startLabel = game.add.text(game.world.centerX, game.world.height-80, 'Fleche haut pour commencer',{font: fonts, fill: textColor});
    startLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(startLabel).to({angle: -5}, 500).to({angle: 0}, 500).loop().start();

    var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.addOnce(this.start, this);

    if (!localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', 0);
    }

    if (game.global.score > localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', game.global.score);
    }

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }
  },

  start: function() {
    game.state.start('play');
  },

  toggleSound: function() {
    game.sound.mute = ! game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  }
};

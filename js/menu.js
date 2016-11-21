var menuState = {

  create: function() {
    //game.add.image(0, 0, 'background');
    game.stage.backgroundColor = "#313131";

    this.music = game.add.audio('elephant', 1, true);
    if (this.musicplay == undefined) {
      this.music.loopFull();
    }
    this.musicplay = 1;

    var nameLabel = game.add.text(game.world.centerX, -50, 'Bob le blob',{font: fontxl, fill: textColor});
    nameLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(nameLabel).to({y: 50}, 1000).easing(Phaser.Easing.Bounce.Out).start();

    /*var text = 'Score : ' + game.global.score + '\nRecord : ' + localStorage.getItem('bestScore');
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text, {font: fontm, fill: textColor, align: 'center'});
    scoreLabel.anchor.setTo(0.5, 0.5);*/

    var explosion = game.add.sprite(game.world.centerX, game.world.centerY, 'explosion');
    explosion.anchor.set(0.5);
    game.add.tween(explosion).to({angle: -5}, 500).to({angle: 0}, 500).loop().start();
    game.add.tween(explosion.scale).to({x: 0.8, y: 0.8}, 500).to({x: 1, y: 1}, 500).loop().start();

    var blob = game.add.sprite(game.world.centerX, game.world.centerY, 'blob');
    blob.anchor.set(0.5);

    var bouton1 = game.add.sprite(game.world.centerX-150, 280, 'bouton1');
    bouton1.scale.setTo(0.5);
    bouton1.anchor.set(0.5);
    bouton1.inputEnabled = true;
    bouton1.events.onInputDown.add(this.level1, this);

    var bouton2 = game.add.sprite(game.world.centerX, 280, 'bouton2');
    bouton2.scale.setTo(0.5);
    bouton2.anchor.set(0.5);
    bouton2.inputEnabled = true;
    bouton2.events.onInputDown.add(this.level2, this);

    var bouton3 = game.add.sprite(game.world.centerX+150, 280, 'bouton3');
    bouton3.scale.setTo(0.5);
    bouton3.anchor.set(0.5);
    bouton3.inputEnabled = true;
    bouton3.events.onInputDown.add(this.level3, this);

    var arrows = game.add.sprite(game.world.centerX+160, game.world.centerY-15, 'arrows');
    arrows.anchor.set(0.5);
    bouton3.scale.setTo(0.5);
    game.add.tween(arrows.scale).to({x: 0.8, y: 0.8}, 250).to({x: 1, y: 1}, 250).loop().start();

    /*var startLabel = game.add.text(game.world.centerX, game.world.height-80, 'Fleche haut pour commencer',{font: fonts, fill: textColor});
    startLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(startLabel).to({angle: -5}, 500).to({angle: 0}, 500).loop().start();*/

    /*if (!localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', 0);
    }

    if (game.global.score > localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', game.global.score);
    }*/

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }
  },

  level1: function() {
    game.state.start('play', true, false, "map");
  },

  level2: function() {
    game.state.start('play2');
  },

  level3: function() {
    game.state.start('play3');
  },

  toggleSound: function() {
    game.sound.mute = ! game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  restartGame: function() {
    this.elephant.stop();
  }
};

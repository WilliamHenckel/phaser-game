var menuState = {
  create: function () {
    game.stage.backgroundColor = '#313131';

    this.explosionSound = game.add.audio('explosion');
    this.explosionSound.volume = 0.5;
    this.music = game.add.audio('castelvania', 1, true);
    this.fall = game.add.audio('fall');
    this.fall.volume = 0.3;
    this.fall.play();

    game.time.events.add(500, this.titleRandom, this);
    game.time.events.add(800, this.titleExplosion, this);
    game.time.events.add(800, this.titleMinion, this);
    game.time.events.add(1800, this.titleText, this);
    game.time.events.add(1800, this.titleStart, this);
    game.time.events.add(1800, this.titleControls, this);

    this.explosion = game.add.sprite(400, game.world.centerY, 'explosion');
    this.explosion.anchor.set(0.5);
    this.explosion.scale.setTo(0);

    this.random = game.add.sprite(400, -70, 'achilleimg');
    this.random.anchor.set(0.5);

    this.minion = game.add.sprite(400, game.world.centerY, 'minion');
    this.minion.anchor.set(0.5);

    this.nameLabel = game.add.text(400, -50, 'Random Guy Adventures', {font: fontxl, fill: textColor});
    this.nameLabel.anchor.setTo(0.5, 0.5);

    this.startButton = game.add.text(400, 700, 'Démarrer', {font: fontxl, fill: textColor});
    this.startButton.anchor.set(0.5);
    this.startButton.alpha = 0.5;
    this.startButton.inputEnabled = true;

    this.helpButton = game.add.text(400, 700, 'Aide', {font: fontxl, fill: textColor});
    this.helpButton.anchor.set(0.5);
    this.helpButton.alpha = 0.5;
    this.helpButton.inputEnabled = true;

    game.input.onDown.add(this.level1, this);


    this.arrows = game.add.sprite(900, game.world.centerY - 15, 'arrows');
    this.arrows.anchor.set(0.5);

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }
  },

  update: function () {
    if (this.startButton.input.pointerOver()) {
      this.startButton.alpha = 1;
    } else if (this.helpButton.input.pointerOver()) {
      this.helpButton.alpha = 1;
    } else {
      this.startButton.alpha = 0.5;
      this.helpButton.alpha = 0.5;
    }
  },

  titleRandom: function () {
    game.add.tween(this.random).to({y: game.world.centerY}, 1000).easing(Phaser.Easing.Bounce.Out).start();
  },

  titleText: function () {
    game.add.tween(this.nameLabel).to({y: 100}, 1000).easing(Phaser.Easing.Circular.Out).start();
  },

  titleExplosion: function () {
    game.add.tween(this.explosion.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true);
    game.add.tween(this.explosion).to({angle: -5}, 500).to({angle: 0}, 500).loop().start();
    this.explosionSound.play();
  },

  titleStart: function () {
    game.add.tween(this.startButton).to({y: game.world.centerY + 160}, 1000).easing(Phaser.Easing.Circular.Out).start();
    game.add.tween(this.helpButton).to({y: game.world.centerY + 240}, 1000).easing(Phaser.Easing.Circular.Out).start();


    if (this.musicplay === undefined) {
      this.music.loopFull();
    }
    this.musicplay = 1;
  },

  titleControls: function () {
    game.add.tween(this.arrows).to({x: 400 + 160, y: game.world.centerY - 15}, 1000).easing(Phaser.Easing.Circular.Out).start();
    game.add.tween(this.arrows.scale).to({x: 0.8, y: 0.8}, 250).to({x: 1, y: 1}, 250).loop().start();
  },

  titleMinion: function () {
    this.minion.destroy();
    this.minion = game.add.sprite(400, game.world.centerY, 'minion2');
    this.minion.anchor.setTo(0.5, 0.5);
    game.add.tween(this.minion).to({x: 400 - 200, y: game.world.centerY - 100}, 1000).easing(Phaser.Easing.Circular.Out).start();
    game.add.tween(this.minion).to({angle: -50}, 1000, Phaser.Easing.Circular.Out, true);
  },

  level1: function () {
    if (!this.muteButton.input.pointerOver() && this.nameLabel.y === 100) {
      if (this.startButton.input.pointerOver()) {
        game.state.start('character');
      } else if (this.helpButton.input.pointerOver()) {
        game.state.start('help');
      } else {
        return;
      }
    }
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  restartGame: function () {
    this.castelvania.stop();
  },
};

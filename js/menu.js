var menuState = {
  create: function () {
    game.stage.backgroundColor = '#313131';

    /* this.music = game.add.audio('elephant', 1, true);
    if (this.musicplay === undefined) {
      this.music.loopFull();
    }
    this.musicplay = 1; */

    game.time.events.add(500, this.titleRandom, this);
    game.time.events.add(800, this.titleExplosion, this);
    game.time.events.add(800, this.titleMinion, this);
    game.time.events.add(1800, this.titleText, this);
    game.time.events.add(1800, this.titleStart, this);
    game.time.events.add(1800, this.titleControls, this);

    /* var text = 'Score : ' + game.global.score + '\nRecord : ' + localStorage.getItem('bestScore');
    var scoreLabel = game.add.text(game.world.centerX, game.world.centerY, text, {font: fontm, fill: textColor, align: 'center'});
    scoreLabel.anchor.setTo(0.5, 0.5); */

    game.explosion = game.add.sprite(game.world.centerX, game.world.centerY, 'explosion');
    game.explosion.anchor.set(0.5);
    game.explosion.scale.setTo(0);

    game.random = game.add.sprite(game.world.centerX, -70, 'achilleimg');
    game.random.anchor.set(0.5);

    game.minion = game.add.sprite(game.world.centerX, game.world.centerY, 'minion');
    game.minion.anchor.set(0.5);

    game.startButton = game.add.text(game.world.centerX, 700, 'Cliquez pour commencer !', {font: fontxl, fill: textColor});
    game.startButton.anchor.set(0.5);

    game.input.onDown.add(this.level1, this);

    game.arrows = game.add.sprite(900, game.world.centerY - 15, 'arrows');
    game.arrows.anchor.set(0.5);

    /* if (!localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', 0);
    } */

    /* if (game.global.score > localStorage.getItem('bestScore')) {
      localStorage.setItem('bestScore', game.global.score);
    } */

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }
  },

  titleRandom: function () {
    game.add.tween(game.random).to({y: game.world.centerY}, 1000).easing(Phaser.Easing.Bounce.Out).start();
  },

  titleText: function () {
    var nameLabel = game.add.text(game.world.centerX, -50, 'Random Guy Adventures', {font: fontxl, fill: textColor});
    nameLabel.anchor.setTo(0.5, 0.5);
    game.add.tween(nameLabel).to({y: 100}, 1000).easing(Phaser.Easing.Circular.Out).start();
  },

  titleExplosion: function () {
    game.add.tween(game.explosion.scale).to({x: 1, y: 1}, 500, Phaser.Easing.Bounce.Out, true);
    game.add.tween(game.explosion).to({angle: -5}, 500).to({angle: 0}, 500).loop().start();
  },

  titleStart: function () {
    game.add.tween(game.startButton).to({y: game.world.centerY + 200}, 1000).easing(Phaser.Easing.Circular.Out).start();
  },

  titleControls: function () {
    game.add.tween(game.arrows).to({x: game.world.centerX + 160, y: game.world.centerY - 15}, 1000).easing(Phaser.Easing.Circular.Out).start();
    game.add.tween(game.arrows.scale).to({x: 0.8, y: 0.8}, 250).to({x: 1, y: 1}, 250).loop().start();
  },

  titleMinion: function () {
    game.minion.destroy();
    game.minion = game.add.sprite(game.world.centerX, game.world.centerY, 'minion2');
    game.minion.anchor.setTo(0.5, 0.5);
    game.add.tween(game.minion).to({x: game.world.centerX - 200, y: game.world.centerY - 100}, 1000).easing(Phaser.Easing.Circular.Out).start();
    game.add.tween(game.minion).to({angle: -50}, 1000, Phaser.Easing.Circular.Out, true);
  },

  level1: function () {
    game.state.start('character');
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  restartGame: function () {
    //this.elephant.stop();
  }
};

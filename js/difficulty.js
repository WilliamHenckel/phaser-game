var difficultyState = {
  create: function () {
    this.choiceDifficulty = game.add.text(1100, 100, 'Difficulté', {font: fontxl, fill: textColor});
    game.add.tween(this.choiceDifficulty).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.choiceDifficulty.anchor.set(0.5);

    this.easyDifficulty = game.add.text(1100, game.world.centerY - 100, 'Facile', {font: fontxl, fill: textColor});
    game.add.tween(this.easyDifficulty).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.easyDifficulty.anchor.set(0.5);
    this.easyDifficulty.alpha = 0.5;
    this.easyDifficulty.inputEnabled = true;

    this.casualDifficulty = game.add.text(1100, game.world.centerY, 'Normal', {font: fontxl, fill: textColor});
    game.add.tween(this.casualDifficulty).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.casualDifficulty.anchor.set(0.5);
    this.casualDifficulty.alpha = 0.5;
    this.casualDifficulty.inputEnabled = true;

    this.hardDifficulty = game.add.text(1100, game.world.centerY + 100, 'Difficile', {font: fontxl, fill: textColor});
    game.add.tween(this.hardDifficulty).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.hardDifficulty.anchor.set(0.5);
    this.hardDifficulty.alpha = 0.5;
    this.hardDifficulty.inputEnabled = true;

    game.input.onDown.add(this.difficultyChoice, this);

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }
  },

  update: function () {
    if (this.easyDifficulty.input.pointerOver()) {
      this.easyDifficulty.alpha = 1;
    } else if (this.casualDifficulty.input.pointerOver()) {
      this.casualDifficulty.alpha = 1;
    } else if (this.hardDifficulty.input.pointerOver()) {
      this.hardDifficulty.alpha = 1;
    } else {
      this.easyDifficulty.alpha = 0.5;
      this.casualDifficulty.alpha = 0.5;
      this.hardDifficulty.alpha = 0.5;
    }
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  difficultyChoice: function () {
    if (this.easyDifficulty.input.pointerOver()) {
      game.difficulty = 'easy';
    } else if (this.casualDifficulty.input.pointerOver()) {
      game.difficulty = 'casual';
    } else if (this.hardDifficulty.input.pointerOver()) {
      game.difficulty = 'hard';
    } else {
      return;
    }

    this.transitionAnimation();
  },

  transitionAnimation: function () {
    game.add.tween(this.choiceDifficulty).to({x: this.choiceDifficulty.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.easyDifficulty).to({x: this.easyDifficulty.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.casualDifficulty).to({x: this.casualDifficulty.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.hardDifficulty).to({x: this.hardDifficulty.x - 800}, 400, Phaser.Easing.Linear.Out, true);

    game.time.events.add(500, this.statePlay, this);
  },

  statePlay: function () {
    game.state.start('play', true, false, 1);
  }
};

var difficultyState = {
  create: function () {
    this.choiceDifficulty = game.add.text(400, 100, 'Difficulté', {font: fontxl, fill: textColor});
    this.choiceDifficulty.anchor.set(0.5);

    this.easyDifficulty = game.add.text(400, game.world.centerY - 100, 'Facile', {font: fontxl, fill: textColor});
    this.easyDifficulty.anchor.set(0.5);
    this.easyDifficulty.alpha = 0.5;
    this.easyDifficulty.inputEnabled = true;

    this.casualDifficulty = game.add.text(400, game.world.centerY, 'Normal', {font: fontxl, fill: textColor});
    this.casualDifficulty.anchor.set(0.5);
    this.casualDifficulty.alpha = 0.5;
    this.casualDifficulty.inputEnabled = true;

    this.hardDifficulty = game.add.text(400, game.world.centerY + 100, 'Difficile', {font: fontxl, fill: textColor});
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

    game.state.start('play', true, false, 1);
  }
};

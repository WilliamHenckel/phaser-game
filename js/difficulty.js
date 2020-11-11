/* global Phaser, game, fontxl, textColor */
var difficultyState = {
  create: function () {
    this.choiceDifficulty = game.add.text(1100, 100, "Difficulté", {
      font: fontxl,
      fill: textColor,
    });
    game.add
      .tween(this.choiceDifficulty)
      .to({ x: 400 }, 400, Phaser.Easing.Linear.Out, true);
    this.choiceDifficulty.anchor.set(0.5);

    this.returnButton = game.add.text(
      1100,
      game.world.centerY + 240,
      "Retour",
      { font: fontxl, fill: textColor }
    );
    game.add
      .tween(this.returnButton)
      .to({ x: 400 }, 400, Phaser.Easing.Linear.Out, true);
    this.returnButton.anchor.set(0.5);
    this.returnButton.alpha = 0.5;
    this.returnButton.inputEnabled = true;

    this.easyDifficulty = game.add.text(
      1100,
      game.world.centerY - 100,
      "Facile",
      { font: fontxl, fill: textColor }
    );
    game.add
      .tween(this.easyDifficulty)
      .to({ x: 400 }, 400, Phaser.Easing.Linear.Out, true);
    this.easyDifficulty.anchor.set(0.5);
    this.easyDifficulty.alpha = 0.5;
    this.easyDifficulty.inputEnabled = true;

    this.casualDifficulty = game.add.text(1100, game.world.centerY, "Normal", {
      font: fontxl,
      fill: textColor,
    });
    game.add
      .tween(this.casualDifficulty)
      .to({ x: 400 }, 400, Phaser.Easing.Linear.Out, true);
    this.casualDifficulty.anchor.set(0.5);
    this.casualDifficulty.alpha = 0.5;
    this.casualDifficulty.inputEnabled = true;

    this.hardDifficulty = game.add.text(
      1100,
      game.world.centerY + 100,
      "Difficile",
      { font: fontxl, fill: textColor }
    );
    game.add
      .tween(this.hardDifficulty)
      .to({ x: 400 }, 400, Phaser.Easing.Linear.Out, true);
    this.hardDifficulty.anchor.set(0.5);
    this.hardDifficulty.alpha = 0.5;
    this.hardDifficulty.inputEnabled = true;

    this.muteButton = game.add.button(20, 20, "mute", this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }

    game.input.onDown.add(this.difficultyChoice, this);
  },

  update: function () {
    if (this.easyDifficulty.input.pointerOver()) {
      this.easyDifficulty.alpha = 1;
    } else if (this.casualDifficulty.input.pointerOver()) {
      this.casualDifficulty.alpha = 1;
    } else if (this.hardDifficulty.input.pointerOver()) {
      this.hardDifficulty.alpha = 1;
    } else if (this.returnButton.input.pointerOver()) {
      this.returnButton.alpha = 1;
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
      game.conf.difficulty = "easy";
      this.transitionAnimation("play");
    } else if (this.casualDifficulty.input.pointerOver()) {
      game.conf.difficulty = "casual";
      this.transitionAnimation("play");
    } else if (this.hardDifficulty.input.pointerOver()) {
      game.conf.difficulty = "hard";
      this.transitionAnimation("play");
    } else if (this.returnButton.input.pointerOver()) {
      this.transitionAnimation("character");
    }
  },

  transitionAnimation: function (pState) {
    game.add
      .tween(this.choiceDifficulty)
      .to(
        { x: this.choiceDifficulty.x - 800 },
        400,
        Phaser.Easing.Linear.Out,
        true
      );
    game.add
      .tween(this.easyDifficulty)
      .to(
        { x: this.easyDifficulty.x - 800 },
        400,
        Phaser.Easing.Linear.Out,
        true
      );
    game.add
      .tween(this.casualDifficulty)
      .to(
        { x: this.casualDifficulty.x - 800 },
        400,
        Phaser.Easing.Linear.Out,
        true
      );
    game.add
      .tween(this.hardDifficulty)
      .to(
        { x: this.hardDifficulty.x - 800 },
        400,
        Phaser.Easing.Linear.Out,
        true
      );
    game.add
      .tween(this.returnButton)
      .to(
        { x: this.returnButton.x - 800 },
        400,
        Phaser.Easing.Linear.Out,
        true
      );

    if (pState === "play") {
      game.time.events.add(500, this.stateLevel, this);
    } else if (pState === "character") {
      game.time.events.add(500, this.stateCharacter, this);
    }
  },

  stateLevel: function () {
    game.state.start("level", true, false, 4);
  },

  stateCharacter: function () {
    game.state.start("character");
  },
};

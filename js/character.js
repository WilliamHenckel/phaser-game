var characterState = {
  create: function () {
    this.choice = game.add.text(1100, 100, 'Choix du personnage', {font: fontxl, fill: textColor});
    game.add.tween(this.choice).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.choice.anchor.set(0.5);

    this.returnButton = game.add.text(1100, game.world.centerY + 240, 'Retour', {font: fontxl, fill: textColor});
    game.add.tween(this.returnButton).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.returnButton.anchor.set(0.5);
    this.returnButton.alpha = 0.5;
    this.returnButton.inputEnabled = true;

    this.achilleName = game.add.text(400, game.world.centerY + 160, 'Achille', {font: fontxl, fill: textColor});
    this.achilleName.anchor.set(0.5);
    this.achilleName.alpha = 0;

    this.ernestName = game.add.text(400, game.world.centerY + 160, 'Ernest', {font: fontxl, fill: textColor});
    this.ernestName.anchor.set(0.5);
    this.ernestName.alpha = 0;

    this.achille = game.add.sprite(1025, game.world.centerY, 'achilleimg');
    game.add.tween(this.achille).to({x: 400 - 75}, 400, Phaser.Easing.Linear.Out, true);
    this.achille.anchor.set(0.5);
    this.achille.alpha = 0.5;
    this.achille.inputEnabled = true;

    this.ernest = game.add.sprite(1175, game.world.centerY, 'ernestimg');
    game.add.tween(this.ernest).to({x: 400 + 75}, 400, Phaser.Easing.Linear.Out, true);
    this.ernest.anchor.set(0.5);
    this.ernest.alpha = 0.5;
    this.ernest.inputEnabled = true;

    game.input.onDown.add(this.characterChoice, this);

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }
  },

  update: function () {
    if (this.achille.input.pointerOver()) {
      this.achille.alpha = 1;
      this.achilleName.alpha = 1;
    } else if (this.ernest.input.pointerOver()) {
      this.ernest.alpha = 1;
      this.ernestName.alpha = 1;
    } else if (this.returnButton.input.pointerOver()) {
      this.returnButton.alpha = 1;
    } else {
      this.achille.alpha = 0.5;
      this.ernest.alpha = 0.5;
      this.achilleName.alpha = 0;
      this.ernestName.alpha = 0;
      this.returnButton.alpha = 0.5;
    }
  },

  stateDifficulty: function () {
    game.state.start('difficulty');
  },

  stateMenu: function () {
    game.state.start('menu')
  },

  transitionAnimation: function (pState) {
    game.add.tween(this.choice).to({x: this.choice.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.achille).to({x: this.achille.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.ernest).to({x: this.ernest.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.returnButton).to({x: this.returnButton.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    this.achilleName.kill();
    this.ernestName.kill();

    if (pState === 'difficulty') {
      game.time.events.add(500, this.stateDifficulty, this);
    } else if (pState === 'menu') {
      game.time.events.add(500, this.stateMenu, this);
    }
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  characterChoice: function () {
    if (this.achille.input.pointerOver()) {
      game.character = 'achille';
      this.transitionAnimation('difficulty');
    } else if (this.ernest.input.pointerOver()) {
      game.character = 'ernest';
      this.transitionAnimation('difficulty');
    } else if (this.returnButton.input.pointerOver()) {
      this.transitionAnimation('menu');
    } else {
      return;
    }
  }
};

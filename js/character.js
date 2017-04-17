var characterState = {
  create: function () {
    this.choice = game.add.text(400, 100, 'Choix du personnage', {font: fontxl, fill: textColor});
    this.choice.anchor.set(0.5);

    this.achilleName = game.add.text(400, game.world.centerY + 200, 'Achille', {font: fontxl, fill: textColor});
    this.achilleName.anchor.set(0.5);
    this.achilleName.alpha = 0;

    this.ernestName = game.add.text(400, game.world.centerY + 200, 'Ernest', {font: fontxl, fill: textColor});
    this.ernestName.anchor.set(0.5);
    this.ernestName.alpha = 0;

    this.achille = game.add.sprite(400 - 75, game.world.centerY, 'achilleimg');
    this.achille.anchor.set(0.5);
    this.achille.alpha = 0.5;
    this.achille.inputEnabled = true;

    this.ernest = game.add.sprite(400 + 75, game.world.centerY, 'ernestimg');
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
    } else {
      this.achille.alpha = 0.5;
      this.ernest.alpha = 0.5;
      this.achilleName.alpha = 0;
      this.ernestName.alpha = 0;
    }
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  characterChoice: function () {
    if (this.achille.input.pointerOver()) {
      game.character = 'achille';
    } else if (this.ernest.input.pointerOver()) {
      game.character = 'ernest';
    } else {
      return;
    }

    game.state.start('play', true, false, 1);
  }
};

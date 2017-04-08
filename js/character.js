var characterState = {
  create: function () {
    game.choice = game.add.text(400, 100, 'Choix du personnage', {font: fontxl, fill: textColor});
    game.choice.anchor.set(0.5);

    game.achilleName = game.add.text(400, game.world.centerY + 200, 'Achille', {font: fontxl, fill: textColor});
    game.achilleName.anchor.set(0.5);
    game.achilleName.alpha = 0;

    game.ernestName = game.add.text(400, game.world.centerY + 200, 'Ernest', {font: fontxl, fill: textColor});
    game.ernestName.anchor.set(0.5);
    game.ernestName.alpha = 0;

    game.achille = game.add.sprite(400 - 75, game.world.centerY, 'achilleimg');
    game.achille.anchor.set(0.5);
    game.achille.alpha = 0.5;
    game.achille.inputEnabled = true;

    game.ernest = game.add.sprite(400 + 75, game.world.centerY, 'ernestimg');
    game.ernest.anchor.set(0.5);
    game.ernest.alpha = 0.5;
    game.ernest.inputEnabled = true;

    game.input.onDown.add(this.characterChoice, this);

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }
  },

  update: function () {
    if (game.achille.input.pointerOver()) {
      game.achille.alpha = 1;
      game.achilleName.alpha = 1;
    } else if (game.ernest.input.pointerOver()) {
      game.ernest.alpha = 1;
      game.ernestName.alpha = 1;
    } else {
      game.achille.alpha = 0.5;
      game.ernest.alpha = 0.5;
      game.achilleName.alpha = 0;
      game.ernestName.alpha = 0;
    }
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  characterChoice: function () {
    if (game.achille.input.pointerOver()) {
      game.character = 'achille';
    } else if (game.ernest.input.pointerOver()) {
      game.character = 'ernest';
    } else {
      return;
    }

    game.state.start('play', true, false, 1);
  }
};

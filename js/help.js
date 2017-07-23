var helpState = {
  create: function () {
    game.stage.backgroundColor = '#313131';

    this.title = game.add.text(400, 100, 'Aide', {font: fontxl, fill: textColor});
    this.title.anchor.set(0.5);

    this.returnButton = game.add.text(400, game.world.centerY + 240, 'Retour', {font: fontxl, fill: textColor});
    this.returnButton.anchor.set(0.5);
    this.returnButton.alpha = 0.5;
    this.returnButton.inputEnabled = true;

    game.input.onDown.add(this.menu, this);

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }

    this.coin = game.add.sprite(150, 200, 'coin');
    this.coin.anchor.setTo(0.5, 0.5);
    this.coin.animations.add('turn', [0, 1, 2, 3], 8, true);
    this.coin.animations.play('turn');
    this.coin.scale.setTo(1, 1);
    this.coinText = game.add.text(200, 200, 'Les pièces permettent de passer au niveau suivant', {font: fonts, fill: textColor});
    this.coinText.anchor.setTo(0, 0.5);

    this.potion = game.add.sprite(150, 275, 'potion');
    this.potion.anchor.setTo(0.5, 0.5);
    this.potion.scale.setTo(1, 1);
    this.potionText = game.add.text(200, 275, 'Les potions vous font récupérer des points de vie', {font: fonts, fill: textColor});
    this.potionText.anchor.setTo(0, 0.5);

    this.enemy1 = game.add.sprite(150, 350, 'enemy');
    this.enemy1.anchor.setTo(0.5, 0.5);
    this.enemy1.animations.add('walk', [7, 6, 5, 6], 8, true);
    this.enemy1.animations.play('walk');
    this.enemy1.scale.setTo(1, 1);
    this.enemy1Text = game.add.text(200, 350, 'Ces ennemis ne peuvent pas être tués', {font: fonts, fill: textColor});
    this.enemy1Text.anchor.setTo(0, 0.5);

    this.enemy2 = game.add.sprite(150, 425, 'enemy2');
    this.enemy2.anchor.setTo(0.5, 0.5);
    this.enemy2.animations.add('walk', [7, 6, 5, 6], 8, true);
    this.enemy2.animations.play('walk');
    this.enemy2.scale.setTo(1, 1);
    this.enemy2Text = game.add.text(200, 425, 'Ces ennemis peuvent être écrasés en sautant dessus', {font: fonts, fill: textColor});
    this.enemy2Text.anchor.setTo(0, 0.5);
  },

  update: function () {
    if (this.returnButton.input.pointerOver()) {
      this.returnButton.alpha = 1;
    } else {
      this.returnButton.alpha = 0.5;
    }
  },

  menu: function () {
    if (!this.muteButton.input.pointerOver() && this.returnButton.input.pointerOver()) {
      game.state.start('menu');
    } else {
      return;
    }
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  }
};

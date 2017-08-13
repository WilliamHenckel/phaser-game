var helpState = {
  create: function () {
    game.stage.backgroundColor = '#313131';

    this.title = game.add.text(1100, 100, 'Aide', {font: fontxl, fill: textColor});
    game.add.tween(this.title).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.title.anchor.set(0.5);

    this.returnButton = game.add.text(1100, game.world.centerY + 240, 'Retour', {font: fontxl, fill: textColor});
    game.add.tween(this.returnButton).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.returnButton.anchor.set(0.5);
    this.returnButton.alpha = 0.5;
    this.returnButton.inputEnabled = true;

    game.input.onDown.add(this.menu, this);

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }

    this.coin = game.add.sprite(850, 200, 'coin');
    game.add.tween(this.coin).to({x: 150}, 400, Phaser.Easing.Linear.Out, true);
    this.coin.anchor.setTo(0.5, 0.5);
    this.coin.animations.add('turn', [0, 1, 2, 3], 8, true);
    this.coin.animations.play('turn');
    this.coin.scale.setTo(1, 1);
    this.coinText = game.add.text(900, 200, 'Les pièces permettent de passer au niveau suivant', {font: fonts, fill: textColor});
    game.add.tween(this.coinText).to({x: 200}, 400, Phaser.Easing.Linear.Out, true);
    this.coinText.anchor.setTo(0, 0.5);

    this.potion = game.add.sprite(850, 275, 'potion');
    game.add.tween(this.potion).to({x: 150}, 400, Phaser.Easing.Linear.Out, true);
    this.potion.anchor.setTo(0.5, 0.5);
    this.potion.scale.setTo(1, 1);
    this.potionText = game.add.text(900, 275, 'Les potions vous font récupérer des points de vie', {font: fonts, fill: textColor});
    game.add.tween(this.potionText).to({x: 200}, 400, Phaser.Easing.Linear.Out, true);
    this.potionText.anchor.setTo(0, 0.5);

    this.enemy1 = game.add.sprite(850, 350, 'enemy');
    game.add.tween(this.enemy1).to({x: 150}, 400, Phaser.Easing.Linear.Out, true);
    this.enemy1.anchor.setTo(0.5, 0.5);
    this.enemy1.animations.add('walk', [7, 6, 5, 6], 8, true);
    this.enemy1.animations.play('walk');
    this.enemy1.scale.setTo(1, 1);
    this.enemy1Text = game.add.text(900, 350, 'Ces ennemis ne peuvent pas être tués', {font: fonts, fill: textColor});
    game.add.tween(this.enemy1Text).to({x: 200}, 400, Phaser.Easing.Linear.Out, true);
    this.enemy1Text.anchor.setTo(0, 0.5);

    this.enemy2 = game.add.sprite(850, 425, 'enemy2');
    game.add.tween(this.enemy2).to({x: 150}, 400, Phaser.Easing.Linear.Out, true);
    this.enemy2.anchor.setTo(0.5, 0.5);
    this.enemy2.animations.add('walk', [7, 6, 5, 6], 8, true);
    this.enemy2.animations.play('walk');
    this.enemy2.scale.setTo(1, 1);
    this.enemy2Text = game.add.text(900, 425, 'Ces ennemis peuvent être écrasés en sautant dessus', {font: fonts, fill: textColor});
    game.add.tween(this.enemy2Text).to({x: 200}, 400, Phaser.Easing.Linear.Out, true);
    this.enemy2Text.anchor.setTo(0, 0.5);
  },

  update: function () {
    if (this.returnButton.input.pointerOver()) {
      this.returnButton.alpha = 1;
    } else {
      this.returnButton.alpha = 0.5;
    }
  },

  transitionAnimation: function (pState) {
    game.add.tween(this.title).to({x: this.title.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.returnButton).to({x: this.returnButton.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.coin).to({x: this.coin.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.coinText).to({x: this.coin.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.potion).to({x: this.potion.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.potionText).to({x: this.coin.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.enemy1).to({x: this.enemy1.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.enemy1Text).to({x: this.enemy1Text.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.enemy2).to({x: this.enemy2.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.enemy2Text).to({x: this.enemy2Text.x - 800}, 400, Phaser.Easing.Linear.Out, true);

    game.time.events.add(500, this.stateMenu, this);
  },

  menu: function () {
    if (!this.muteButton.input.pointerOver() && this.returnButton.input.pointerOver()) {
      this.transitionAnimation();
    } else {
      return;
    }
  },

  stateMenu: function () {
    game.state.start('menu');
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  }
};

var characterState = {
  create: function () {
    game.choice = game.add.text(game.world.centerX, 100, 'Choix du personnage', {font: fontxl, fill: textColor});
    game.choice.anchor.set(0.5);

    game.achille = game.add.sprite(game.world.centerX-75, game.world.centerY, 'achilleimg');
    game.achille.anchor.set(0.5);
    game.achille.alpha = 0.5;
    game.achille.inputEnabled = true;

    game.ernest = game.add.sprite(game.world.centerX+75, game.world.centerY, 'ernestimg');
    game.ernest.anchor.set(0.5);
    game.ernest.alpha = 0.5;
    game.ernest.inputEnabled = true;

    game.input.onDown.add(this.characterChoice, this);
  },

  update: function () {
    if (game.achille.input.pointerOver()) {
        game.achille.alpha = 1;
    } else if (game.ernest.input.pointerOver()) {
        game.ernest.alpha = 1;
    }
    else {
        game.achille.alpha = 0.5;
        game.ernest.alpha = 0.5;
    }
  },

  characterChoice: function () {
    if (game.achille.input.pointerOver()) {
      game.character = 'achille';
    } else if (game.ernest.input.pointerOver()) {
      game.character = 'ernest';
    }

    game.state.start('play', true, false, 1);
  }
};

/* global game, fontxl, fontl, textColor */
var levelState = {
  init: function (map) {
    game.conf.mapName = map;

    switch (game.conf.difficulty) {
      case 'easy':
        game.conf.difficultyData = JSON.parse(this.game.cache.getText('easy'));
        break;

      case 'hard':
        game.conf.difficultyData = JSON.parse(this.game.cache.getText('hard'));
        break;

      default:
        game.conf.difficultyData = JSON.parse(this.game.cache.getText('casual'));
    }
  },

  create: function () {
    game.stage.backgroundColor = '#000000';
    game.time.events.add(400, this.displayText, this);
    game.time.events.add(1600, this.eraseText, this);
    game.time.events.add(2400, this.statePlay, this);
  },

  update: function () {
  },

  displayText: function () {
    this.level = game.add.text(400, game.world.centerY - 75, 'World 1 - ' + game.conf.mapName, {font: fontxl, fill: textColor});
    this.level.anchor.set(0.5);
    this.level.alpha = 0;
    game.add.tween(this.level).to({ alpha: 1 }, 400, 'Linear', true);

    switch (game.conf.mapName) {
      case 1:
      case 2:
        this.tutoLabel = game.add.text(400, game.world.centerY + 75, 'Goal : ' + game.conf.difficultyData.score + ' points', {font: fontl, fill: textColor});
        break;

      case 3:
        this.tutoLabel = game.add.text(400, game.world.centerY + 75, 'Goal : Defeat the Boss', {font: fontl, fill: textColor});
        break;

      case 4:
        this.tutoLabel = game.add.text(400, game.world.centerY + 75, 'Goal : Collect all coins', {font: fontl, fill: textColor});
        break;
    }

    this.tutoLabel.anchor.set(0.5);
    this.tutoLabel.alpha = 0;
    game.add.tween(this.tutoLabel).to({ alpha: 1 }, 400, 'Linear', true);
  },

  eraseText: function () {
    game.add.tween(this.level).to({ alpha: 0 }, 400, 'Linear', true);
    game.add.tween(this.tutoLabel).to({ alpha: 0 }, 400, 'Linear', true);
  },

  statePlay: function () {
    game.state.start('play', true, false, game.conf.mapName);
  }
};

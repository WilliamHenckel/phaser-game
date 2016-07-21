var loadState = {

  preload: function() {
    var loadingLabel = game.add.text(game.world.centerX, 150, 'Chargement...',{font: fontl, fill: textColor});
    loadingLabel.anchor.setTo(0.5, 0.5);

    var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);

    game.load.spritesheet('slime','assets/slime.png', 58, 32, 4);

    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('coin', 'assets/coin.png');
    game.load.image('potion', 'assets/red-potion.png');
    game.load.image('pixel', 'assets/pixel.png');
    game.load.image('tileset', 'assets/tileset.png');
    game.load.image('bouton1', 'assets/bouton1.png');
    game.load.image('bouton2', 'assets/bouton2.png');
    game.load.image('bouton3', 'assets/bouton3.png');
    game.load.image('explosion', 'assets/explosion.png');
    game.load.image('blob', 'assets/blob.png');
    game.load.image('arrows', 'assets/arrowKeys.png');

    game.load.tilemap('map', 'assets/map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map2', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map3', 'assets/map3.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.audio('jump',['assets/jump.ogg','assets/jump.mp3']);
    game.load.audio('coin',['assets/coin.ogg','assets/coin.mp3']);
    game.load.audio('dead',['assets/dead.ogg','assets/dead.mp3']);
    game.load.audio('elephant',['assets/elephant.mp3']);
    game.load.audio('potion',['assets/powerup.ogg','assets/powerup.mp3']);

    game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
  },

  create: function() {
    game.state.start('menu');
  }
};

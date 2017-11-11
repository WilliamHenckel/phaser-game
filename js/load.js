/* global Phaser, game */
var loadState = {
  preload: function () {
    let progressBar = game.add.sprite(game.world.centerX, game.world.centerY, 'progressBar');
    progressBar.anchor.setTo(0.5, 0.5);
    game.load.setPreloadSprite(progressBar);

    game.load.spritesheet('achille', 'assets/achille.png', 40, 36, 12);
    game.load.spritesheet('ernest', 'assets/ernest.png', 40, 36, 12);
    game.load.spritesheet('coin', 'assets/coin.png', 32, 32, 4);
    game.load.spritesheet('mute', 'assets/muteButton.png', 28, 22);
    game.load.spritesheet('enemy', 'assets/enemy.png', 32, 32, 8);
    game.load.spritesheet('enemy2', 'assets/enemy2.png', 40, 26, 8);
    game.load.spritesheet('boss', 'assets/boss.png', 56, 74, 5);
    game.load.spritesheet('health', 'assets/coeur.png', 156, 24, 6);
    game.load.spritesheet('healthBoss', 'assets/health-boss.png', 80, 16, 6);

    game.load.image('background', 'assets/background.jpg');
    game.load.image('backgroundscroll', 'assets/backgroundscroll.png');
    game.load.image('potion', 'assets/red-potion.png');
    game.load.image('pixel', 'assets/particule.png');
    game.load.image('tileset', 'assets/tileset.png');
    game.load.image('minion', 'assets/minion.png');
    game.load.image('minion2', 'assets/minion2.png');
    game.load.image('explosion', 'assets/explosion.png');
    game.load.image('achilleimg', 'assets/achilleimg.png');
    game.load.image('ernestimg', 'assets/ernestimg.png');
    game.load.image('arrows', 'assets/arrowKeys.png');
    game.load.image('wallH', 'assets/plateforme.png');
    game.load.image('missile', 'assets/missile.png');
    game.load.image('trophy', 'assets/trophy.png');

    game.load.tilemap('1', 'assets/map1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('2', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('3', 'assets/map3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('4', 'assets/map4.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.audio('jump', ['assets/jump.ogg', 'assets/jump.mp3']);
    game.load.audio('coin', ['assets/coin.ogg', 'assets/coin.mp3']);
    game.load.audio('hurtSound', ['assets/hurt.ogg', 'assets/hurt.mp3']);
    game.load.audio('dead', ['assets/dead.ogg', 'assets/dead.mp3']);
    game.load.audio('castelvania', ['assets/castelvania.mp3', 'assets/castelvania.ogg']);
    game.load.audio('potion', ['assets/powerup.ogg', 'assets/powerup.mp3']);
    game.load.audio('boom', ['assets/laser.ogg', 'assets/laser.mp3']);
    game.load.audio('bossDieSound', ['assets/bossDie.ogg', 'assets/bossDie.mp3']);
    game.load.audio('bossHurtSound', ['assets/bossHurt.ogg', 'assets/bossHurt.mp3']);
    game.load.audio('enemyDieSound', ['assets/enemyDie.ogg', 'assets/enemyDie.mp3']);
    game.load.audio('explosion', ['assets/explosion.ogg', 'assets/explosion.mp3']);
    game.load.audio('fall', ['assets/fall.ogg', 'assets/fall.mp3']);
    game.load.audio('trophy', ['assets/trophy.ogg', 'assets/trophy.mp3']);

    game.load.text('level1', 'assets/data/level1.json');
    game.load.text('level2', 'assets/data/level2.json');
    game.load.text('level3', 'assets/data/level3.json');
    game.load.text('level4', 'assets/data/level4.json');
    game.load.text('easy', 'assets/data/easy.json');
    game.load.text('casual', 'assets/data/casual.json');
    game.load.text('hard', 'assets/data/hard.json');
    game.load.text('trophy', 'assets/data/trophy.json');
  },

  create: function () {
    game.conf.enemyKillCounter = 0;
    game.conf.easyEnding = false;
    game.conf.casualEnding = false;
    game.conf.hardEnding = false;
    game.state.start('menu');
  }
};

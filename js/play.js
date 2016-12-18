var playState = {
  init: function (map, playerX, playerY) {
    switch (map) {
      case 2:
        this.levelData = JSON.parse(this.game.cache.getText('level2'));
        break;

      case 3:
        this.levelData = JSON.parse(this.game.cache.getText('level3'));
        break;

      default:
        this.levelData = JSON.parse(this.game.cache.getText('level1'));
    }

    this.conf = {};
    this.conf.mapName = map;
    this.conf.playerX = this.levelData.playerStart.x;
    this.conf.playerY = this.levelData.playerStart.y;
    this.conf.coinX = this.levelData.coinStart.x;
    this.conf.coinY = this.levelData.coinStart.y;
    this.conf.coinPosition = this.levelData.coinPosition;
    this.conf.potionX = this.levelData.potionStart.x;
    this.conf.potionY = this.levelData.potionStart.y;
    this.conf.potionPosition = this.levelData.potionPosition;
    this.conf.bossX = this.levelData.bossStart.x;
    this.conf.bossY = this.levelData.bossStart.y;
    this.conf.bossHealthX = this.levelData.bossHealth.x;
    this.conf.bossHealthY = this.levelData.bossHealth.y;
  },

  create: function () {
    // Fond
    game.stage.backgroundColor = game.add.tileSprite(0, 0, 800, 640, 'background');

    // Commandes
    this.cursor = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

    // Murs
    this.createWorld();

    // Joueur
    this.player = game.add.sprite(this.conf.playerX, this.conf.playerY, 'slime');
    this.player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;
    this.player.animations.add('right', [1, 2, 3, 2], 8, true);
    this.player.animations.add('left', [5, 6, 7, 6], 8, true);
    this.player.animations.add('jump-right', [8], 8, true);
    this.player.animations.add('down-right', [9], 8, true);
    this.player.animations.add('jump-left', [10], 8, true);
    this.player.animations.add('down-left', [11], 8, true);
    game.life_points = 3;
    game.direction = 'right';
    this.player.body.checkCollision.up = false;
    this.player.body.setSize(30, 36, 5, 0);
    /* game.wallJump = false; */

    // Points de vie
    this.health = game.add.sprite(game.world.width - 200, 5, 'health');
    this.health.animations.add('5', [0], 1, true);
    this.health.animations.add('4', [1], 1, true);
    this.health.animations.add('3', [2], 1, true);
    this.health.animations.add('2', [3], 1, true);
    this.health.animations.add('1', [4], 1, true);
    this.health.animations.add('0', [5], 1, true);
    this.health.animations.play(game.life_points);

    // Boss
    this.boss = game.add.sprite(this.conf.bossX, this.conf.bossY, 'boss');
    game.physics.arcade.enable(this.boss);
    this.boss.anchor.setTo(0.5, 0.5);
    this.boss.animations.add('walk', [0, 1], 8, true);
    this.boss.animations.play('walk');
    this.boss.animations.add('hurt', [2, 3, 4, 3, 2], 10, true);
    this.boss.body.gravity.y = 1000;
    this.boss.body.velocity.x = -100;
    this.boss.body.bounce.x = 1;
    this.boss.direction = 'left';
    this.boss.body.setSize(56, 56, 0, 18);
    game.boss_life_points = 5;

    this.healthBoss = game.add.sprite(this.conf.bossHealthX, this.conf.bossHealthY, 'healthBoss');
    this.healthBoss.anchor.setTo(0.5, 0.5);
    this.healthBoss.animations.add('5', [0], 1, true);
    this.healthBoss.animations.add('4', [1], 1, true);
    this.healthBoss.animations.add('3', [2], 1, true);
    this.healthBoss.animations.add('2', [3], 1, true);
    this.healthBoss.animations.add('1', [4], 1, true);
    this.healthBoss.animations.add('0', [5], 1, true);
    this.healthBoss.animations.play(game.boss_life_points);

    game.timer_missile = game.time.events.loop(Phaser.Timer.SECOND * 1.5, this.fireMissile, this);

    // Missiles
    this.missiles = game.add.group();
    this.missiles.enableBody = true;
    this.missiles.createMultiple(10, 'missile');
    this.missiles.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetMissile);
    this.missiles.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    this.missiles.setAll('checkWorldBounds', true);

    // Pièce
    this.coin = game.add.sprite(this.conf.coinX, this.conf.coinY, 'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(0.5, 0.5);
    this.coin.animations.add('turn', [0, 1, 2, 3], 8, true);
    this.coin.animations.play('turn');
    this.coin.scale.setTo(1, 1);

    // Potion
    if (game.life_points <= 3) {
      this.potion = game.add.sprite(this.conf.potionX, this.conf.potionY, 'potion');
    }
    game.physics.arcade.enable(this.potion);
    this.potion.anchor.setTo(0.5, 0.5);

    // Score
    this.scoreLabel = game.add.text(15, 5, 'Score : 0', {font: fontm, fill: textColor});
    game.global.score = 0;

    // Points de vie boss
    if (this.conf.mapName === 3) {
      game.boss_life_pointsLabel = game.add.text(400, 170, 'Boss', {font: fontxl, fill: textColor});
      game.boss_life_pointsLabel.anchor.setTo(0.5, 0.5);
    }

    // Ennemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.createMultiple(13, 'enemy');
    this.nextEnemy = 0;

    this.enemies.callAll('animations.add', 'animations', 'walk', [0, 1, 2, 1], 6, true);
    this.enemies.callAll('play', null, 'walk');

    // Sons
    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.deadSound = game.add.audio('dead');
    this.potionSound = game.add.audio('potion');

    // Particules
    this.emitter = game.add.emitter(0, 0, 15);
    this.emitter.makeParticles('pixel');
    this.emitter.setYSpeed(-200, 200);
    this.emitter.setXSpeed(-200, 200);
    this.emitter.gravity = 0;
    this.emitter.minParticleScale = 0.5;
    this.emitter.minRotation = 50;

    // Damage
    this.executed = false;

    if (this.conf.mapName < 3) {
      this.tutoLabel = game.add.text(game.world.centerX, game.world.centerY - 150, 'Objectif : 100 points', {font: fontm, fill: textColor});
      this.tutoLabel.anchor.setTo(0.5, 0.5);
      game.time.events.add(2000, this.eraseTuto, this);
    }
  },

  eraseTuto: function () {
    game.add.tween(this.tutoLabel).to({ alpha: 0 }, 1000, 'Linear', true);
  },

  update: function () {
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);
    game.physics.arcade.collide(this.boss, this.layer);

    /* console.log('x : ' + this.player.body.x);
    console.log('y : ' + this.player.body.y); */

    // game.physics.arcade.collide(this.enemies, this.movingWall);
    // game.physics.arcade.collide(this.movingWall, this.layer);
    // game.physics.arcade.collide(this.player, this.movingWall);

    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.potion, this.takePotion, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerHurt, null, this);
    game.physics.arcade.overlap(this.player, this.missiles, this.playerHurt, null, this);
    game.physics.arcade.overlap(this.player, this.boss, this.bossOrPlayerHurt, null, this);

    this.movePlayer();
    this.moveBoss();

    if (!this.player.inWorld && game.global.score < 100) {
      this.playerDie();
    }

    if (this.nextEnemy < game.time.now) {
      var start = 4000;
      var end = 1000;
      var score = 100;
      var delay = Math.max(start - (start - end) * game.global.score / score, end);

      if (this.conf.mapName < 3) {
        this.addEnemy();
        this.nextEnemy = game.time.now + delay;
      }
    }

    /* if (this.movingWall.x >= game.world.centerX + 50) {
      this.movingWall.body.velocity.x = -50;
    } else if (this.movingWall.x <= game.world.centerX - 50) {
      this.movingWall.body.velocity.x = 50;
    } */
  },

  moveBoss: function () {
    if (this.boss.body.velocity.x > 0 && this.boss.direction === 'left') {
      this.boss.scale.x = -1;
      this.boss.direction = 'right';
    } else if (this.boss.body.velocity.x < 0 && this.boss.direction === 'right') {
      this.boss.scale.x = 1;
      this.boss.direction = 'left';
    }
  },

  movePlayer: function () {
    if (this.cursor.left.isDown /* && game.wallJump == false */) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
      game.direction = 'left';
    } else if (this.cursor.right.isDown /* && game.wallJump == false */) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
      game.direction = 'right';
    } /* else if (this.cursor.left.isDown && game.wallJump == true) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } else if (this.cursor.right.isDown && game.wallJump == true) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    } */ else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();
      if (game.direction === 'left') {
        this.player.frame = 4;
      } else {
        this.player.frame = 0;
      }
    }

    // Reset walljump
    /* if (this.player.body.onFloor()) {
      game.wallJump = false;
    } */

    // Jump simple
    if (this.cursor.up.isDown && this.player.body.onFloor() && this.player.alive) {
      this.player.body.velocity.y = -470;
      /* if (this.cursor.left.isDown) {
        game.add.tween(this.player).to({angle:-360}, 500, Phaser.Easing.Linear.None, true);
      } else if (this.cursor.right.isDown) {
        game.add.tween(this.player).to({angle:360}, 500, Phaser.Easing.Linear.None, true);
      } */

      this.jumpSound.play();
    }

    if ((this.cursor.up.isDown && game.direction === 'right') || (!this.player.body.onFloor() && game.direction === 'right')) {
      this.player.animations.play('jump-right');
      if (this.player.body.velocity.y >= 0 && this.player.scale.y === 1) {
        this.player.animations.play('down-right');
      }
    }

    if ((this.cursor.up.isDown && game.direction === 'left') || (!this.player.body.onFloor() && game.direction === 'left')) {
      this.player.animations.play('jump-left');
      if (this.player.body.velocity.y >= 0 && this.player.scale.y === 1) {
        this.player.animations.play('down-left');
      }
    }

    // Wall jump
    /* if (!this.player.body.onFloor() && this.player.body.onWall() && this.cursor.up.isDown && this.cursor.left.isDown || !this.player.body.onFloor() && this.player.body.onWall() && this.cursor.up.isDown && this.cursor.right.isDown) {
      game.wallJump = true;
      this.player.body.velocity.y = -200;
    } */
  },

  createWorld: function () {
    this.map = game.add.tilemap(this.conf.mapName);

    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollisionBetween(1, 14);

    // moving wall
    /* this.movingWall = game.add.sprite(game.world.centerX, 180, 'wallH');
    this.movingWall.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(this.movingWall);
    this.movingWall.enableBody = true;
    this.movingWall.body.immovable = true;
    this.movingWall.body.velocity.x = 50; */
  },

  nextLevelText: function () {
    var finishLabel;
    if (this.conf.mapName <= 2) {
      finishLabel = game.add.text(game.world.centerX, game.world.centerY, 'Niveau terminé', {font: fontl, fill: textColor});
      finishLabel.anchor.setTo(0.5, 0.5);
      game.time.events.add(2000, this.nextLevelState, this);
    } else {
      finishLabel = game.add.text(game.world.centerX, game.world.centerY, 'Jeu terminé ! Bravo !', {font: fontl, fill: textColor});
      finishLabel.anchor.setTo(0.5, 0.5);
      game.time.events.add(2000, this.startMenu, this);
    }
  },

  nextLevelState: function () {
    game.state.start('play', true, false, this.conf.mapName + 1);
  },

  // Mise a jour des points de vie du personnage
  playerHurt: function () {
    if (!this.executed && game.life_points >= 1 && game.global.score < 100) {
      this.executed = true;
      game.life_points -= 1;
      this.health.animations.play(game.life_points);
      this.player.alpha = 0.5;
      this.player.tint = 0xffffff;
      game.tint = game.time.events.loop(100, this.changeTint, this);
      game.time.events.add(1000, this.resetTint, this);
      game.time.events.add(1000, this.reset_executed, this);

      if (game.life_points >= 4) {
        game.time.events.add(10000, this.updatePotionPosition, this);
      }
    } else if (game.life_points === 0) {
      this.playerDie();
    }
  },

  changeTint: function () {
    /* if (this.player.tint == 0xff0000) {
      this.player.tint = 0xffffff;
    } else {
      this.player.tint = 0xff0000;
    } */
    this.player.tint = (this.player.tint === 0xff0000) ? 0xffffff : 0xff0000;
  },

  resetTint: function () {
    game.time.events.remove(game.tint);
    this.player.tint = 0xffffff;
  },

  reset_executed: function () {
    this.executed = false;
    this.player.alpha = 1;
    this.player.tint = 0xffffff;
    this.boss.body.enable = true;
    this.boss.animations.play('walk');
  },

  bossHurt: function () {
    if (!this.executed && game.boss_life_points >= 0) {
      game.boss_life_points -= 1;
      game.time.events.add(1000, this.reset_executed, this);
      this.player.body.velocity.y = -200;
      this.boss.body.enable = false;
      this.emitter.x = this.boss.x;
      this.emitter.y = this.boss.y;
      this.emitter.start(true, 300, null, 6);
      this.boss.animations.play('hurt');
      this.healthBoss.animations.play(game.boss_life_points);

      if (game.boss_life_points >= 1) {
        game.time.events.add(Phaser.Timer.SECOND / 4, this.fireMissileUp, this);
      }

      if (game.boss_life_points === 0) {
        this.bossDie();
      }
    }
  },

  bossOrPlayerHurt: function () {
    if (this.player.body.velocity.y <= 0) {
      this.playerHurt();
    } else if (this.player.body.velocity.y > 0) {
      this.bossHurt();
    }
  },

  playerDie: function () {
    if (!this.player.alive) {
      return;
    }

    this.player.kill();

    this.deadSound.play();

    var deathLabel = game.add.text(game.world.centerX, game.world.centerY, 'T\'es nul...', {font: fontl, fill: textColor});
    deathLabel.anchor.setTo(0.5, 0.5);

    game.stage.backgroundColor = '#313131';

    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    this.emitter.start(true, 600, null, 6);

    game.time.events.add(1000, this.restartLevel, this);
  },

  bossDie: function () {
    this.boss.kill();
    game.boss_life_pointsLabel.kill();
    this.healthBoss.kill();
    game.time.events.remove(game.timer_missile);

    var deathLabel = game.add.text(this.conf.bossHealthX, this.conf.bossHealthY, 'T\'as fini le jeu, retourne bosser !', {font: fontl, fill: textColor});
    deathLabel.anchor.setTo(0.5, 0.5);

    game.time.events.add(3000, this.startMenu, this);
  },

  takeCoin: function () {
    /* this.emitter.x = this.coin.x;
    this.emitter.y = this.coin.y;
    this.emitter.start(true, 600, null, 15); */

    if (game.global.score < 90) {
      this.updateCoinPosition();
    } else {
      this.coin.kill();
      this.potion.kill();
    }

    game.global.score += 10;
    this.scoreLabel.text = 'Score : ' + game.global.score;

    this.coinSound.play();

    this.coin.scale.setTo(0, 0);
    game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

    game.add.tween(this.player.scale).to({x: 1.2, y: 0.8}, 50).to({x: 1, y: 1}, 150).start();

    if (game.global.score === 100) {
      this.nextLevelText();
    }
  },

  takePotion: function () {
    game.add.tween(this.player.scale).to({x: 0.8, y: 1.2}, 50).to({x: 1, y: 1}, 150).start();
    this.updatePotionPosition();
    game.life_points += 1;
    this.health.animations.play(game.life_points);

    this.potionSound.play();

    var newPotionPosition = {x: -100, y: -100};

    this.potion.reset(newPotionPosition.x, newPotionPosition.y);

    if (game.life_points <= 4) {
      game.time.events.add(10000, this.updatePotionPosition, this);
    }
  },

  updateCoinPosition: function () {
    var coinPositionJson = this.conf.coinPosition;
    var coinPosition = coinPositionJson.slice(0);

    for (var i = 0; i < coinPosition.length; i++) {
      if (coinPosition[i].x === this.coin.x && coinPosition[i].y === this.coin.y) {
        coinPosition.splice(i, 1);
        coinPosition.splice(0, coinPosition[i]);
      }
    }

    var newCoinPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];

    this.coin.reset(newCoinPosition.x, newCoinPosition.y);
  },

  updatePotionPosition: function () {
    var potionPositionJson = this.conf.potionPosition;
    var potionPosition = potionPositionJson.slice(0);

    for (var j = 0; j < potionPosition.length; j++) {
      if (potionPosition[j].x === this.potion.x) {
        potionPosition.splice(j, 1);
      }
    }

    var newPotionPosition = potionPosition[game.rnd.integerInRange(0, potionPosition.length - 1)];

    this.potion.reset(newPotionPosition.x, newPotionPosition.y);
  },

  addEnemy: function () {
    var enemy = this.enemies.getFirstDead();

    if (!enemy) {
      return;
    }

    enemy.anchor.setTo(0.5, 1);
    enemy.reset(game.world.centerX, 0);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = 100 * game.rnd.integerInRange(-1, 1);
    if (enemy.body.velocity.x === 0) { enemy.body.velocity.x = -100; }
    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  },

  fireMissile: function () {
    var missile = this.missiles.getFirstDead();

    if (missile && this.boss.x > this.player.x) {
      missile.reset(this.boss.x - 30, this.boss.y + 20);
      missile.body.velocity.x = -500;
      missile.scale.x = 1;
      missile.angle = 0;
    } else if (missile && this.boss.x <= this.player.x) {
      missile.scale.x = -1;
      missile.angle = 0;
      missile.reset(this.boss.x + 30, this.boss.y + 20);
      missile.body.velocity.x = 500;
    }
  },

  fireMissileUp: function () {
    var missile = this.missiles.getFirstDead();

    missile.reset(this.boss.x, this.boss.y);
    missile.body.velocity.y = -500;

    if (missile.scale.x === 1) {
      missile.angle = 90;
    } else {
      missile.angle = -90;
    }
  },

  resetMissile: function (missile) {
    missile.kill();
  },

  startMenu: function () {
    game.state.start('menu');
  },

  restartLevel: function () {
    game.state.start('play', true, false, 1);
  }
};

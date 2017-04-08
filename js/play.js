var playState = {
  init: function (map) {
    switch (map) {
      case 2:
        this.levelData = JSON.parse(this.game.cache.getText('level2'));
        break;

      case 3:
        this.levelData = JSON.parse(this.game.cache.getText('level3'));
        break;

      case 4:
        this.levelData = JSON.parse(this.game.cache.getText('level4'));
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

    if (this.conf.mapName === 1) {
      this.conf.movingWallX = this.levelData.movingwallStart.x;
      this.conf.movingWallY = this.levelData.movingwallStart.y;
    }

    if (this.conf.mapName === 3) {
      this.conf.bossX = this.levelData.bossStart.x;
      this.conf.bossY = this.levelData.bossStart.y;
      this.conf.bossHealthX = this.levelData.bossHealth.x;
      this.conf.bossHealthY = this.levelData.bossHealth.y;
    }
  },

  create: function () {
    // Fond
    if (this.conf.mapName <= 3) {
      game.stage.backgroundColor = game.add.tileSprite(0, 0, 800, 640, 'background');
    } else if (this.conf.mapName === 4) {
      game.stage.backgroundColor = game.add.tileSprite(0, 0, 3840, 640, 'backgroundscroll');
    }

    // Commandes
    this.cursor = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
    this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.zsqd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.Z),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.Q),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    // Décor
    this.createWorld();

    // Joueur
    if (game.character === 'achille') {
      this.player = game.add.sprite(this.conf.playerX, this.conf.playerY, 'achille');
    } else if (game.character === 'ernest') {
      this.player = game.add.sprite(this.conf.playerX, this.conf.playerY, 'ernest');
    }

    game.camera.follow(this.player);

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

    // Points de vie
    this.health = game.add.sprite(625, 20, 'health');
    this.health.fixedToCamera = true;
    this.health.animations.add('5', [0], 1, true);
    this.health.animations.add('4', [1], 1, true);
    this.health.animations.add('3', [2], 1, true);
    this.health.animations.add('2', [3], 1, true);
    this.health.animations.add('1', [4], 1, true);
    this.health.animations.add('0', [5], 1, true);
    this.health.animations.play(game.life_points);

    // Boss
    if (this.conf.mapName === 3) {
      this.boss = game.add.sprite(this.conf.bossX, this.conf.bossY, 'boss');
      game.physics.arcade.enable(this.boss);
      this.boss.anchor.setTo(0.5, 0.5);
      this.boss.animations.add('walk', [0, 1], 8, true);
      this.boss.animations.play('walk');
      this.boss.animations.add('hurtAnim', [2, 3, 4, 3, 2], 10, true);
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
    }

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
    game.coinCount = 0;

    // Potion
    if (game.life_points <= 3) {
      this.potion = game.add.sprite(this.conf.potionX, this.conf.potionY, 'potion');
    }
    game.physics.arcade.enable(this.potion);
    this.potion.anchor.setTo(0.5, 0.5);

    // Score
    this.scoreLabel = game.add.text(65, 17, 'Score : 0', {font: fontm, fill: textColor});
    this.scoreLabel.fixedToCamera = true;
    game.global.score = 0;

    // Points de vie boss
    if (this.conf.mapName === 3) {
      game.boss_life_pointsLabel = game.add.text(400, 170, 'Boss', {font: fontxl, fill: textColor});
      game.boss_life_pointsLabel.anchor.setTo(0.5, 0.5);
    }

    // Ennemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;

    for (var k = 0; k < 12; k++) {
      var tirage = game.rnd.integerInRange(0, 3);

      switch (tirage) {
        case 0:
        case 1:
          this.enemies.createMultiple(1, 'enemy');
          break;
        case 2:
        case 3:
          this.enemies.createMultiple(1, 'enemy2');
          break;
      }
    }
    this.nextEnemy = 0;

    this.enemies.callAll('animations.add', 'animations', 'walk-left', [0, 1, 2, 1], 10);
    this.enemies.callAll('animations.add', 'animations', 'walk-right', [7, 6, 5, 6], 10);

    this.enemies.callAll('animations.add', 'animations', 'fall-left', [3], 10);
    this.enemies.callAll('animations.add', 'animations', 'fall-right', [4], 10);

    // Sons
    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.hurtSound = game.add.audio('hurtSound');
    this.deadSound = game.add.audio('dead');
    this.potionSound = game.add.audio('potion');
    this.missileSound = game.add.audio('boom');
    this.missileSound.volume = 0.3;
    this.bossDieSound = game.add.audio('bossDieSound');
    this.bossDieSound.volume = 0.5;
    this.bossHurtSound = game.add.audio('bossHurtSound');
    this.enemyDieSound = game.add.audio('enemyDieSound');
    this.enemyDieSound.volume = 0.4;
    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;
    this.muteButton.fixedToCamera = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }

    // Particules
    this.emitter = game.add.emitter(0, 0, 15);
    this.emitter.makeParticles('pixel');
    this.emitter.setYSpeed(-200, 200);
    this.emitter.setXSpeed(-200, 200);
    this.emitter.gravity = 0;
    this.emitter.minParticleScale = 0.5;
    this.emitter.minRotation = 50;

    // Décor premier plan
    this.createWorldForeground();

    // Damage
    this.executed = false;
    this.hurtAgain = true;

    if (this.conf.mapName === 1) {
      this.tutoLabel = game.add.text(game.world.centerX, game.world.centerY - 150, 'Objectif : 100 points', {font: fontm, fill: textColor});
      this.tutoLabel.anchor.setTo(0.5, 0.5);
      game.time.events.add(2000, this.eraseTuto, this);
    }
  },

  update: function () {
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);
    game.physics.arcade.collide(this.boss, this.layer);
    game.physics.arcade.collide(this.player, this.movingWall);

    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.potion, this.takePotion, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.enemyOrPlayerHurt, null, this);
    game.physics.arcade.overlap(this.player, this.missiles, this.playerHurt, null, this);
    game.physics.arcade.overlap(this.player, this.boss, this.bossOrPlayerHurt, null, this);

    this.movePlayer();
    this.moveBoss();

    if ((!this.player.inWorld && this.player.body.y > 0) && game.global.score < 100) {
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

    this.enemies.forEach(this.animateEnemy);

    if (this.movingWall.x >= this.conf.movingWallX + 50) {
      this.movingWall.body.velocity.x = -50;
    } else if (this.movingWall.x <= this.conf.movingWallX - 50) {
      this.movingWall.body.velocity.x = 50;
    }

    if (game.life_points === 0) {
      this.playerDie();
    }
  },

  // WORLD
  createWorld: function () {
    this.map = game.add.tilemap(this.conf.mapName);

    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollisionBetween(1, 14);

    this.movingWall = game.add.sprite(this.conf.movingWallX, this.conf.movingWallY, 'wallH');
    this.movingWall.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(this.movingWall);
    this.movingWall.enableBody = true;
    this.movingWall.body.immovable = true;
    this.movingWall.body.velocity.x = 50;
  },

  createWorldForeground: function () {
    this.layer2 = this.map.createLayer('Tile Layer 2');
    this.layer2.resizeWorld();
  },

  eraseTuto: function () {
    game.add.tween(this.tutoLabel).to({ alpha: 0 }, 1000, 'Linear', true);
  },

  // PLAYER
  movePlayer: function () {
    if (this.cursor.left.isDown || this.zsqd.left.isDown) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
      game.direction = 'left';
    } else if (this.cursor.right.isDown || this.zsqd.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
      game.direction = 'right';
    } else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();

      if (game.direction === 'left') {
        this.player.frame = 4;
      } else {
        this.player.frame = 0;
      }
    }

    if ((this.cursor.up.isDown || this.space.isDown || this.zsqd.up.isDown) && (this.player.body.velocity.y === 0 || this.player.body.onFloor()) && this.player.alive) {
      this.player.body.velocity.y = -470;
      this.jumpSound.play();
    }

    if ((this.cursor.up.isDown && game.direction === 'right') || (!this.player.body.onFloor() && game.direction === 'right' && this.player.body.velocity.y !== 0)) {
      this.player.animations.play('jump-right');
      if (this.player.body.velocity.y > 0 && this.player.scale.y === 1) {
        this.player.animations.play('down-right');
      } else if (this.player.body.velocity.y === 0 && this.player.body.velocity.x === 0) {
        this.player.frame = 0;
      }
    }

    if ((this.cursor.up.isDown && game.direction === 'left') || (!this.player.body.onFloor() && game.direction === 'left' && this.player.body.velocity.y !== 0)) {
      this.player.animations.play('jump-left');
      if (this.player.body.velocity.y > 0 && this.player.scale.y === 1) {
        this.player.animations.play('down-left');
      } else if (this.player.body.velocity.y === 0 && this.player.body.velocity.x === 0) {
        this.player.frame = 4;
      }
    }
  },

  playerHurt: function (pPlayer, pEnemy) {
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

      if (game.life_points >= 1) {
        this.hurtSound.play();
      }
    }
  },

  changeTint: function () {
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
    if (this.conf.mapName === 3) {
      this.boss.body.enable = true;
      this.boss.animations.play('walk');
    }
  },

  playerDie: function () {
    if (!this.player.alive) {
      return;
    }

    this.player.kill();

    this.deadSound.play();

    var deathLabel = game.add.text(400, game.world.centerY, 'T\'es nul...', {font: fontl, fill: textColor});
    deathLabel.fixedToCamera = true;
    deathLabel.anchor.setTo(0.5, 0.5);

    game.stage.backgroundColor = '#313131';

    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    this.emitter.start(true, 600, null, 6);

    game.time.events.add(1000, this.restartLevel, this);
  },

  // BOSS
  moveBoss: function () {
    if (this.conf.mapName === 3) {
      if (this.boss.body.velocity.x > 0 && this.boss.direction === 'left') {
        this.boss.scale.x = -1;
        this.boss.direction = 'right';
      } else if (this.boss.body.velocity.x < 0 && this.boss.direction === 'right') {
        this.boss.scale.x = 1;
        this.boss.direction = 'left';
      }
    }
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
      this.boss.animations.play('hurtAnim');
      this.healthBoss.animations.play(game.boss_life_points);

      if (game.boss_life_points >= 1) {
        game.time.events.add(Phaser.Timer.SECOND / 4, this.fireMissileUp, this);
        this.bossHurtSound.play();
      }

      if (game.boss_life_points === 0) {
        this.bossDie();
      }
    }
  },

  bossOrPlayerHurt: function (pPlayer, pEnemy) {
    if (this.player.body.velocity.y <= 0) {
      this.playerHurt(pPlayer, pEnemy);
    } else if (this.player.body.velocity.y > 0) {
      this.bossHurt();
    }
  },

  bossDie: function () {
    this.bossDieSound.play();
    this.boss.kill();
    game.boss_life_pointsLabel.kill();
    this.healthBoss.kill();
    game.time.events.remove(game.timer_missile);

    this.nextLevelText();
  },

  fireMissile: function () {
    var missile = this.missiles.getFirstDead();

    if (missile && this.boss.x > this.player.x) {
      missile.reset(this.boss.x - 30, this.boss.y + 20);
      missile.body.velocity.x = -500;
      missile.scale.x = 1;
      missile.angle = 0;
      this.missileSound.play();
    } else if (missile && this.boss.x <= this.player.x) {
      missile.scale.x = -1;
      missile.angle = 0;
      missile.reset(this.boss.x + 30, this.boss.y + 20);
      missile.body.velocity.x = 500;
      this.missileSound.play();
    }
  },

  fireMissileUp: function () {
    var missile = this.missiles.getFirstDead();

    missile.reset(this.boss.x, this.boss.y);
    missile.body.velocity.y = -500;
    this.missileSound.play();

    if (missile.scale.x === 1) {
      missile.angle = 90;
    } else {
      missile.angle = -90;
    }
  },

  resetMissile: function (missile) {
    missile.kill();
  },

  // ENEMY
  addEnemy: function () {
    var enemy = this.enemies.getFirstDead();

    if (!enemy) {
      return;
    }

    enemy.anchor.setTo(0.5, 0.5);
    enemy.reset(game.world.centerX, 0);
    enemy.body.gravity.y = 500;
    enemy.body.checkCollision.down = true;
    enemy.body.checkCollision.left = true;
    enemy.body.checkCollision.right = true;
    enemy.body.checkCollision.up = true;
    enemy.angle = 0;

    var enemyVelocity = game.rnd.integerInRange(0, 3);
    switch (enemyVelocity) {
      case 0:
      case 1:
        enemy.body.velocity.x = 110;
        break;
      case 2:
      case 3:
        enemy.body.velocity.x = -110;
        break;
      default:
        enemy.body.velocity.x = 110;
    }

    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  },

  animateEnemy: function (pEnemy) {
    if (!pEnemy.body.onFloor() && pEnemy.body.velocity.x <= 0) {
      pEnemy.animations.play('fall-left');
    } else if (!pEnemy.body.onFloor() && pEnemy.body.velocity.x >= 0) {
      pEnemy.animations.play('fall-right');
    }

    if (pEnemy.body.onFloor() && pEnemy.body.velocity.x < 0) {
      pEnemy.animations.play('walk-left');
    } else if (pEnemy.body.onFloor() && pEnemy.body.velocity.x > 0) {
      pEnemy.animations.play('walk-right');
    }
  },

  enemyOrPlayerHurt: function (pPlayer, pEnemy) {
    if (this.hurtAgain === true) {
      if (pPlayer.body.velocity.y <= 0 || pPlayer.body.y >= pEnemy.body.y) {
        this.playerHurt(pPlayer, pEnemy);
        this.hurtAgain = false;
        game.time.events.add(500, this.resetHurtAgain, this);
      } else if (pEnemy.key === 'enemy2' && pPlayer.body.velocity.y > 0) {
        pEnemy.body.checkCollision.down = false;
        pEnemy.body.checkCollision.left = false;
        pEnemy.body.checkCollision.right = false;
        pEnemy.body.checkCollision.up = false;

        if (pEnemy.body.velocity.x <= 0) {
          game.add.tween(pEnemy).to({angle: -180}, 750, Phaser.Easing.Linear.Out, true);
        } else if (pEnemy.body.velocity.x > 0) {
          game.add.tween(pEnemy).to({angle: 180}, 750, Phaser.Easing.Linear.Out, true);
        }

        this.enemyDieSound.play();
        pPlayer.body.velocity.y = -200;
        pEnemy.body.velocity.y = -100;
        this.emitter.x = pEnemy.x;
        this.emitter.y = pEnemy.y;
        this.emitter.start(true, 300, null, 6);
        this.hurtAgain = false;
        game.time.events.add(500, this.resetHurtAgain, this);
      }
    }
  },

  resetHurtAgain: function () {
    this.hurtAgain = true;
  },

  // COIN
  takeCoin: function () {
    this.pointsLabel = game.add.text(this.coin.x, this.coin.y, '10', {font: fontm, fill: textColor});
    this.pointsLabel.anchor.setTo(0.5, 0.5);
    game.time.events.add(500, this.eraseScore, this);
    game.add.tween(this.pointsLabel).to({y: this.coin.y - 50}, 500, 'Linear', true);

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

  eraseScore: function () {
    game.add.tween(this.pointsLabel).to({ alpha: 0 }, 500, 'Linear', true);
  },

  updateCoinPosition: function () {
    var coinPositionJson = this.conf.coinPosition;
    var coinPosition = coinPositionJson.slice(0);
    var newCoinPosition;

    for (var i = 0; i < coinPosition.length; i++) {
      if (this.conf.mapName < 4 && coinPosition[i].x === this.coin.x && coinPosition[i].y === this.coin.y) {
        coinPosition.splice(i, 1);
        coinPosition.splice(0, coinPosition[i]);
      }
    }

    if (this.conf.mapName < 4) {
      newCoinPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length - 1)];
    } else if (this.conf.mapName === 4 && game.coinCount < 9) {
      newCoinPosition = coinPosition[game.coinCount += 1];
    }

    this.coin.reset(newCoinPosition.x, newCoinPosition.y);
  },

  // POTION
  takePotion: function () {
    this.healthBonus = game.add.sprite(this.potion.x, this.potion.y, 'healthBonus');
    this.healthBonus.anchor.setTo(0.5, 0.5);
    game.time.events.add(500, this.eraseHealthBonus, this);
    game.add.tween(this.healthBonus).to({y: this.potion.y - 50}, 500, 'Linear', true);

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

  eraseHealthBonus: function () {
    game.add.tween(this.healthBonus).to({ alpha: 0 }, 500, 'Linear', true);
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

  // LEVELS
  startMenu: function () {
    game.state.start('menu');
  },

  nextLevelText: function () {
    var finishLabel;
    if (this.conf.mapName <= 3) {
      finishLabel = game.add.text(game.world.centerX, game.world.centerY, 'Niveau terminé', {font: fontl, fill: textColor});
      finishLabel.anchor.setTo(0.5, 0.5);
      game.time.events.add(2000, this.nextLevelState, this);
    } else if (this.conf.mapName === 4) {
      finishLabel = game.add.text(400, game.world.centerY, 'Jeu terminé ! Bravo !', {font: fontl, fill: textColor});
      finishLabel.fixedToCamera = true;
      finishLabel.anchor.setTo(0.5, 0.5);
      game.time.events.add(2000, this.startMenu, this);
    }
  },

  nextLevelState: function () {
    game.state.start('play', true, false, this.conf.mapName + 1);
  },

  restartLevel: function () {
    game.state.start('play', true, false, this.conf.mapName);
  },

  // SOUND
  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  }
};

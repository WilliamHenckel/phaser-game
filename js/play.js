/* global Phaser, game, fontxl, fontl, fontm, fonts, textColor, textColorBlack */
var playState = {
  init: function (map) {
    switch (map) {
      case 2:
        this.levelData = JSON.parse(this.game.cache.getText("level2"));
        break;

      case 3:
        this.levelData = JSON.parse(this.game.cache.getText("level3"));
        break;

      case 4:
        this.levelData = JSON.parse(this.game.cache.getText("level4"));
        break;

      default:
        this.levelData = JSON.parse(this.game.cache.getText("level1"));
    }

    if (game.conf.mapName === 4) {
      game.conf.difficultyData.score = 100;
    }
  },

  create: function () {
    // Fond
    if (game.conf.mapName <= 3) {
      game.stage.backgroundColor = game.add.tileSprite(
        0,
        0,
        800,
        640,
        "background"
      );
    } else if (game.conf.mapName === 4) {
      game.stage.backgroundColor = game.add.tileSprite(
        0,
        0,
        3840,
        640,
        "backgroundscroll"
      );
    }

    // Commandes
    this.cursor = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
    ]);
    this.space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.zsqd = {
      up: game.input.keyboard.addKey(Phaser.Keyboard.Z),
      down: game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: game.input.keyboard.addKey(Phaser.Keyboard.Q),
      right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    this.debugInput = {
      m: game.input.keyboard.addKey(Phaser.Keyboard.M),
    };

    // Décor
    this.createWorld();

    // Joueur
    this.player = game.add.sprite(
      this.levelData.playerStart.x,
      this.levelData.playerStart.y,
      game.character
    );

    game.camera.follow(this.player);

    this.player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;
    this.player.animations.add("right", [1, 2, 3, 2], 8, true);
    this.player.animations.add("left", [5, 6, 7, 6], 8, true);
    this.player.animations.add("jump-right", [8], 8, true);
    this.player.animations.add("down-right", [9], 8, true);
    this.player.animations.add("jump-left", [10], 8, true);
    this.player.animations.add("down-left", [11], 8, true);
    this.life_points = 3;
    this.direction = "right";
    this.player.body.checkCollision.up = false;
    this.player.body.setSize(30, 36, 5, 0);

    // Points de vie
    this.health = game.add.sprite(625, 20, "health");
    this.health.fixedToCamera = true;
    this.health.animations.add("5", [0], 1, true);
    this.health.animations.add("4", [1], 1, true);
    this.health.animations.add("3", [2], 1, true);
    this.health.animations.add("2", [3], 1, true);
    this.health.animations.add("1", [4], 1, true);
    this.health.animations.add("0", [5], 1, true);
    this.health.animations.play(this.life_points);

    // Boss
    if (game.conf.mapName === 3) {
      this.boss = game.add.sprite(
        this.levelData.bossStart.x,
        this.levelData.bossStart.y,
        "boss"
      );
      game.physics.arcade.enable(this.boss);
      this.boss.anchor.setTo(0.5, 0.5);
      this.boss.animations.add("walk", [0, 1], 8, true);
      this.boss.animations.play("walk");
      this.boss.animations.add("hurtAnim", [2, 3, 4, 3, 2], 10, true);
      this.boss.body.gravity.y = 1000;
      this.boss.body.velocity.x = -100;
      this.boss.body.bounce.x = 1;
      this.boss.direction = "left";
      this.boss.body.setSize(56, 56, 0, 18);
      this.boss_life_points = 5;

      this.healthBoss = game.add.sprite(
        this.levelData.bossHealth.x,
        this.levelData.bossHealth.y,
        "healthBoss"
      );
      this.healthBoss.anchor.setTo(0.5, 0.5);
      this.healthBoss.animations.add("5", [0], 1, true);
      this.healthBoss.animations.add("4", [1], 1, true);
      this.healthBoss.animations.add("3", [2], 1, true);
      this.healthBoss.animations.add("2", [3], 1, true);
      this.healthBoss.animations.add("1", [4], 1, true);
      this.healthBoss.animations.add("0", [5], 1, true);
      this.healthBoss.animations.play(this.boss_life_points);

      this.timer_missile = game.time.events.loop(
        Phaser.Timer.SECOND * 1.5,
        this.fireMissile,
        this
      );

      // Missiles
      this.missiles = game.add.group();
      this.missiles.enableBody = true;
      this.missiles.createMultiple(10, "missile");
      this.missiles.callAll(
        "events.onOutOfBounds.add",
        "events.onOutOfBounds",
        this.resetMissile
      );
      this.missiles.callAll("anchor.setTo", "anchor", 0.5, 1.0);
      this.missiles.setAll("checkWorldBounds", true);

      // Points de vie boss
      this.boss_life_pointsLabel = game.add.text(400, 170, "Boss", {
        font: fontxl,
        fill: textColor,
      });
      this.boss_life_pointsLabel.anchor.setTo(0.5, 0.5);
      this.boss_life_pointsLabel.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    }

    if (game.conf.mapName < 3) {
      // Pièce
      this.coin = game.add.sprite(
        this.levelData.coinStart.x,
        this.levelData.coinStart.y,
        "coin"
      );
      game.physics.arcade.enable(this.coin);
      this.coin.anchor.setTo(0.5, 0.5);
      this.coin.animations.add("turn", [0, 1, 2, 3], 8, true);
      this.coin.animations.play("turn");
      this.coin.scale.setTo(1, 1);
      this.coinCount = 0;

      this.coinPosition = [...this.levelData.coinPosition];
      this.potionPosition = [...this.levelData.potionPosition];

      // Potion
      if (this.life_points <= 3) {
        this.potion = game.add.sprite(
          this.levelData.potionStart.x,
          this.levelData.potionStart.y,
          "potion"
        );
      }
      game.physics.arcade.enable(this.potion);
      this.potion.anchor.setTo(0.5, 0.5);
    }

    // Score
    this.scoreLabel = game.add.text(
      65,
      17,
      "Score : 0 / " + game.conf.difficultyData.score,
      { font: fontm, fill: textColor }
    );
    this.scoreLabel.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    this.scoreLabel.fixedToCamera = true;
    this.score = 0;

    // Ennemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;

    for (let i = 0; i < 12; i++) {
      let tirage = game.rnd.integerInRange(0, 3);

      switch (tirage) {
        case 0:
        case 1:
          this.enemies.createMultiple(1, "enemy");
          break;
        case 2:
        case 3:
          this.enemies.createMultiple(1, "enemy2");
          break;
      }
    }
    this.nextEnemy = 0;

    this.enemies.callAll(
      "animations.add",
      "animations",
      "walk-left",
      [5, 0, 1, 2, 3, 4],
      8
    );
    this.enemies.callAll(
      "animations.add",
      "animations",
      "walk-right",
      [6, 11, 10, 9, 8, 7],
      8
    );

    this.enemies.callAll("animations.add", "animations", "fall-left", [12], 10);
    this.enemies.callAll(
      "animations.add",
      "animations",
      "fall-right",
      [13],
      10
    );

    // Sons
    this.jumpSound = game.add.audio("jump");
    this.coinSound = game.add.audio("coin");
    this.hurtSound = game.add.audio("hurtSound");
    this.deadSound = game.add.audio("dead");
    this.potionSound = game.add.audio("potion");
    this.missileSound = game.add.audio("boom");
    this.missileSound.volume = 0.3;
    this.bossDieSound = game.add.audio("bossDieSound");
    this.bossDieSound.volume = 0.5;
    this.bossHurtSound = game.add.audio("bossHurtSound");
    this.enemyDieSound = game.add.audio("enemyDieSound");
    this.enemyDieSound.volume = 0.4;
    this.muteButton = game.add.button(20, 20, "mute", this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;
    this.muteButton.fixedToCamera = true;
    this.trophySound = game.add.audio("trophy");

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }

    // Particules
    this.emitter = game.add.emitter(0, 0, 15);
    this.emitter.makeParticles("pixel");
    this.emitter.setYSpeed(-200, 200);
    this.emitter.setXSpeed(-200, 200);
    this.emitter.gravity = 0;
    this.emitter.minParticleScale = 0.5;
    this.emitter.minRotation = 50;

    // Décor premier plan
    this.createWorldForeground();
    game.stage.backgroundColor = "#3c906e";

    // Damage
    this.executed = false;
    this.hurtAgain = true;

    // Responsive
    this.addMobileInputs();

    // Timer
    this.playerHasMoved = false;
    playState.idleTimer();
  },

  update: function () {
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);
    game.physics.arcade.collide(this.player, this.movingWall);

    game.physics.arcade.overlap(
      this.player,
      this.coin,
      this.takeCoin,
      null,
      this
    );
    game.physics.arcade.overlap(
      this.player,
      this.potion,
      this.takePotion,
      null,
      this
    );
    game.physics.arcade.overlap(
      this.player,
      this.enemies,
      this.enemyOrPlayerHurt,
      null,
      this
    );

    if (game.conf.mapName === 3) {
      game.physics.arcade.collide(this.boss, this.layer);
      game.physics.arcade.overlap(
        this.player,
        this.missiles,
        this.playerHurt,
        null,
        this
      );
      game.physics.arcade.overlap(
        this.player,
        this.boss,
        this.bossOrPlayerHurt,
        null,
        this
      );
      this.moveBoss();
    }

    this.movePlayer();
    this.debugButton();
    this.moveBoss();

    if (
      !this.player.inWorld &&
      this.player.body.y > 0 &&
      this.score < game.conf.difficultyData.score
    ) {
      this.playerDie();
    }

    if (this.nextEnemy < game.time.now) {
      let start = 4000;
      let end = 1000;
      let score = game.conf.difficultyData.score;
      let delay = Math.max(start - ((start - end) * this.score) / score, end);

      if (game.conf.mapName < 3) {
        game.time.events.add(3000, this.addEnemy, this);
        this.nextEnemy = game.time.now + delay;
      }
    }

    this.enemies.forEach(this.animateEnemy);

    if (game.conf.mapName === 1) {
      if (this.movingWall.x >= this.levelData.movingwallStart.x + 50) {
        this.movingWall.body.velocity.x = -50;
      } else if (this.movingWall.x <= this.levelData.movingwallStart.x - 50) {
        this.movingWall.body.velocity.x = 50;
      }
    }

    if (this.life_points === 0) {
      this.playerDie();
    }
  },

  // WORLD
  createWorld: function () {
    this.map = game.add.tilemap(game.conf.mapName);

    this.map.addTilesetImage("tileset");
    this.layer = this.map.createLayer("Tile Layer 1");

    if (game.conf.mapName === 4) {
      this.layer.resizeWorld();
    }

    this.map.setCollisionBetween(1, 14);

    if (game.conf.mapName === 1) {
      this.movingWall = game.add.sprite(
        this.levelData.movingwallStart.x,
        this.levelData.movingwallStart.y,
        "wallH"
      );
      this.movingWall.anchor.setTo(0.5, 1);
      game.physics.arcade.enable(this.movingWall);
      this.movingWall.enableBody = true;
      this.movingWall.body.immovable = true;
      this.movingWall.body.velocity.x = 50;
    }
  },

  createWorldForeground: function () {
    this.layer2 = this.map.createLayer("Tile Layer 2");

    if (game.conf.mapName === 4) {
      this.layer2.resizeWorld();
    }
  },

  // PLAYER
  movePlayer: function () {
    if (this.cursor.left.isDown || this.zsqd.left.isDown || this.moveLeft) {
      this.player.body.velocity.x = -200;
      this.player.animations.play("left");
      this.direction = "left";
      this.playerHasMoved = true;
    } else if (
      this.cursor.right.isDown ||
      this.zsqd.right.isDown ||
      this.moveRight
    ) {
      this.player.body.velocity.x = 200;
      this.player.animations.play("right");
      this.direction = "right";
      this.playerHasMoved = true;
    } else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();

      if (this.direction === "left") {
        this.player.frame = 4;
      } else {
        this.player.frame = 0;
      }
    }

    if (this.cursor.up.isDown || this.space.isDown || this.zsqd.up.isDown) {
      this.playerJump();
    }

    if (
      (this.cursor.up.isDown && this.direction === "right") ||
      (!this.player.body.onFloor() &&
        this.direction === "right" &&
        this.player.body.velocity.y !== 0)
    ) {
      this.player.animations.play("jump-right");
      if (this.player.body.velocity.y > 0 && this.player.scale.y === 1) {
        this.player.animations.play("down-right");
      } else if (
        this.player.body.velocity.y === 0 &&
        this.player.body.velocity.x === 0
      ) {
        this.player.frame = 0;
      }
    }

    if (
      (this.cursor.up.isDown && this.direction === "left") ||
      (!this.player.body.onFloor() &&
        this.direction === "left" &&
        this.player.body.velocity.y !== 0)
    ) {
      this.player.animations.play("jump-left");
      if (this.player.body.velocity.y > 0 && this.player.scale.y === 1) {
        this.player.animations.play("down-left");
      } else if (
        this.player.body.velocity.y === 0 &&
        this.player.body.velocity.x === 0
      ) {
        this.player.frame = 4;
      }
    }
  },

  debugButton: function () {
    if (this.debugInput.m.isDown) {
      game.time.events.add(300, this.startMenu, this);
    }
  },

  playerJump: function () {
    if (
      (this.player.body.velocity.y === 0 || this.player.body.onFloor()) &&
      this.player.alive
    ) {
      this.player.body.velocity.y = -470;
      this.jumpSound.play();
    }
    this.playerHasMoved = true;
  },

  playerHurt: function () {
    if (
      !this.executed &&
      this.life_points >= 1 &&
      this.score < game.conf.difficultyData.score
    ) {
      this.executed = true;
      this.life_points -= 1;
      this.health.animations.play(this.life_points);
      this.player.alpha = 0.5;
      this.player.tint = 0xffffff;
      this.tint = game.time.events.loop(100, this.changeTint, this);
      game.time.events.add(990, this.resetTint, this);
      game.time.events.add(1000, this.reset_executed, this);

      if (this.life_points >= 4 && game.conf.difficulty !== "hard") {
        game.time.events.add(
          game.conf.difficultyData.potionTime,
          this.updatePotionPosition,
          this
        );
      }

      if (this.life_points >= 1) {
        this.hurtSound.play();
      }
    }
  },

  changeTint: function () {
    this.player.tint = this.player.tint === 0xff0000 ? 0xffffff : 0xff0000;
  },

  resetTint: function () {
    game.time.events.remove(this.tint);
    this.player.tint = 0xffffff;
  },

  reset_executed: function () {
    this.executed = false;
    this.player.alpha = 1;
    this.player.tint = 0xffffff;
    if (game.conf.mapName === 3) {
      this.boss.body.enable = true;
      this.boss.animations.play("walk");
    }
  },

  playerDie: function () {
    if (!this.player.alive) {
      return;
    }

    this.player.kill();

    this.deadSound.play();

    let deathLabel = game.add.text(400, game.world.centerY, "T'es nul...", {
      font: fontl,
      fill: textColor,
    });
    deathLabel.fixedToCamera = true;
    deathLabel.anchor.setTo(0.5, 0.5);
    deathLabel.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);

    game.stage.backgroundColor = "#313131";

    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    this.emitter.start(true, 600, null, 6);

    game.time.events.add(1000, this.restartLevel, this);
  },

  // BOSS
  moveBoss: function () {
    if (game.conf.mapName === 3) {
      if (this.boss.body.velocity.x > 0 && this.boss.direction === "left") {
        this.boss.scale.x = -1;
        this.boss.direction = "right";
      } else if (
        this.boss.body.velocity.x < 0 &&
        this.boss.direction === "right"
      ) {
        this.boss.scale.x = 1;
        this.boss.direction = "left";
      }
    }
  },

  bossHurt: function () {
    if (!this.executed && this.boss_life_points >= 0) {
      this.boss_life_points -= 1;
      game.time.events.add(1000, this.reset_executed, this);
      this.player.body.velocity.y = -200;
      this.boss.body.enable = false;
      this.emitter.x = this.boss.x;
      this.emitter.y = this.boss.y;
      this.emitter.start(true, 300, null, 6);
      this.boss.animations.play("hurtAnim");
      this.healthBoss.animations.play(this.boss_life_points);

      if (this.boss_life_points >= 1) {
        game.time.events.add(Phaser.Timer.SECOND / 4, this.fireMissileUp, this);
        this.bossHurtSound.play();
      }

      if (this.boss_life_points === 0) {
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
    this.boss_life_pointsLabel.kill();
    this.healthBoss.kill();
    game.time.events.remove(this.timer_missile);

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
    let enemy = this.enemies.getFirstDead();

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

    let enemyVelocity = game.rnd.integerInRange(0, 3);
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
      pEnemy.animations.play("fall-left");
    } else if (!pEnemy.body.onFloor() && pEnemy.body.velocity.x >= 0) {
      pEnemy.animations.play("fall-right");
    }

    if (pEnemy.body.onFloor() && pEnemy.body.velocity.x < 0) {
      pEnemy.animations.play("walk-left");
    } else if (pEnemy.body.onFloor() && pEnemy.body.velocity.x > 0) {
      pEnemy.animations.play("walk-right");
    }
  },

  enemyOrPlayerHurt: function (pPlayer, pEnemy) {
    if (this.hurtAgain === true) {
      if (pPlayer.body.velocity.y <= 0 || pPlayer.body.y >= pEnemy.body.y) {
        this.playerHurt(pPlayer, pEnemy);
        this.hurtAgain = false;
        game.time.events.add(500, this.resetHurtAgain, this);
      } else if (pEnemy.key === "enemy2" && pPlayer.body.velocity.y > 0) {
        pEnemy.body.checkCollision.down = false;
        pEnemy.body.checkCollision.left = false;
        pEnemy.body.checkCollision.right = false;
        pEnemy.body.checkCollision.up = false;

        if (pEnemy.body.velocity.x <= 0) {
          game.add
            .tween(pEnemy)
            .to({ angle: -180 }, 750, Phaser.Easing.Linear.Out, true);
        } else if (pEnemy.body.velocity.x > 0) {
          game.add
            .tween(pEnemy)
            .to({ angle: 180 }, 750, Phaser.Easing.Linear.Out, true);
        }

        this.enemyDieSound.play();
        pPlayer.body.velocity.y = -200;
        pEnemy.body.velocity.y = -100;
        this.emitter.x = pEnemy.x;
        this.emitter.y = pEnemy.y;
        this.emitter.start(true, 300, null, 6);
        this.hurtAgain = false;
        game.time.events.add(500, this.resetHurtAgain, this);
        game.conf.enemyKillCounter++;

        if (game.conf.enemyKillCounter === 30) {
          game.time.events.add(300, this.getTrophy, this, "Dexter Morgan");
        }
      }
    }
  },

  getTrophy: function (name) {
    this.trophySound.play();

    this.dialogue = game.add.sprite(game.world.width - 400, -70, "dialogue");
    this.dialogue.anchor.setTo(0.5, 0.5);
    game.add
      .tween(this.dialogue)
      .to({ y: 140 }, 400, Phaser.Easing.Circular.Out, true);

    this.trophyUnlocked = game.add.sprite(
      game.world.width - 550,
      -70,
      "trophy"
    );
    this.trophyUnlocked.anchor.setTo(0.5, 0.5);
    this.trophyUnlocked.scale.setTo(0.5, 0.5);
    game.add
      .tween(this.trophyUnlocked)
      .to({ y: 140 }, 400, Phaser.Easing.Circular.Out, true);

    this.trophyUnlockedText = game.add.text(
      game.world.width - 400,
      -70,
      "Obtenu : " + name,
      { font: fonts, fill: textColorBlack }
    );
    this.trophyUnlockedText.anchor.setTo(0.5, 0.5);
    game.add
      .tween(this.trophyUnlockedText)
      .to({ y: 140 }, 400, Phaser.Easing.Circular.Out, true);

    game.time.events.add(2000, this.eraseTrophy, this);
  },

  eraseTrophy: function () {
    game.add
      .tween(this.dialogue)
      .to({ y: -70 }, 400, Phaser.Easing.Circular.In, true);
    game.add
      .tween(this.trophyUnlocked)
      .to({ y: -70 }, 400, Phaser.Easing.Circular.In, true);
    game.add
      .tween(this.trophyUnlockedText)
      .to({ y: -70 }, 400, Phaser.Easing.Circular.In, true);

    game.time.events.add(500, this.killTrophy, this);
  },

  killTrophy: function () {
    this.dialogue.kill();
    this.trophyUnlocked.kill();
    this.trophyUnlockedText.kill();
  },

  resetHurtAgain: function () {
    this.hurtAgain = true;
  },

  // COIN
  takeCoin: function () {
    this.pointsLabel = game.add.text(this.coin.x, this.coin.y, "10", {
      font: fontm,
      fill: textColor,
    });
    this.pointsLabel.anchor.setTo(0.5, 0.5);
    this.pointsLabel.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
    game.time.events.add(500, this.eraseScore, this);
    game.add
      .tween(this.pointsLabel)
      .to({ y: this.coin.y - 50 }, 500, "Linear", true);

    if (this.score < game.conf.difficultyData.score - 10) {
      this.updateCoinPosition();
    } else {
      this.coin.kill();
      this.potion.kill();
    }

    this.score += 10;
    this.scoreLabel.text =
      "Score : " + this.score + " / " + game.conf.difficultyData.score;

    this.coinSound.play();

    this.coin.scale.setTo(0, 0);
    game.add.tween(this.coin.scale).to({ x: 1, y: 1 }, 300).start();

    game.add
      .tween(this.player.scale)
      .to({ x: 1.2, y: 0.8 }, 50)
      .to({ x: 1, y: 1 }, 150)
      .start();

    if (this.score === game.conf.difficultyData.score) {
      this.nextLevelText();
    }
  },

  eraseScore: function () {
    game.add.tween(this.pointsLabel).to({ alpha: 0 }, 500, "Linear", true);
  },

  updateCoinPosition: function () {
    if (game.conf.mapName < 4) {
      // generate number between 1 and coinPosition.length (0 holds the last value used)
      this.keyCoinPosition = game.rnd.integerInRange(
        1,
        this.coinPosition.length - 1
      );

      this.coinPositionValue = this.coinPosition[this.keyCoinPosition];
    } else if (game.conf.mapName === 4 && this.coinCount < 9) {
      ++this.coinCount;
      this.coinPositionValue = this.coinPosition[this.coinCount];
    }

    // delete value from array
    this.coinPosition.splice(this.keyCoinPosition, 1);

    // insert value in coinposition[0]
    this.coinPosition.unshift(this.coinPositionValue);

    // use value
    this.coin.reset(this.coinPositionValue.x, this.coinPositionValue.y);
  },

  // POTION
  takePotion: function () {
    this.healthBonus = game.add.sprite(
      this.potion.x,
      this.potion.y,
      "healthBonus"
    );
    this.healthBonus.anchor.setTo(0.5, 0.5);
    game.time.events.add(500, this.eraseHealthBonus, this);
    game.add
      .tween(this.healthBonus)
      .to({ y: this.potion.y - 50 }, 500, "Linear", true);

    game.add
      .tween(this.player.scale)
      .to({ x: 0.8, y: 1.2 }, 50)
      .to({ x: 1, y: 1 }, 150)
      .start();

    this.updatePotionPosition();
    this.life_points += 1;
    this.health.animations.play(this.life_points);

    this.potionSound.play();

    let newPotionPosition = { x: -100, y: -100 };

    this.potion.reset(newPotionPosition.x, newPotionPosition.y);

    if (this.life_points <= 4 && game.conf.difficulty !== "hard") {
      game.time.events.add(
        game.conf.difficultyData.potionTime,
        this.updatePotionPosition,
        this
      );
    }
  },

  eraseHealthBonus: function () {
    game.add.tween(this.healthBonus).to({ alpha: 0 }, 500, "Linear", true);
  },

  updatePotionPosition: function () {
    // generate number between 1 and coinPosition.length (0 holds the last value used)
    this.keyPotionPosition = game.rnd.integerInRange(
      1,
      this.potionPosition.length - 1
    );

    this.potionPositionValue = this.potionPosition[this.keyPotionPosition];

    // delete value from array
    this.potionPosition.splice(this.keyPotionPosition, 1);

    // insert value in coinposition[0]
    this.potionPosition.unshift(this.potionPositionValue);

    this.potion.reset(this.potionPositionValue.x, this.potionPositionValue.y);
  },

  addMobileInputs: function () {
    this.jumpButton = game.add.sprite(650, 620, "jumpButton");
    this.jumpButton.inputEnabled = true;
    this.jumpButton.alpha = 0.5;
    this.jumpButton.events.onInputDown.add(function () {
      this.playerJump();
    }, this);

    this.moveLeft = false;
    this.moveRight = false;

    this.leftButton = game.add.sprite(50, 620, "leftButton");
    this.leftButton.inputEnabled = true;
    this.leftButton.alpha = 0.5;
    this.leftButton.events.onInputOver.add(function () {
      this.moveLeft = true;
    }, this);
    this.leftButton.events.onInputOut.add(function () {
      this.moveLeft = false;
    }, this);
    this.leftButton.events.onInputDown.add(function () {
      this.moveLeft = true;
    }, this);
    this.leftButton.events.onInputUp.add(function () {
      this.moveLeft = false;
    }, this);

    this.rightButton = game.add.sprite(350, 620, "rightButton");
    this.rightButton.inputEnabled = true;
    this.rightButton.alpha = 0.5;
    this.rightButton.events.onInputOver.add(function () {
      this.moveRight = true;
    }, this);
    this.rightButton.events.onInputOut.add(function () {
      this.moveRight = false;
    }, this);
    this.rightButton.events.onInputDown.add(function () {
      this.moveRight = true;
    }, this);
    this.rightButton.events.onInputUp.add(function () {
      this.moveRight = false;
    }, this);
  },

  idleTimer: function () {
    setTimeout(function () {
      if (playState.playerHasMoved === false) {
        game.conf.grevin = true;
        game.time.events.add(300, playState.getTrophy, playState, "Grevin");
      }
    }, 5000);
  },

  // LEVELS
  startMenu: function () {
    game.state.start("menu");
  },

  nextLevelText: function () {
    let finishLabel;
    if (game.conf.mapName <= 3) {
      finishLabel = game.add.text(
        game.world.centerX,
        game.world.centerY,
        "Niveau terminé",
        { font: fontl, fill: textColor }
      );
      finishLabel.anchor.setTo(0.5, 0.5);
      finishLabel.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);
      game.time.events.add(3000, this.nextLevelState, this);
    } else if (game.conf.mapName === 4) {
      finishLabel = game.add.text(
        400,
        game.world.centerY,
        "Jeu terminé ! Bravo !",
        { font: fontl, fill: textColor }
      );
      finishLabel.fixedToCamera = true;
      finishLabel.anchor.setTo(0.5, 0.5);
      finishLabel.setShadow(3, 3, "rgba(0,0,0,0.5)", 5);

      if (game.conf.difficulty === "easy") {
        game.conf.easyEnding = true;
        game.time.events.add(300, this.getTrophy, this, "Fin Facile");
      } else if (game.conf.difficulty === "casual") {
        game.conf.casualEnding = true;
        game.time.events.add(300, this.getTrophy, this, "Fin Normale");
      } else if (game.conf.difficulty === "hard") {
        game.conf.hardEnding = true;
        game.time.events.add(300, this.getTrophy, this, "Fin Difficile");
      }

      game.time.events.add(3000, this.startMenu, this);
    }

    if (
      game.conf.enemyKillCounter === 0 &&
      game.conf.mapName < 3 &&
      game.conf.pacifiste === false
    ) {
      game.conf.pacifiste = true;
      game.time.events.add(300, this.getTrophy, this, "Pacifiste");
    }
  },

  nextLevelState: function () {
    game.state.start("level", true, false, game.conf.mapName + 1);
  },

  restartLevel: function () {
    if (game.conf.difficulty !== "hard") {
      game.state.start("level", true, false, game.conf.mapName);
    } else {
      game.state.start("level", true, false, 1);
    }
  },

  // SOUND
  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },
};

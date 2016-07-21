var playState = {
  create: function() {
    //Commandes
    this.cursor = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

    //Murs
    this.createWorld();

    //Joueur
    this.player = game.add.sprite(game.world.centerX, 230, 'slime');
    this.player.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 500;
    this.player.animations.add('right', [2,3], 6, true);
    this.player.animations.add('left', [0,1], 6, true);
    game.life_points = 3;
    /*game.wallJump = false;*/

    //Pièce
    this.coin = game.add.sprite(60,140,'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(0.5,0.5);

    //Power Up
    this.potion = game.add.sprite(game.world.centerX, game.world.centerY,'potion');
    game.physics.arcade.enable(this.potion);
    this.potion.anchor.setTo(0.5,0.5);

    //Score
    this.scoreLabel = game.add.text(30, 30, 'Score : 0', {font:fontxs, fill:textColor});
    game.global.score = 0;

    //Points de vie
    game.life_pointsLabel = game.add.text(460, 30, game.life_points, {font:fontxs, fill:textColor});

    //Ennemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.createMultiple(10, 'enemy');
    this.nextEnemy = 0;

    //Sons
    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.deadSound = game.add.audio('dead');
    this.potionSound = game.add.audio('potion');

    //Particules
    this.emitter = game.add.emitter(0, 0, 15);
    this.emitter.makeParticles('pixel');
    this.emitter.setYSpeed(-150, 150);
    this.emitter.setXSpeed(-150, 150);
    this.emitter.gravity = 0;
    this.emitter.minParticleScale = 0.5;
    this.emitter.minRotation = 50;

    //Fond
    game.stage.backgroundColor = "#3498db";

    //Damage
    this.executed = false;

    this.tutoLabel = game.add.text(game.world.centerX, game.world.centerY, 'Objectif : 100 points', {font:fontxs, fill:textColor});
    this.tutoLabel.anchor.setTo(0.5,0.5);
    game.time.events.add(2000, this.eraseTuto, this);
  },

  eraseTuto:function() {
    game.add.tween(this.tutoLabel).to( { alpha: 0 }, 1000, "Linear", true);
  },

  update: function() {
    //Fonction exécutée 60x par seconde
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);

    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.potion, this.takePotion, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerHurt, null, this);

    this.movePlayer();

    if (!this.player.inWorld && game.global.score < 100) {
      this.playerDie();
    }

    if (this.nextEnemy < game.time.now) {
      var start = 4000, end = 1000, score = 100;
      var delay = Math.max(start - (start-end)*game.global.score/score, end);

      this.addEnemy();
      this.nextEnemy = game.time.now + delay;
    }
  },

  movePlayer: function() {
    if (this.cursor.left.isDown /*&& game.wallJump == false*/) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    } else if (this.cursor.right.isDown /*&& game.wallJump == false*/) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } /*else if (this.cursor.left.isDown && game.wallJump == true) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } else if (this.cursor.right.isDown && game.wallJump == true) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    }*/ else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();
      this.player.frame = 0;
    }

    //Reset walljump
    /*if (this.player.body.onFloor()) {
      game.wallJump = false;
    }*/

    //Jump simple
    if (this.cursor.up.isDown && this.player.body.onFloor() && this.player.alive) {
      this.player.body.velocity.y = -300;
      /*if (this.cursor.left.isDown) {
        game.add.tween(this.player).to({angle:-360}, 500, Phaser.Easing.Linear.None, true);
      } else if (this.cursor.right.isDown) {
        game.add.tween(this.player).to({angle:360}, 500, Phaser.Easing.Linear.None, true);
      }*/

      this.jumpSound.play();
    }

    //Wall jump
    /*if (!this.player.body.onFloor() && this.player.body.onWall() && this.cursor.up.isDown && this.cursor.left.isDown || !this.player.body.onFloor() && this.player.body.onWall() && this.cursor.up.isDown && this.cursor.right.isDown) {
      game.wallJump = true;
      this.player.body.velocity.y = -200;
    }*/
  },

  createWorld: function() {
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollision(1);
  },

  nextLevel: function() {
    var finishLabel = game.add.text(game.world.centerX, game.world.centerY, 'Niveau terminé',{font: fontl, fill: textColor});
    finishLabel.anchor.setTo(0.5, 0.5);
    game.time.events.add(2000, this.level2, this);
  },

  level2: function() {
    game.state.start('play2');
  },

  // Mise a jour des points de vie du personnage
  playerHurt: function() {
    if (!this.executed && game.life_points >= 1 && game.global.score < 100){
      this.executed = true;
      game.life_points -= 1;
      this.player.alpha = 0.5;
      game.life_pointsLabel.text = game.life_points;
      game.time.events.add(1000, this.reset_executed, this);
    } else if (game.life_points === 0) {
      this.playerDie();
    }
  },

  reset_executed: function() {
    this.executed = false;
    this.player.alpha = 1;
  },

  playerDie: function() {
    if (!this.player.alive) {
      return;
    }

    this.player.kill();

    this.deadSound.play();

    var deathLabel = game.add.text(game.world.centerX, game.world.centerY, 'T\'es nul...',{font: fontl, fill: textColor});
    deathLabel.anchor.setTo(0.5, 0.5);

    game.stage.backgroundColor = "#313131";

    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    this.emitter.start(true, 600, null, 15);

    game.time.events.add(1000, this.startMenu, this);
  },

  takeCoin: function() {
    if (game.global.score < 90) {
      this.updateCoinPosition();
    } else {
      this.coin.kill();
    }

    game.global.score += 10;
    this.scoreLabel.text = 'Score : ' + game.global.score;

    this.coinSound.play();

    this.coin.scale.setTo(0,0);
    game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

    game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();

    if (game.global.score == 100) {
      this.nextLevel();
    }
  },

  takePotion: function() {
    this.updatePotionPosition();
    game.life_points += 1;
    game.life_pointsLabel.text = game.life_points;

    this.potionSound.play();

    this.potion.scale.setTo(0,0);
  },

  updateCoinPosition: function() {
    var coinPosition = [
      {x: 170, y: 60}, {x: 330, y: 60},
      {x: 60, y: 140}, {x: 440, y: 140},
      {x: 170, y: 300}, {x: 330, y: 300}
    ];

    for (var i = 0; i < coinPosition.length; i++) {
      if (coinPosition[i].x === this.coin.x) {
        coinPosition.splice(i,1);
      }
    }

    var newCoinPosition = coinPosition[
      game.rnd.integerInRange(0, coinPosition.length-1)
    ];

    this.coin.reset(newCoinPosition.x, newCoinPosition.y);
  },

  updatePotionPosition: function() {
    var potionPosition = [
      {x: 250, y: 60},
      {x: 240, y: 120},
      {x: 230, y: 300}
    ];

    for (var j = 0; j < potionPosition.length; j++) {
      if (potionPosition[j].x === this.potion.x) {
        potionPosition.splice(j,1);
      }
    }

    var newPotionPosition = potionPosition[
      game.rnd.integerInRange(0, potionPosition.length-1)
    ];

    this.potion.reset(newPotionPosition.x, newPotionPosition.y);
  },

  addEnemy: function() {
    var enemy = this.enemies.getFirstDead();

    if (!enemy) {
      return;
    }

    enemy.anchor.setTo(0.5, 1);
    enemy.reset(game.world.centerX,0);
    enemy.body.gravity.y = 500;
    enemy.body.velocity.x = 100 * game.rnd.integerInRange(-1,1);
    if (enemy.body.velocity.x === 0) {enemy.body.velocity.x=-100}
    enemy.body.bounce.x = 1;
    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  },

  startMenu: function() {
    game.state.start('menu');
  },
};

var playState = {
  create: function() {
    //Commandes
    this.cursor = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);

    //Murs
    this.createWorld();

    //Joueur
    this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    this.player.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 500;
    this.player.animations.add('right', [1,2], 8, true);
    this.player.animations.add('left', [3,4], 8, true);

    //Pièce
    this.coin = game.add.sprite(60,140,'coin');
    game.physics.arcade.enable(this.coin);
    this.coin.anchor.setTo(0.5,0.5);

    //Score
    this.scoreLabel = game.add.text(30, 30, 'Score : 0', {font:'18px Arial', fill:'#ffffff'});
    game.global.score = 0;

    //Ennemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.createMultiple(10, 'enemy');
    this.nextEnemy = 0;

    //Sons
    this.jumpSound = game.add.audio('jump');
    this.coinSound = game.add.audio('coin');
    this.deadSound = game.add.audio('dead');

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
  },

  update: function() {
    //Fonction exécutée 60x par seconde
    game.physics.arcade.collide(this.player, this.layer);
    game.physics.arcade.collide(this.enemies, this.layer);

    game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
    game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);

    this.movePlayer();

    if (!this.player.inWorld) {
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
    if (this.cursor.left.isDown) {
      this.player.body.velocity.x = -200;
      this.player.animations.play('left');
    } else if (this.cursor.right.isDown) {
      this.player.body.velocity.x = 200;
      this.player.animations.play('right');
    } else {
      this.player.body.velocity.x = 0;
      this.player.animations.stop();
      this.player.frame = 0;
    }

    if (this.cursor.up.isDown && this.player.body.onFloor() && this.player.alive) {
      this.player.body.velocity.y = -300;
      if (this.cursor.left.isDown) {
        game.add.tween(this.player).to({angle:-360}, 500, Phaser.Easing.Linear.None, true);
      } else if (this.cursor.right.isDown) {
        game.add.tween(this.player).to({angle:360}, 500, Phaser.Easing.Linear.None, true);
      }

      this.jumpSound.play();
    }
  },

  createWorld: function() {
    this.map = game.add.tilemap('map');
    this.map.addTilesetImage('tileset');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.resizeWorld();
    this.map.setCollision(1);
  },

  playerDie: function() {
    if (!this.player.alive) {
      return;
    }

    this.player.kill();

    this.deadSound.play();

    var deathLabel = game.add.text(game.world.centerX, game.world.centerY, 'T\'es nul...',{font: '30px Arial', fill: '#ffffff'});
    deathLabel.anchor.setTo(0.5, 0.5);

    game.stage.backgroundColor = "#ff0000";

    this.emitter.x = this.player.x;
    this.emitter.y = this.player.y;
    this.emitter.start(true, 600, null, 15);

    game.time.events.add(1000, this.startMenu, this);
  },

  takeCoin: function() {
    this.updateCoinPosition();
    game.global.score += 5;
    this.scoreLabel.text = 'Score : ' + game.global.score;

    this.coinSound.play();

    this.coin.scale.setTo(0,0);
    game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();

    game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
  },

  updateCoinPosition: function() {
    var coinPosition = [
      {x: 140, y: 60}, {x: 360, y: 60},
      {x: 60, y: 140}, {x: 440, y: 140},
      {x: 130, y: 300}, {x: 370, y: 300}
    ];

    for (var i = 0; i < coinPosition.length; i++) {
      if (coinPosition[i].x === this.coin.x) {
        coinPosition.splice(i,1);
      }
    }

    var newPosition = coinPosition[
      game.rnd.integerInRange(0, coinPosition.length-1)
    ];

    this.coin.reset(newPosition.x, newPosition.y);
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
  }
};

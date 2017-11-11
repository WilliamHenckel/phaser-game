/* global Phaser, game, fonts, fontxl, textColor */
var trophyState = {
  init: function () {
    this.trophyData = JSON.parse(this.game.cache.getText('trophy'));
  },

  create: function () {
    game.stage.backgroundColor = '#313131';

    this.title = game.add.text(1100, 100, 'Trophées', {font: fontxl, fill: textColor});
    game.add.tween(this.title).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.title.anchor.set(0.5);

    this.returnButton = game.add.text(1100, game.world.centerY + 240, 'Retour', {font: fontxl, fill: textColor});
    game.add.tween(this.returnButton).to({x: 400}, 400, Phaser.Easing.Linear.Out, true);
    this.returnButton.anchor.set(0.5);
    this.returnButton.alpha = 0.5;
    this.returnButton.inputEnabled = true;

    this.muteButton = game.add.button(20, 20, 'mute', this.toggleSound, this);
    this.muteButton.input.useHandCursor = true;

    if (game.sound.mute) {
      this.muteButton.frame = 1;
    }

    this.trophyLocked = [];
    this.trophyLockedText = [];
    this.trophyCounter = 0;

    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 5; i++) {
        this.trophyLocked[this.trophyCounter] = game.add.sprite(840 + j * 200, 200 + i * 60, 'trophy');
        this.trophyLocked[this.trophyCounter].anchor.setTo(0.5, 0.5);
        this.trophyLocked[this.trophyCounter].scale.setTo(0.5, 0.5);
        this.trophyLocked[this.trophyCounter].alpha = 0.5;
        game.add.tween(this.trophyLocked[this.trophyCounter]).to({x: 140 + j * 200}, 400, Phaser.Easing.Linear.Out, true);

        this.trophyLockedText[this.trophyCounter] = game.add.text(865 + j * 200, 200 + i * 60, this.trophyData.trophyNames[this.trophyCounter], {font: fonts, fill: textColor});
        this.trophyLockedText[this.trophyCounter].anchor.setTo(0, 0.5);
        this.trophyLockedText[this.trophyCounter].alpha = 0.5;
        game.add.tween(this.trophyLockedText[this.trophyCounter]).to({x: 165 + j * 200}, 400, Phaser.Easing.Linear.Out, true);

        this.trophyCounter++;
      }
    }

    if (game.conf.enemyKillCounter >= 30) {
      this.trophyLocked[5].alpha = 1;
      game.add.tween(this.trophyLocked[5]).to({angle: -10}, 300).to({angle: 0}, 300).to({angle: 10}, 300).to({angle: 0}, 300).loop().start();
      this.trophyLockedText[5].alpha = 1;
    }

    if (game.conf.easyEnding === true) {
      this.trophyLocked[0].alpha = 1;
      game.add.tween(this.trophyLocked[0]).to({angle: -10}, 300).to({angle: 0}, 300).to({angle: 10}, 300).to({angle: 0}, 300).loop().start();
      this.trophyLockedText[0].alpha = 1;
    }

    if (game.conf.casualEnding === true) {
      this.trophyLocked[1].alpha = 1;
      game.add.tween(this.trophyLocked[1]).to({angle: -10}, 300).to({angle: 0}, 300).to({angle: 10}, 300).to({angle: 0}, 300).loop().start();
      this.trophyLockedText[1].alpha = 1;
    }

    if (game.conf.hardEnding === true) {
      this.trophyLocked[2].alpha = 1;
      game.add.tween(this.trophyLocked[2]).to({angle: -10}, 300).to({angle: 0}, 300).to({angle: 10}, 300).to({angle: 0}, 300).loop().start();
      this.trophyLockedText[2].alpha = 1;
    }

    /* this.trophyUnlocked = game.add.sprite(850, 350, 'trophy');
    game.add.tween(this.trophyUnlocked).to({x: 150}, 400, Phaser.Easing.Linear.Out, true);
    this.trophyUnlocked.anchor.setTo(0.5, 0.5);
    this.trophyUnlocked.scale.setTo(0.5, 0.5);
    this.trophyUnlockedText = game.add.text(900, 350, 'Trophée unlocked', {font: fonts, fill: textColor});
    game.add.tween(this.trophyUnlockedText).to({x: 200}, 400, Phaser.Easing.Linear.Out, true);
    this.trophyUnlockedText.anchor.setTo(0, 0.5);
    game.add.tween(this.trophyUnlocked).to({angle: -10}, 300).to({angle: 0}, 300).to({angle: 10}, 300).to({angle: 0}, 300).loop().start(); */

    game.input.onDown.add(this.menu, this);
  },

  update: function () {
    if (this.returnButton.input.pointerOver()) {
      this.returnButton.alpha = 1;
    } else {
      this.returnButton.alpha = 0.5;
    }
  },

  toggleSound: function () {
    game.sound.mute = !game.sound.mute;
    this.muteButton.frame = game.sound.mute ? 1 : 0;
  },

  stateMenu: function () {
    game.state.start('menu');
  },

  menu: function () {
    if (!this.muteButton.input.pointerOver() && this.returnButton.input.pointerOver()) {
      this.transitionAnimation();
    }
  },

  transitionAnimation: function () {
    game.add.tween(this.title).to({x: this.title.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    game.add.tween(this.returnButton).to({x: this.returnButton.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    for (let i = 0, j = this.trophyCounter; i < j; i++) {
      game.add.tween(this.trophyLocked[i]).to({x: this.trophyLocked[i].x - 800}, 400, Phaser.Easing.Linear.Out, true);
      game.add.tween(this.trophyLockedText[i]).to({x: this.trophyLockedText[i].x - 800}, 400, Phaser.Easing.Linear.Out, true);
    }
    // game.add.tween(this.trophyUnlocked).to({x: this.trophyUnlocked.x - 800}, 400, Phaser.Easing.Linear.Out, true);
    // game.add.tween(this.trophyUnlockedText).to({x: this.trophyUnlockedText.x - 800}, 400, Phaser.Easing.Linear.Out, true);

    game.time.events.add(500, this.stateMenu, this);
  },

  menuChoice: function () {
    if (!this.muteButton.input.pointerOver()) {
      if (this.returnButton.input.pointerOver()) {
        this.transitionAnimation('character');
      }
    }
  }
};

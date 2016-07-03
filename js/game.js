var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');
var textColor = '#ffffff'; // Couleur du texte
var textFont = 'Arial'; // Police du texte
var fontxl = '50px '+textFont; // Énorme taille de texte
var fontl = '30px '+textFont; // Grande taille de texte
var fontm = '25px '+textFont; // Taille de texte moyenne
var fonts = '20px '+textFont; // Petite taille de texte
var fontxs = '18px '+textFont; // Minuscule taille de texte

game.global = {score:0};

game.state.add('boot', {
  preload: function() {
    game.load.image('progressBar', 'assets/progressBar.png');
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.state.start('load');
  }
});

game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('play2', playState2);
game.state.add('play3', playState3);

game.state.start('boot');

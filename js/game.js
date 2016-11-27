var game = new Phaser.Game(800, 640, Phaser.AUTO, 'gameDiv', null, false);
var textColor = '#ffffff';      // Couleur du texte
var textFont = 'Monaco';        // Police du texte
var fontxl = '50px ' + textFont;  // Énorme taille de texte
var fontl = '30px ' + textFont;   // Grande taille de texte
var fontm = '25px ' + textFont;   // Taille de texte moyenne
var fonts = '20px ' + textFont;   // Petite taille de texte
var fontxs = '18px ' + textFont;  // Minuscule taille de texte

game.global = {score: 0};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('boot');

var game = new Phaser.Game(800, 600, Phaser.CANVAS)

var player, enemy, platforms, ledge, cursors, wing, shield, spikes, roofSpikes, fire, fallingSpikes;
var runFastX = false, jumpHigherX = false, stunGunWeapon = false;
var timer;
var smack;
var music;
var music1;
// Virtual Joystick

var pad;
var stick;
//Forces the next state of the game with a button that is not coded in phaser.
var forceGameStart4=false;
var trumpQuotes;
var total = 0;
var highestTotalLocal=0;

//////////////////////////////////////////////////Story///////////////////////////////////
var content = [
  "In the future, Donald Trump has seized all power.",
  "To fund his endless wars, Trump creates a game show.",
  "A game show that uses prisoners as contestants.",
  "You have been selected as a contestant",
  "The goal is to survive as long as possible.",
  "Welcome to Glory Brawl.",
];

var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 120;
var lineDelay = 400;

function nextLine() {

  if (lineIndex === content.length)
  {
      //  We're finished
      return;
  }

  //  Split the current line on spaces, so one word per array element
  line = content[lineIndex].split(' ');

  //  Reset the word index to zero (the first word in the line)
  wordIndex = 0;

  //  Call the 'nextWord' function once for each word in the line (line.length)
  game.time.events.repeat(wordDelay, line.length, nextWord, this);

  //  Advance to the next line
  lineIndex++;

}

function nextWord() {

  //  Add the next word onto the text string, followed by a space
  text.text = text.text.concat(line[wordIndex] + " ");

  //  Advance the word index to the next word in the line
  wordIndex++;

  //  Last word?
  if (wordIndex === line.length)
  {
      //  Add a carriage return
      text.text = text.text.concat("\n");

      //  Get the next line after the lineDelay amount of ms has elapsed
      game.time.events.add(lineDelay, nextLine, this);
  }

}
/////////////////////

////////////////////////////////////////////////////////////////GAME STATES////////////////////////////////////////////////////////////////
game.state.add('state1',brawl.state1);
game.state.add('state2',brawl.state2);
game.state.add('state3',brawl.state3);
game.state.start('state1');
//game.state.start('state2');
//game.state.start('state3');
//game.state.start('state4');
////////////////////////////////////////////////////////////////PHASER 2 GAME (GLORY_BRAWL)////////////////////////////////////////////////////////////////

/*
//Changing Game States Where you Press Numbers
function changeState (i,stateNum) {
  console.log(i);
  game.state.start('state'+stateNum);
}

function addKeyCallback(key,fn,args) {
  game.input.keyboard.addKey(key).onDown.add(fn,null,null,args);
}

function addChangeStateEventListeners() {
  addKeyCallback(Phaser.Keyboard.TWO, changeState,2);
}
*/

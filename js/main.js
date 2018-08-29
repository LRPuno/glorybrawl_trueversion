var game = new Phaser.Game(1400, 930, Phaser.CANVAS,)

////////////////////////Game States//////////////////////
game.state.add('mainMenu',brawl.state1);
game.state.add('ruleSetOne',brawl.state2);
game.state.add('levelOne',brawl.state3);
game.state.add('ruleSetTwo',brawl.state5);
game.state.add('levelTwo',brawl.state6);
game.state.add('deathState',brawl.state4);
game.state.start('mainMenu');

////////////////////Variables that Holds Player and controls///////////////
var player;

/////////// Variables that hold the Sound and Special FX//////////////
var music;

// Global Variables that Holds Sprite/Game Object Properties That Will Be Used Throughout All Levels.
var platforms;
var ledge;
var roofSpikes;
var fallingSpikes;
var spikes;
var enemy;
var fire;

// Variables that Holds Power Ups Objects (These are cumulative the entire game).
var wing;
var shield;
// Variables that Hold Cumlative Power-Up Booleans
var runFastX = false;
var jumpHigherX = false;

// Virtual Joystick
var pad;
var stick;
var buttonA;

//Mechanics Specific for Level One
var timer;
var total = 30;

//Mechanics Specific for Level Two
var wall;
var door;

// Life Mechanic for Entire Game
var lives=10;
var ghettoLoopMechanic=10;

//////////////////////////////////////////////////Main Menu Story//////////////////////////////////////////////
var content = [
  "In the future, Donald Trump has seized all power.",
  "To fund his endless wars, Trump creates a game show.",
  "A game show that uses prisoners as contestants.",
  "If a prisoner survives 5 rounds, they become free.",
  "You are Prison XJ7, this is your chance for freedom.",
  "Alpha New B. Welcome to Glory Brawl."
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

//Event Handlers 


function runFaster (player,shield) {
  runFastX=true;
  shield.kill();
}

function jumpHigher (player,wing) {
  jumpHigherX=true;
  wing.kill();
}

function platformConundrum (player,platforms) {
  if (platforms.body.touching.up) {
      platforms.body.velocity.y = -150;
    }
  //smack.play();
}

//Platfrom Moving Mechanics
function platformMover (player,ledge) {
  if (ledge.body.touching.left) {
    ledge.body.velocity.x = 550;
  }
  else if (ledge.body.touching.right) {
    ledge.body.velocity.x = -550;
  }
  else if (ledge.body.touching.up) {
    ledge.body.velocity.y = 100;
    ledge.body.velocity.x = 0;
  }
  else if (ledge.body.touching.down) {
    ledge.body.velocity.y=-550;
  }
}

// Platform Moving Mechanics Level Two
function returnWall (platforms,wall) {
  platforms.body.velocity.setTo(-250,0);
}

//////////////////Game States/////////////////////

function levelTwoWin (player,door) {
  ghettoLoopMechanic--;
  location.reload();
}

//Deathgame State
function deathOne(victim, killer) {
  victim.kill();
  game.state.start('deathState');
}

function deathTwo(victim,killer) {
  victim.kill();
}

//Timer Elements
function updateCounter() {
  total--;
}




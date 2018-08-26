brawl.state2=function(){};
brawl.state2.prototype= {
    preload: function (){
        game.load.script('joystick', 'assets/phaser-virtual-joystick.min.js');
        game.load.atlas('dpad', 'assets/dpad.png', 'assets/dpad.json');
        game.load.image('sky', 'assets/sky3.png');
        game.load.image('ground', 'assets/platform2.png');
        game.load.image('testGround','assets/platformY.png');
        game.load.image('bullet', 'assets/bullets/bullet206.png');
        game.load.image('spikes', 'assets/spikes.png');
        game.load.image('invertedSpikes', 'assets/invertedSpikesTrue.png')
        game.load.image('wing','assets/wings.png');
        game.load.image('shield','assets/shield2.png');
        game.load.image('fallingSpike',"assets/newSpikes.png");
        game.load.image('enemy','assets/trumpface.png');
        game.load.image('invisibleSpikes','assets/invisibleFloorSpikes.png');
        game.load.spritesheet('dude', 'assets/white.png',87.5,93.5);
        game.load.spritesheet('fire','assets/spritefire.png',340,340);
        game.load.audio('musical', ['assets/destination-01.mp3']);
        game.load.audio('smack',['assets/smack-1.mp3']);
        //game.load.spritesheet('secondDude','assets/white.png',47,50,19);
    },
    create: function (){
        console.log("state2");
        //GENERAL MAP SETTINGS
        game.physics.startSystem(Phaser.Physics.ARCADE); // We're going to be using physics, so enable the Arcade Physics system

        // Virtual Joystick

        pad = game.plugins.add(Phaser.VirtualJoystick);
        stick = pad.addDPad(0,0, 150, 'dpad');
        stick.scale= 1.0;
        stick.alignBottomLeft(-20);

        this.buttonA = pad.addButton(500, 520, 'dpad', 'button1-up', 'button1-down');
        this.buttonA.scale=1.5;
        this.buttonA.alignBottomRight(-20);
        this.buttonA.onDown.add(this.jumpMechanic, this);
        

        //Adding Music Functions
        music = game.add.audio('musical');
        smack = game.add.audio('smack');

        //Background music entire game that loops.
        music.loopFull();

        //Visuals of the Game
        
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //Scales our Game
        game.add.sprite(0, 0, 'sky');   // A simple background for our game

        //GROUND PLATFORM FOR MAP
        platforms = game.add.group(); // The platforms group contains the ground and the 2 ledges we can jump on
        platforms.enableBody = true; // We will enable physics for any object that is created in this group

        //MAJOR LEDGE (quantity: one)
        var groundThree = platforms.create(200, 300, 'ground');
        groundThree.body.velocity.setTo(30,100);
        groundThree.body.collideWorldBounds=true;
        groundThree.body.bounce.set(.5);

        // MINOR LEDGES (MOVING; Quantity: 8)
        ledge = game.add.group();
        ledge.enableBody = true;
        game.physics.arcade.enable(ledge)

        //Ledges in loop for randomization.
        for (var i=0;i<8;i++) {
            var randomNumber=Math.floor((Math.random() * 600) + 1);
            var randomNumber2=Math.floor((Math.random() * 500) + 1);
            if (i<4) {
            var randomNumber3=Math.floor((Math.random() * 60) + 1);
            var randomNumber4=Math.floor((Math.random() * 60) + 1);
            }
            else if (i>=4) {
            var randomNumber3=Math.floor((Math.random() * 120) - 240);
            var randomNumber4=Math.floor((Math.random() * 60) - 120);
            }
            ledges=ledge.create(randomNumber,randomNumber2,'testGround');
            ledges.body.velocity.setTo(randomNumber3,randomNumber4);
            ledges.body.collideWorldBounds=true;
            ledges.body.bounce.set(.5);
        }

        //  Our controls.
        cursors = game.input.keyboard.createCursorKeys();

        // PLAYER 1 SETTINGS
        player = game.add.sprite(250, 250, 'dude');
        game.physics.arcade.enable(player); //enables physics for player 1
        player.body.bounce.y = 0;
        player.body.gravity.y = 200;
        player.body.collideWorldBounds = true;

        // PLAYER 1 - ANIMATIONS
        player.animations.add('left', [0,1,2,3,4,5,6,7], 10, true);
        player.animations.add('right', [9,10,11,12,13,14,15], 10, true);

        //PIT OF FIRE (visual; non functional without Ground spikes)
        fire = game.add.group();
        fire.enableBody=true

        for (var i=0;i<12;i++) {
            var newFire=fire.create(i*100,750,'fire');
            newFire.animations.add('move');
            newFire.animations.play('move',5,true);
        }
        // Outside Loop To Put a Fire at the Bottom Left

        var newFire=fire.create(-125,750,'fire');
        newFire.animations.add('move');
        newFire.animations.play('move',5,true);
        
        
        // GROUND SPIKES (to give fire damage)
        spikes = game.add.group();
        spikes.enableBody = true;
        spikes.visible=false;
        var spikesOne = spikes.create(0, 800, 'invisibleSpikes');
        spikesOne.body.immovable = true;


        // ROOF SPIKES
        roofSpikes=game.add.group();
        roofSpikes.enableBody=true;
        var invertedSpikes=roofSpikes.create(0,game.world.height-950,'invertedSpikes');
        invertedSpikes.scale.setTo(1,.5);
        invertedSpikes.body.immovable=true;

        // Trump Sprite, One outside so a Trump Sprite exists at the beginning of the game.

        enemy=game.add.group();
        enemy.enableBody=true;
        game.physics.arcade.enable(enemy);
        var randomNumber=Math.floor((Math.random() * 700) + 1);
        var trumpImage=enemy.create(randomNumber,game.world.height-600,'enemy');
        trumpImage.body.bounce.y = .8;// 0.7 + Math.random() * 0.2;
        trumpImage.body.bounce.x = .8;
        trumpImage.body.gravity.y=10;
        trumpImage.body.collideWorldBounds = true;
        trumpImage.body.velocity.x = 200;

        //Timer for Item and Spike Generation
        
        game.time.events.repeat(Phaser.Timer.SECOND * 30,2, itemGenerator, this);
        game.time.events.repeat(Phaser.Timer.SECOND * 7,10000, spikesFalling, this);
        game.time.events.repeat(Phaser.Timer.SECOND * 15,6, trumpGenerator, this);
        

        function trumpGenerator () {
            var randomNumber=Math.floor((Math.random() * 700) + 1);
            var trumpImage=enemy.create(randomNumber,game.world.height-1000,'enemy');
            trumpImage.body.bounce.y = .8;// 0.7 + Math.random() * 0.2;
            trumpImage.body.bounce.x = .8;
            trumpImage.body.gravity.y=10;
            trumpImage.body.collideWorldBounds = true;
            trumpImage.body.velocity.x = 200;
        }

        //To randomly generate items.
        function itemGenerator() {
            //Subject to change
            wing = game.add.group();
            shield = game.add.group();

            //enable physics
            wing.enableBody = true;
            shield.enableBody = true;

            wing.collideWorldBounds=true;
            shield.collideWorldBounds=true;

            for (var i = 0; i < 2; i++)
            {
            var randomNumberX=Math.floor((Math.random() * 2) + 1);

            if (randomNumberX===1) {
                var randomNumber=Math.floor((Math.random() * 700) + 1);
                var shields = shield.create(randomNumber, game.world.height-1000, 'shield');
                shields.body.gravity.y = 300;
                shields.body.bounce.y = 0.7 + Math.random() * 0.2; //  This just gives each stun a slightly random bounce value
            }

            else if (randomNumberX===2) {
                var randomNumber=Math.floor((Math.random() * 700) + 1);
                var wings = wing.create(randomNumber, game.world.height-1000, 'wing');
                wings.body.gravity.y = 300;
                wings.body.bounce.y = 0.7 + Math.random() * 0.2;
            }
            }
        }

        function spikesFalling () {
            fallingSpikes= game.add.group();
            fallingSpikes.enableBody = true;
            fallingSpikes.collideWorldBounds=true;

            for (var i=0;i<3;i++) {
            var randomNumber=Math.floor((Math.random() * 900) + 1);
            var spikeFall = fallingSpikes.create(randomNumber, game.world.height-1000, 'fallingSpike');
            spikeFall.body.gravity.y = 300;
            }
        }

        //Timer to Keep Track of Score//  Create our Timer

        
        timer = game.time.create(false);

            //  Set a TimerEvent to occur after 2 seconds
        timer.loop(1000, updateCounter, this);

            //  Start the timer running - this is important!
            //  It won't start automatically, allowing you to hook it to button events and the like.
        timer.start();

        //
    
        
        
    },
    update: function (){
            //  Collide the player and the stars with the platforms
        game.physics.arcade.collide(player, platforms,platformConundrum);
        game.physics.arcade.collide(player,ledge, platformMover);
        game.physics.arcade.collide(wing, ledge);
        game.physics.arcade.collide(shield, ledge);
        game.physics.arcade.collide(enemy,ledge);
        game.physics.arcade.collide(enemy,spikes);
        game.physics.arcade.collide(wing, platforms);
        game.physics.arcade.collide(shield, platforms);
        game.physics.arcade.collide(enemy,platforms);
        
        //Black Bars

        game.physics.arcade.collide(enemy,black);
        game.physics.arcade.collide(player,black);
        game.physics.arcade.collide(ledge,black);
        game.physics.arcade.collide(platforms,black);
    


        //Checks to see if overlap in assets.
        //game.physics.arcade.overlap(weapon.bullets, platforms, bulletHitPlatform, null, this);
        game.physics.arcade.overlap(player, enemy, deathOne, null, this);
        game.physics.arcade.overlap(player, spikes, deathOne, null, this);
        game.physics.arcade.overlap(player, roofSpikes, deathOne, null, this);
        game.physics.arcade.overlap(player, fallingSpikes, deathOne, null, this);
        game.physics.arcade.overlap(player, shield, runFaster, null, this);
        game.physics.arcade.overlap(player, wing, jumpHigher, null, this);
        
        game.physics.arcade.overlap(wing, spikes, deathTwo, null, this);
        game.physics.arcade.overlap(shield, spikes, deathTwo, null, this);
        
        game.physics.arcade.overlap(fallingSpikes, ledge, deathTwo, null, this);
        game.physics.arcade.overlap(fallingSpikes, platforms, deathTwo, null, this);



        // Virtual Joystick
        if (stick.isDown)
            {
                if (stick.direction === Phaser.LEFT)
                {
                    player.body.velocity.x = -350;
                    player.animations.play('left');

                    if (runFastX) {
                        player.body.velocity.x = -600;
                        player.animations.play('left');
                    }
                }
                else if (stick.direction === Phaser.RIGHT)
                {
                    player.body.velocity.x = 350;
                    player.animations.play('right');

                    if (runFastX) {
                        player.body.velocity.x = 600;
                        player.animations.play('right');
                    }
                }
            }
        else {
            player.body.velocity.x = 0;
            player.frame=8;
        }


    },

    jumpMechanic: function () {
        if (player.body.touching.down) {
            player.body.velocity.y=-250;
            if (jumpHigherX) {
                player.body.velocity.y = -425;
            }
        }
    },

    render: function () {
        game.debug.text('Survived For: ' + total, 32, 64);
    }
    
    
    
};

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
    if (platforms.body.touching.left) {
        platforms.body.velocity.x = 50;
      }
      else if (platforms.body.touching.right) {
        platforms.body.velocity.x = -50;
      }
      else if (platforms.body.touching.up) {
        platforms.body.velocity.y = -150;
      }
      else if (platforms.body.touching.down) {
        platforms.body.velocity.y=-100;
      }
      smack.play();
}

//Platfrom Moving Mechanics
function platformMover (player,ledge) {
  if (ledge.body.touching.left) {
    ledge.body.velocity.x = 600;
  }
  else if (ledge.body.touching.right) {
    ledge.body.velocity.x = -600;
  }
  else if (ledge.body.touching.up) {
    ledge.body.velocity.y = 150;
  }
  else if (ledge.body.touching.down) {
    ledge.body.velocity.y=-300;
  }
  smack.play();
}

//Removing Elements
function deathOne(victim, killer) {
  victim.kill();
  game.state.start('state3');
}

function deathTwo(victim,killer) {
  victim.kill();
}

//Timer Elements
function updateCounter() {
    total++;
}










brawl.state6=function(){};
brawl.state6.prototype= {
    preload: function (){
        game.load.script('joystick', 'js/phaser-virtual-joystick.min.js');
        game.load.atlas('dpad', 'assets/dpad.png', 'js/dpad.json');
        game.load.image('background', 'assets/sky3.png');
        game.load.image('wing','assets/wings.png');
        game.load.image('shield','assets/shield2.png');
        game.load.image('invertedSpikes', 'assets/invertedSpikesTrue.png')
        game.load.image('fallingSpike',"assets/newSpikes.png");
        game.load.image('enemy','assets/trumpface.png');
        game.load.image('testGround','assets/platformY.png');
        game.load.image('invisibleSpikes','assets/invisibleFloorSpikes.png');
        game.load.image('ground', 'assets/platform2.png');
        game.load.image('wall','assets/wall.png');
        game.load.image('door','assets/door.png');
        game.load.spritesheet('dude', 'assets/white.png',87.5,93.5);
        game.load.spritesheet('fire','assets/spritefire.png',340,340);
    },
    create: function (){
         //GENERAL MAP SETTINGS
        game.physics.startSystem(Phaser.Physics.ARCADE); // We're going to be using physics, so enable the Arcade Physics system
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        // Virtual Joystick

        pad = game.plugins.add(Phaser.VirtualJoystick);
        stick = pad.addDPad(0,0, 150, 'dpad');
        stick.scale= 1.5;
        stick.alignBottomLeft(-40);

        this.buttonA = pad.addButton(500, 520, 'dpad', 'button1-up', 'button1-down');
        this.buttonA.scale=2.0;
        this.buttonA.alignBottomRight(-50);
        this.buttonA.onDown.add(this.jumpMechanic, this);
        

        /*
        music = game.add.audio('musical');

        //Background music entire game that loops.
        music.loopFull();
        */

        ////////////////////Visuals//////////////////
        game.add.sprite(0, 0, 'background');   // A simple background for our game


        // PLAYER SETTINGS
        player = game.add.sprite(0, game.world.centerY+100, 'dude');
        game.physics.arcade.enable(player); //enables physics for player 1
        player.body.bounce.y = 0;
        player.body.gravity.y = 350;
        player.body.collideWorldBounds = true;

        // PLAYER 1 - ANIMATIONS
        player.animations.add('left', [0,1,2,3,4,5,6,7], 10, true);
        player.animations.add('right', [9,10,11,12,13,14,15], 10, true);
        
        //GROUND PLATFORM FOR MAP
        platforms = game.add.group(); // The platforms group contains the ground and the 2 ledges we can jump on
        platforms.enableBody = true; // We will enable physics for any object that is created in this group

        //MAJOR LEDGE (quantity: one)
        ground = platforms.create(0, game.world.centerY+200, 'ground');
        ground.body.velocity.setTo(250,0);
        ground.body.collideWorldBounds=true;
        ground.body.bounce.set(1.0);
        ground.body.immovable=true;

        // MINOR LEDGES (MOVING; Quantity: 8)
        ledge = game.add.group();
        ledge.enableBody = true;
        game.physics.arcade.enable(ledge)

        //Ledges in loop for randomization.
        for (var i=0;i<6;i++) {
            
            var randomNumber=Math.floor((Math.random() * 600) + 1);
            var randomNumber2=Math.floor((Math.random() * 800) + 1);

            if (i<4) {
                var randomNumber3=Math.floor((Math.random() * 300) - 300);
                var randomNumber4=Math.floor((Math.random() * 300) - 200);
            }

            else {
                var randomNumber3=Math.floor((Math.random() * 300) + 1);
                var randomNumber4=Math.floor((Math.random() * 250) + 1);
            }

            var ledges=ledge.create(randomNumber,randomNumber2,'testGround');
            ledges.body.velocity.setTo(randomNumber3,randomNumber4);
            ledges.body.collideWorldBounds=true;
            ledges.body.bounce.set(.92);
        }

        //Roof Spikes
        roofSpikes=game.add.group();
        roofSpikes.enableBody=true;
        var invertedSpikes=roofSpikes.create(0,game.world.height-950,'invertedSpikes');
        invertedSpikes.scale.setTo(1,.5);
        invertedSpikes.body.immovable=true;

        //BUILD THE WALL
        wall=game.add.group();
        wall.enableBody=true;
        var buildTheWall=wall.create(game.world.centerX-40,200,'wall');
        buildTheWall.body.immovable=true;
        

        //Build the Door
        door=game.add.group();
        door.enableBody=true;
        var buildTheDoor=door.create(1350,400,'door');
        buildTheDoor.body.collideWorldBounds=true;
        buildTheDoor.body.immovable=true;
        buildTheDoor.body.bounce.set(1.0);
        buildTheDoor.body.velocity.setTo(0,400);

        //PIT OF FIRE (visual; non functional without Ground spikes)
        fire = game.add.group();

        for (var i=0;i<12;i++) {
            var newFire=fire.create(i*100,750,'fire');
            newFire.animations.add('move');
            newFire.animations.play('move',5,true);
        }
        // Outside Loop To Put a Fire at the Bottom Left

        var newFire=fire.create(-125,750,'fire');
        newFire.animations.add('move');
        newFire.animations.play('move',5,true);

        //Give Fire Damage
        spikes = game.add.group();
        spikes.enableBody = true;
        spikes.visible=false;
        spikes.create(0, 850, 'invisibleSpikes');

        //Enemy Trump (Just One for This Stage)
        enemy=game.add.group();
        enemy.enableBody=true;
        game.physics.arcade.enable(enemy);
        var trumpImage=enemy.create(800,game.world.height-600,'enemy');
        trumpImage.body.bounce.y = .8;
        trumpImage.body.bounce.x = .8;
        trumpImage.body.gravity.y=10;
        trumpImage.body.collideWorldBounds = true;
        trumpImage.body.velocity.x = 200;

        // Item Generation
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

        //Spikes Falling
        function spikesFalling () {
            fallingSpikes= game.add.group();
            fallingSpikes.enableBody = true;
            fallingSpikes.collideWorldBounds=true;

            for (var i=0;i<3;i++) {
            var randomNumber=Math.floor((Math.random() * 900) + 1);
            var spikeFall = fallingSpikes.create(randomNumber, game.world.height-1000, 'fallingSpike');
            spikeFall.body.gravity.y = 500;
            }
        }

        //Timer Events for Traps and Items
        game.time.events.repeat(Phaser.Timer.SECOND * 10,3, itemGenerator, this);
        game.time.events.repeat(Phaser.Timer.SECOND * 6,50, spikesFalling, this);

    },
    update: function (){

        //Player Collision Mechanics
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(player,wall);
        game.physics.arcade.collide(player,ledge,platformMover);

        //Ledge and Item Collision Mechanics
        game.physics.arcade.collide(wing, ledge);
        game.physics.arcade.collide(shield, ledge);
        game.physics.arcade.collide(enemy,ledge);
        game.physics.arcade.collide(wing, platforms);
        game.physics.arcade.collide(shield, platforms);
        game.physics.arcade.collide(enemy,platforms);

        //Wall Collision Mechanics
        game.physics.arcade.collide(ledge,wall);
        game.physics.arcade.collide(enemy,wall);
        game.physics.arcade.overlap(platforms,wall, returnWall, null, this);

        //Player Overlapping Mechanics (Death and Items).
        game.physics.arcade.overlap(player, enemy, deathOne, null, this);
        game.physics.arcade.overlap(player, spikes, deathOne, null, this);
        game.physics.arcade.overlap(player, roofSpikes, deathOne, null, this);
        game.physics.arcade.overlap(player, fallingSpikes, deathOne, null, this);
        game.physics.arcade.overlap(player, shield, runFaster, null, this);
        game.physics.arcade.overlap(player, wing, jumpHigher, null, this);
        game.physics.arcade.overlap(fallingSpikes, ledge, deathTwo, null, this);
        game.physics.arcade.overlap(fallingSpikes, platforms, deathTwo, null, this);
        
        //Objects dying to other objects mechanics
        game.physics.arcade.overlap(wing, spikes, deathTwo, null, this);
        game.physics.arcade.overlap(shield, spikes, deathTwo, null, this);
        game.physics.arcade.overlap(fallingSpikes,wall,deathTwo,null,this);

        //To Win Game
        game.physics.arcade.overlap(player,door, levelTwoWin, null, this);
        
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
            player.body.velocity.y=-350;
            if (jumpHigherX) {
                player.body.velocity.y = -500;
            }
        }
    }
    
};


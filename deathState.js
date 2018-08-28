brawl.state4=function(){};
brawl.state4.prototype= {
    preload: function (){
        game.load.image('background-three', 'assets/trumpBackground.png');
    },
    create: function (){

        //Remove Life Function
        lives--;
        
        //Destroying Buttons
        pad.destroy();

        //Art
        game.add.sprite(0,200, 'background-three');
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        console.log("state3");

        text = game.add.text(300, 220, "You Have "+lives+" Lives Left");
        text.anchor.set(0.295);
        text.align = 'center';

        //	Font style
        text.font = 'Arial Black';
        text.fontSize = 50;
        text.fill= "#000000";
        text.fontWeight = 'bold';

        //Restart Game When You Run out of Lives
        if (lives===0) {
            location.reload();
        }

    },
    update: function (){
      if (this.game.input.activePointer.isDown)
      {
        if (ghettoLoopMechanic===10) {
            game.state.start('levelOne',true,true);
            total=30;
            music.destroy();
        }

        else if (ghettoLoopMechanic===9) {
            game.state.start('levelTwo',true,true);
            music.destroy();
        }
      }

    }
};
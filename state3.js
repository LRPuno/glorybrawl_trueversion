brawl.state3=function(){};
brawl.state3.prototype= {
    preload: function (){
        game.load.image('background-three', 'assets/trumpBackground.png');
    },
    create: function (){
        
        //Destroying Buttons
        pad.destroy();

        //Destroy Timers

        //Art
        game.add.sprite(200,200, 'background-three');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        console.log("state3");

        // Score

        text = game.add.text(300, 240, "You Survived: "+total+" Seconds");
        text.anchor.set(0.295);
        text.align = 'center';

        //	Font style
        text.font = 'Arial Black';
        text.fontSize = 20;
        text.fill= "#000000";
        text.fontWeight = 'bold';


    },
    update: function (){
      if (this.game.input.activePointer.isDown)
      {
        game.state.start('state2',true,true);
        total=0;
      }

    }
};

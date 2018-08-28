brawl.state5=function(){};
brawl.state5.prototype= {
    preload: function (){
        game.load.image('background-one', 'assets/trumpFirstBackground.jpg');
    },
    create: function (){
        game.state.remove('levelOne');
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.add.sprite(0, 0, 'background-one');   // A simple background for our game
    },
    update: function (){
        if (this.game.input.activePointer.isDown)
        {
          //Setting Everything Back to Null.
          player=null;
          smack=null;
          music=null;
          platforms=null;
          ledge=null;
          roofSpikes=null;
          fallingSpikes=null;
          spikes=null;
          enemy=null;
          fire=null;
          wing=null;

          game.state.start('levelTwo',true,true);
        }
    }
};
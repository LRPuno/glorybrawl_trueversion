brawl.state2=function(){};
brawl.state2.prototype= {
    preload: function (){
        game.load.image('background', 'assets/instructions.png');
    },
    create: function (){
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.add.sprite(0, 0, 'background');   // A simple background for our game
    },
    update: function (){
        if (this.game.input.activePointer.isDown)
        {
          game.state.start('levelOne');
        }
    }
    
};


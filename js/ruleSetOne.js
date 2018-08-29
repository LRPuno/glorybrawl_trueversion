brawl.state2=function(){};
brawl.state2.prototype= {
    preload: function (){
        game.load.image('background', 'assets/instructions.png');
    },
    create: function (){
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.add.sprite(0, 0, 'background');   // A simple background for our game
        text = game.add.text(350, 100, "Rules are simple. Survive.\n"+"Controls on the Bottom")
        text.align = 'center';

        //	Font style
        text.font = 'Arial Black';
        text.fontSize = 50;
        text.fill= "#000000";
        text.fontWeight = 'bold';
    },
    update: function (){
        if (this.game.input.activePointer.isDown)
        {
          game.state.start('levelOne');
        }
    }
    
    
};


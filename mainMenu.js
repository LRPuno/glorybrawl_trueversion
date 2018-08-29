var brawl= {};
brawl.state1=function(){};
brawl.state1.prototype= {
    preload: function (){
        game.load.image('background-one', 'assets/trumpFirstBackground.jpg');
    },
    create: function (){

        //Trump Background
        game.add.sprite(600,550,'background-one');
        //Scaling
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //Adding Cool Looking Text
        text = game.add.text(40, 50, '', { font: "50px Arial", fill: "#19de65" });
        nextLine();
        
        //Skip Written Already.
        var text2 = game.add.text(720,500,"Tap Screen to Skip/Play")

        //	Font style
        text2.font = 'Arial';
        text2.fontSize = 35;
        text2.fill= "#19de65";
        text2.fontWeight = 'bold';

    },
    update: function (){
       if (this.game.input.activePointer.isDown)
      {
        this.state=null;
        game.state.start('ruleSetOne');
      }
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
          this.state=null;
          game.state.start('levelTwo');
      }
    }
};



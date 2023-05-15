export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MenuScene"
        })

    }
    preload() {
        this.load.html('Room code', 'index.html')
        
    }

    create() {
       
        

        let makeGame = this.add.text(100, 150, "Click here to create a game")
        let joinGame = this.add.text(100, 50, "Enter a room key here, to join a game")

        jQuery('.Username').hide();
        jQuery('.Room_code').show();

      
        

    
}
}
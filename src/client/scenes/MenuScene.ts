

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
       
        
        const roomCodeInput = this.add.dom(75, 105).createFromCache("Room code")
        let makeGame = this.add.text(100, 50, "Click here to create a game")
        let joinGame = this.add.text(100, 150, "Enter a room key here, to join a game")



      
        

    
}
}

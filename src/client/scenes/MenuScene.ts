

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MenuScene"
        })

    }
    preload() {
        this.load.html('roomCode', 'index.html')
        
    }

    create() {
       
        
        const roomCodeInput = this.add.dom(75, 105).createFromCache("roomCode")
        let makeGame = this.add.text(25, 50, "Click here to create a game")
        let joinGame = this.add.text(75, 50, "Enter a room key here to join a game")



      
        

    }
}

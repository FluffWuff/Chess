import { ServerMessage } from "../../data/Data.js"
import { WebSocketListener } from "../WebSocketController.js"
import { Board, Field } from "../chess/Board.js"


export class StartScene extends Phaser.Scene implements WebSocketListener {

    constructor() {
        super({
            key: "StartScene"
        })
    }

    
    preload() {
        this.load.html('Username', 'index.html')
        var enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }
    
    create() {
        let text = this.add.text(100, 100, "Chess") 
        
        
        let caption = this.add.text(100, 300, "Press Enter to start")
        this.input.keyboard.on('keydown-ENTER', function() {
            let username = "" + $('#username').val();
            if(username.length > 0){
                console.log('From StartScene to MenuScene')
                this.scene.start('MenuScene')
            }
        }, this)
        
        jQuery('.Username').show();
        jQuery('.Room_code').hide();
        
    }
    
    onMessage(message: ServerMessage): void {
        //throw new Error("Method not implemented.")
    }
}


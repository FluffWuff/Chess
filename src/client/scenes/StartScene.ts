import { ClientMessageNewClient, ServerMessage } from "../../data/Data.js"
import { WebSocketController, WebSocketListener } from "../WebSocketController.js"
import { Board, Field } from "../chess/Board.js"


export class StartScene extends Phaser.Scene {

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
        let that = this
        this.input.keyboard.on('keydown-ENTER', function() {
            let username = "" + $('#username').val();
            if(username.length > 0){
                console.log('From StartScene to MenuScene')
                //Open WebSocket and register new client
                let webSocketController = new WebSocketController((controller: WebSocketController) => {
                    let message: ClientMessageNewClient = {
                        type: "newClient",
                        name: username
                    }
                    controller.send(message);
                })

                that.scene.start('MenuScene', {webSocketController: webSocketController})

            }
        }, this)
        
        jQuery('.Username').show();
        jQuery('.Room_code').hide();
        
    }
    
}


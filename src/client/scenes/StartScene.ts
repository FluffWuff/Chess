import { ServerMessage } from "../../data/Data.js"
import { WebSocketListener } from "../WebSocketController.js"

export class StartScene extends Phaser.Scene implements WebSocketListener{
    
    constructor() {
        super({
            key: "StartScene"
        })
    }


    preload() {
        
    }

    create() {
        let text = this.add.text(100, 100, "Chess")        
    }

    onMessage(message: ServerMessage): void {
        
    }

}
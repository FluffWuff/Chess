
import { ServerMessage } from "../../data/Data.js"
import { WebSocketListener } from "../WebSocketController.js"
import { Board, Field } from "./Board.js"

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
        new Board(this)
    }

    onMessage(message: ServerMessage): void {
        
    }

}
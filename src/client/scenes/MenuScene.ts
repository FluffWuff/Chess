import { ServerMessage } from "../../data/Data.js";
import { WebSocketController, WebSocketListener } from "../WebSocketController.js";
import { Button } from "./Button.js";

export class MenuScene extends Phaser.Scene implements WebSocketListener {

    webSocketController: WebSocketController

    constructor() {
        super({
            key: "MenuScene"
        })
    }

    init(data) {
        this.webSocketController = data.webSocketController
        this.webSocketController.messageListeners.push(this)
    }

    preload() {
        this.load.html('Room code', 'index.html')
    }

    create() {
        let joinGame = this.add.text(100, 50, "Enter a room key here, to join a game")

        jQuery('.Username').hide();
        jQuery('.Room_code').show();

        let that = this
        this.input.keyboard.on('keydown-ENTER', function () {
            let roomCode = "" + $('#roomCode').val();
            if (roomCode.length > 0) {
                console.log('From MenuScene to GameScene')
                //enterRoomCode packet
                that.webSocketController.send({
                    type: "enterRoomCode",
                    roomID: roomCode
                })
            }
        })

        let button = new Button(280, 150, 'Click here to create game', this, () => {
            console.log('New game room opened')
            //send 
            that.webSocketController.send({
                type: "newRoom"
            })
        });

    }

    onMessage(message: ServerMessage): void {
        //imlement invalidRoomCode, validRoomCpde
        switch (message.type) {
            case "newRoom":
                let roomCodeText = this.add.text(500, 150, "Dein Roomcode ist: " + message.roomID + ", erwarte einen weiteren Spieler")
                break
            case "invalidRoomCode":
                break
            case "startingGame":
                jQuery('.Room_code').hide();
                this.scene.start("GameScene", {webSocketController: this.webSocketController, gameInfo: message})
        }
    }

}

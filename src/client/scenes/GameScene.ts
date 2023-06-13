import { ClientMessageNewClient, ServerMessage } from "../../data/Data.js"
import { Board, Field } from "../chess/Board.js"
import { WebSocketListener, WebSocketController } from "../WebSocketController.js"

export class GameScene extends Phaser.Scene implements HoverListener, WebSocketListener {

    markedField: Field = null

    board: Board = null

    webSocketController: WebSocketController

    constructor() {
        super({
            key: "GameScene"
        })
    }
    
    init(data) {
        this.webSocketController = data.webSocketController
        this.webSocketController.messageListeners.push(this)
    }

    preload() {
        this.load.spritesheet("figures", "assets/Spritesheet.png", {
            frameWidth: 314,
            frameHeight: 302
        })
    }
    
    create() {
        let text = this.add.text(100, 100, "Chess")
        this.board = new Board(this)
    }

    onOver(field: Field) {
        field.square.setFillStyle(0xFFF000)
    }

    onDown(field: Field) {
        //if(field.figure == null) return
        if (this.markedField == null) {
            field.square.setFillStyle(0xFF0000) //select figure to move
            this.markedField = field
        } else {
            let isIlegal = false
            if (this.markedField == field) {
                isIlegal = true
            }

            if (field.figure != null) {
                console.log(1)
                if (field.figure.isWhitePiece == this.markedField.figure.isWhitePiece) // checks if pieces are same color: false == false or true == true
                    isIlegal = true
                else {
                    //schmeißen:
                }
            }


            if(isIlegal) {
                field.square.setFillStyle(field.originalColor)
                this.markedField.square.setFillStyle(this.markedField.originalColor)
                this.markedField = null
                return 
            }

            field.figure = this.markedField.figure

            let diffX = field.relativePosX - this.markedField.relativePosX
            let diffY = field.relativePosY - this.markedField.relativePosY

            //for (var i = 0; i < Math.abs(diffX); i++) {
            //    for (var j = 0; j < Math.abs(diffY); j++) {
            //        console.log(diffX + " " + diffY)
            //        console.log((this.markedField.relativePosX + i - 1) + " " + (this.markedField.relativePosY + j - 1))
            //        if (this.board.fieldList[this.markedField.relativePosX + i - 1][this.markedField.relativePosY + j - 1].figure == null) {
            //            this.markedField.square.setFillStyle(this.markedField.originalColor)
            //            this.markedField = null
            //            return
            //        }
            //    }
            //}

            let isSuccessful = field.figure.moveFigure(field.relativePosX, field.relativePosY)

            
            this.markedField.square.setFillStyle(this.markedField.originalColor)
            if (isSuccessful) {
                this.markedField.figure = null

                //send move to server
                this.webSocketController.send({
                    type: "sendChessMove",
                    //roomID: "",
                    from: this.markedField.relativePosX+":"+this.markedField.relativePosY,
                    to: field.relativePosX+":"+field.relativePosY
                })
            }
            this.markedField = null

        }
    }

    renderReceivedChessMove(from: string, to: string) {
        let fromX = from.split(":")[0]
        let fromY = from.split(":")[1]

        let toX = +to.split(":")[0]
        let toY = +to.split(":")[1]

        let fromField: Field = this.board.fieldList[fromX][fromY]
        let toField: Field = this.board.fieldList[toX][toY]

        toField.figure = fromField.figure
        fromField.figure = null
        toField.figure.moveFigure(toX, toY)
        console.log("Renderd move by server: " + from + " " + to)
    }

    onOut(field: Field) {
        if (field != this.markedField || this.markedField == null) field.square.setFillStyle(field.originalColor)
    }

    onMessage(message: ServerMessage): void {
        switch(message.type) {
            case "sendChessMove":
                this.renderReceivedChessMove(message.from, message.to)
                break
        }
    }

}

interface HoverListener {
    onOver(field: Field)
    onDown(field: Field)
    onOut(field: Field)

}



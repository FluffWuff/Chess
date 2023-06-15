import { ClientMessageNewClient, ServerMessage } from "../../data/Data.js"
import { Board, Field } from "../chess/Board.js"
import { WebSocketListener, WebSocketController } from "../WebSocketController.js"
import { ServerMessageNewClient, ServerMessageStartingGame } from '../../data/Data.js';
import { FigureType } from "../chess/Figure.js";

export class GameScene extends Phaser.Scene implements HoverListener, WebSocketListener {

    markedField: Field = null

    board: Board = null

    webSocketController: WebSocketController
    roomID: string
    whoIsMoveText: Phaser.GameObjects.Text
    whoIsMove: boolean = false
    playerPiece: boolean

    constructor() {
        super({
            key: "GameScene"
        })
    }

    init(data: { webSocketController: WebSocketController, gameInfo: ServerMessageStartingGame }) {
        this.webSocketController = data.webSocketController
        this.webSocketController.messageListeners.push(this)
        this.roomID = data.gameInfo.roomID
        this.add.text(100, 50, "Spieler2: " + data.gameInfo.blackPiecePlayer)
        this.add.text(100, 1000, "Spieler1: " + data.gameInfo.whitePiecePlayer)
        this.whoIsMoveText = this.add.text(100, 250, "Weiß am Zug")
        this.whoIsMove = false
        this.playerPiece = data.gameInfo.whichPiece
    }

    preload() {
        this.load.spritesheet("figures", "assets/Spritesheet.png", {
            frameWidth: 314,
            frameHeight: 302
        })
    }

    create() {
        //let text = this.add.text(100, 100, "Chess")
        this.board = new Board(this)
    }

    onOver(field: Field) {
        field.square.setFillStyle(0xFFF000)
    }

    onDown(field: Field) {
        //if(field.figure == null) return
        if (this.playerPiece != this.whoIsMove) {
            return;
        }
        if (this.markedField == null) {
            field.square.setFillStyle(0xFF0000) //select figure to move
            this.markedField = field
        } else {
            let isIlegal = false
            if (this.markedField == field) { // !this.markedField.figure.isWhitePiece != this.playerPiece
                isIlegal = true
            }

            if (field.figure != null) {
                console.log(1)
                if (field.figure.isWhitePiece == this.markedField.figure.isWhitePiece) // checks if pieces are same color: false == false or true == true
                    isIlegal = true
            }

            let diffX = field.relativePosX - this.markedField.relativePosX
            let diffY = field.relativePosY - this.markedField.relativePosY

            if(this.markedField.figure.figureType == FigureType.WHITE_PAWN && diffX == 0 && diffY == -1 && field.figure != null) {
                isIlegal = true
            }

            if(this.markedField.figure.figureType == FigureType.BLACK_PAWN && diffX == 0 && diffY == 1 && field.figure != null) {
                isIlegal = true
            }

            if (isIlegal) {
                field.square.setFillStyle(field.originalColor)
                this.markedField.square.setFillStyle(this.markedField.originalColor)
                this.markedField = null
                return
            }

            if(field.figure != null) {
                field.figure.sprite.destroy()
            }
            field.figure = this.markedField.figure


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
                    roomID: this.roomID,
                    from: this.markedField.relativePosX + ":" + this.markedField.relativePosY,
                    to: field.relativePosX + ":" + field.relativePosY,
                    whichPlayer: this.playerPiece
                })
            }
            this.markedField = null

        }
    }

    renderReceivedChessMove(from: string, to: string, whichPlayer: boolean) {
        let isRenderd = false
        if (whichPlayer == this.playerPiece)
            isRenderd = true

        if (!isRenderd) {
            let fromX = +from.split(":")[0]
            let fromY = +from.split(":")[1]

            let toX = +to.split(":")[0]
            let toY = +to.split(":")[1]

            console.log(fromX + " " + toX)
            console.log(fromY + " " + toY)


            let fromField: Field = this.board.fieldList[fromX][fromY]
            let toField: Field = this.board.fieldList[toX][toY]

            if(toField.figure != null) {
                toField.figure.sprite.destroy()
            }
            toField.figure = fromField.figure
            fromField.figure = null
            toField.figure.moveFigure(toX, toY)
            console.log("Renderd move by server: " + from + " " + to)


        }

        this.whoIsMove = !this.whoIsMove
        if (this.whoIsMove) {
            this.whoIsMoveText.setText("Schwarz ist am Zug")
        } else {
            this.whoIsMoveText.setText("Weiß ist am Zug")
        }
    }

    checkForCheck() {
        
    }

    checkForCheckMate() {

    }

    checkForMate() {

    }

    onOut(field: Field) {
        if (field != this.markedField || this.markedField == null) field.square.setFillStyle(field.originalColor)
    }

    onMessage(message: ServerMessage): void {
        switch (message.type) {
            case "sendChessMove":
                this.renderReceivedChessMove(message.from, message.to, message.whichPlayer)
                break
        }
    }

}

interface HoverListener {
    onOver(field: Field)
    onDown(field: Field)
    onOut(field: Field)

}



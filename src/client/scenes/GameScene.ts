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
    statusMessage: Phaser.GameObjects.Text

    isInCheck: [boolean, boolean] = [false, false]

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

            if (this.markedField.figure.figureType == FigureType.WHITE_PAWN && diffX == 0 && diffY == -1 && field.figure != null) {
                isIlegal = true
            }

            if (this.markedField.figure.figureType == FigureType.BLACK_PAWN && diffX == 0 && diffY == 1 && field.figure != null) {
                isIlegal = true
            }

            if (isIlegal) {
                field.square.setFillStyle(field.originalColor)
                this.markedField.square.setFillStyle(this.markedField.originalColor)
                this.markedField = null
                return
            }

            if (field.figure != null) {
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

                let kingPos = this.getKingPos(!this.playerPiece) //check for other piece
                this.checkForCheck(kingPos[0], kingPos[1], !this.playerPiece)

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

            if (toField.figure != null) {
                toField.figure.sprite.destroy()
            }
            toField.figure = fromField.figure
            fromField.figure = null
            toField.figure.moveFigure(toX, toY)
            console.log("Renderd move by server: " + from + " " + to)

            let kingPos = this.getKingPos(this.playerPiece)
            this.checkForCheck(kingPos[0], kingPos[1], this.playerPiece)
        }

        this.whoIsMove = !this.whoIsMove
        if (this.whoIsMove) {
            this.whoIsMoveText.setText("Schwarz ist am Zug")
        } else {
            this.whoIsMoveText.setText("Weiß ist am Zug")
        }
    }

    getKingPos(color: boolean): [number, number] {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                let field = this.board.fieldList[i][j]
                if (field.figure == null) continue
                if (field.figure.figureType == FigureType.KING && !field.figure.isWhitePiece == color)
                    return [field.relativePosX, field.relativePosY]
            }
        }
        return [0, 0]
    }

    // Look at Chess.png to see explanation
    checkForCheck(kingX: number, kingY: number, color: boolean) {
        console.log("KingX: " + kingX + " kingY: " + kingY)
        let checkField: Field = null
        let checks: Field[] = []

        // -> ^= bis bedingung
        //Diagonale checks:
        //1.: -x, -y -> x == 0 || y == 0
        for (var dX = kingX - 1; dX >= 0; dX--) {
            for (var dY = kingY - 1; dY >= 0; dY--) {
                //console.log(dX + " " + dY)
                checkField = this.board.fieldList[dX][dY]
                if (checkField.figure == null) continue
                if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.BISHOP) && !checkField.figure.isWhitePiece != color) {
                    checks.push(checkField)
                    console.log("1 New Check: " + dX + " " + dY)
                    break
                }
                if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                    console.log("1 Same color piece")
                    break
                }
            }
        }
        checkField = null

        //2.: +x, -y -> x == 7 || y == 0
        for (var dX = kingX + 1; dX <= 7; dX++) {
            for (var dY = kingY - 1; dY >= 0; dY--) {
                checkField = this.board.fieldList[dX][dY]
                if (checkField.figure == null) continue
                if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.BISHOP) && !checkField.figure.isWhitePiece != color) {
                    checks.push(checkField)
                    console.log("2 New Check: " + dX + " " + dY)
                    break
                }
                if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                    console.log("2 Same color piece")

                    break
                }
            }
        }
        checkField = null

        //3. +x, + y -> x == 7 || y == 7
        for (var dX = kingX + 1; dX <= 7; dX++) {
            for (var dY = kingY + 1; dY <= 7; dY++) {
                checkField = this.board.fieldList[dX][dY]
                if (checkField.figure == null) continue
                if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.BISHOP) && !checkField.figure.isWhitePiece != color) {
                    checks.push(checkField)
                    console.log("3 New Check: " + dX + " " + dY)
                    break
                }
                if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                    console.log("3 Same color piece")

                    break
                }
            }
        }
        checkField = null

        //4. -x, +y -> x == 0 || y == 7
        for (var dX = kingX - 1; dX >= 0; dX--) {
            for (var dY = kingY + 1; dY <= 7; dY++) {
                checkField = this.board.fieldList[dX][dY]
                if (checkField.figure == null) continue
                if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.BISHOP) && !checkField.figure.isWhitePiece != color) {
                    checks.push(checkField)
                    console.log("4 New Check: " + dX + " " + dY)
                    break
                }
                if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                    console.log("4 Same color piece " + dX + " " + dY)

                    break
                }
            }
        }
        checkField = null

        //Horizontaler check:
        //5.: -x -> x == 0
        for (var dX = kingX - 1; dX >= 0; dX--) {
            checkField = this.board.fieldList[dX][kingY]
            if (checkField.figure == null) continue
            if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.ROOK) && !checkField.figure.isWhitePiece != color) {
                checks.push(checkField)
                console.log("5 New Check: " + dX + " " + kingY)
                break
            }
            if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                console.log("5 Same color piece")

                break
            }
        }
        checkField = null

        //6.: +x -> x == 7
        for (var dX = kingX + 1; dX <= 7; dX++) {
            checkField = this.board.fieldList[dX][kingY]
            if (checkField.figure == null) continue
            if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.ROOK) && !checkField.figure.isWhitePiece != color) {
                checks.push(checkField)
                console.log("6 New Check: " + dX + " " + kingY)
                break
            }
            if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                console.log("6 Same color piece")

                break
            }
        }

        //Vertikaler check:
        //7.: -y -> y == 0
        for (var dY = kingY - 1; dY >= 0; dY--) {
            checkField = this.board.fieldList[kingX][dY]
            if (checkField.figure == null) continue
            if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.ROOK) && !checkField.figure.isWhitePiece != color) {
                checks.push(checkField)
                console.log("7 New Check: " + kingX + " " + dY)
                break
            }
            if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                console.log("7 Same color piece")

                break
            }
        }
        checkField = null

        //8.: +y -> y == 7
        for (var dY = kingY + 1; dY <= 7; dY++) {
            checkField = this.board.fieldList[kingX][dY]
            if (checkField.figure == null) continue
            if ((checkField.figure.figureType == FigureType.QUEEN || checkField.figure.figureType == FigureType.ROOK) && !checkField.figure.isWhitePiece != color) {
                checks.push(checkField)
                console.log("8 New Check: " + kingX + " " + dY)
                break
            }
            if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                console.log("8 Same color piece")

                break
            }
        }
        checkField = null

        //Springer check:
        //9: Alle Springer positionen checken:
        let knightMoves = [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, 1], [-2, -1]]
        for (var i = 0; i < knightMoves.length; i++) {
            let knightMove = knightMoves[i]
            if (kingX + knightMove[0] > 7 || kingX + knightMove[0] < 0 || kingY + knightMove[1] > 7 || kingY + knightMove[1] < 0) {
                continue
            }
            checkField = this.board.fieldList[kingX + knightMove[0]][kingY + knightMove[1]]
            if (checkField.figure == null) continue
            if (checkField.figure.figureType == FigureType.KNIGHT && !checkField.figure.isWhitePiece != color) {
                checks.push(checkField)
                console.log("9 New Check: " + kingX + knightMove[0] + " " + kingY + knightMove[1])
                break
            }
            if (!checkField.figure.isWhitePiece == color) { //field contains same color piece
                console.log("9 ame color piece")

                break
            }
        }
        if (checks.length > 0) {
            let colorText = ""
            if(color) colorText = "Schwarz"
            else colorText = "Weiß"
            if(this.statusMessage == null) {
                this.statusMessage = this.add.text(100, 300, "Schach für " + colorText)
            } else {
                this.statusMessage.setText("Schach für " + colorText)
            }
            this.isInCheck = [true, color]
            console.log(checks)
        }
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



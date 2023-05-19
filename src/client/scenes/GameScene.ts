import { Board, Field } from "./Board.js"
import { Figure } from "./Figure"

export class GameScene extends Phaser.Scene implements HoverListener {

    markedField: Field = null

    board: Board = null

    constructor() {
        super({
            key: "StartScene"
        })
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
            this.markedField = field
            field.square.setFillStyle(0xFF0000) //select figure to move
        } else {
            if (this.markedField == field) {
                field.square.setFillStyle(field.originalColor)
                return
            }
            field.figure = this.markedField.figure

            let diffX = field.relativePosX - this.markedField.relativePosX
            let diffY = field.relativePosY - this.markedField.relativePosY
            //for (var i = 0; i < Math.abs(diffX); i++) {
            //    for (var j = 0; j < Math.abs(diffY); j++) {
            //        //console.log(diffX + " " + diffY)
            //        console.log((this.markedField.relativePosX + i-1) + " " + (this.markedField.relativePosY + j-1))
            //        if (this.board.fieldList[this.markedField.relativePosX + i-1][this.markedField.relativePosY + j-1].figure == null) {
            //            this.markedField.square.setFillStyle(this.markedField.originalColor)
            //            this.markedField = null
            //            return
            //        }
            //    }
            //}

            let isSuccessful = field.figure.moveFigure(field.relativePosX, field.relativePosY)

            this.markedField.square.setFillStyle(this.markedField.originalColor)
            if (isSuccessful) this.markedField.figure = null
            this.markedField = null
        }


    }

    onOut(field: Field) {
        if (field != this.markedField) field.square.setFillStyle(field.originalColor)

    }
}

interface HoverListener {
    onOver(field: Field)
    onDown(field: Field)
    onOut(field: Field)

}



import { Board, Field } from "./Board.js"
import { Figure } from "./Figure"

export class GameScene extends Phaser.Scene implements HoverListener {

    markedField: Field = null

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
        let board = new Board(this)
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
            
            field.figure.moveFigure(field.relativePosX, field.relativePosY)
            field.figure.posX = field.relativePosX
            field.figure.posY = field.relativePosY

            this.markedField.figure = null
            this.markedField = null
        }


    }

    onOut(field: Field) {
        field.square.setFillStyle(field.originalColor)

    }
}

interface HoverListener {
    onOver(field: Field)
    onDown(field: Field)
    onOut(field: Field)

}



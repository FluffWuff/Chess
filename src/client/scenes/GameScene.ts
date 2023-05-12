import { Board, Field } from "./Board.js"

export class GameScene extends Phaser.Scene implements HoverListener {

    clickedField: Field = null

    constructor() {
        super({
            key: "StartScene"
        })
    }



    preload() {

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
        if (this.clickedField == null) {
            this.clickedField = field
            field.square.setFillStyle(0xFF0000) //select figure to move
        } else {
            if (this.clickedField == field) {
                field.square.setFillStyle(field.originalColor)
                return
            }
            //check if move is legal
            field.figure = this.clickedField.figure
            field.figure.posX = field.relativePosX
            field.figure.posY = field.relativePosY
            console.log("Moved to: " + field.relativePosX + " " + field.relativePosY)
            this.clickedField.figure = null
            this.clickedField = null
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



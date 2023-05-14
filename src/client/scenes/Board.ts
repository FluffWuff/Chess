import { Figure } from "./Figure.js"
import { GameScene } from "./GameScene.js"

export class Board {


    /*
    * LowerCase: white pieces
    * UpperCase: black pieces
    * 
    */
    stringFieldList: string[] = [
        "RSBQKBSR",
        "PPPPPPPP",
        "",
        "",
        "",
        "",
        "pppppppp",
        "rsbqkbsr"
    ]

    letterToSpriteIndex = {
        "k": 0,
        "K": 1,
        "q": 2,
        "Q": 3,
        "b": 4,
        "B": 5,
        "s": 6,
        "S": 7,
        "r": 8,
        "R": 9,
        "p": 10,
        "P": 11,
        "": -1
    }

    fieldList: Field[][] = []
    constructor(scene: GameScene) {
        for (let i = 0; i < 8; i++) {
            this.fieldList[i] = []
            for (let n = 0; n < 8; n++) {
                let color: number = 0xAAAAAA
                if ((n % 2 == 0 || i % 2 != 0) && (i % 2 == 0 || n % 2 != 0)) {
                    color = 0xFFFFFF
                }
                this.fieldList[i][n] = new Field((1920 / 2) - (4 * 128) + i * 128, 100 + n * 128, scene, color, i, n, this.letterToSpriteIndex[this.stringFieldList[n].charAt(i)])
            }
        }

    }


}

export class Field {
    figure: Figure
    square: Phaser.GameObjects.Rectangle
    originalColor: number

    constructor(public xPos: number, public yPos: number, scene: GameScene, color: number, public relativePosX: number, public relativePosY: number, spriteIndex: number) {
        
        let square = scene.add.rectangle(xPos, yPos, 128, 128)
        square.setDisplayOrigin(0,0 )
        square.setFillStyle(color)
        this.square = square
        this.originalColor = color
        if(spriteIndex != -1) this.figure = new Figure(scene, xPos, yPos, relativePosX, relativePosY, spriteIndex)
        this.square.setInteractive().on("pointerover", (pointer, localX, localY, event) => {
            scene.onOver(this)
        })
        this.square.setInteractive().on("pointerdown", (pointer, localX, localY, event) => {
            scene.onDown(this)
        })
        this.square.setInteractive().on("pointerout", (pointer, localX, localY, event) => {
            scene.onOut(this)
        })
    }

}



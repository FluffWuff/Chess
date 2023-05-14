import { Figure } from "./Figure.js"
import { GameScene } from "./GameScene.js"

export class Board {
    fieldList: Field[][] = []
    constructor(scene: GameScene) {
        for (let i = 0; i < 8; i++) {
            this.fieldList[i] = []
            for (let n = 0; n < 8; n++) {
                let color: number = 0x000000
                if ((n % 2 == 0 || i % 2 != 0) && (i % 2 == 0 || n % 2 != 0)) {
                    color = 0xFFFFFF
                }
                this.fieldList[i][n] = new Field((1920 / 2) - (4 * 128) + i * 128, 100 + n * 128, scene, color, i, n)
            }
        }

    }


}

export class Field {
    figure: Figure
    square: Phaser.GameObjects.Rectangle
    originalColor: number

    constructor(public xPos: number, public yPos: number, scene: GameScene, color: number, public relativePosX: number, public relativePosY: number) {
        
        let square = scene.add.rectangle(xPos, yPos, 128, 128)
        square.setFillStyle(color)
        this.square = square
        this.originalColor = color
        this.figure = new Figure(scene, xPos, yPos, relativePosX, relativePosY)
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

    convertToAbsolutPosX() {
        return this.xPos * 128 + (1920 / 2) - (4 * 128)
    }

    convertToAbsolutPosY() {
        return 100 + this.yPos	 * 128
    }

}



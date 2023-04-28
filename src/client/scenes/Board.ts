import { StartScene } from "./StartScene.js"

export class Board {
    fieldList: Field[][] = []
    constructor(scene: StartScene) {
        for (let i = 0; i < 8; i++) {
            this.fieldList[i] = []
            for (let n = 0; n < 8; n++) {
                let color: number = 0x555555
                if ((n % 2 == 0 || i % 2 != 0) && (i % 2 == 0 || n % 2 != 0)) {
                    color = 0xffffff
                }
                this.fieldList[i][n] = new Field((1920/2)-(4*128) + i * 128, 100 + n * 128, scene, color)
            }
        }
        
    }
    

}

export class Field {
    //figure: Figure
    scene: Phaser.Scene
    xPos: number
    yPos: number
    square: Phaser.GameObjects.Rectangle

    constructor(xPos: number, yPos: number, scene: StartScene, color: number) {
        let square = scene.add.rectangle(xPos, yPos, 128, 128)
        square.setFillStyle(color)
        this.scene = scene
        this.xPos = xPos
        this.yPos = yPos
        this.square = square

        this.square.setInteractive().on("pointerover", (pointer, localX, localY, event) =>  {
            scene.onOver(this)
        })

    }

  }


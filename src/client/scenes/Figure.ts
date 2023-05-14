export class Figure {

    rect: Phaser.GameObjects.Rectangle

    posX: number
    posY: number

    constructor(scene: Phaser.Scene, x: number, y: number, posX: number, posY: number) {
        this.rect = scene.add.rectangle(x, y, 20, 20, 0x00FF00)
        this.rect.setDepth(20)
    }

    moveFigure(x: number, y: number) {
        this.rect.setPosition(x, y)
    }
}
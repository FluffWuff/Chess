export class Figure {

    sprite: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, x: number, y: number, public posX: number, public posY: number, spriteIndex: number) {
        this.sprite = scene.add.sprite(x, y, "figures", spriteIndex)
        this.sprite.setDisplayOrigin(0,0).setDisplaySize(128, 128)
    }

    moveFigure(x: number, y: number) {
        this.sprite.setPosition(x, y).setDepth(20)
        console.log("X: " + x + " Y: "+y)
    }


}
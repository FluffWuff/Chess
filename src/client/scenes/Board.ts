export class Board {
    fieldList: Field[][] = []
    constructor(scene: Phaser.Scene) {
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

    constructor(x: number, y: number, scene: Phaser.Scene, color: number) {
        let square = scene.add.rectangle(x, y, 128, 128)
        square.setFillStyle(color)


    }

}


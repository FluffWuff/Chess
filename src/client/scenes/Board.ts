class Board {
    fieldList: number[] = []

    constructor() {

    }

}

class Field {
    figure: Figure

    constructor(x: number, y: number, scene: Phaser.Scene) {
        let square = scene.add.rectangle(x, y, 8, 8)
        square.setFillStyle(0xffffff)
        
        
    }

}
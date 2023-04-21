export class Board {
    fieldList: Field[][] = []
    constructor(scene: Phaser.Scene) {
        for(let i = 0; i < 8; i++ ){
            this.fieldList[i] = []
            for(let n = 0; n < 8; n++){
                let color: number = 0x000000
                if(i+n %2 == 0){
                    color = 0xFFFFFF
                }
                this.fieldList[i][n] = new Field(i*8,n*8,scene, color)                
            }
        }


    }

}

class Field {
    //figure: Figure

    constructor(x: number, y: number, scene: Phaser.Scene, color: number) {
        let square = scene.add.rectangle(x, y, 8, 8)
        square.setFillStyle(color)
        
        
    }

}


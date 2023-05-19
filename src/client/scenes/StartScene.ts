import { Board, Field} from "./Board.js"


export class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: "StartScene"
        })
    }


    preload() {
        
    }

    create() {
        let text = this.add.text(100, 100, "Chess")
        
    }
    
    onOver(field: Field) {

    }

}



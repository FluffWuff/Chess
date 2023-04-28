import { Board, Field} from "./Board.js"

export class StartScene extends Phaser.Scene implements HoverListener {
    constructor() {
        super({
            key: "StartScene"
        })
    }


    preload() {
        
    }

    create() {
        let text = this.add.text(100, 100, "Chess")
        new Board(this)
    }
    
    onOver(field: Field) {
        console.log("Dada")
    }

}

interface HoverListener {
    onOver(field: Field)
}

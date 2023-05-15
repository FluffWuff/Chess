export class Figure {

    sprite: Phaser.GameObjects.Sprite

    figureMoveType: number[][]

    constructor(scene: Phaser.Scene, x: number, y: number, public posX: number, public posY: number, spriteIndex: number) {
        if (spriteIndex == 0 || spriteIndex == 1) {
            this.figureMoveType = FigureMoveTypes.KING
        } else if (spriteIndex == 2 || spriteIndex == 3) {
            this.figureMoveType = FigureMoveTypes.QUEEN
        } else if (spriteIndex == 4 || spriteIndex == 5) {
            this.figureMoveType = FigureMoveTypes.BISHOP
        } else if (spriteIndex == 6 || spriteIndex == 7) {
            this.figureMoveType = FigureMoveTypes.KNIGHT
        } else if (spriteIndex == 8 || spriteIndex == 9) {
            this.figureMoveType = FigureMoveTypes.ROOK
        } else if (spriteIndex == 10 || spriteIndex == 11) {
            this.figureMoveType = FigureMoveTypes.PAWN
        }
        this.sprite = scene.add.sprite(x, y, "figures", spriteIndex)
        this.sprite.setDisplayOrigin(0, 0).setDisplaySize(128, 128)
    }

    moveFigure(boardX: number, boardY: number) {
        console.log()
        let diffX = boardX - this.posX
        let diffY = boardY - this.posY
        //check if difference is legal
        let isLegal = false
        for (var i = 0; i < this.figureMoveType.length; i++) {
            let moveOrder = this.figureMoveType[i]
            console.log("MoveORder: " + moveOrder)
            console.log("DiffX: " + diffX + ", DiffY: " + diffY)
            if (moveOrder[0] == diffX && moveOrder[1] == diffY) {
                isLegal = true
            }
        }
        if (!isLegal) {
            console.log("ILLEGAL MOVE!!!!")
            return
        }
        this.sprite.setPosition(this.convertToAbsolutePosX(boardX), this.convertToAbsolutePosY(boardY)).setDepth(20)
        console.log("X: " + boardX + " Y: " + boardY)
    }

    convertToAbsolutePosX(relativeX: number) {
        return relativeX * 128 + (1920 / 2) - (4 * 128)
    }

    convertToAbsolutePosY(relativeY: number) {
        return relativeY * 128 + 100
    }

}

export class FigureMoveTypes {

    static PAWN = [[0, 1], [-1, -1], [1, 1], [0, -1], [0, 2], [0, -2]]
    static KNIGHT = [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, 1], [-2, 1]]
    static KING = [[-1, -1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]]
    static ROOK = [[0, 1], [0, -1], [1, 0], [-1, 0]] //all other ways will be multiplied
    static BISHOP = [[-1, 1], [1, 1], [1, -1], [-1, -1]] //all other ways will be multiplied
    static QUEEN = [[-1, -1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]] //all other ways will be multiplied

}
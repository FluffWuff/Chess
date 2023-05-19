export class Figure {

    sprite: Phaser.GameObjects.Sprite

    figureMoveType: number[][]

    //Indicates how many time the figure was moved
    moveCount = 0

    constructor(scene: Phaser.Scene, x: number, y: number, public posX: number, public posY: number, spriteIndex: number) {
        // replace with switch-case
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
        } else if (spriteIndex == 10) {
            this.figureMoveType = FigureMoveTypes.WHITE_PAWN
        } else if (spriteIndex == 11) {
            this.figureMoveType = FigureMoveTypes.BLACK_PAWN
        }
        this.sprite = scene.add.sprite(x, y, "figures", spriteIndex)
        this.sprite.setDisplayOrigin(0, 0).setDisplaySize(128, 128)
    }

    moveFigure(boardX: number, boardY: number): boolean {
        let diffX = boardX - this.posX
        let diffY = boardY - this.posY
        //check if difference is legal
        let isLegal = false


        for (var i = 0; i < this.figureMoveType.length; i++) {
            let moveOrder = this.figureMoveType[i]
            if (this.figureMoveType == FigureMoveTypes.BISHOP || this.figureMoveType == FigureMoveTypes.ROOK || this.figureMoveType == FigureMoveTypes.QUEEN) {
                for (var k = 1; k < 8; k++) {
                    //console.log("x: " + moveOrder[0]*k + " y:" + moveOrder[1]*k)
                    if (moveOrder[0]*k == diffX && moveOrder[1]*k == diffY)
                        isLegal = true
                }
                continue
            }
            //console.log("MoveORder: " + moveOrder)
            //console.log("DiffX: " + diffX + ", DiffY: " + diffY)
            if (moveOrder[0] == diffX && moveOrder[1] == diffY)
                isLegal = true
        }

        if (!isLegal) {
            console.log("ILLEGAL MOVE!!!!")
            return false
        }
        this.sprite.setPosition(this.convertToAbsolutePosX(boardX), this.convertToAbsolutePosY(boardY)).setDepth(20)
        this.posX = boardX
        this.posY = boardY
        //console.log("X: " + boardX + " Y: " + boardY)

        this.moveCount++
        if (this.figureMoveType == FigureMoveTypes.WHITE_PAWN || this.figureMoveType == FigureMoveTypes.BLACK_PAWN) {
            if (diffY == 2 || diffY == -2 || this.moveCount == 1) {
                //Remove the first opening move
                this.figureMoveType.pop()
            }
        }
        return true
    }

    convertToAbsolutePosX(relativeX: number) {
        return relativeX * 128 + (1920 / 2) - (4 * 128)
    }

    convertToAbsolutePosY(relativeY: number) {
        return relativeY * 128 + 100
    }

}

export class FigureMoveTypes {

    static WHITE_PAWN = [[0, -1], [-1, -1], [1, -1], [0, -2]]
    static BLACK_PAWN = [[0, 1], [-1, 1], [1, 1], [0, 2]]

    static KNIGHT = [[-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, 1], [-2, -1]]
    static KING = [[-1, -1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]]
    static ROOK = [[0, 1], [0, -1], [1, 0], [-1, 0]] //all other ways will be multiplied
    static BISHOP = [[-1, 1], [1, 1], [1, -1], [-1, -1]] //all other ways will be multiplied
    static QUEEN = [[-1, -1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]] //all other ways will be multiplied

}
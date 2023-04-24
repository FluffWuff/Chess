export class StartScene extends Phaser.Scene {
    constructor() {
        super({
            key: "StartScene"
        })
    }


    preload() {
        this.load.html('username', 'index.html')
    }

    create() {
        let text = this.add.text(100, 100, "Chess") 
        const username = this.add.dom(75, 55).createFromCache('username')
        let caption = this.add.text(100, 300, "Press Enter to start")
        this.input.once('ENTER', function() {
            console.log('From StartScene to MenuScene')
            this.scene.start('MenuScene')
        }, this)
        
    }
}
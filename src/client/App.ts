import { GameScene } from "./scenes/GameScene.js"
import { MenuScene } from "./scenes/MenuScene.js"
import { StartScene } from "./scenes/StartScene.js"


var config: Phaser.Types.Core.GameConfig = {
    width: 1920,
    height: 1080,
    type: Phaser.AUTO,
    parent: 'game',
    antialias: false,
    scene: [
        new GameScene(),
        new StartScene(),
        new MenuScene()
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    input: {
        gamepad: true
    }
}

new Phaser.Game(config)
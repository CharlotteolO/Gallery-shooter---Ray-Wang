"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    fps: { forceSetTimeOut: true, target: 30 },
    render: {
        pixelArt: true
    },
    width: 800,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [StartScene, Wave1, Wave2,Wave3, GameOver, End, ControlScene, CreditScene]
}

const game = new Phaser.Game(config);

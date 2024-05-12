class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('starfield', 'star.jpg');
    }

    create() {

        this.starfield = this.add.tileSprite(400, 400, 800, 800, 'starfield');

        this.titleText = this.add.text(400, 100, 'Space Fight', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);


        this.add.text(400, 200, 'Click to Start', { fontSize: '24px', fill: '#0f0' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('wave1'));

        
        this.add.text(400, 300, 'Controls', { fontSize: '24px', fill: '#ff0' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('ControlScene'));

        
        this.add.text(400, 400, 'Credits', { fontSize: '24px', fill: '#0ff' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('CreditScene'));

        const highScore = this.getHighScore();
        this.add.text(400, 500, `High Score: ${highScore}`, { fontSize: '24px', fill: '#ff0' }).setOrigin(0.5);

        this.time.addEvent({
            delay: 1000,
            callback: this.changeTitleColor,
            callbackScope: this,
            loop: true
        });

        
    }
    
    update(){
        this.starfield.tilePositionY -= 2;
    }

    getHighScore() {
        const highScore = localStorage.getItem('highScore') || 0;
        return highScore;
    }

    changeTitleColor() {
        const randomColor = Phaser.Display.Color.RandomRGB();
        this.titleText.setColor('#' + randomColor.r.toString(16).padStart(2, '0') + randomColor.g.toString(16).padStart(2, '0') + randomColor.b.toString(16).padStart(2, '0'));
    }
    

}


class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('starfield', 'star.jpg');
    }

    create() {
        this.starfield = this.add.tileSprite(400, 400, 800, 800, 'starfield');
        this.add.text(400, 300, 'Game Over', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 350, 'Click to Return', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('StartScene');
        });
    }

    update(){
        this.starfield.tilePositionY -= 2;
    }
}

class End extends Phaser.Scene {
    constructor() {
        super('end');
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('starfield', 'star.jpg');
    }

    create() {
        this.starfield = this.add.tileSprite(400, 400, 800, 800, 'starfield');
        this.add.text(400, 300, 'You Win!', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(400, 350, 'Click to Return', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);


        this.input.once('pointerdown', () => {
            this.scene.start('StartScene');
        });
    }

    update(){
        this.starfield.tilePositionY -= 2;
    }
}

class ControlScene extends Phaser.Scene {
    constructor() {
        super('ControlScene');
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('starfield', 'star.jpg');
    }

    create() {
        this.starfield = this.add.tileSprite(400, 400, 800, 800, 'starfield');
        this.add.text(400, 200, 'Controls', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5);
        this.add.text(400, 350, 'WASD: Move\nSPACE: Shoot\nESC: Exit', { fontSize: '24px', fill: '#ffffff' })
            .setOrigin(0.5);

        this.add.text(400, 450, 'Back to Menu', { fontSize: '24px', fill: '#ff0000' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('StartScene'));
    }

    update(){
        this.starfield.tilePositionY -= 2;
    }
}

class CreditScene extends Phaser.Scene {
    constructor() {
        super('CreditScene');
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('starfield', 'star.jpg');
    }

    create() {
        this.starfield = this.add.tileSprite(400, 400, 800, 800, 'starfield');
        this.add.text(400, 200, 'Credits', { fontSize: '32px', fill: '#ffffff' })
            .setOrigin(0.5);
        this.add.text(400, 350, 'Creator: Ray Wang\nArtwork: Ray Wang, Kenney.nl\nAudio: Kenney.nl', { fontSize: '24px', fill: '#ffffff' })
            .setOrigin(0.5);

        this.add.text(400, 450, 'Back to Menu', { fontSize: '24px', fill: '#ff0000' })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('StartScene'));
    }

    update(){
        this.starfield.tilePositionY -= 2;
    }
}


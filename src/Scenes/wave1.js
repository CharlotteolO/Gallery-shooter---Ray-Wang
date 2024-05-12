class Wave1 extends Phaser.Scene {
    constructor() {
        super('wave1');
        this.my = {sprite: {}};

        this.bodyX = 400;
        this.bodyY = 650;

        this.bullets = [];

        this.enemies = [];
        this.enemyBullets = [];

        this.playerHealth = 3;
        this.maxHealth = 3;

        this.score = 0;


    }

    
    preload() {
        
        this.load.setPath("./assets/");
        this.load.image('starfield', 'star.jpg');

        this.load.image("player", "playerShip2_green.png");
        this.load.image("bullet", "laserGreen05.png");

        this.load.image("enemy1", "enemyRed2.png");
        this.load.image("bullet2", "laserRed03.png");

        this.load.image("heart", "suit_hearts.png");

        this.load.audio('injured', 'error_005.ogg');
        this.load.audio('shootSound', 'laserLarge_002.ogg');
        
        document.getElementById('description').innerHTML = '<h2>Wave 1</h2>'
    }

    create() {
        let my = this.my;
        this.starfield = this.add.tileSprite(400, 400, 800, 800, 'starfield');

        this.shootSound = this.sound.add('shootSound');
        this.injuredSound = this.sound.add('injured');

        this.scoreText = this.add.text(700, 10, 'Score: 0', {
            fontSize: '16px',
            fill: '#fff'
        });

        my.sprite.player = this.physics.add.sprite(this.bodyX, this.bodyY, "player");

        my.sprite.hearts = [];
        for (let i = 0; i < this.maxHealth; i++) {
            my.sprite.hearts.push(this.add.sprite(30 + i * 50, 30, 'heart'));
        }
        
        this.keys = {
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            foward: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            backward: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            esc: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        };

        this.time.addEvent({
            delay: 2000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 5000,
            callback: this.regenerateHealth,
            callbackScope: this,
            loop: true
        });

        this.resetGame();

        

        this.physics.add.overlap(my.sprite.player, this.enemyBullets, this.handlePlayerHit, null, this);
        this.physics.add.overlap(my.sprite.player, this.enemies, this.handlePlayerHit, null, this);

        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitsEnemy, null, this);



    }

    update() {
        let my = this.my;
        this.starfield.tilePositionY -= 2;

        if (this.keys.left.isDown) {
            my.sprite.player.x -= 10;
            if (my.sprite.player.x <= 0) {
                my.sprite.player.x = 0;
            }
        } 

        if (this.keys.right.isDown) {
            my.sprite.player.x += 10;
            if (my.sprite.player.x >= 800) {
                my.sprite.player.x = 800;
            }
        }

        if (this.keys.foward.isDown) {
            my.sprite.player.y -= 10;
            if (my.sprite.player.y <= 0) {
                my.sprite.player.y = 0;
            }
        } 

        if (this.keys.backward.isDown) {
            my.sprite.player.y += 10;
            if (my.sprite.player.y >= 800) {
                my.sprite.player.y = 800;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            let bullet = this.physics.add.sprite(my.sprite.player.x, my.sprite.player.y, 'bullet');
            this.bullets.push(bullet);
            this.shootSound.play();
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
            this.scene.start('StartScene');
        }
        
        this.bullets.forEach((bullet, index) => {
            bullet.y -= 20;
            if (bullet.y < 0) {
                bullet.destroy();
                this.bullets.splice(index, 1);
            }
        });

        this.enemies.forEach(enemy => {
            if (!enemy.active) return;
    
            enemy.y += 2;
            if (enemy.y > 800) {
                enemy.destroy();
                this.enemies.remove(enemy);
            } else if (Math.random() < 0.01) {
                this.enemyShoot(enemy.x, enemy.y, enemy);
            }
        });

        this.enemyBullets.forEach((bullet, index) => {
            bullet.y += 3;
            if (bullet.y > 800) {
                bullet.destroy();
                this.enemyBullets.splice(index, 1);
            }
        });

        this.setHighScore(this.score)


    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
        this.checkScore();
    }


    enemyShoot(x, y, enemy) {
        if (!enemy.active) return;
        let bullet = this.physics.add.sprite(x, y + 10, 'bullet2').setVelocityY(100);
        this.enemyBullets.push(bullet);
    }
    

    spawnEnemy() {
        let xPosition = Math.random() * 800;
        let enemy = this.physics.add.sprite(xPosition, 0, 'enemy1');
        enemy.setData('health', 2);
        this.enemies.push(enemy);
        
    }

    regenerateHealth() {
        if (this.playerHealth < this.maxHealth) {
            this.playerHealth++;
            this.updateHealthDisplay();
        }
    }

    handlePlayerHit(player, gameObject) {
        this.injuredSound.play();
        this.updateScore(-5);
        gameObject.destroy();
        this.playerHealth -= 1;
        this.updateHealthDisplay();
        if (this.playerHealth <= 0) {
            this.gameOver();
        }
    }

    updateHealthDisplay() {
        this.my.sprite.hearts.forEach((heart, index) => {
            heart.setVisible(index < this.playerHealth);
        });
    }

    

    bulletHitsEnemy(bullet, enemy) {
        bullet.destroy();
    
        let health = enemy.getData('health') - 1;
        enemy.setData('health', health);
    
        if (health <= 0) {
            enemy.setActive(false).setVisible(false);
            enemy.destroy();
            this.updateScore(10);
        }
    }
    

    resetGame() {
        this.score = 0;
        this.playerHealth = this.maxHealth;
        this.updateHealthDisplay();
    }
    
    

    gameOver() {
        this.scene.start('GameOver');
    }

    checkScore() {
        if (this.score >= 200) {
            this.scene.start('wave2', { score: this.score });
        }
    }

    setHighScore(score) {
        const currentHighScore = localStorage.getItem('highScore') || 0;
        if (score > currentHighScore) {
            localStorage.setItem('highScore', score);
        }
    }
}

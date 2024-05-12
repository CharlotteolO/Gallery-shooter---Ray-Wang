class Wave3 extends Phaser.Scene {
    constructor() {
        super('wave3');
        this.my = {sprite: {}};

        this.bodyX = 400;
        this.bodyY = 650;

        this.bullets = [];

        this.enemies = [];
        this.enemyBullets = [];

        this.playerHealth = 3;
        this.maxHealth = 3;

        this.score = 0;

        this.boss = null;
        this.bossHealth = 80;
        this.playerHealth = 3;
        this.phase2Initialized = false;



    }

    
    preload() {
        
        this.load.setPath("./assets/");
        this.load.image('starfield', 'star.jpg');

        this.load.image("player", "playerShip2_green.png");
        this.load.image("bullet", "laserGreen05.png");

        this.load.image("boss", "ufoRed.png");
        this.load.image("bullet2", "laserRed10.png");

        this.load.image("heart", "suit_hearts.png");

        this.load.audio('injured', 'error_005.ogg');
        this.load.audio('shootSound', 'laserLarge_002.ogg');
        
        document.getElementById('description').innerHTML = '<h2>Wave 3</h2>'
    }

    init(data) {
        this.score = data.score;
    }
    

    create() {
        let my = this.my;
        this.starfield = this.add.tileSprite(400, 400, 800, 800, 'starfield');

        this.shootSound = this.sound.add('shootSound');
        this.injuredSound = this.sound.add('injured');

        this.scoreText = this.add.text(700, 10, 'Score: ' + this.score, {
            fontSize: '16px',
            fill: '#fff'
        });


        this.boss = this.physics.add.sprite(400, 100, 'boss');
        this.boss.setData('health', 80);
        this.enemies.push(this.boss);


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
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        };

        this.time.addEvent({
            delay: 5000,
            callback: this.regenerateHealth,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 2000,
            callback: () => {
                if (this.boss.getData('health') > 50) {
                    this.fireBossBullet(this.boss.x, this.boss.y, 0);
                    let angle = Phaser.Math.Between(-30, 30);
                    this.fireBossBullet(this.boss.x, this.boss.y, angle);
                } else {
                    this.boss.body.collideWorldBounds = true;
                    this.boss.body.onWorldBounds = true;
                    this.fireBossBullet(this.boss.x, this.boss.y, 0);
                    this.fireBossBullet(this.boss.x, this.boss.y, -30);
                    this.fireBossBullet(this.boss.x, this.boss.y, 30);
                }
            },
            callbackScope: this,
            loop: true
        });


        this.resetGame();

        

        this.physics.add.overlap(my.sprite.player, this.enemyBullets, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.bullets, this.enemies, this.bulletHitsEnemy, null, this);



    }

    update() {
        let my = this.my;
        this.starfield.tilePositionY -= 2;

        if (this.boss.getData('health') <= 50 && !this.phase2Initialized) {
            this.boss.setVelocityX(100);
            this.phase2Initialized = true;
        }

        
        if (this.phase2Initialized) {
            if (this.boss.x <= 100 || this.boss.x >= 700) {
                this.boss.setVelocityX(-this.boss.body.velocity.x);
            }
        }

        if (this.boss.getData('health') <= 50) {
            if (this.boss.x <= 100) {
                this.boss.setVelocityX(100);
            }
            if (this.boss.x >= 700) {
                this.boss.setVelocityX(-100);
            }
        }


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
        
        this.bullets.forEach((bullet, index) => {
            bullet.y -= 20;
            if (bullet.y < 0) {
                bullet.destroy();
                this.bullets.splice(index, 1);
            }
        });

        this.setHighScore(this.score)

    }

    updateScore(points) {
        this.score += points;
        this.scoreText.setText('Score: ' + this.score);
        this.checkScore();
    }


    fireBossBullet(x, y, angle) {
        let bullet = this.physics.add.sprite(x, y, 'bullet2');
        bullet.setVelocityY(100);
        bullet.setVelocityX(100 * Math.sin(angle * Math.PI / 180));
        this.enemyBullets.push(bullet);
    }

    

    regenerateHealth() {
        if (this.playerHealth < this.maxHealth) {
            this.playerHealth++;
            this.updateHealthDisplay();
        }
    }

    

    handlePlayerHit(player, gameObject) {
        this.injuredSound.play();
        if (gameObject && gameObject.active) {
            gameObject.destroy();
        }
    
        
        if (this.playerHealth > 0) {
            this.playerHealth -= 1;
            this.updateHealthDisplay();
            this.updateScore(-5);
            
        }
    
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
            if (enemy === this.boss) {
                this.scene.start('end');
            } else {
                let points = enemy.texture.key === "enemy2" ? 100 : 10;
                this.updateScore(points);
            }
        }
        
    }
    

    resetGame() {
        this.playerHealth = this.maxHealth;
        this.updateHealthDisplay();
    }
    

    gameOver() {
        this.scene.start('GameOver');
    }

    setHighScore(score) {
        const currentHighScore = localStorage.getItem('highScore') || 0;
        if (score > currentHighScore) {
            localStorage.setItem('highScore', score);
        }
    }
    
}

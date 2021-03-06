var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var platform;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var jarum;
var bombs;
var gerak = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/tile1.png');
    this.load.image('ground-1', 'assets/tile2.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('jarum', 'assets/jarum.png');
    this.load.image('jarum-1', 'assets/jarum1.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{

    // platform
    this.add.image(400, 300, 'sky');
    
    platform = this.physics.add.staticGroup();


    platform.create(40, 568, 'ground').setScale(2).refreshBody();
    platform.create(130, 568, 'ground').setScale(2).refreshBody();
    platform.create(290, 568, 'ground').setScale(2).refreshBody();

    platform.create(390, 400, 'ground-1');
    
    // player
    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);


    player.body.setGravityY(300);

    this.anims.create({
       key: 'left',
       frames: this.anims.generateFrameNumbers('dude', {
           start: 0,
           end: 3
       }) ,
       frameRate: 10,
       repeat: -1
    });

    this.anims.create({
       key: 'turn',
       frames: [ {key: 'dude', frame: 4} ],
       frameRate: 20
    });

    this.anims.create({
       key: 'right',
       frames: this.anims.generateFrameNumbers('dude', {
           start: 5,
           end: 8
       }) ,
       frameRate: 10,
       repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, platform);

    // stars

    stars = this.physics.add.group({
        key: 'star',
        repeat: 2,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars = this.physics.add.group({
        key: 'star',
        repeat: 2,
        setXY: { x: 22, y: 0, stepX: 70 }
    });


    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.physics.add.collider(stars, platform);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    // jarum
    jarum = this.physics.add.staticGroup();

    jarum.create(210, 590, 'jarum');

    jarum.create(370, 590, 'jarum-1');

    this.physics.add.collider(player, jarum, hitJarum, null, this);

    // Score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // Bomb
    bombs = this.physics.add.group();

    // var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(250, 16, 'bomb');
    console.log(bomb.x);
    
    // bombs.setBounce(1);
    bomb.setCollideWorldBounds(true);
    // bombs.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;

    this.physics.add.collider(bombs, platform)


}

function update ()
{
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-390);
    }


    if (bomb.x >= 270) {
        player.setVelocityX(160);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}

function hitJarum(player, jarum)
{
    player.setTint(0xff0000);
}

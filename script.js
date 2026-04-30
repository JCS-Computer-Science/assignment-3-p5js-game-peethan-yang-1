let fruits = [];
let bombs = [];
let trail = [];
let particles = [];
let fruitSplatter = [];



let spawnTimer = 0;
let bombTimer = 0;

let fruitcolors = [];
let fruitImages = []

let score = 0;
let lives = 3;

let gameOver = false;

let combo = 0;
let comboTimer = 0;
let comboLength = 120;

let comboLost = false;
let comboLostTimer = 0;
let comboLostTextDuration = 60;

let comboShakeTime = 0;
let comboShakeLength = 10;
let comboShakeDist = 8;

let comboLostShakeTime = 0;
let comboLostShakeLength = 25;
let comboLostShakeDist = 8;

let flashOpacity = 0;
let flashLength = 20;

let img;
let bombImg;

class GameObject {
    constructor(x, y, size, vx, vy, img) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.vx = vx;
        this.vy = vy;
        this.img = img;
    }

    update(gravity) {
        this.vy += gravity;
        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(millis()/300);
        image(this.img, 0, 0, this.size, this.size);
        pop();
    }

    isOffScreen() {
        return this.y > height + 50;
    }
}

class Fruit extends GameObject {
    constructor(x, y, size, vx, vy, img, color) {
        super(x, y, size, vx, vy, img);
        this.color = color;
    }

    slice() {
        addSplat(this.x, this.y, this.size, this.color);

        for (let j = 0; j < 15; j++) {
            particles.push(new Particle(
                this.x, 
                this.y,
                random(-5, 5),
                random(-5, 5),
                random(5, 12),
                this.color
            ))
        }
    }
}

class Bomb extends GameObject {
    constructor (x, y, size, vx, vy, img) {
        super(x, y, size, vx, vy, img);
    }

    bombHit() {
        lives -=1;

        combo = 0;
        comboTimer = 0;

        comboLost = true;
        comboLostTimer = comboLostTextDuration;
        comboLostShakeTime = comboLostShakeLength;
        
        flashOpacity = 255;
    }
}

class Particle {
    constructor(x, y, vx, vy, size, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
        this.life = 60;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
        this.life--;
    }

    ifDead() {
        return this.life <= 0;
    }

    draw() {
        fill(this.color);
        noStroke();
        circle(this.x, this.y, this.size);
    }
}

function preload() {
    img = loadImage('cuttingboard nobg resize.png')
    // image dimensions 1300x856

    bombImg = loadImage('bomb.png')

    fruitImages = [
        loadImage('apple.png'),
        loadImage('greenApple.png'),
        loadImage('orange.png'),
        loadImage('watermelon.png'),
        loadImage('grapefruit.png'),
        loadImage('coconut.png'),
    ]



}

function setup () {
    createCanvas(1300, 856);

    for (let i = 0; i < fruitImages.length; i++) {
        fruitcolors[i] = getImagecolor(fruitImages[i]);
    }

    setInterval(() => {
        trail.shift()
    }, 30);
}

function draw() {
    background(0);

    imageMode(CORNER)
    image(img, 0, 0, width, height);

    if (!gameOver) {
        spawnObject();
        updateGame();

        scoreCounter();
        livesCounter();
        comboCounter();
        bombFlash();

        comboLoss();

        updateParticles();
        mouseTrail();

        drawSplat();
    } else {
        drawGameOver();
    }
}

function drawGameOver() {
    background(50)

    textAlign(CENTER, CENTER);

    fill(255, 0, 0);
    textSize(width * 0.05);
    text("GAME OVER", width / 2, (height / 2) - 40);
    text("FINAL SCORE: " + score, width / 2, (height / 2) + 40)

    
}

function scoreCounter() {
    fill(255);
    textSize(60);
    text("Score: " + score, width * 0.009, height * 0.1);
}

function livesCounter() {
    fill(255);
    textSize(60);
    text("Lives: " + lives, width * 0.8, height * 0.1);
}

function comboCounter() {

    if (combo >= 1) {
        let x = width * 0.9;
        let y = height * 0.35;

        if (comboShakeTime > 0) {
            x += random(-comboShakeDist, comboShakeDist);
            y += random(-comboShakeDist, comboShakeDist);
            comboShakeTime -= 1;
        }

        x = constrain(x, 0, width - 100);
        y = constrain(y, 0, height - 150);


        fill(255);
        textSize(33);
        textAlign(CENTER, TOP);
        text("COMBO: " + combo, x, y);
    }
    
}

function bombFlash() {
    if (flashOpacity > 0) {
        fill(255, 255, 255, flashOpacity);
        rect(0, 0, width, height);
        flashOpacity -= 255 / flashLength;
        if (flashOpacity < 0) {
            flashOpacity = 0;
        }
    }
}

function comboLoss() {
    if (comboLostTimer > 0) {
        let x = width * 0.9;
        let y = height * 0.35;

        if(comboLostShakeTime > 0) {
            x += random(-comboLostShakeDist, comboLostShakeDist);
            y += random(-comboLostShakeDist, comboLostShakeDist);
            comboLostShakeTime -= 1;
        }


        fill(255, 0, 0);
        textSize(33);
        textAlign(CENTER, TOP);
        text("COMBO LOST!", x, y);

        comboLostTimer -= 1;
    } else {
        comboLost = false;
    }

    textAlign(LEFT, BASELINE);
}

function getImagecolor(img) {
    
    let gfx = createGraphics(img.width, img.height);
    gfx.image(img, 0, 0);
    gfx.loadPixels();

    let r = 0;
    let g = 0;
    let b = 0;

    let count = 0;

    for (let i = 0; i < gfx.pixels.length; i += 40) {
        r += gfx.pixels[i];
        g += gfx.pixels[i+1];
        b += gfx.pixels[i+2];

        count++
    }

    gfx.remove();

    return color(r/count, g/count, b/count);
}

function spawnObject() {

    spawnTimer = spawnTimer + 1;
    bombTimer = bombTimer + 1;

    if (spawnTimer > 25) {

        let index = floor(random(fruitImages.length));

        fruits.push(new Fruit(
            random(width * 0.1, width * 0.9),
            height,
            random(70, 105),
            random(-10, 10),
            random(-20, -15),
            fruitImages[index],
            fruitcolors[index]
        ));

        spawnTimer = 0;
    }

    if (bombTimer > 80) {
        
        bombs.push(new Bomb(
            random(100, width - 100),
            height,
            random(70, 105),
            random(-10, 10),
            random(-20, -15),
            bombImg
        ));


        bombTimer = 0;
    } 
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        
        let p = particles[i];

        p.update();
        p.draw();

        if (p.ifDead()) {
            particles.splice(i, 1);
        }
    }
}

function addSplat(x, y, size, color) {
    let splat = {
        x: x,  
        y: y,
        size: size,
        color: color,
        life: 30,
        maxLife: 30
    }

    fruitSplatter.push(splat);
}

function drawSplat() {
    for (let i = fruitSplatter.length - 1; i >= 0; i--) {
        let s = fruitSplatter[i];

        fill(red(s.color), green(s.color), blue(s.color), 255 * (s.life / s.maxLife));
        ellipse(s.x, s.y, s.size);

        s.life--;

        if (s.life <= 0) {
            fruitSplatter.splice(i, 1);
        }
    }
}


function updateGame() {
    let gravity = 0.5;
    
    for (let i = fruits.length - 1; i >= 0; i--) {
        
        let f = fruits[i];

        f.update(gravity);
        f.draw();

        if (f.isOffScreen()) {
            fruits.splice(i, 1);
        }
    }

    for (let i = bombs.length - 1; i >= 0; i--) {
        
        let b = bombs[i];

        b.update(gravity);
        b.draw();

        if (b.isOffScreen()) {
            bombs.splice(i, 1);
        }
    }

    if (comboTimer > 0) {
        comboTimer -= 1;
    } else if (combo > 0) {
        combo = 0;
        comboLost = true;
        comboLostTimer = comboLostTextDuration;

        comboLostShakeTime = comboLostShakeLength;

        
    }

    if (lives <= 0) {
        gameOver = true;
    }

}

function mouseSlice() {
    for (let i = fruits.length - 1; i >= 0; i--) {
        let d = dist(mouseX, mouseY, fruits[i].x, fruits[i].y);

        if (d < fruits[i].size / 2) {
            let f = fruits.splice(i,1)[0];
            f.slice();


            combo += 1;
            comboTimer = comboLength;

            comboShakeTime = comboShakeLength;

            score += combo * 2;

            comboLost = false;
            comboLostTimer = 0;
            } 
        }
    

    for (let i = bombs.length - 1; i >= 0; i--) {
        let d = dist(mouseX, mouseY, bombs[i].x, bombs[i].y);

        if (d < bombs[i].size / 2) {
            let b = bombs.splice(i, 1)[0];
            b.bombHit();
        }
    }
}

function mouseTrail() {
    for (let i = 0; i < trail.length - 1; i++) {
        fill(255);
        stroke('white')
        strokeWeight(10)
        line(trail[i].x, trail[i].y, trail[i + 1].x, trail[i + 1].y)
        noStroke()
        circle(trail[i].x, trail[i].y, 10);
    }
}

function mouseMoved() {
    mouseSlice();

    trail.push({
        x: mouseX,
        y: mouseY
    });

    if (trail.length > 10) {
        trail.shift();
    }
}


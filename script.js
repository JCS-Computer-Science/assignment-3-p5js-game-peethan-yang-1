let fruits = [];
let bombs = [];
let trail = [];
let particles = [];
let fruitSplatter = [];

let canvasX = 1000;
let canvasY = 800;

let spawnTimer = 0;
let bombTimer = 0;

let fruitColours = ["blue", "green", "orange", "yellow", "brown", "purple", "olive", "lime", "teal", "aqua", "navy", "fuchsia"];

let score = 0;
let lives = 3;

let gameOver = false;

let combo = 0;
let comboTimer = 0;
let comboLength = 60;

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


function setup () {
    createCanvas(canvasX, canvasY);

    fruitX = random(1, canvasX);
    fruitY = canvasY;
    fruitSize = random(20, 60);
    fruitSpeed = random(1, 5);
    setInterval(() => {
        trail.shift()
    }, 30);
}

function draw() {
    background(100, 100, 100);

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
    textSize(67);
    text("GAME OVER", canvasX / 2, canvasY / 2);
    text("FINAL SCORE: " + score, canvasX / 2, (canvasY / 2) + 70)

    
}

function scoreCounter() {
    fill(255);
    textSize(32);
    text("Score: " + score, 20, 40);
}

function livesCounter() {
    fill(255);
    textSize(32);
    text("Lives: " + lives, 860, 40);
}

function comboCounter() {

    if (combo >= 1) {
        let x = 820;
        let y = 300;

        if (comboShakeTime > 0) {
            x += random(-comboShakeDist, comboShakeDist);
            y += random(-comboShakeDist, comboShakeDist);
            comboShakeTime -= 1;
        }

        x = constrain(x, 0, canvasX - 100);
        y = constrain(y, 0, canvasY - 150);


        fill(255);
        textSize(32);
        textAlign(CENTER, TOP);
        text("COMBO: " + combo, x, y);
    }
    
}

function bombFlash() {
    if (flashOpacity > 0) {
        fill(255, 255, 255, flashOpacity);
        rect(0, 0, canvasX, canvasY);
        flashOpacity -= 255 / flashLength;
        if (flashOpacity < 0) {
            flashOpacity = 0;
        }
    }
}

function comboLoss() {
    if (comboLostTimer > 0) {
        let x = 820;
        let y = 300;

        if(comboLostShakeTime > 0) {
            x += random(-comboLostShakeDist, comboLostShakeDist);
            y += random(-comboLostShakeDist, comboLostShakeDist);
            comboLostShakeTime -= 1;
        }


        fill(255, 0, 0);
        textSize(28);
        textAlign(CENTER, TOP);
        text("COMBO LOST!", x, y);

        comboLostTimer -= 1;
    } else {
        comboLost = false;
    }

    textAlign(LEFT, BASELINE);
}

function spawnObject() {

    spawnTimer = spawnTimer + 1;
    bombTimer = bombTimer + 1;

    if (spawnTimer > 25) {
        let fruit = {
            x: random(100, canvasX - 100),
            y: canvasY,
            size: random(70, 105),
            vx: random(-10, 10),
            vy: random(-20, -15),
            colour: random(fruitColours)
        };
    
        fruits.push(fruit)

        spawnTimer = 0;
    }

    if (bombTimer > 80) {
        let bomb = {
            x: random(100, canvasX - 100),
            y: canvasY,
            size: random(70, 105),
            vx: random(-10, 10),
            vy: random(-20, -15),
            colour: "red"
        };

        bombs.push(bomb);
        bombTimer = 0;
    } 
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life -= 1;

        fill(p.colour);
        noStroke();
        circle(p.x, p.y, p.size);

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function addSplat(x, y, size, colour) {
    let splat = {
        x: x,  
        y: y,
        size: size,
        colour: colour
    }

    fruitSplatter.push(splat);
}

function drawSplat() {
    for (const splat of fruitSplatter) {
        console.log(splat.colour)
        fill((splat.colour));
        ellipse(splat.x, splat.y, splat.size, splat.size)
    }
}


function updateGame() {
    let gravity = 0.5;
    
    for (let i = fruits.length - 1; i >= 0; i--) {
        fruits[i].vy += gravity;
        
        fruits[i].x += fruits[i].vx;
        fruits[i].y += fruits[i].vy;

        fill(fruits[i].colour);
        circle(fruits[i].x, fruits[i].y, fruits[i].size);

        if (fruits[i].y > canvasY + 50) {
            fruits.splice(i, 1);
            
        }
    }

    for (let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].vy += gravity;

        bombs[i].x += bombs[i].vx;
        bombs[i].y += bombs[i].vy;

        fill(bombs[i].colour);
        circle(bombs[i].x, bombs[i].y, bombs[i].size);

        if (bombs[i].y > canvasY + 50) {
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
            let slicedFruit = fruits.splice(i, 1)[0];
            console.log(slicedFruit)
            addSplat(slicedFruit.x, slicedFruit.y, slicedFruit.size, slicedFruit.colour);

            for (let j = 0; j < 15; j++) {
                particles.push({
                    x: slicedFruit.x,
                    y: slicedFruit.y,
                    vx: random(-5, 5),
                    vy: random(-5, 5),
                    size: random(5, 12),
                    colour: slicedFruit.colour,
                    life: 60
                })
            }



            combo += 1;
            comboTimer = comboLength;

            comboShakeTime = comboShakeLength;

            score += combo;

            comboLost = false;
            comboLostTimer = 0;
        }
    }

    for (let i = bombs.length - 1; i >= 0; i--) {
        let d = dist(mouseX, mouseY, bombs[i].x, bombs[i].y);

        if (d < bombs[i].size / 2) {
            bombs.splice(i, 1);
            lives -= 1;

            combo = 0;
            comboTimer = 0;
            comboLost = true;
            comboLostTimer = comboLostTextDuration;

            comboLostShakeTime = comboLostShakeLength;

            flashOpacity = 255;
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


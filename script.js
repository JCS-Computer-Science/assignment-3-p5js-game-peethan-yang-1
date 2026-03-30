let fruits = []
let bombs = []
let trail = []

let canvasX = 1000;
let canvasY = 800;

let spawnTimer = 0;
let bombTimer = 0;

let fruitColours = ["blue", "green", "orange", "yellow"];


function setup () {
    createCanvas(canvasX, canvasY);

    fruitX = random(1, canvasX);
    fruitY = canvasY;
    fruitSize = random(20, 60);
    fruitSpeed = random(1, 5);
}

function draw() {
    background(100, 100, 100);

    spawnObject();
    updateGame();
    
}


function spawnObject() {

    spawnTimer = spawnTimer + 1;
    bombTimer = bombTimer + 1;

    if (spawnTimer > 45) {
        let fruit = {
            x: random(100, canvasX - 100),
            y: canvasY,
            size: random(30, 60),
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
            size: random(30, 60),
            vx: random(-10, 10),
            vy: random(-20, -15),
            colour: "red"
        };

        bombs.push(bomb);
        bombTimer = 0;
    } 
}


function updateGame() {
    let gravity = 0.5;
    
    for (let i = 0; i < fruits.length; i++) {
        fruits[i].vy += gravity;
        
        fruits[i].x += fruits[i].vx;
        fruits[i].y += fruits[i].vy;

        fill(fruits[i].colour);
        circle(fruits[i].x, fruits[i].y, fruits[i].size);

        if (fruits[i].y > canvasY + 50) {
            fruits.splice(i, 1);
        }
    }

    for (let i = 0; i < bombs.length; i++) {
        bombs[i].vy += gravity;

        bombs[i].x += bombs[i].vx;
        bombs[i].y += bombs[i].vy;

        fill(bombs[i].colour);
        circle(bombs[i].x, bombs[i].y, bombs[i].size);

        if (bombs[i].i > canvasY + 50) {
            fruits.splice(i, 1);
        }

    }
}

function mouseSlice() {
    for (let i = fruits.length - 1; i >=0; i--) {
        let d = dist(mouseX, mouseY, fruits[i].x, fruits[i].y);

        if (d < fruits[i].size / 2) {
            fruits.splice(i, 1);
        }
    }
}
function mouseMoved() {
    mouseSlice();
}


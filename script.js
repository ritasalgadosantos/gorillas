let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

let lastDate = Date.now();

function notBlurry() {
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}

class Entity {
    constructor(image, x, y, scale) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.imageLoaded = false;
        this.image.addEventListener('load', () => {
            this.imageLoaded = true;
            this.width = scale * this.image.naturalWidth;
            this.height = scale * this.image.naturalHeight;
        }, false);
        this.image.src = image;
    }

    getCanvasPos() {
        return {
            x: ctx.canvas.width / 2 - this.width / 2 + this.x,
            y: ctx.canvas.height / 2 - this.height / 2 + this.y
        };
    }

    draw(ctx) {
        notBlurry();
        if (this.imageLoaded) {
            let canvasPos = this.getCanvasPos();
            ctx.drawImage(this.image, canvasPos.x, canvasPos.y, this.width, this.height);
        }
    }
}

class Button extends Entity {
    constructor(imageNormal, imagePressed, x, y, scale) {
        super(imageNormal, x, y, scale);
        this.isPressed = false;
        this.imagePressed = new Image();
        this.imagePressedLoaded = false;
        this.imagePressed.addEventListener('load', () => {
            this.imagePressedLoaded = true;
        }, false);
        this.imagePressed.src = imagePressed;
    }

    handle(event, action) {
        if (event.x > ctx.canvas.width / 2 - this.width / 2 && event.x < ctx.canvas.width / 2 + this.width / 2
            && event.y > ctx.canvas.height / 2 - this.height / 2 && event.y < ctx.canvas.height / 2 + this.height / 2) {
            if (event.type == 'mousedown') {
                this.isPressed = true;
            } else if (event.type == 'mouseup') {
                action();
            }
        }
    }

    draw(ctx) {
        notBlurry();
        if (this.isPressed ? this.imagePressedLoaded : this.imageLoaded) {
            let canvasPos = this.getCanvasPos();
            ctx.drawImage(this.isPressed ? this.imagePressed : this.image, canvasPos.x, canvasPos.y, this.width, this.height);
        }
    }
}

class MovingObject extends Entity {
    constructor(image, x, y, sx, sy, scale) {
        super(image, x, y, scale);
        this.sx = sx;
        this.sy = sy;
    }

    update(delta_time, changeImage) {
        let test_x = this.x + delta_time * this.sx;
        let test_y = this.y + delta_time * this.sy;

        if (test_x - this.width / 2 <= -ctx.canvas.width / 2 || test_x + this.width / 2 >= ctx.canvas.width / 2) {
            this.sx = -this.sx;
            changeImage();
        }
        if (test_y - this.height / 2 <= -ctx.canvas.height / 2 || test_y + this.height / 2 >= ctx.canvas.height / 2) {
            this.sy = -this.sy;
            changeImage()
        }

        this.x += delta_time * this.sx;
        this.y += delta_time * this.sy;
    }
}

class Background extends Entity {
    constructor(image, x, y, scale) {
        super(image, x, y, scale);
    }

    draw(ctx) {
        if (this.imageLoaded) {
            let canvasPos = this.getCanvasPos();
            ctx.drawImage(this.image, canvasPos.x, canvasPos.y, this.width, this.height);
        }
    }
}

let startButton = new Button('images/red_start_button_normal.png', 'images/red_start_button_pressed.png', 0, 0, 10);
let blue_heart = new MovingObject('images/blue_heart.png', 0, 0, 0.1, 0.15, 5);
let background0 = new Background('images/background0.png', 0, 0, 0.15);
let background1 = new Background('images/background1.png', 0, 0, 0.25);
let background2 = new Background('images/background2.png', 0, 0, 0.15);
let background3 = new Background('images/background3.png', 0, 0, 0.15);
let background4 = new Background('images/background4.png', 0, 0, 0.15);
let background5 = new Background('images/background5.png', 0, 0, 0.7);
let background6 = new Background('images/background6.png', 0, 0, 0.15);
let background7 = new Background('images/background7.png', 0, 0, 0.2);
let background8 = new Background('images/background8.png', 0, 0, 1);
let background9 = new Background('images/background9.png', 0, 0, 0.25);
let background10 = new Background('images/background10.png', 0, 0, 0.75);


for (let e of ['mousedown', 'mouseup']) {
    canvas.addEventListener(e, event => {
        startButton.handle(event, startGame);
    });
}

let cenas = [startButton];

function draw() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    for (let e of cenas) {
        e.draw(ctx);
    }
}

function startGame() {
    cenas = [background0, blue_heart];
}

let a = 1;
function changeBackground() {
    let backgroundImgs = [background0, background1, background2, background3, background4, background5, background6, background7, background8, background9, background10];
    if (a >= backgroundImgs.length) {
        a = 0;
    }
    cenas[0] = backgroundImgs[a];
    a += 1;
}

function animate() {
    let currentDate = Date.now();
    let delta_time = currentDate - lastDate;
    lastDate = currentDate;
    for (let e of cenas) {
        if (e instanceof MovingObject) {
            e.update(delta_time, changeBackground);
        }
        draw();
    }
    requestAnimationFrame(animate);
}

animate();
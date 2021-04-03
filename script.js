let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

function notBlurry() {
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
}

class Button {
    constructor(imageNormal, imagePressed, scale) {
        this.isPressed = false;
        this.imageNormal = new Image();
        this.imageNormalLoaded = false;
        this.imageNormal.addEventListener('load', () => {
            this.imageNormalLoaded = true;
            this.width = scale * this.imageNormal.naturalWidth;
            this.height =  scale * this.imageNormal.naturalHeight;
        }, false);
        this.imageNormal.src = imageNormal;

        this.imagePressed = new Image ();
        this.imagePressedLoaded = false;
        this.imagePressed.addEventListener('load', () => {
            this.imagePressedLoaded = true;
        }, false);
        this.imagePressed.src = imagePressed;
    }
    
    draw(ctx) {
        notBlurry();
        if (this.isPressed ? this.imagePressedLoaded : this.imageNormalLoaded) {
            ctx.drawImage(this.isPressed ? this.imagePressed : this.imageNormal, ctx.canvas.width/2 - this.width/2, ctx.canvas.height/2 - this.height/2, this.width, this.height);
        } 
    }

    handle(event) {
        if (event.x > ctx.canvas.width/2 - this.width/2 && event.x < ctx.canvas.width/2 + this.width/2
            && event.y > ctx.canvas.height/2 - this.height/2 && event.y < ctx.canvas.height/2 + this.height/2) {
                if (event.type == 'mousedown') {
                    this.isPressed = true;
                } else if (event.type == 'mouseup') {
                    this.isPressed = false;
                }
            }
    }
}

let start = new Button('images/red_start_button_normal.png', 'images/red_start_button_pressed.png', 8);

canvas.addEventListener('mousedown', event => {
    start.handle(event);
});

canvas.addEventListener('mouseup', event => {
    start.handle(event);
});

function draw() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    start.draw(ctx);
    requestAnimationFrame(draw);
}

draw();
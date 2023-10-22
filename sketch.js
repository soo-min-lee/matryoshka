let balls = [];
let images = [];
let imgWidth = 0; // Adjust the image width to your preference
let imgHeight = 0; // Adjust the image height to your preference
let myFontB;
let myFontR;
let isSongPlaying = false; // Flag to check if the sound is already playing

let isFlushing = false;
let isBallDiameterRandom = false;
let displayInfos = true;
let displayWeight = false;
let clickOnce = false;

let FRAME_RATE = 60;
let SPEED_FLUSH = 3;
let Y_GROUND;
let lastFR;

function preload() {
  // make sure they exist in the sketch folder
  images.push(loadImage("doll1.svg"));
  images.push(loadImage("doll2.svg"));
  images.push(loadImage("doll3.svg"));
  images.push(loadImage("doll4.svg"));
  images.push(loadImage("doll5.svg"));
  images.push(loadImage("doll6.svg"));
  images.push(loadImage("doll7.svg"));
  images.push(loadImage("doll8.svg"));

  soundFormats("mp3", "ogg");
  mySound = loadSound("bubblepop.mp3");
  mySong = loadSound("MarioMainMenu.mp3");

  myFontB = loadFont("GoodSans-Bold.otf");
  myFontR = loadFont("GoodSans-Regular.otf");
}

function setup() {
  frameRate(FRAME_RATE);

  // Calculate the initial canvas size based on the window size
  const canvasWidth = windowWidth;
  const canvasHeight = windowHeight;

  // Create the canvas with the calculated dimensions
  createCanvas(canvasWidth, canvasHeight);

  // Call windowResized to set up the initial size and responsiveness
  windowResized();

  Y_GROUND = (height / 20) * 19;
  lastFR = FRAME_RATE;
}

function windowResized() {
  // Update the canvas size when the window is resized
  const canvasWidth = windowWidth;
  const canvasHeight = windowHeight;
  resizeCanvas(canvasWidth, canvasHeight);

  // Your other code to reposition or resize elements based on the new canvas size
}

function draw() {
  background(0);

  if (isFlushing) {
    for (let i = 0; i < SPEED_FLUSH; i++) {
      balls.pop();
    }

    if (balls.length === 0) {
      isFlushing = false;
    }
  }

  balls.forEach((ball) => {
    ball.collide();
    ball.move();
    ball.display(displayWeight);
    ball.checkCollisions();
  });

  if (mouseIsPressed) {
    let ballDiameter;

    if (isBallDiameterRandom) {
      ballDiameter = random(25, 150);
    } else {
      ballDiameter = 55;
    }

    if (canAddBall(mouseX, mouseY, ballDiameter)) {
      isFlushing = false;
      let newBall = new Ball(mouseX, mouseY, ballDiameter, balls);

      if (mouseButton === LEFT && !clickOnce) {
        balls.push(newBall);
        clickOnce = true;
      }

      if (mouseButton === RIGHT) {
        balls.push(newBall);
      }
    }
  }

  drawGround();

  if (displayInfos) {
    displayShortcuts();
    displayFrameRate();
    displayBallCount();
  }
}

function mouseReleased() {
  if (mouseButton === LEFT) {
    clickOnce = false;
  }
}

function keyPressed() {
  if (keyCode === 32) {
    //SPACE
    displayInfos = !displayInfos;
  }

  if (keyCode === 70) {
    //F
    isFlushing = true;
  }

  if (keyCode === 71) {
    //G
    isBallDiameterRandom = !isBallDiameterRandom;
  }

  if (keyCode === 72) {
    //H
    displayWeight = !displayWeight;
  }
}

function canAddBall(x, y, d) {
  let isInScreen =
    y + d / 2 < Y_GROUND && y - d / 2 > 0 && x + d / 2 < width && x - d / 2 > 0;

  let isInAnotherBall = false;

  for (let i = 0; i < balls.length; i++) {
    let d = dist(x, y, balls[i].position.x, balls[i].position.y);

    if (d < balls[i].w) {
      isInAnotherBall = true;
      break;
    }
  }

  return isInScreen && !isInAnotherBall;
}

function drawGround() {
  strokeWeight(0);
  fill("rgba(200,200,200, 0)");
  rect(0, (height / 10) * 9, width, height / 10);
}

function displayFrameRate() {
  if (frameCount % 30 === 0) {
    lastFR = round(frameRate());
  }

  textSize(50);
  fill(255, 0, 0);

  let lastFRWidth = textWidth(lastFR);
  //text(lastFR, width - lastFRWidth - 25, 50);
  //textSize(10);
  //text('fps', width - 20, 50);
}

function displayBallCount() {
  textFont(myFontB);
  textSize(50);
  fill(255, 0, 0);
  text(balls.length, 10, 50);
  let twBalls = textWidth(balls.length);
  textFont(myFontR);
  textSize(25);
  text("matryoshkas", 15 + twBalls, 50);
}

function displayShortcuts() {
  let hStart = 30;
  let steps = 15;
  let maxTW = 0;
  /*let controlTexts = [
        'LEFT CLICK : add 1 ball',
        'RIGHT CLICK : add 1 ball continuously',
        'SPACE : display infos',
        'F : flush balls',
        'G : set random ball diameter (' + isBallDiameterRandom + ')',
        'H : display weight of balls (' + displayWeight + ')'
    ];

    textSize(11);
    fill(0);

    for (let i = 0; i < controlTexts.length; i++) {
        let currentTW = textWidth(controlTexts[i]);

        if (currentTW > maxTW) {
            maxTW = currentTW;
        }
    }

    for (let i = 0; i < controlTexts.length; i++) {
        text(controlTexts[i], width / 2 - maxTW / 2 + 5, hStart);
        hStart += steps;
    }

    fill(200, 200, 200, 100);
    rect(width / 2 - maxTW / 2,
        hStart - (controlTexts.length + 1) * steps,
        maxTW + steps,
        (controlTexts.length + 1) * steps - steps / 2
    );*/
}

function mouseClicked() {
  mySound.play();

  if (!isSongPlaying) {
    mySong.play();
    isSongPlaying = true;
  }
}

class Ball {
  /*constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = random(images); // Select a random image
    this.velocity = createVector(random(-2, 2), random(-2, 2)); // Random initial velocity
  }*/
  constructor(x, y, w, e, img) {
    this.id = e.length;
    this.w = w;
    this.e = e;
    this.img = random(images); // Select a random image

    this.progressiveWidth = 0;
    /*this.rgb = [
      floor(random(0, 256)),
      floor(random(0, 256)),
      floor(random(0, 256)),
    ];*/
    this.mass = w;
    this.position = createVector(x + random(-1, 1), y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);

    this.gravity = 0.2;
    this.friction = 0.2;
  }

  collide() {
    for (let i = this.id + 1; i < this.e.length; i++) {
      let dx = this.e[i].position.x - this.position.x;
      let dy = this.e[i].position.y - this.position.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.e[i].w / 2 + this.w / 2;

      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.position.x + cos(angle) * minDist;
        let targetY = this.position.y + sin(angle) * minDist;

        this.acceleration.set(
          targetX - this.e[i].position.x,
          targetY - this.e[i].position.y
        );
        this.velocity.sub(this.acceleration);
        this.e[i].velocity.add(this.acceleration);

        //TODO : Effets bizarre quand on empile les boules (chevauchement)

        this.velocity.mult(this.friction);
      }
    }
  }

  move() {
    this.velocity.add(createVector(0, this.gravity));
    this.position.add(this.velocity);
  }

  display(displayMass) {
    if (this.progressiveWidth < this.w) {
      this.progressiveWidth += this.w / 10;
    }
    // Calculate the aspect ratio of the image
    let aspectRatio = this.img.width / this.img.height;

    // Calculate the new height based on the progressive width and the aspect ratio
    let newHeight = this.progressiveWidth / aspectRatio;

    // Use the loaded image for the ball and display it with the new dimensions
    image(
      this.img,
      this.position.x - this.progressiveWidth / 2,
      this.position.y - newHeight / 2, // Center the image vertically
      this.progressiveWidth,
      newHeight
    );

    if (displayMass) {
      strokeWeight(1);
      textSize(10);
      let tempTW = textWidth(int(this.w));
      text(int(this.w), this.position.x - tempTW / 2, this.position.y + 4);
    }
  }

  checkCollisions() {
    if (this.position.x > width - this.w / 2) {
      this.velocity.x *= -this.friction;
      this.position.x = width - this.w / 2;
    } else if (this.position.x < this.w / 2) {
      this.velocity.x *= -this.friction;
      this.position.x = this.w / 2;
    }

    if (this.position.y > Y_GROUND - this.w / 2) {
      this.velocity.x -= this.velocity.x / 100;
      this.velocity.y *= -this.friction;
      this.position.y = Y_GROUND - this.w / 2;
    } else if (this.position.y < this.w / 2) {
      this.velocity.y *= -this.friction;
      this.position.y = this.w / 2;
    }
  }
}

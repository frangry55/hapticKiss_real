// Vira, P. (2024) p5.js Coding Tutorial | Slime Molds (Physarum). 23 February. Available at: https://www.youtube.com/watch?v=VyXxSNcgDtg
// Vira, P. (2024) Slime Molds. Available at: https://p5js.org/sketches/2213463/

class Mold {

  constructor() {

    //location of mould
    this.x = width / 2;
    this.y = height / 2;

    // radius
    this.r = 0.25;

    //direction / angle it is heading in
    this.heading = random(360);

    //angle mould takes
    this.rotAngle = random(30, 90);

    // polar to cartesian cooridnates
    this.vx = cos(this.heading);
    this.vy = sin(this.heading);

    // declaring variables for the sensing components - vectors hold 2x values. we need a left, center and right sensor to determine which direction the slime mould will move
    this.rSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);

    this.sensorAngle = 15;
    this.sensorDist = 15;

  }

  update() {

    let vol = mic.getLevel();
    let stepSize = 0;

    // Drawing pauses when mic vol is below certain level
    if (vol > 0.01) {
      stepSize = map(vol, 0.01, 0.2, 0.5, 7);
    } else {
      stepSize = 0;
    }

    //smooth the pitch value using linear interpolation
    if (currentPitch > 0) {
      smoothPitch = lerp(smoothPitch, currentPitch, 0.05);
    }

    let freqTurn = map(smoothPitch, 5, 255, -10, 5);
    this.heading += freqTurn;

    this.vx = cos(this.heading) * stepSize;
    this.vy = sin(this.heading) * stepSize;

    // Only update position if we are moving
    this.x += this.vx;
    this.y += this.vy;

    console.log("this.x", this.x);
    console.log("this.y", this.y);

    if (stepSize > 0.1) {
      //sensing conditions based on current position of the slime mold
      this.rSensorPos.x = this.x +
        this.sensorDist * cos(this.heading + this.sensorAngle);
      this.rSensorPos.y = this.y +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * sin(this.heading + this.sensorAngle);

      this.lSensorPos.x = this.x +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * cos(this.heading - this.sensorAngle);
      this.lSensorPos.y = this.y +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * sin(this.heading - this.sensorAngle);

      this.fSensorPos.x = this.x +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * cos(this.heading);
      this.fSensorPos.y = this.y +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * sin(this.heading);

      let index;
      let l;
      let f;
      let r;

      index = 4 * (d * floor(this.rSensorPos.y)) * (d * width) + 4 * (d * floor(this.rSensorPos.x));
      r = pixels[index];

      index = 4 * (d * floor(this.lSensorPos.y)) * (d * width) + 4 * (d * floor(this.lSensorPos.x));
      l = pixels[index];

      index = 4 * (d * floor(this.fSensorPos.y)) * (d * width) + 4 * (d * floor(this.fSensorPos.x));
      f = pixels[index];

      //deciding which direction the mould will take
      if (f > l && f > r) {
        this.heading += 0;
      } else if (f < l && f < r) {
        if (random(1) < 0.5) {
          this.heading += this.rotAngle;
        }
      } else if (l > r) {
        this.heading += -this.rotAngle;
      } else if (r > l) {
        this.heading += this.rotAngle;
      }
    }
  }

  edges() {
    if (this.x >= width) {
      this.x = 1;
    }
    if (this.x <= 0) {
      this.x = width;
    }
    if (this.y >= height) {
      this.y = 1;
    }
    if (this.y <= 0) {
      this.y = height - 1;
    }
  }

  //displaying the slime mould
  display() {

    circleSize = map(smoothPitch, 50, 355, 0.1, 7);
    circleAlpha = map(smoothPitch, 50, 355, 10, 150);
    circleColourRed = map(smoothPitch, 50, 255, 0, 255);
    circleColourGreen = map(smoothPitch, 50, 255, 0, 105);
    circleColourBlue = map(smoothPitch, 50, 255, 0, 105);

    strokeWeight(circleSize);
    stroke(circleColourRed, circleColourGreen, circleColourBlue, circleAlpha);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);

  }
}
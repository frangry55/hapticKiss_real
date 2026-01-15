// Vira, P. (2024) p5.js Coding Tutorial | Slime Molds (Physarum). 23 February. Available at: https://www.youtube.com/watch?v=VyXxSNcgDtg
// Vira, P. (2024) Slime Molds. Available at: https://p5js.org/sketches/2213463/
  
class Mold {

  constructor() {

    //location of mould
    this.pos = createVector(width/2, height/2);

    // radius
    this.r = 0.25;

    //direction / angle it is heading in
    this.heading = random(360);

    //angle mould takes
    this.rotAngle = random(360);

    // polar to cartesian cooridnates
    this.vel = createVector(cos(this.heading), sin(this.heading))

    // declaring variables for the sensing components - vectors hold 2x values. we need a left, center and right sensor to determine which direction the slime mould will move
    this.rSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);

    this.sensorAngle = 90;
    this.sensorDist = random(30, 70);

  }

  update() {

    let vol = mic.getLevel();
    let stepSize = 0;

    // Drawing pauses when mic vol is below certain level
    if (vol > 0.03) {
      stepSize = map(vol, 0.01, 0.25, 0.5, 1);
    } else {
      stepSize = 0;
    }

    //smooth the pitch value using linear interpolation
    if (currentPitch > 0) {
      smoothPitch = lerp(smoothPitch, currentPitch, 0.05);
    }

    getEn = fft.getEnergy("bass");

    let mapBass = map(getEn, 0, 300, -10, 5);
    console.log("getEn:", getEn);

    let freqTurn = map(smoothPitch, 5, 255, -10, 5);
    this.heading += mapBass;

    this.vel.x = cos(this.heading) * stepSize;
    this.vel.y = sin(this.heading) * stepSize;

    // Only update position if we are moving
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // console.log("this.x", this.pos.x);
    // console.log("this.y", this.pos.y);

    if (stepSize > 0.1) {
      //sensing conditions based on current position of the slime mold
      this.rSensorPos.x = this.pos.x +
        this.sensorDist * cos(this.heading + this.sensorAngle);
      this.rSensorPos.y = this.pos.y +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * sin(this.heading + this.sensorAngle);

      this.lSensorPos.x = this.pos.x +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * cos(this.heading - this.sensorAngle);
      this.lSensorPos.y = this.pos.y +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * sin(this.heading - this.sensorAngle);

      this.fSensorPos.x = this.pos.x +
        this.sensorDist * sin(this.heading + this.sensorAngle);
      this.sensorDist * cos(this.heading);
      this.fSensorPos.y = this.pos.y +
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
    if (this.pos.x >= width) {
      this.pos.x = 1;
    }
    if (this.pos.x <= 0) {
      this.pos.x = width;
    }
    if (this.pos.y >= height) {
      this.pos.y = 1;
    }
    if (this.pos.y <= 0) {
      this.pos.y = height - 1;
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
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

  }
}
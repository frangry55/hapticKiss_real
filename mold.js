// Vira, P. (2024) p5.js Coding Tutorial | Slime Molds (Physarum). 23 February. Available at: https://www.youtube.com/watch?v=VyXxSNcgDtg
// Vira, P. (2024) Slime Molds. Available at: https://p5js.org/sketches/2213463/

class Mold {

  constructor() {

    //location of mould
    this.pos = createVector(0, 0, 0);

    // radius
    this.r = 0.25;

    //direction / angle it is heading in
    this.theta = random(180);
    this.phi = random(360);

    //angle mould takes
    this.rotAngle = random(360);

    // polar to cartesian cooridnates
    this.vel = createVector(0, 0, 0)

    // declaring variables for the sensing components - vectors hold 2x values. we need a left, center and right sensor to determine which direction the slime mould will move
    this.rSensorPos = createVector(0, 0);
    this.fSensorPos = createVector(0, 0);
    this.lSensorPos = createVector(0, 0);

    //adding 3rd dimension
    this.uSensorPos = createVector(0, 0);
    this.dSensorPos = createVector(0, 0);

    this.sensorAngle = 90;
    this.sensorDist = random(2);

  }

  update() {

    let vol = mic.getLevel();
    let stepSize = 0;

    // Drawing pauses when mic vol is below certain level
    if (vol > 0.03) {
      stepSize = map(vol, 0.01, 0.25, 0.5, 2);
    } else {
      stepSize = 0;
    }

    //smooth the pitch value using linear interpolation
    if (currentPitch > 0) {
      smoothPitch = lerp(smoothPitch, currentPitch, 0.05);
    }

    getEn = fft.getEnergy("bass");

    let mapBass = map(getEn, 0, 250, -20, 20);
    console.log("getEn:", getEn);

    let freqTurn = map(smoothPitch, 5, 255, -10, 5);
    this.heading += mapBass;

    let dir = p5.Vector.fromAngles(radians(this.theta), radians(this.phi));
    this.vel = dir.copy().mult(stepSize);

    // Only update position if we are moving
    this.pos.add(this.vel);

    //sensor directions
    let fDir = p5.Vector.fromAngles(radians(this.theta), radians(this.phi));
    this.fSensorPos = p5.Vector.add(this.pos, fDir.mult(this.sensorDist));

    let lDir = p5.Vector.fromAngles(radians(this.theta - this.sensorAngle), radians(this.phi));
    this.lSensorPos = p5.Vector.add(this.pos, lDir.mult(this.sensorDist));

    // Right Sensor (Rotate theta)
    let rDir = p5.Vector.fromAngles(radians(this.theta + this.sensorAngle), radians(this.phi));
    this.rSensorPos = p5.Vector.add(this.pos, rDir.mult(this.sensorDist));

    let fVal = this.getPixelVal(this.fSensorPos.x, this.fSensorPos.y);
    let lVal = this.getPixelVal(this.lSensorPos.x, this.lSensorPos.y);
    let rVal = this.getPixelVal(this.rSensorPos.x, this.rSensorPos.y);

    if (fVal > lVal && fVal > rVal) {
      //do nothing
    } else if (fVal < lVal && fVal < rVal) {
      this.theta += random(-this.rotAngle, this.rotAngle);
      this.phi += random(-this.rotAngle, this.rotAngle);
    } else if (lVal > rVal) {
      this.theta -= this.rotAngle;
    } else if (rVal > lVal) {
      this.theta += this.rotAngle;
    }
  }

  getPixelVal(x, y) {
    // 1. Offset coordinates because WEBGL 0,0 is center, but Image 0,0 is top-left
    let px = floor(x + width / 2);
    let py = floor(y + height / 2);

    // 2. Check bounds so we don't crash
    if (px < 0 || px >= width || py < 0 || py >= height) {
      return 0;
    }

    // 3. Get pixel index
    // Note: 'd' is pixelDensity from your main sketch
    let index = 4 * (d * py) * (d * width) + 4 * (d * px);

    // Return the Red channel value (0-255)
    return pixels[index];
  }


  edges() {

    let boxSize = createVector(width, height, height);
    if (this.pos.x > boxSize.x) this.pos.x = -boxSize.x;
    if (this.pos.x < -boxSize.x) this.pos.x = boxSize.x;
    if (this.pos.y > boxSize.y) this.pos.y = -boxSize.y;
    if (this.pos.y < -boxSize.y) this.pos.y = boxSize.y;
    if (this.pos.z > boxSize.z) this.pos.z = -boxSize.z;
    if (this.pos.z < -boxSize.z) this.pos.z = boxSize.z;

  }

  //displaying the slime mould
  display() {

    circleSize = map(smoothPitch, 50, 355, 0.1, 7);
    circleAlpha = map(smoothPitch, 50, 355, 10, 150);
    circleColourRed = map(smoothPitch, 50, 255, 0, 255);
    circleColourGreen = map(smoothPitch, 50, 255, 0, 105);
    circleColourBlue = map(smoothPitch, 50, 255, 0, 105);

    push();
    strokeWeight(circleSize);
    fill(circleColourRed, circleColourGreen, circleColourBlue, circleAlpha);
    strokeWeight(1);
    stroke(circleColourRed, circleColourGreen, circleColourBlue, circleAlpha);
    translate(this.pos.x, this.pos.y, this.pos.z);
    sphere(this.r, 10, 10);
    pop();

  }
}
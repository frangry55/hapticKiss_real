let circleSize = 1;
let circleAlpha;
let circleColourRed;
let circleColourGreen;
let circleColourBlue;
  
//sound input
let audioContextOn = false;
let sound;
let amplitude;
let fft;
let vol;

//loading ml5 pitch reader - Jenny-yw, ml5 pitch detection. Available at: https://editor.p5js.org/Jenny-yw/sketches/J1GteCrzt 
const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let currentPitch = 0;
let smoothPitch = 0;
let getEn;

//testing slime mould with voice
let molds = [];
let numMolds = 105;
let d;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  //suspend audio context because it won't be able to start until the user starts it in VS Code
  //Aston, R. (no date) MicrophoneVolume. Available at: https://editor.p5js.org/beckyaston/sketches/spJnV30qW
  getAudioContext().suspend();

  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

  angleMode(DEGREES);

  d = pixelDensity();

  for (let i = 0; i < numMolds; i++) {
    molds[i] = new Mold();
  }
}

function draw() {

  if (audioContextOn) {

    loadPixels();

    for (let i = 0; i < numMolds; i++) {
      molds[i].update();
      molds[i].edges();
      molds[i].display();
    }

    //testing mic input
    let level = mic.getLevel();
    console.log("mic.level:", level);

     let spectralCentroid = fft.getCentroid();

    //smooth the pitch value using limear interpolation
    if (currentPitch > 0) {
      smoothPitch = lerp(smoothPitch, currentPitch, 0.05);
    }

   

    console.log("smooth:", smoothPitch);

    let spectrum = fft.analyze(); //essential

  } else {
    background(255);
    fill(0);
    text("press ' f ' to activate mic and enter fullscreen", 20, 20)
  }
}


function listening() {
  console.log("listening");
  requestAnimationFrame(() => {
    pitch = ml5.pitchDetection(
      model_url,
      getAudioContext(),
      mic.stream,
      modelLoaded
    );
  });
}

function gotPitch(error, frequency) {
  if (error) {
    console.error(error);
  }

  if (frequency) {
    currentPitch = frequency;
    console.log("Pitch:", frequency);
  } else {
    console.log("No pitch (null)");
  }

  pitch.getPitch(gotPitch);
}

//loading ml5
function modelLoaded() {
  console.log('model loaded!');
  pitch.getPitch(gotPitch);
}

//window resize by Rebecca Aston
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  //toggle fullscreen on or off
  //Aston, R. (no date) fullscreen_mobile_interactions [Computer program]. Unpublished.

  if (key == 'f') {

    //get current full screen state 
    let fs = fullscreen();

    //switch it to the opposite of current value
    console.log("Full screen getting set to: " + !fs);
    fullscreen(!fs);

    //user starts audio on when full screen is activated
    if (!audioContextOn) {
      audioContextOn = true;
      userStartAudio();// start audio context
      mic.start(listening);

    }
  }

}
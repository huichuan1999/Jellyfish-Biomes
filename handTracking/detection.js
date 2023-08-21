let detections ={};
const videoElement = document.getElementById('video');

function gotHands(results) {
  detections = results;
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 1, // the max number of hands
  modelComplexity: 1, //maybe change to 0
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  delegate: "GPU"
});
hands.onResults(gotHands);


const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  // width: 2400/5,
  // height: 2400
  // width: window.innerWidth,
  // height: window.innerHeight
});
camera.start();
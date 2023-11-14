let detections ={};
const videoElement = document.getElementById('video');

function gotHands(results) {
  detections = results;
}

const hands = new Hands({locateFile: (file) => {
  return `./libraries/mediapipe-hands/${file}`;
}});
hands.setOptions({
 // runningMode: "VIDEO",
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
  // rotate: Math.PI/2,
  width: 1000/1.7,
  height: 1000
});
camera.start();

// console.log(videoElement.width, videoElement.height);
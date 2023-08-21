let detections ={};
const videoElement = document.getElementById('video');
//const canvasElement = document.getElementByClass("canvas");

function gotHands(results) {
  detections = results;
}

// const hands = new Hands({locateFile: (file) => {
//   return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
// }});
const hands = new Hands({locateFile: (file) => {
  return `./libraries/mediapipe-hands/${file}`;
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
  width: 2400/4,
  height: 2400
  // width: canvasElement.width,
  // height: canvasElement.height
});
camera.start();

// videoElement.width = canvas.width;
// videoElement.height = canvas.height;
// videoElement.style.width = canvas.width;
// videoElement.style.height = canvas.height;
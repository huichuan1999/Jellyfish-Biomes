let physics;
let tailPhysics;
let noGravityPhysics;

let particleGrabRadius = 30;

let handParticles = [];
let handAttractions = [];
const pinchThreshold = 50;
let canvas;

let draggedParticle = null;
let attraction;

function setup() {
  let canvasHeight = Math.min(windowHeight, 2400);//动态设置画布宽度
  let canvasWidth = canvasHeight / 3; // 对应的高度
  canvas = createCanvas(canvasWidth, canvasHeight);
  //canvas = createCanvas(2400,600);
  canvas.id("canvas");

  physics = new VerletPhysics2D();
  physics.setWorldBounds(new Rect(0,20, width, height));
  let gb0 = new GravityBehavior(new Vec2D(0, -0.01));// add gravity to tails
  physics.addBehavior(gb0);
 //physics.setDrag(0.001);

  tailPhysics = new VerletPhysics2D();
  tailPhysics.setWorldBounds(new Rect(0, 0, width, height));
  let gb = new GravityBehavior(new Vec2D(0, 0.1));// add gravity to tails
  tailPhysics.addBehavior(gb);
  tailPhysics.setDrag(0.02);

  noGravityPhysics = new VerletPhysics2D();
  noGravityPhysics.setDrag(0);

  attraction = new AttractionBehavior(new Vec2D(0, 0), height, 0.5, 0.2);//整体的环境吸引力
  physics.addBehavior(attraction);

  colorMode(HSB, 255);

  createStars();
  //createTreeCell();
  //createDNA();
  //createParticleNetrwork();

}

function draw() {
  clear();
  stroke(255);
  noFill();
  rect(0, 0, width, height);
  physics.update();
  tailPhysics.update();
  noGravityPhysics.update();


  drawHand();

  handDetected();
  pinchInteraction();

  drawStars();
  //drawTreeCell();
  //drawDNA();
  //drawParticleNetwork();

}

function handDetected() {

  //If detected hand
  const allLandmarkIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const allLandmarkCoordinates = getLandmarkCoordinates(allLandmarkIndices, detections);

  if (handParticles.length === 0) {
    addHandParticle(allLandmarkCoordinates);
  }

  //添加手部粒子对物理系统中粒子的影响
  for (let i = 0; i < handParticles.length; i++) {
    const index = allLandmarkIndices[i];
    if (index == 8 || index == 4) {
      continue; // // Skip keys with index 8 (index finger) or 4 (thumb)
    }
    const coord = allLandmarkCoordinates[index];
    if (coord) {
      handParticles[i].updatePosition(coord.x, coord.y);
    }

    //适用于tailphysics 的交互
    if (tailPhysics.behaviors.length < tailPhysics.particles.length + 19) {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      tailPhysics.addBehavior(handAttractions[i]);
    } else {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
    }
    //适用于physics 的交互
    if (physics.behaviors.length < physics.particles.length + 19) {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
      physics.addBehavior(handAttractions[i]);
    } else {
      handAttractions[i].attractor.set(handParticles[i].getPosition());
    }

  }

  //console.log(tailPhysics.particles.length,tailPhysics.behaviors, tailPhysics);

}

function pinchInteraction() {
  //Add pinch interaction
  const landmarkIndices = [8, 4];
  const landmarkCoordinates = getLandmarkCoordinates(landmarkIndices, detections);

  if (landmarkCoordinates[8] && landmarkCoordinates[4]) {
    const distance = calculateDistance(landmarkCoordinates[8], landmarkCoordinates[4]);

    if (distance < pinchThreshold) {
      // The pinch action occurs 捏合动作发生
      const midpoint = {
        x: (landmarkCoordinates[8].x + landmarkCoordinates[4].x) / 2,
        y: (landmarkCoordinates[8].y + landmarkCoordinates[4].y) / 2
      };
      fill(255);
      noStroke();
      ellipse(midpoint.x, midpoint.y, 20, 20);

      // 更新吸引行为的中心
      attraction.setAttractor(new Vec2D(midpoint.x, midpoint.y));
      attraction.setStrength(0.1);

      for (let dna of dnas) {
        for (let i = 0; i < 2; i++) {
            let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);

            if (d < 20) {
                dna.particles[i].set(width / 2, height / 2);
            }
        } //只探测最开始的粒子

        for (let i = dna.particles.length - 2; i < dna.particles.length; i++) {
            let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);

            if (d < 20) {
                dna.particles[i].set(random(midpoint.x-100,midpoint.x+100), random(midpoint.y-100,midpoint.y+100));
            }
        }
      }
      //捏合交互
      // for (let star of stars) {
      //   //for (let point of star.points) { 
      //     let d = dist(midpoint.x, midpoint.y, star.centerPoint.x, star.centerPoint.y);
      //     if (d < particleGrabRadius) {
      //       // star.centerPoint.lock();
      //       // star.centerPoint.x = midpoint.x;
      //       // star.centerPoint.y = midpoint.y;
      //       // star.centerPoint.unlock();
      //       draggedParticle = star.centerPoint;
      //       draggedParticle.set(midpoint.x, midpoint.y,);
      //       //break;
      //     }
      //   //}
      // }
    }
    else {
      draggedParticle = null;
      attraction.setStrength(0); //将吸引行为设置为0
    }
  } else {
    attraction.setStrength(0);
  }
}

function removeHandParticles() {
  for (let i = 0; i < handParticles.length; i++) {
    // 删除handAttractions的物理行为
    if (handAttractions[i]) {
      //console.log("Removing hand particles...");
      tailPhysics.removeBehavior(handAttractions[i]);
    }
    // 这里还可以添加其他必要的清理代码，例如从physics中删除粒子等
  }
  // 清空手部粒子和吸引力数组
  handParticles = [];
  handAttractions = [];
}

function drawHand() {
  //draw hand landmarks
  if (detections != undefined) {
    if (detections.multiHandLandmarks != undefined) {

      //console.log(detections);

      //draw landmarks 
      drawLines([0, 5, 9, 13, 17, 0]);//palm
      drawLines([0, 1, 2, 3, 4]);//thumb
      drawLines([5, 6, 7, 8]);//index finger
      drawLines([9, 10, 11, 12]);//middle finger
      drawLines([13, 14, 15, 16]);//ring finger
      drawLines([17, 18, 19, 20]);//pinky

      drawLandmarks([0, 1], 0);//palm base
      drawLandmarks([1, 5], 60);//thumb
      drawLandmarks([5, 9], 120);//index finger
      drawLandmarks([9, 13], 180);//middle finger
      drawLandmarks([13, 17], 240);//ring finger
      drawLandmarks([17, 21], 300);//pinky

    }
  }
}

// function windowResized() {
//   resizeCanvas(window.innerWidth, window.innerWidth / 4);
// }

function keyPressed() {
  //press the space to reload
  if (keyCode === 32) {
    location.reload();
  }
}
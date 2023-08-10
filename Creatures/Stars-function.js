let stars = [];
let angStars = [];
let numStars = 3;

function createStars() {
  for (let i = 0; i < numStars; i++) {
    let centerX = random(width / 6, width - width / 6);
    let centerY = random(height / 6, height - height / 6);
    angStars.push(random(3, 7));
    let innerRadius = random(10, 20);
    let outerRadius = innerRadius + random(10, 30);
    let star = new Star(centerX, centerY, angStars[i], innerRadius, outerRadius);
    stars.push(star);
  }
}

function drawStars() {

  for (let star of stars) {
    star.draw();
  }
  //draw tails
  for (let s of tailPhysics.springs) {
    line(s.a.x, s.a.y, s.b.x, s.b.y);
  }

}
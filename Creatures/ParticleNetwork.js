
class ParticleNetwork {
  constructor(physics, startPosition, stepDirection, numParticles, strength, damping) {
    this.particles = [];
    this.springs = [];

    for (let i = 0; i < numParticles; i++) {
      const particle = new VerletParticle2D(startPosition.add(stepDirection.scale(i)));
      physics.addParticle(particle);
      this.particles.push(particle);

      if (i > 0) {
        const prevParticle = this.particles[i - 1];
        const spring = new VerletSpring2D(prevParticle, particle, stepDirection.magnitude(), strength);
        spring.damping = damping;
        physics.addSpring(spring);
        this.springs.push(spring);
      }

      for (let j = 0; j < 2; j++) {
        const branchDirection = stepDirection.rotate(Math.PI / 2).scale((j + 1) * 10);
        const branchParticle = new VerletParticle2D(particle.add(branchDirection));
        physics.addParticle(branchParticle);

        //在这里改变分叉的大小
        const branchSpring = new VerletSpring2D(particle, branchParticle, branchDirection.magnitude()/12, strength);
        branchSpring.damping = damping;
        physics.addSpring(branchSpring);
        this.springs.push(branchSpring);
      }
    }
  }

  display() {
    stroke(255, 80);
    strokeWeight(2);
    noFill();

    beginShape();
    for (const particle of this.particles) {
      vertex(particle.x, particle.y);
    }
    endShape();


    for (const spring of this.springs) {
      //stroke(255, 50);
      strokeWeight(1);
      line(spring.a.x, spring.a.y, spring.b.x, spring.b.y);
      if (spring.b !== this.particles[this.particles.indexOf(spring.a) + 1]) {
        stroke(255,100);
        fill(255,50);
        ellipse(spring.b.x, spring.b.y, 10, 10);
      }
    }

    for (const particle of this.particles) {
      stroke(255,100);
      ellipse(particle.x, particle.y, 3, 3);
    }
  }
}

let particleNetwork;

function createParticleNetrwork(){

  const startPosition = new Vec2D(width / 2, height / 2);
  const stepDirection = new Vec2D(1, 0).normalizeTo(10);
  const numParticles = 20;
  const strength = 0.01;
  const damping = 0.01;

  particleNetwork = new ParticleNetwork(physics, startPosition, stepDirection, numParticles, strength, damping);
}

function drawParticleNetwork(){

  // Allow mouse to control the first particle
  if (mouseIsPressed) {
    particleNetwork.particles[0].lock();
    particleNetwork.particles[0].set(mouseX, mouseY);
  } else {
    particleNetwork.particles[0].unlock();
  }

  particleNetwork.display();

}
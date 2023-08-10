
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

        const branchSpring = new VerletSpring2D(particle, branchParticle, branchDirection.magnitude()/5, strength);//在这里改变分叉的大小
        branchSpring.damping = damping;
        physics.addSpring(branchSpring);
        this.springs.push(branchSpring);
      }
    }
  }

  display() {
    stroke(255, 100);
    noFill();

    beginShape();
    for (const particle of this.particles) {
      vertex(particle.x, particle.y);
    }
    endShape();

    // for (const particle of this.particles) {
    //   ellipse(particle.x, particle.y, 5, 5);
    // }

    for (const spring of this.springs) {
      line(spring.a.x, spring.a.y, spring.b.x, spring.b.y);
      if (spring.b !== this.particles[this.particles.indexOf(spring.a) + 1]) {
        fill(255,50);
        ellipse(spring.b.x, spring.b.y, 10, 10);
      }
    }
  }
}
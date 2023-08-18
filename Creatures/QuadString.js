class ParticleQuadChain {
    constructor(physics, startPosition, stepDirection, numQuads, strength, damping) {
      this.particles = [];
      this.springs = [];
      this.physics = physics;
  
      let lastParticle;
      for (let i = 0; i < numQuads; i++) {
        const particleA = new VerletParticle2D(startPosition.add(stepDirection.scale(i * 2)));
        const particleB = new VerletParticle2D(particleA.add(stepDirection.rotate(-Math.PI / 2).scale(stepDirection.magnitude())));
  
        this.physics.addParticle(particleA);
        this.physics.addParticle(particleB);
        this.particles.push(particleA, particleB);
  
        if (i > 0) {
          const springA = new VerletSpring2D(lastParticle, particleA, stepDirection.magnitude(), strength);
          springA.damping = damping;
          this.physics.addSpring(springA);
          this.springs.push(springA);
        }
  
        const springB = new VerletSpring2D(particleA, particleB, stepDirection.magnitude(), strength);
        springB.damping = damping;
        this.physics.addSpring(springB);
        this.springs.push(springB);
  
        lastParticle = particleB;
      }
      for (let i = 0; i < this.particles.length; i++) {
        let repulsion = new AttractionBehavior(this.particles[i], 20, -0.7);
        this.physics.addBehavior(repulsion);
      }
    }
  
    display() {
      stroke(255, 100);
      fill(255,30);
      //noStroke();
      //noFill();
  
      for (let i = 0; i < this.particles.length - 3; i += 2) {
        beginShape();
        vertex(this.particles[i].x, this.particles[i].y);
        vertex(this.particles[i + 1].x, this.particles[i + 1].y);
        vertex(this.particles[i + 3].x, this.particles[i + 3].y);
        vertex(this.particles[i + 2].x, this.particles[i + 2].y);
        endShape(CLOSE);
      }
    }
  }
  
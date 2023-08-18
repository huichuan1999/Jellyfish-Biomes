class TriangleString {
    constructor(physics, startPosition, stepDirection, numParticles, strength, damping) {
      this.particles = [];
      this.springs = [];
  
      for (let i = 0; i < numParticles; i++) {
        const particle = new toxi.physics2d.VerletParticle2D(startPosition.add(stepDirection.scale(i)));
        physics.addParticle(particle);
        this.particles.push(particle);
  
        if (i > 0) {
          const prevParticle = this.particles[i - 1];
          const spring = new toxi.physics2d.VerletSpring2D(prevParticle, particle, stepDirection.magnitude(), strength);
          spring.damping = damping;
          physics.addSpring(spring);
          this.springs.push(spring);
        }
  
        // 添加额外的弹簧来连接每个三角形的第一个和第三个粒子
        if (i > 1) {
          const firstParticle = this.particles[i - 2];
          let spring;
          
          if (i % 2 == 0) {
            // 连接偶数的粒子（连接右侧的三角形）
            spring = new toxi.physics2d.VerletSpring2D(firstParticle, particle, stepDirection.magnitude() /2, strength);
          } else {
            // 连接奇数的粒子（连接左侧的三角形）
            const secondParticle = this.particles[i - 1];
            spring = new toxi.physics2d.VerletSpring2D(secondParticle, particle, stepDirection.magnitude() /2, strength);
          }
          
          spring.damping = damping;
          physics.addSpring(spring);
          this.springs.push(spring);
        }
      }
    }
  
    display() {
      stroke(255, 100);
      fill(255,30);
      //noFill();
  
      for (let i = 0; i < this.particles.length - 2; i += 2) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[i + 1];
        const particle3 = this.particles[i + 2];
  
        // 绘制一个三角形
        triangle(particle1.x, particle1.y, particle2.x, particle2.y, particle3.x, particle3.y);
      }
  
      // for (const particle of this.particles) {
      //   fill(255,50);
      //   ellipse(particle.x, particle.y, 5, 5);
      // }
    }
  }
  
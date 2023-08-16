class Butterfly {
    constructor(x, y, size) {
      this.centerParticle = new toxi.physics2d.VerletParticle2D(x, y);
      physics.addParticle(this.centerParticle);
  
      this.triangles = [];
      this.springLength = size;
      this.particles = [];
      this.pendantLength = size * 0.4;
      this.pendants = [];
  
      // 创建两个三角形
      for (let i = 0; i < 2; i++) {
        let p1 = new toxi.physics2d.VerletParticle2D(
          this.centerParticle.x + this.springLength * cos(i * PI),
          this.centerParticle.y + this.springLength * sin(i * PI)
        );
        let p2 = new toxi.physics2d.VerletParticle2D(
          this.centerParticle.x + this.springLength * cos(i * PI + PI / 2),
          this.centerParticle.y + this.springLength * sin(i * PI + PI / 2)
        );
  
        physics.addParticle(p1);
        physics.addParticle(p2);
  
        let s1 = new toxi.physics2d.VerletSpring2D(
          this.centerParticle,
          p1,
          this.springLength,
          0.01
        );
        let s2 = new toxi.physics2d.VerletSpring2D(
          this.centerParticle,
          p2,
          this.springLength,
          0.01
        );
        let s3 = new toxi.physics2d.VerletSpring2D(p1, p2, this.springLength, 0.01);
  
        physics.addSpring(s1);
        physics.addSpring(s2);
        physics.addSpring(s3);
  
        this.triangles.push([this.centerParticle, p1, p2]);
        this.particles.push(p1, p2);
      }
  
      // 添加两个三角形之间的弹簧
      let interTriangleSpring = new toxi.physics2d.VerletSpring2D(
        this.particles[0],
        this.particles[2],
        this.springLength * 2,
        0.005
      );
      let interTriangleSpring2 = new toxi.physics2d.VerletSpring2D(
        this.particles[1],
        this.particles[3],
        this.springLength * 2,
        0.005
      );
      physics.addSpring(interTriangleSpring);
      physics.addSpring(interTriangleSpring2);
  
      // 添加游离的particle作为吊坠
      for (let i = 0; i < this.particles.length; i++) {
        let angleOffset = i % 2 == 0 ? 0.1 : -0.1;
        let pendant = new toxi.physics2d.VerletParticle2D(
          this.particles[i].x + this.pendantLength * cos((TWO_PI / 4) * i + angleOffset),
          this.particles[i].y + this.pendantLength * sin((TWO_PI / 4) * i + angleOffset)
        );
  
        physics.addParticle(pendant);
        let spring = new toxi.physics2d.VerletSpring2D(
          this.particles[i],
          pendant,
          this.pendantLength,
          0.01
        );
        physics.addSpring(spring);
  
        this.pendants.push(pendant);
      }
    }
  
    display() {
      // 让中心的 particle 跟随鼠标
      this.centerParticle.set(mouseX, mouseY);
  
      // 绘制两个额外的弹簧
      stroke(255, 100); // 白色且透明度为100
      line(this.particles[0].x, this.particles[0].y, this.particles[2].x, this.particles[2].y);
      line(this.particles[1].x, this.particles[1].y, this.particles[3].x, this.particles[3].y);
  
      // 绘制两个三角形
      stroke(255);
      fill(255, 100);
      for (let tri of this.triangles) {
        beginShape();
        for (let p of tri) {
          vertex(p.x, p.y);
        }
        endShape(CLOSE);
      }
  
      // 绘制吊坠
      for (let i = 0; i < this.pendants.length; i++) {
        ellipse(this.pendants[i].x, this.pendants[i].y, 7, 7);  // 吊坠的小圆形表示
      }
  
      // 绘制蝴蝶的每个粒子
      for (let p of this.particles) {
        circle(p.x, p.y, 20);
      }
    }
  }
  
class DNA {
    constructor(x, y, length, distance, tailPhysics) {
        this.particles = [];
        this.springs = [];
        this.length = length;
        this.distance = distance;  // 新增的距离属性
        this.physics = tailPhysics;

        for (let i = 0; i < this.length; i++) {
            let particleA = new toxi.physics2d.VerletParticle2D(x, y + i * this.distance);
            let particleB = new toxi.physics2d.VerletParticle2D(x + this.distance, y + i * this.distance);
            physics.addParticle(particleA);
            physics.addParticle(particleB);
            this.particles.push(particleA, particleB);

            if (i > 0) {
                let springA = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2], particleA, this.distance, 0.01);
                let springB = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2 + 1], particleB, this.distance, 0.01);
                let crossSpringDistance = Math.sqrt(this.distance * this.distance * 2);  // 使用Pythagoras计算斜边距离
                let crossSpring = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2], particleB, crossSpringDistance, 0.01);
                let crossSpring2 = new toxi.physics2d.VerletSpring2D(this.particles[(i - 1) * 2 + 1], particleA, crossSpringDistance, 0.01);

                this.physics.addSpring(springA);
                this.physics.addSpring(springB);
                this.physics.addSpring(crossSpring);
                this.physics.addSpring(crossSpring2);
                this.springs.push(springA, springB, crossSpring, crossSpring2);
            }
        }
    }

    display() {
        for (let i = 0; i < this.particles.length; i++) {
            fill(255, 80);
            stroke(255,150);
            strokeWeight(1);
            if (i < 2 || i > this.particles.length - 3) {
                ellipse(this.particles[i].x, this.particles[i].y, 15);
            } else {
                ellipse(this.particles[i].x, this.particles[i].y, 7);
            }
        }

        // for (let i = 0; i < this.springs.length; i++) {
        //     stroke(255,100);
        //     line(this.springs[i].a.x, this.springs[i].a.y, this.springs[i].b.x, this.springs[i].b.y);
        // }
    }
}

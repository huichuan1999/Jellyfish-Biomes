let dnas = [];

function createDNA() {
    for (let i = 0; i < 4; i++) {
        //在画布下方生成
        dnas.push(new DNA(random(width / 6, width - width / 6), random(0, height / 4), random(3, 12), random(5,20),tailPhysics));
    }
}

function drawDNA() {
    for (let dna of dnas) {
        dna.display();
    }
}

// function DNAJump() {
//     //需要在pinch Interaction里面使用
//     for (let dna of dnas) {
//         for (let i = 0; i < 2; i++) {
//             let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);

//             if (d < 20) {
//                 dna.particles[i].set(width / 2, height / 2);
//             }
//         } //只探测最开始的粒子

//         for (let i = dna.particles.length - 2; i < dna.particles.length; i++) {
//             let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);

//             if (d < 20) {
//                 dna.particles[i].set(random(width), random(height));
//             }
//         }

//         //只探测倒数两个的粒子
//         //   for(let i = 0; i < dna.particles.length; i++) { 
//         //   let d = dist(midpoint.x, midpoint.y, dna.particles[i].x, dna.particles[i].y);
//         //   if (d < particleGrabRadius) {
//         //     dna.particles[i].lock();
//         //     dna.particles[i].x = midpoint.x;
//         //     dna.particles[i].y = midpoint.y;
//         //     dna.particles[i].unlock();
//         //   }
//         // }
//     }
// }
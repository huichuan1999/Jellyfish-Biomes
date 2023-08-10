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
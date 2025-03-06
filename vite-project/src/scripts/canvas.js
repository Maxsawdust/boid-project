import { Flock } from "../classes/Flock.js";
import { Boid } from "../classes/Boid.js";

// Get canvas div
const canvasDiv = document.getElementById("canvas");

// create canvas element
export const canvas = document.createElement("canvas");
canvas.width = canvasDiv.clientWidth;
canvas.height = canvasDiv.clientHeight;
canvasDiv.appendChild(canvas);

// Get the drawing context
export const context = canvas.getContext("2d");
// context is an object containing methods to draw to canvas

// function to draw a simple triangle
export function drawBoid(x, y, rotation) {
  /* .save() creates a snapshot of the canvas settings that you can return to later.
     This is useful when you may want to draw lots of similar objects, like boids,
     with different x and y postitions and rotations. */
  context.save();
  // setting the position of the boid
  context.translate(x, y);
  // setting the rotation of the boid
  context.rotate(rotation);

  // begin drawing path
  context.beginPath();
  context.moveTo(0, -10); // tip of triangle
  context.lineTo(-5, 10); // bottom left
  context.lineTo(5, 10); // bottom right
  // closing the path - connecting the triangle
  context.closePath();

  // Style and fill
  context.fillStyle = "black";
  context.fill();

  // this reverts the context back to the saved state for the next drawing.
  context.restore();
}

// creating a flock of boids
const flock = new Flock();

// storing all the boids in an array
export const boids = [];
for (let i = 0; i < flock.size; i++) {
  const randPosX = Math.random() * canvas.width;
  const randPosY = Math.random() * canvas.height;

  const randRot = Math.random() * 360;

  boids.push(new Boid(randPosX, randPosY, randRot, 1));
}

// defining a lastTime to calculate deltaTime
let lastTime = 0;

function animate() {
  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw all boids
  for (let boid of boids) {
    boid.cohere();
    boid.align();
    boid.separate();
    boid.update();
    boid.checkBounds();

    // Normalize velocity to maintain constant speed
    const speed = Math.sqrt(
      boid.velocity.x * boid.velocity.x + boid.velocity.y * boid.velocity.y
    );
    if (speed > boid.speed) {
      boid.velocity.x = (boid.velocity.x / speed) * boid.speed;
      boid.velocity.y = (boid.velocity.y / speed) * boid.speed;
    }

    drawBoid(boid.position.x, boid.position.y, boid.rotation);
  }

  requestAnimationFrame(animate);
}

// Start single animation loop
requestAnimationFrame(animate);

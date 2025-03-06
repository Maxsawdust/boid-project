import { Flock } from "./Flock.js";
import { canvas } from "../scripts/canvas.js";
import { boids } from "../scripts/canvas.js";

const flock = new Flock();

export class Boid extends Flock {
  constructor(posX, posY, rotation, speed) {
    super();

    this.rotation = rotation;

    this.speed = speed;

    this.position = {
      x: posX,
      y: posY,
    };

    this.velocity = {
      x: Math.cos(this.rotation) * speed,
      y: Math.sin(this.rotation) * speed,
    };

    this.steeringFactor = 0.01;
  }

  update() {
    // adding the velocity in either direction to the position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Updating rotation to match velocity direction
    this.rotation = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
  }

  checkBounds() {
    if (this.position.x > canvas.width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = canvas.width;
    if (this.position.y > canvas.height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = canvas.height;
  }

  getDistance(otherBoid) {
    const distanceX = this.position.x - otherBoid.position.x;
    const distanceY = this.position.y - otherBoid.position.y;

    return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  }

  detectBoids() {
    const nearbyBoids = boids.filter((other) => {
      if (this === other) {
        return false;
      }

      const distance = this.getDistance(other);
      return distance < flock.visionRadius;
    });

    return nearbyBoids;
  }

  align() {
    const nearbyBoids = this.detectBoids();
    if (nearbyBoids.length === 0) {
      return false;
    }

    // iterate through the nearby boids to average their velocity
    const averageXVel =
      nearbyBoids.reduce((a, b) => a + b.velocity.x, 0) / nearbyBoids.length;
    const averageYVel =
      nearbyBoids.reduce((a, b) => a + b.velocity.y, 0) / nearbyBoids.length;

    // get the direction vector
    const directionX = averageXVel - this.velocity.x * this.steeringFactor;
    const directionY = averageYVel - this.velocity.y * this.steeringFactor;

    // adjust velocity to steer towards center
    this.velocity.x += directionX;
    this.velocity.y += directionY;

    this.rotation = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI / 2;
  }

  cohere() {
    const nearbyBoids = this.detectBoids();
    if (nearbyBoids.length === 0) {
      return false;
    }
    // iterate through the nearby boids to average their position
    const averageXPos =
      nearbyBoids.reduce((a, b) => a + b.position.x, 0) / nearbyBoids.length;
    const averageYPos =
      nearbyBoids.reduce((a, b) => a + b.position.y, 0) / nearbyBoids.length;

    // get the direction vector
    const directionX = averageXPos - this.position.x;
    const directionY = averageYPos - this.position.y;

    // adjust velocity to steer towards center
    this.velocity.x += directionX * this.steeringFactor;
    this.velocity.y += directionY * this.steeringFactor;
  }

  separate() {
    const nearbyBoids = this.detectBoids();
    if (nearbyBoids.length === 0) {
      return false;
    }

    for (let boid of nearbyBoids) {
      const otherPosition = { x: boid.position.x, y: boid.position.y };
      const distance = this.getDistance(boid);
      const opposingForce = {
        x: (this.position.x - otherPosition.x) / (distance * distance),
        y: (this.position.y - otherPosition.y) / (distance * distance),
      };
      this.velocity.x += opposingForce.x;
      this.velocity.y += opposingForce.y;
    }
  }
}

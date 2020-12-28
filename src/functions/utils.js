import { c } from './';
import Swal from "sweetalert2";

/**
 * Returns the distance between two points 
 */
export function distanceBetween(ax, ay, bx, by) {
  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}
  
/**
 * Returns array with [x,y] of midpoint between two points
 * Both params should be [x,y]
 */
export function midPoint(a, b) {
  return [(a[0]+b[0])/2, (a[1]+b[1])/2];
}

/**
 * Convert the angle to 0 <= rad <= 2*PI 
 */
export function normalizeRadian(radians) {
  let retVal = radians;
  if (retVal < 0) {
    retVal += Math.PI * 2;
  }
  if (retVal > Math.PI * 2) {
    retVal -= Math.PI * 2;
  }
  return retVal;
}
  
/**
 * Calc gravity for point.
 * @return {x,y,dir} This will be the x and y forces applied to the object (not a point)
 */
export function calcGravity(x, y, planet) {
  let distance = distanceBetween(x, y, planet.x, planet.y);
  if (distance < 10) {
    distance = 10;
  }
  let gravityDirection = Math.atan2(x - planet.x, y - planet.y);
  let gravityX = c.GRAVITATIONAL_CONST * planet.mass / Math.pow(distance, 2) * -Math.sin(gravityDirection);
  let gravityY = c.GRAVITATIONAL_CONST * planet.mass / Math.pow(distance, 2) * -Math.cos(gravityDirection);
  return {x:gravityX, y:gravityY, dir:gravityDirection};
}

/**
 * @return the angle x1,y1 would need to face to point directly at x2,y2
 */
export function directionTo(x1,y1, x2,y2) {
  return normalizeRadian(Math.atan2(y2 - y1, x2 - x1));
}

/**
 * @return {xAmt, yAmt} splitting the dir and amount into x,y portions
 */
export function dirComponents(dir, amount) {
  let xAmt = amount * Math.cos(dir);
  let yAmt = amount * Math.sin(dir);
  return {xAmt, yAmt};
}

/**
 * @return an int between min and max inclusive
 */
export function randomInt(minP, maxP) {
  let min = Math.ceil(minP);
  let max = Math.floor(maxP);
  return Math.floor(Math.random() * (max - min +1) + min); 
}

/**
 * @return a random floating point number between min and max
 */
export function randomFloat(min, max) {
  return min + (Math.random() * (max - min));
}

/**
 * @return true 50% of the time
 */
export function randomBool() {
  return Math.random() > 0.5;
}

/**
 * @return add distance in direction to startX,startY 
 */
export function getPointFrom(startX, startY, dir, distance) {
  let x = startX + (distance * Math.cos(dir));
  let y = startY + (distance * Math.sin(dir));
  return {x,y};
}

/**
 * @return a collection of points [[x,y],[x,y]] on a rectangular sprite that can be used for collision detection
 * @param x,y global x,y position of sprite (on main map, not in viewport)
 */
export function getVertexData(x,y, sprite) {
  sprite.calculateVertices();
  let collisionPoints = []; // [[x,y],[x,y]]
  collisionPoints.push(toGlobal(x, y, sprite.vertexData[0], sprite.vertexData[1])); // top left
  collisionPoints.push(toGlobal(x, y, sprite.vertexData[2], sprite.vertexData[3])); // top right
  collisionPoints.push(toGlobal(x, y, sprite.vertexData[4], sprite.vertexData[5])); // bottom right
  collisionPoints.push(toGlobal(x, y, sprite.vertexData[6], sprite.vertexData[7])); // bottom left
  // Add a few points between to help with border collisions (these have already been converted to global)
  collisionPoints.push(midPoint(collisionPoints[0], collisionPoints[1]));
  collisionPoints.push(midPoint(collisionPoints[1], collisionPoints[2]));
  collisionPoints.push(midPoint(collisionPoints[2], collisionPoints[3]));
  collisionPoints.push(midPoint(collisionPoints[3], collisionPoints[0]));
  return collisionPoints;
}

/**
 * Converts the local sprite-based x,y to global based on ship's position
 * @return [x,y] in global map coordinates
 */
export function toGlobal(globalX,globalY, spriteX,spriteY) {
  return [globalX + (spriteX - c.HALF_SCREEN_WIDTH), globalY+ (spriteY - c.HALF_SCREEN_HEIGHT)];
}

/**
 * Sets up a keyboard listener
 */
export function keyboardListener(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
  };
  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
  };
  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  return key;
}

export function showToast(text) {
  Swal.fire({
    title: text,
    timer: 5000,
    position:'top',
    showConfirmButton: false,
    toast:true,
    width: Math.floor(c.SCREEN_WIDTH/2)+'px',
    showClass: {
      popup: 'animate__animated animate__slideInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__slideOutUp'
    }
  }).then();
}
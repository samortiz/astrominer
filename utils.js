import { GRAVITATIONAL_CONST } from './init.js';

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
  let gravityX = GRAVITATIONAL_CONST * planet.mass / Math.pow(distance, 2) * -Math.sin(gravityDirection);
  let gravityY = GRAVITATIONAL_CONST * planet.mass / Math.pow(distance, 2) * -Math.cos(gravityDirection);
  return {x:gravityX, y:gravityY, dir:gravityDirection};
}


/**
 * Sets up a keyboard listener
 */
export function keyboard(value) {
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
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
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
import { changeGameState } from "./game.js";
import { distanceBetween, normalizeRadian, midPoint, calcGravity } from "./utils.js";
import { GAME_STATE, world, SCREEN_HEIGHT, HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT, CRASH_SPEED,  MINIMAP_HEIGHT, MINIMAP_WIDTH,
  CRASH_ANGLE, ALLOWED_OVERLAP,DARK_GREY, MED_GREY, LIGHT_GREY, WHITE, RED, HALF_MINIMAP_VIEW_WIDTH, 
  HALF_MINIMAP_VIEW_HEIGHT, MINIMAP_SCALE_X, HALF_MINIMAP_WIDTH, HALF_MINIMAP_HEIGHT, MINIMAP_SCALE_Y } from './init.js';

export function enterFlyState() {
  console.log("Take off");
}

// Main play mode - flying
export function flyLoop(delta) {
  let ship = world.ship;
  // Keypress handling
  if (world.keys.left.isDown) {
    turnShip(ship, true);
  }
  if (world.keys.right.isDown) {
    turnShip(ship, false);
  }
  if (world.keys.up.isDown) {
    propelShip(ship);
  }
  if (world.keys.down.isDown) {
    brakeShip(ship);
  }
  // Find planets in view
  let planetsInView = [];
  for (let planet of world.planets) {
    if (planetInView(ship, planet)) {
      planetsInView.push(planet);
    }
  }
  // Gravity
  for (let planet of planetsInView) {
    let grav = calcGravity(ship.x, ship.y, planet);
    ship.vx += grav.x;
    ship.vy += grav.y;
  }
  // Momentum
  ship.x += ship.vx;
  ship.y += ship.vy;
  // Collisions
  for (let planet of planetsInView) {
    if (detectCollision(ship, planet)) {
      if (successfulLanding(ship, planet)) {
        landShip(ship, planet);
      } else {
        crash(ship);
      }
      return; // exit loop
    }
  }
  drawMiniMap();
}

/**
 * @return true if the planet is in view of the ship, false otherwise
 * NOTE: This will set the sprite.visible and sprite x/y attributes for the planet
 */
export function planetInView(ship, planet) {
  // Right side
  if ((ship.x + HALF_SCREEN_WIDTH + planet.radius < planet.x) || // Right
      (ship.x - HALF_SCREEN_WIDTH - planet.radius > planet.x) || // Left
      (ship.y + HALF_SCREEN_HEIGHT + planet.radius < planet.y) || // Bottom
      (ship.y - HALF_SCREEN_HEIGHT - planet.radius > planet.y)) { // Top
     planet.sprite.visible = false;
    return false;
  }
  planet.sprite.visible = true;
  // Set planet relative to the ship's viewport
  planet.sprite.x = (planet.x - ship.x) + HALF_SCREEN_WIDTH;
  planet.sprite.y = (planet.y - ship.y) + HALF_SCREEN_HEIGHT;
  return true;
}

// Returns true if there is a collision and false otherwise
function detectCollision(ship, planet) {
  ship.sprite.calculateVertices();
  let collisionPoints = []; // [[x,y],[x,y]]
  collisionPoints.push(toGlobal(ship, ship.sprite.vertexData[0], ship.sprite.vertexData[1])); // top left
  collisionPoints.push(toGlobal(ship, ship.sprite.vertexData[2], ship.sprite.vertexData[3])); // top right
  collisionPoints.push(toGlobal(ship, ship.sprite.vertexData[4], ship.sprite.vertexData[5])); // bottom right
  collisionPoints.push(toGlobal(ship, ship.sprite.vertexData[6], ship.sprite.vertexData[7])); // bottom left
  // Add a few points between to help with border collisions (these have already been converted to global)
  collisionPoints.push(midPoint(collisionPoints[0], collisionPoints[1]));
  collisionPoints.push(midPoint(collisionPoints[1], collisionPoints[2]));
  collisionPoints.push(midPoint(collisionPoints[2], collisionPoints[3]));
  collisionPoints.push(midPoint(collisionPoints[3], collisionPoints[0]));
  for (let point of collisionPoints) {
    let dist = distanceBetween(point[0], point[1], planet.x, planet.y);
    if (dist < planet.radius - ALLOWED_OVERLAP) { 
      return true;
    } 
  }
  return false;
}

/**
 * Converts the local sprite-based x,y to global based on ship's position
 * @return [x,y] in global map coordinates
 */
export function toGlobal(ship, x,y) {
  return [ship.x + (x-HALF_SCREEN_WIDTH), ship.y + (y-HALF_SCREEN_HEIGHT)];
}

function successfulLanding(ship, planet) {
  // atan2 has parameters (y,x)
  let planetDir = normalizeRadian(Math.atan2(ship.y - planet.y, ship.x - planet.x));
  let dirDiff = Math.abs(ship.sprite.rotation - planetDir);
  let speed = Math.abs(ship.vx) + Math.abs(ship.vy);
  // 0 and PI*2 are right beside each other, so large values are very close to small values
  return ((dirDiff < CRASH_ANGLE) || (dirDiff > (Math.PI * 2 - CRASH_ANGLE)))
         && (speed < CRASH_SPEED);
}

function landShip(ship, planet) {
  world.selectedPlanet = planet;
  // Stop moving (even though the event loop stops movement)
  ship.vx = 0;
  ship.vy = 0;
  //Set ship position and angle on the planet surface
  let dir = normalizeRadian(Math.atan2(ship.y - planet.y, ship.x - planet.x));
  let r = planet.radius + ship.sprite.height/2 + 5; 
  ship.x = planet.x + (r * Math.cos(dir));
  ship.y = planet.y + (r * Math.sin(dir));
  ship.sprite.rotation = dir;
  changeGameState(GAME_STATE.MANAGE);
}

function turnShip(ship, left) {
  ship.sprite.rotation = normalizeRadian(ship.sprite.rotation + ship.turnSpeed * (left ? -1 : 1));
}

function propelShip(ship) {
  ship.vx += ship.propulsion * Math.cos(ship.sprite.rotation);
  ship.vy += ship.propulsion * Math.sin(ship.sprite.rotation);
}

function brakeShip(ship) {
  ship.vx -= ship.vx * ship.brakeSpeedPct;
  ship.vy -= ship.vy * ship.brakeSpeedPct;
}

function crash(ship) {
  ship.x = world.shipStartX;
  ship.y = world.shipStartY;
  ship.vx = 0;
  ship.vy = 0;
  ship.sprite.rotation = 0;
}

function drawMiniMap() {
 let g = world.miniMapGraphics;
 let ship = world.ship;
 let l = 0;
 let t = SCREEN_HEIGHT - MINIMAP_HEIGHT;
 let r = MINIMAP_WIDTH;
 let b = SCREEN_HEIGHT;

  g.clear();

  // Background
  g.beginFill(DARK_GREY);
  g.lineStyle(1, MED_GREY); 
  g.drawRect(l, t, r, b);
  g.endFill();

  // Ship
  g.lineStyle(1, WHITE);
  g.drawCircle(l+MINIMAP_WIDTH/2,t+MINIMAP_HEIGHT/2, 2);

  // Planets
  for (let planet of world.planets) {
    if (planetOnMap(ship, planet)) {
      let x = l + HALF_MINIMAP_WIDTH + ((planet.x - ship.x) * MINIMAP_SCALE_X);
      let y = t + HALF_MINIMAP_HEIGHT + ((planet.y - ship.y) * MINIMAP_SCALE_Y);
      g.lineStyle(1, LIGHT_GREY);
      g.drawCircle(x,y, planet.radius * MINIMAP_SCALE_X);
    }
  }

}

function planetOnMap(ship, planet) {

  // Right side
  if ((ship.x + HALF_MINIMAP_VIEW_WIDTH + planet.radius < planet.x) || // Right
      (ship.x - HALF_MINIMAP_VIEW_WIDTH - planet.radius > planet.x) || // Left
      (ship.y + HALF_MINIMAP_VIEW_HEIGHT + planet.radius < planet.y) || // Bottom
      (ship.y - HALF_MINIMAP_VIEW_HEIGHT - planet.radius > planet.y)) { // Top
    return false;
  }
  return true;
}
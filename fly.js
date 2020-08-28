import { changeGameState } from "./game.js";
import { distanceBetween, normalizeRadian, midPoint, calcGravity } from "./utils.js";
import { GAME_STATE, world, SCREEN_WIDTH, SCREEN_HEIGHT, CRASH_SPEED, CRASH_ANGLE, ALLOWED_OVERLAP } from './init.js';

export function enterFlyState() {
  console.log("Take off");
}

// Main play mode - flying
export function flyLoop(delta) {
  let ship = world.ship;
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
  for (let planet of world.planets) {
    let grav = calcGravity(ship.sprite.x, ship.sprite.y, planet);
    ship.vx += grav.x;
    ship.vy += grav.y;
  }
  moveShip(ship);
}

function moveShip(ship) {
  ship.sprite.rotation = normalizeRadian(ship.sprite.rotation);
  // Momentum
  ship.sprite.x += ship.vx;
  ship.sprite.y += ship.vy;

  detectCollisions(ship);
  checkBounds(ship);
}

function detectCollisions(ship) {
  for (let planet of world.planets) {
    ship.sprite.calculateVertices();
    let collisionPoints = []; // [[x,y],[x,y]]
    collisionPoints.push([ship.sprite.vertexData[0], ship.sprite.vertexData[1]]); // top left
    collisionPoints.push([ship.sprite.vertexData[2], ship.sprite.vertexData[3]]); // top right
    collisionPoints.push([ship.sprite.vertexData[4], ship.sprite.vertexData[5]]); // bottom right
    collisionPoints.push([ship.sprite.vertexData[6], ship.sprite.vertexData[7]]); // bottom left
    // Add a few points between to help with border collisions
    collisionPoints.push(midPoint(collisionPoints[0], collisionPoints[1]));
    collisionPoints.push(midPoint(collisionPoints[1], collisionPoints[2]));
    collisionPoints.push(midPoint(collisionPoints[2], collisionPoints[3]));
    collisionPoints.push(midPoint(collisionPoints[3], collisionPoints[0]));
    for (let point of collisionPoints) {
      let dist = distanceBetween(point[0], point[1], planet.x, planet.y);
      let planetRadius = planet.width/2;
      if (dist < planetRadius - ALLOWED_OVERLAP) { 
        if (successfulLanding(ship, planet)) {
          landShip(ship, planet);
        } else {
          crash(ship);
        }
      }
    }
  }
}

function successfulLanding(ship, planet) {
  let planetDir = normalizeRadian(Math.atan2(ship.sprite.y - planet.y, ship.sprite.x - planet.x));
  let dirDiff = Math.abs(ship.sprite.rotation - planetDir);
  let speed = Math.abs(ship.vx) + Math.abs(ship.vy);
  // TODO: 0.01 and PI*2 are right beside each other, so large values are very close
  return ((dirDiff < CRASH_ANGLE) || (dirDiff > (Math.PI * 2 - CRASH_ANGLE)))
         && (speed < CRASH_SPEED);
}

function landShip(ship, planet) {
  world.selectedPlanet = planet;
  // Stop moving (even though the event loop stops movement)
  ship.vx = 0;
  ship.vy = 0;
  //Set ship position and angle on the planet surface
  let dir = normalizeRadian(Math.atan2(ship.sprite.y - planet.y, ship.sprite.x - planet.x));
  let r = planet.width/2 + ship.sprite.height/2 + 5; 
  let x = planet.x + (r * Math.cos(dir));
  let y = planet.y + (r * Math.sin(dir));
  ship.sprite.x = x;
  ship.sprite.y = y;
  ship.sprite.rotation = dir;
  changeGameState(GAME_STATE.MANAGE);
}

function checkBounds(ship) {
  let shipSize = ship.sprite.height/2 + 10;
  if (ship.sprite.x < shipSize) {
    ship.sprite.x = shipSize;
    ship.vx = 0;
  }
  if (ship.sprite.y < shipSize) {
    ship.sprite.y = shipSize;
    ship.vy = 0;
  }
  if (ship.sprite.x > SCREEN_WIDTH - shipSize) {
    ship.sprite.x = SCREEN_WIDTH - shipSize;
    ship.vx = 0;
  }
  if (ship.sprite.y > SCREEN_HEIGHT - shipSize) {
    ship.sprite.y = SCREEN_HEIGHT - shipSize;
    ship.vy = 0;
  }
}

function turnShip(ship, left) {
  ship.sprite.rotation += ship.turnSpeed * (left ? -1 : 1);
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
  ship.sprite.x = 100;
  ship.sprite.y = 100;
  ship.vx = 0;
  ship.vy = 0;
  ship.sprite.rotation = 0;
}

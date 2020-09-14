import { utils, c, game } from './';

export function enterFlyState() {
  console.log("Take off");
}

// Main play mode - flying
export function flyLoop(delta) {
  let world = window.world;
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
    let grav = utils.calcGravity(ship.x, ship.y, planet);
    ship.vx += grav.x;
    ship.vy += grav.y;
  }
  // move the ship
  ship.x += ship.vx;
  ship.y += ship.vy;
  moveBackground(ship);
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

export function moveBackground(ship) {
  let bgSprite = window.world.bgSprite;
  bgSprite.tilePosition.x = (100 - ship.x) + c.HALF_SCREEN_WIDTH;
  bgSprite.tilePosition.y = (100 - ship.y) + c.HALF_SCREEN_HEIGHT;
}

/**
 * @return true if the planet is in view of the ship, false otherwise
 * NOTE: This will set the sprite.visible and sprite x/y attributes for the planet
 */
export function planetInView(ship, planet) {
  // Right side
  if ((ship.x + c.HALF_SCREEN_WIDTH + planet.radius < planet.x) || // Right
      (ship.x - c.HALF_SCREEN_WIDTH - planet.radius > planet.x) || // Left
      (ship.y + c.HALF_SCREEN_HEIGHT + planet.radius < planet.y) || // Bottom
      (ship.y - c.HALF_SCREEN_HEIGHT - planet.radius > planet.y)) { // Top
     planet.sprite.visible = false;
    return false;
  }
  planet.sprite.visible = true;
  // Set planet relative to the ship's viewport
  planet.sprite.x = (planet.x - ship.x) + c.HALF_SCREEN_WIDTH;
  planet.sprite.y = (planet.y - ship.y) + c.HALF_SCREEN_HEIGHT;
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
  collisionPoints.push(utils.midPoint(collisionPoints[0], collisionPoints[1]));
  collisionPoints.push(utils.midPoint(collisionPoints[1], collisionPoints[2]));
  collisionPoints.push(utils.midPoint(collisionPoints[2], collisionPoints[3]));
  collisionPoints.push(utils.midPoint(collisionPoints[3], collisionPoints[0]));
  for (let point of collisionPoints) {
    let dist = utils.distanceBetween(point[0], point[1], planet.x, planet.y);
    if (dist < planet.radius - c.ALLOWED_OVERLAP) { 
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
  return [ship.x + (x-c.HALF_SCREEN_WIDTH), ship.y + (y-c.HALF_SCREEN_HEIGHT)];
}

function successfulLanding(ship, planet) {
  // atan2 has parameters (y,x)
  let planetDir = utils.normalizeRadian(Math.atan2(ship.y - planet.y, ship.x - planet.x));
  let dirDiff = Math.abs(ship.sprite.rotation - planetDir);
  let speed = Math.abs(ship.vx) + Math.abs(ship.vy);
  // 0 and PI*2 are right beside each other, so large values are very close to small values
  return ((dirDiff < ship.crashAngle) || (dirDiff > (Math.PI * 2 - ship.crashAngle)))
         && (speed < ship.crashSpeed);
}

function landShip(ship, planet) {
  window.world.selectedPlanet = planet;
  // Stop moving (even though the event loop stops movement)
  ship.vx = 0;
  ship.vy = 0;
  //Set ship position and angle on the planet surface
  let dir = utils.normalizeRadian(Math.atan2(ship.y - planet.y, ship.x - planet.x));
  let r = planet.radius + ship.sprite.width/2; 
  ship.x = planet.x + (r * Math.cos(dir));
  ship.y = planet.y + (r * Math.sin(dir));
  ship.sprite.rotation = dir;
  game.changeGameState(c.GAME_STATE.MANAGE);
}

function turnShip(ship, left) {
  ship.sprite.rotation = utils.normalizeRadian(ship.sprite.rotation + ship.turnSpeed * (left ? -1 : 1));
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
  ship.vx = 0;
  ship.vy = 0;
  window.world.ship.sprite.visible = false;
  let crashSprite = window.world.crashSprite;
  crashSprite.play();
  // This function runs after the animation finishes a loop
  crashSprite.onLoop= () => {
    ship.x = window.world.shipStartX;
    ship.y = window.world.shipStartY;
    ship.sprite.rotation = 0;
    crashSprite.stop(); // pause until we crash again
    window.world.ship.sprite.visible = true;
  };
}

export function drawMiniMap() {
 let g = window.world.miniMapGraphics;
 let ship = window.world.ship;
 let l = 0;
 let t = c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT;
 let r = c.MINIMAP_WIDTH;
 let b = c.SCREEN_HEIGHT;

  g.clear();

  // Background
  g.beginFill(c.DARK_GREY);
  g.lineStyle(1, c.MED_GREY); 
  g.drawRect(l, t, r, b);
  g.endFill();

  // Planets
  for (let planet of window.world.planets) {
    if (planetOnMap(ship, planet)) {
      let x = l + c.HALF_MINIMAP_WIDTH + ((planet.x - ship.x) * c.MINIMAP_SCALE_X);
      let y = t + c.HALF_MINIMAP_HEIGHT + ((planet.y - ship.y) * c.MINIMAP_SCALE_Y);
      g.lineStyle(1, c.LIGHT_GREY);
      g.drawCircle(x,y, planet.radius * c.MINIMAP_SCALE_X);
      // Buildings
      for (let building of planet.buildings) {
        let buildingX = l + c.HALF_MINIMAP_WIDTH + ((building.x - ship.x) * c.MINIMAP_SCALE_X) -1.5; 
        let buildingY = t + c.HALF_MINIMAP_HEIGHT + ((building.y - ship.y) * c.MINIMAP_SCALE_Y) -1.5;
        g.lineStyle(1, c.RED); 
        g.drawRect(buildingX,buildingY,3,3); 
      }
    }
  }

  // Ship
  g.lineStyle(1, c.WHITE);
  g.drawCircle(l+c.MINIMAP_WIDTH/2,t+c.MINIMAP_HEIGHT/2, 2);
}

function planetOnMap(ship, planet) {
  // Right side
  if ((ship.x + c.HALF_MINIMAP_VIEW_WIDTH + planet.radius < planet.x) || // Right
      (ship.x - c.HALF_MINIMAP_VIEW_WIDTH - planet.radius > planet.x) || // Left
      (ship.y + c.HALF_MINIMAP_VIEW_HEIGHT + planet.radius < planet.y) || // Bottom
      (ship.y - c.HALF_MINIMAP_VIEW_HEIGHT - planet.radius > planet.y)) { // Top
    return false;
  }
  return true;
}

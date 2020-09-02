import { c, utils, game } from './';

export function enterManageState() {
  console.log("enter manage state");
}

// When managing planet resources - loop runs 60/s
export function manageLoop(delta) {
  if (window.world.keys.up.isDown) {
    takeOff();
  }
}

function takeOff() {
  let world = window.world;
  let ship = world.ship;
  game.changeGameState(c.GAME_STATE.FLY);
  let gravity = utils.calcGravity(ship.x, ship.y, world.selectedPlanet);
  ship.vx = gravity.x * -c.TAKEOFF_SPEED;
  ship.vy = gravity.y * -c.TAKEOFF_SPEED;
  ship.x += ship.vx * c.TAKEOFF_BOOST;
  ship.y += ship.vy * c.TAKEOFF_BOOST;
}

export function buildMine() {
  let world = window.world;
  let mine = {type: c.BUILDING_TYPE_MINE};
  let planet = world.selectedPlanet;
  let ship = world.ship;

  //Setup the graphics
  let sheet = window.PIXI.Loader.shared.resources[c.SPRITESHEET_JSON].spritesheet;
  mine.sprite = new window.PIXI.AnimatedSprite(sheet.animations[c.MINE_FILE]);
  mine.sprite.animationSpeed = c.MINE_ANIMATION_SPEED; 
  mine.sprite.play();
  mine.sprite.anchor.set(0.5, 0.5);
  mine.sprite.scale.set(c.MINE_SCALE, c.MINE_SCALE);

  // Place the mine (to the right of the ship)
  mine.sprite.rotation = getBuildingPlacementRotation(ship, planet, c.MINE_PLACEMENT_FROM_SHIP);
  // Calculate an X,Y point near the ship on surface of the planet
  // NOTE: we use sprite.height for width because all sprites face to the right (0 rotation)
  let {x,y,rotation} = getAvailablePlanetXY(planet, ship, mine.sprite.rotation, mine.sprite.height/2, 0);
  if (x === null) {
    console.warn("Unable to place mine");
    return;
  }
  mine.x = x;
  mine.y = y;
  mine.sprite.rotation = rotation;
  mine.sprite.x = (mine.x - planet.x);
  mine.sprite.y = (mine.y - planet.y);

  planet.sprite.addChild(mine.sprite);
  game.payBuildingCost(planet, ship, c.MINE_COST);
  planet.buildings.push(mine);
}

/**
 * @return the rotation direction of a place some distance to the right of the ship
 */
export function getBuildingPlacementRotation(ship, planet, distanceFromShip) {
  let deg = ship.sprite.rotation + Math.PI/2; // 90 deg (right of the ship)
  let degX = ship.x + distanceFromShip  * Math.cos(deg); // Some point Xpx to the right of the ship
  let degY = ship.y + distanceFromShip * Math.sin(deg);
  // Calculate the rotation direction to get to that point
  return utils.normalizeRadian(Math.atan2(degY - planet.y, degX - planet.x));

}

/**
 * @return {x,y} for the next free space to the right of the ship on the planet circumfrence 
 */
export function getAvailablePlanetXY(planet, ship, rotation, buildingWidth, count) {
  if (buildingFits(planet, ship, rotation, buildingWidth)) {
    let x = planet.x + ((planet.radius + 10) * Math.cos(rotation));
    let y = planet.y + ((planet.radius + 10) * Math.sin(rotation));
    return {x,y, rotation};
  }
  // If we have done a full circle then give up
  if (count > (Math.PI*2 / c.BUILDING_PLACEMENT_ROTATION_INCREMENT)) {
    return {x:null, y:null, rotation:null};
  }
  return getAvailablePlanetXY(planet, ship, rotation+c.BUILDING_PLACEMENT_ROTATION_INCREMENT
    , buildingWidth, ++count);
}

export function buildingFits(planet, ship, rotation, buildingWidth) {
  let x = planet.x + ((planet.radius + 10) * Math.cos(rotation));
  let y = planet.y + ((planet.radius + 10) * Math.sin(rotation));
  // Min distance to building
  let minDist = utils.distanceBetween(x,y, ship.x, ship.y);
  let minBuildingWidth = ship.sprite.height/2;
  for (let building of planet.buildings) {
     let dist = utils.distanceBetween(x,y, building.x, building.y);
     if (dist < minDist) {
       minDist = dist;
       minBuildingWidth = building.sprite.height;
     }
  } 
  return (minDist > (buildingWidth/2 + minBuildingWidth/2 + 15));
}

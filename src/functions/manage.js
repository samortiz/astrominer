import { c, utils, fly, game } from './';

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
  fly.drawMiniMap(); // add building to minimap
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

/**
 * Move a resource ship <-> planet 
 */
export function transferResource(source, target, resourceType, requestedAmtStr, maxCapacity) {
  let requestedAmt = Number(requestedAmtStr);
  if (isNaN(requestedAmt)) {
    requestedAmt = 0;
  }
  let amt = requestedAmt;
  // requesting '' is requesting the entire source (same as requesting too much)
  if (requestedAmtStr === '' || (source[resourceType] - requestedAmt < 0)) {
    amt = source[resourceType];
  }
  // Cap to max capacity of target
  let spaceLeft =  maxCapacity - (target.titanium + target.gold + target.uranium);
  if ((maxCapacity > 0) && (spaceLeft < amt)) {
    amt = spaceLeft;
  }
  
  target[resourceType] += amt;
  source[resourceType] -= amt;
}

export function buildFactory() {
  let world = window.world;
  let planet = world.selectedPlanet;
  let ship = world.ship;
  let factory = {type: c.BUILDING_TYPE_FACTORY};

  //Setup the graphics
  let spritesheet = window.PIXI.Loader.shared.resources[c.SPRITESHEET_JSON].spritesheet;
  factory.sprite =  new window.PIXI.Sprite(spritesheet.textures[c.FACTORY_FILE]);
  factory.sprite.anchor.set(0.5, 0.5);
  factory.sprite.scale.set(c.FACTORY_SCALE, c.FACTORY_SCALE);

  // Place the mine (to the right of the ship)
  factory.sprite.rotation = getBuildingPlacementRotation(ship, planet, c.FACTORY_PLACEMENT_FROM_SHIP);
  // Calculate an X,Y point near the ship on surface of the planet
  // NOTE: we use sprite.height for width because all sprites face to the right (0 rotation)
  let {x,y,rotation} = getAvailablePlanetXY(planet, ship, factory.sprite.rotation, factory.sprite.height/2, 0);
  if (x === null) {
    console.warn("Unable to place factory");
    return;
  }
  factory.x = x;
  factory.y = y;
  factory.sprite.rotation = rotation;
  factory.sprite.x = (factory.x - planet.x);
  factory.sprite.y = (factory.y - planet.y);

  planet.sprite.addChild(factory.sprite);
  game.payBuildingCost(planet, ship, c.FACTORY_COST);
  planet.buildings.push(factory);
  fly.drawMiniMap(); // add to minimap
} 

export function buildShip(shipTemplate) {
  let world = window.world;
  let planet = world.selectedPlanet;
  let ship = loadNewShip(shipTemplate);
  changeShip(ship, planet);
  return ship
}

export function loadNewShip(shipTemplate) {
  let newShip = game.createShip(shipTemplate);
  let oldShip = window.world.ship;
  let container = window.world.app.stage;
  window.world.ship = newShip;
  newShip.sprite.rotation= oldShip.sprite.rotation;
  fly.resetWeaponsCool(newShip);
  container.removeChild(oldShip.sprite);
  container.addChild(newShip.sprite);
  return newShip;
}

export function changeShip(newShip, planet) {
  let r = planet.radius + newShip.sprite.width/2; 
  newShip.x = planet.x + (r * Math.cos(newShip.sprite.rotation));
  newShip.y = planet.y + (r * Math.sin(newShip.sprite.rotation));
  // Set the sprite.x/y position of all the planets (moves your viewport slightly)
  for (let planet of window.world.planets) {
    fly.planetInView(newShip, planet);
  }
}

/**
 * @return true if the planet has a factory for the player
 */
export function hasFactory(planet) {
  for (let building of planet.buildings) {
    if (building.type === c.BUILDING_TYPE_FACTORY) {
      return true;
    }
  }
  return false;
}
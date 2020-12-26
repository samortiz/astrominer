import { c, utils, fly, game } from './';
import lodash from 'lodash';

export function enterManageState() {
  console.log("enter manage state");
}

// When managing planet resources - loop runs 60/s
export function manageLoop(delta) {
  if ((window.world.system.keys.up.isDown || window.world.system.keys.w.isDown)) {
    if (window.world.ship.alive && !window.world.system.isTyping) {
      takeOff();
    }
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
  mine.rotation = getBuildingPlacementRotation(ship, planet, c.MINE_PLACEMENT_FROM_SHIP);
  mine.sprite.rotation = mine.rotation;
  // Calculate an X,Y point near the ship on surface of the planet
  // NOTE: we use sprite.height for width because all sprites face to the right (0 rotation)
  let {x,y,rotation} = getAvailablePlanetXY(planet, ship, mine.sprite.rotation, mine.sprite.height/2, 0);
  if (x === null) {
    console.warn("Unable to place mine");
    return;
  }
  mine.x = x;
  mine.y = y;
  mine.rotation = rotation;
  mine.sprite.rotation = rotation;
  mine.sprite.x = (mine.x - planet.x);
  mine.sprite.y = (mine.y - planet.y);

  game.getPlanetSprite(planet).addChild(mine.sprite);
  game.payResourceCost(planet, ship, c.MINE_COST);
  planet.buildings.push(mine);
  fly.drawMiniMap(); // add building to minimap
}

/**
 * @return the rotation direction of a place some distance to the right of the ship
 */
export function getBuildingPlacementRotation(ship, planet, distanceFromShip) {
  let deg = ship.rotation + Math.PI/2; // 90 deg (right of the ship)
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
  let minBuildingWidth = ship.spriteHeight / 2;
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
  if (spaceLeft < amt) {
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
  factory.rotation = getBuildingPlacementRotation(ship, planet, c.FACTORY_PLACEMENT_FROM_SHIP);
  factory.sprite.rotation = factory.rotation;
  // Calculate an X,Y point near the ship on surface of the planet
  // NOTE: we use sprite.height for width because all sprites face to the right (0 rotation)
  let {x,y,rotation} = getAvailablePlanetXY(planet, ship, factory.sprite.rotation, factory.sprite.height/2, 0);
  if (x === null) {
    console.warn("Unable to place factory");
    return;
  }
  factory.x = x;
  factory.y = y;
  factory.rotation = rotation;
  factory.sprite.rotation = rotation;
  factory.sprite.x = (factory.x - planet.x);
  factory.sprite.y = (factory.y - planet.y);

  game.getPlanetSprite(planet).addChild(factory.sprite);
  game.payResourceCost(planet, ship, c.FACTORY_COST);
  planet.buildings.push(factory);
  fly.drawMiniMap(); // add to minimap
} 

/**
 * Called when the factory finishes building a new ship 
 */
export function buildShip(shipTemplate) {
  let world = window.world;
  let planet = world.selectedPlanet;
  let newShip = game.createShip(shipTemplate);
  planet.ships.push(newShip);
}

/**
 * Called when the user clicks to switch to a new ship 
 * NOTE: the new ship should already be created and stored in a planet
 */
export function switchToShip(newShip, planet) {
  console.log('switch to ship');
  let oldShip = window.world.ship;
  if (!removeShipFromStorage(newShip, planet)) {
    console.warn("Unable to remove ship from planet ",newShip," planet=",planet);
    return;
  }
  addShipToStorage(oldShip, planet);

  window.world.ship = newShip;
  // check to ensure oldShip is not destroyed
  if (oldShip && oldShip.alive && oldShip.spriteId) {
    fly.resetWeaponsCool(oldShip);
    const oldShipSprite = game.getShipSprite(oldShip);
    oldShipSprite.visible = false;
    oldShip.spriteId = null;
  }
  // Get the new sprite (adds it to the container)
  const newShipSprite = game.getShipSprite(newShip);
  newShipSprite.visible = true;
  if (oldShip && oldShip.alive) {
    newShip.rotation = oldShip.rotation;
  } else {
    newShip.rotation = planet.lastLandingDir;
  }
  newShipSprite.rotation = newShip.rotation;

  let r = planet.radius + (newShip.spriteWidth / 2);
  newShip.x = planet.x + (r * Math.cos(newShip.rotation));
  newShip.y = planet.y + (r * Math.sin(newShip.rotation));
  fly.repositionScreen();
}

/**
 * Removes a ship from the planet, returns null if no matching ship was found
 */
export function removeShipFromStorage(ship, planet) {
  let ships = planet.ships.filter((s) => s !== ship);
  let removedShip = ships.length < planet.ships.length;
  planet.ships = ships;
  return removedShip;
}

export function addShipToStorage(ship, planet) {
  // If the ship is not visible (and armorMax is zero) it has been destroyed
  // Some ships might be non-visible because they are not currently being used
  if (ship.alive && ship.armorMax > 0) {
    planet.ships.push(ship);
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

export function buildEquip(equipTemplate) {
  let planet = window.world.selectedPlanet;
  let equip = lodash.cloneDeep(equipTemplate);
  equip.id = lodash.uniqueId();
  planet.equip.push(equip);
}

export function costToRepair(ship) {
  return {titanium:(ship.armorMax - ship.armor), gold:0, uranium:0};
}

export function repairShip(planet, ship) {
  let cost = costToRepair(ship);
  let addArmor = ship.armorMax - ship.armor; // armor needed
  if (!game.canAfford(planet, ship, cost)) {
    let titaniumOnHand = planet.resources.stored.titanium + ship.resources.titanium;
    cost.titanium = titaniumOnHand;
    addArmor = titaniumOnHand;
  } 
  game.payResourceCost(planet, ship, cost);
  ship.armor += addArmor;
}

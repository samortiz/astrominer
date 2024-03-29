import { c, utils, fly, game, ai } from './';
import lodash from 'lodash';
import {EQUIP_TYPE_BRAKE, EQUIP_TYPE_PRIMARY_WEAPON, EQUIP_TYPE_THRUSTER} from "./constants";
import {canAfford, payResourceCost} from "./game";

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

export function takeOff(boost = 1) {
  let world = window.world;
  let ship = world.ship;
  game.changeGameState(c.GAME_STATE.FLY);
  let gravity = utils.calcGravity(ship.x, ship.y, world.selectedPlanet);
  ship.vx = gravity.x * -c.TAKEOFF_SPEED * boost;
  ship.vy = gravity.y * -c.TAKEOFF_SPEED * boost;
}

/**
 * @return Correct set of constants for the building type.
 * Maybe these constants could be moved into a variable or something
 */
function getBuildingInfo(buildingType) {
  if (buildingType === c.BUILDING_TYPE_FACTORY) {
    return {spriteScale:c.FACTORY_SCALE, spriteFile:c.FACTORY_FILE, animation:false};
  } else if (buildingType === c.BUILDING_TYPE_MINE) {
    return {spriteScale:c.MINE_SCALE, spriteFile:c.MINE_FILE, animation:true};
  }
  console.warn('Unknown building type ', buildingType);
  return {}
}

/**
 * Creates a factory sprite and adds it to the planet container using the factory x,y and rotation
 * NOTE: The building x,y,rot need to be set before calling this
 * @param building building to build
 * @param planet planet to build on
 * @param planetSprite optional, if null this will lookup the sprite using getPlanetSprite()
 */
export function makeBuildingSprite(building, planet, planetSprite = null) {
  const { spriteScale, spriteFile, animation } = getBuildingInfo(building.type);
  let spritesheet = window.PIXI.Loader.shared.resources[c.SPRITESHEET_JSON].spritesheet;
  let buildingSprite;
  if (animation) {
    buildingSprite = new window.PIXI.AnimatedSprite(spritesheet.animations[spriteFile]);
    buildingSprite.animationSpeed = c.MINE_ANIMATION_SPEED;
    buildingSprite.play();
  } else {
    buildingSprite = new window.PIXI.Sprite(spritesheet.textures[spriteFile]);
  }
  buildingSprite.anchor.set(0.5, 0.5);
  buildingSprite.scale.set(spriteScale, spriteScale);
  buildingSprite.rotation = building.rotation;
  buildingSprite.x = (building.x - planet.x);
  buildingSprite.y = (building.y - planet.y);
  buildingSprite.visible = true;
  if (!planetSprite) {
    planetSprite = game.getPlanetSprite(planet);
  }
  planetSprite.addChild(buildingSprite);
}

export function buildMine() {
  let world = window.world;
  let mine = {type: c.BUILDING_TYPE_MINE};
  let planet = world.selectedPlanet;
  let ship = world.ship;
  if (!canAfford(planet, ship, c.MINE_COST)) {
    console.log('Not enough resources to build a mine');
    return;
  }
  // Place the mine (to the right of the ship)
  const initRotation = getBuildingPlacementRotation(ship, planet, c.MINE_WIDTH);
  // Calculate an X,Y point near the ship on surface of the planet
  // NOTE: we use sprite.height for width because all sprites face to the right (0 rotation)
  let {x,y,rotation} = getAvailablePlanetXY(planet, ship, initRotation, c.MINE_WIDTH, 0);
  if (x === null) {
    console.warn("Unable to place mine");
    return;
  }
  mine.width = c.MINE_WIDTH;
  mine.x = x;
  mine.y = y;
  mine.rotation = rotation;
  // Setup the graphics
  makeBuildingSprite(mine, planet);
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
  let minBuildingWidth = buildingWidth;
  for (let building of planet.buildings) {
     let dist = utils.distanceBetween(x,y, building.x, building.y);
     if (dist < minDist) {
       minDist = dist;
       minBuildingWidth = building.width;
     }
  } 
  return (minDist > (buildingWidth/2 + minBuildingWidth/2 + 15));
}

/**
 * Move a resource ship <-> planet 
 */
export function transferResource(source, target, resourceType, requestedAmtStr, maxCapacity) {
  let requestedAmt = Number(requestedAmtStr);
  if (requestedAmt < 0) {
    requestedAmt = 0;
  }
  if (isNaN(requestedAmt)) {
    requestedAmt = 0;
  }
  let amt = requestedAmt;
  // requesting '' is requesting the entire source (same as requesting too much)
  if (requestedAmtStr === '' || (source[resourceType] - requestedAmt < 0)) {
    amt = source[resourceType];
  }
  // Cap to max capacity of target
  if (maxCapacity !== null) {
    let spaceLeft = maxCapacity - (target.titanium + target.gold + target.uranium);
    if (spaceLeft < amt) {
      amt = spaceLeft;
    }
  }
  target[resourceType] += amt;
  source[resourceType] -= amt;
}

/**
 * Move all resources to the planet
 */
export function unloadShip(ship, planet) {
  transferResource(ship.resources, planet.resources.stored, 'titanium', ship.resources.titanium, null);
  transferResource(ship.resources, planet.resources.stored, 'gold', ship.resources.gold, null);
  transferResource(ship.resources, planet.resources.stored, 'uranium', ship.resources.uranium, null);
}

/**
 * Choose some default resources to resupply the ship with.
 * This is for quick restocking of resources
 * NOTE: This may need to do multiple passes to fill up the space properly especially when planets are low on uranium
 */
export function resupplyShip(ship, planet) {
  const desiredAmt = Math.floor(ship.resourcesMax / 3);
  let freeAmt = ship.resourcesMax - (ship.resources.titanium + ship.resources.gold + ship.resources.uranium);
  if (freeAmt <= 0) {
    // no space for more resources
    return;
  }
  // 20 is the min required to build a mine - you probably want at least 20
  const desiredTitanium = desiredAmt >= 20 ? desiredAmt : 20;
  if (ship.resources.titanium < desiredTitanium) {
    transferResource(planet.resources.stored, ship.resources, 'titanium', desiredTitanium - ship.resources.titanium, ship.resourcesMax);
  }
  if (ship.resources.gold < desiredAmt) {
    transferResource(planet.resources.stored, ship.resources, 'gold', desiredAmt - ship.resources.gold, ship.resourcesMax);
  }
  // Fill up the rest of the space with uranium (it's the rarest)
  freeAmt = ship.resourcesMax - (ship.resources.titanium + ship.resources.gold + ship.resources.uranium);
  if (ship.resources.uranium < freeAmt) {
    transferResource(planet.resources.stored, ship.resources, 'uranium', freeAmt, ship.resourcesMax);
  }
  // If we still have space
  freeAmt = ship.resourcesMax - (ship.resources.titanium + ship.resources.gold + ship.resources.uranium);
  if (freeAmt > 0) {
    transferResource(planet.resources.stored, ship.resources, 'titanium', '', ship.resourcesMax);
    transferResource(planet.resources.stored, ship.resources, 'gold', '', ship.resourcesMax);
    transferResource(planet.resources.stored, ship.resources, 'uranium', '', ship.resourcesMax);
  }
}

export function buildFactory() {
  let world = window.world;
  let planet = world.selectedPlanet;
  let ship = world.ship;
  let factory = {type: c.BUILDING_TYPE_FACTORY};
  if (!canAfford(planet, ship, c.FACTORY_COST)) {
    console.log('Not enough resources to build a factory');
    return;
  }
  // Place the factory (to the right of the ship)
  const initialRotation = getBuildingPlacementRotation(ship, planet, c.FACTORY_WIDTH);
  // Calculate an X,Y point near the ship on surface of the planet
  // NOTE: we use sprite.height for width because all sprites face to the right (0 rotation)
  let {x,y,rotation} = getAvailablePlanetXY(planet, ship, initialRotation, c.FACTORY_WIDTH, 0);
  if (x === null) {
    console.warn("Unable to place factory");
    return;
  }
  factory.width = c.MINE_WIDTH;
  factory.x = x;
  factory.y = y;
  factory.rotation = rotation;
  planet.buildings.push(factory);

  // Setup the graphics
  makeBuildingSprite(factory, planet);

  game.payResourceCost(planet, ship, c.FACTORY_COST);
  fly.drawMiniMap(); // add to minimap
}

/**
 * Called when the factory finishes building a new ship 
 */
export function buildShip(shipTemplate) {
  let world = window.world;
  let planet = world.selectedPlanet;
  let ship = window.world.ship;
  if (!canAfford(planet, ship, shipTemplate.cost)) {
    return;
  }
  payResourceCost(planet, ship, shipTemplate.cost);

  if (shipTemplate.autonomousShip) {
    // Special equip that creates an autonomous ship
    launchDroidShip(shipTemplate);
  } else {
    let newShip = game.createShip(shipTemplate, c.PLAYER);
    planet.ships.push(newShip);
  }
}

/**
 * Called when the user clicks to switch to a new ship 
 * NOTE: the new ship should already be created and stored in a planet
 */
export function switchToShip(newShip) {
  let oldShip = window.world.ship;
  let selectedPlanet = window.world.selectedPlanet;
  let lastPlanetLanded = window.world.lastPlanetLanded;
  if (!removeShipFromStorage(newShip, selectedPlanet)) {
    console.warn("Unable to remove ship from planet ",newShip," planet=",selectedPlanet);
    return;
  }
  addShipToStorage(oldShip, lastPlanetLanded);

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
  newShip.rotation = selectedPlanet.lastLandingDir;
  newShipSprite.rotation = newShip.rotation;
  newShipSprite.position.set(c.HALF_SCREEN_WIDTH, c.HALF_SCREEN_HEIGHT);

  let r = selectedPlanet.radius + (newShip.spriteWidth / 2);
  newShip.x = selectedPlanet.x + (r * Math.cos(newShip.rotation));
  newShip.y = selectedPlanet.y + (r * Math.sin(newShip.rotation));
  window.world.lastPlanetLanded = selectedPlanet;
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

/**
 * Create a new piece of equipment from the template
 */
export function makeEquip(equipTemplate) {
  let equip = lodash.cloneDeep(equipTemplate);
  equip.id = window.world.nextId++;
  return equip;
}

export function buildEquip(equipTemplate) {
  let planet = window.world.selectedPlanet;
  let ship = window.world.ship;
  if (canAfford(planet, ship, equipTemplate.cost)) {
    payResourceCost(planet, ship, equipTemplate.cost);
    planet.equip.push(makeEquip(equipTemplate));
  }
}

export function launchDroidShip(equipTemplate) {
  const planet = window.world.selectedPlanet;
  const ship = window.world.ship;
  const child = game.createShip(equipTemplate, ship.owner);
  const childSprite = game.getShipSprite(child);
  const childDistFromShip = planet.radius + child.spriteWidth + 10;
  child.aiData = {homePlanet: planet, targetPlanet:null};
  child.x = planet.x;
  child.y = planet.y;
  childSprite.x = (child.x - window.world.ship.x) + c.HALF_SCREEN_WIDTH;
  childSprite.y = (child.y - window.world.ship.y) + c.HALF_SCREEN_HEIGHT;
  childSprite.visible = true;
  window.world.ships.push(child);
  // Find a targetPlanet (has to be done after x,y is set
  child.aiData.targetPlanet = ai.getTargetPlanetWithResources(child);
  // Adjust the x,y so the ship points towards the destination
  let dir = null;
  if (child.aiData.targetPlanet) {
    dir = utils.directionTo(child.aiData.targetPlanet.x, child.aiData.targetPlanet.y, planet.x, planet.y);
  } else {
    dir = ship.rotation + (Math.PI / 2);
  }
  const {xAmt, yAmt} = utils.dirComponents(dir, childDistFromShip);
  child.x = planet.x - xAmt;
  child.y = planet.y - yAmt;
  child.rotation = utils.normalizeRadian(dir - Math.PI);
}

export function costToRepair(ship) {
  const damageToRepair = ship.armorMax - ship.armor;
  // If you change the /5 remember to change the same in repairShip... maybe should be a constant
  return {titanium:(damageToRepair / 5), gold:0, uranium:0};
}

export function repairShip(ship, planet) {
  let cost = costToRepair(ship);
  let addArmor = ship.armorMax - ship.armor; // armor needed
  if (!game.canAfford(planet, ship, cost)) {
    let titaniumOnHand = planet.resources.stored.titanium + ship.resources.titanium;
    cost.titanium = titaniumOnHand;
    addArmor = titaniumOnHand * 5;
  } 
  game.payResourceCost(planet, ship, cost);
  ship.armor += addArmor;
}

export function addEquip(ship, newEquip) {
  if (newEquip.type === c.EQUIP_TYPE_ARMOR) {
    // Only add armor if the ship is in full repair
    if (ship.armor === ship.armorMax) {
      ship.armor += newEquip.armorAmt;
    }
    ship.armorMax += newEquip.armorAmt;
  } else if (newEquip.type === c.EQUIP_TYPE_STORAGE) {
    ship.resourcesMax += newEquip.storageAmount;
  }
}

export function selectFirstSecondaryWeapon(ship) {
  for (let i=0; i< ship.equip.length; i++) {
    if (ship.equip[i].type === c.EQUIP_TYPE_SECONDARY_WEAPON) {
      ship.selectedSecondaryWeaponIndex = i;
      return;
    }
  } // for
  // Couldn't find a secondary weapon
  ship.selectedSecondaryWeaponIndex = -1;
}

export function moveEquipFromPlanetToShip(ship, planet, equipToMove) {
  // Remove from the planet
  ship.equip.push(equipToMove);
  addEquip(ship, equipToMove);
  // Remove the oldEquip from the planet
  lodash.remove(planet.equip, (e) => e.id === equipToMove.id);
  selectFirstSecondaryWeapon(ship);
}

export function moveEquipFromShipToPlanet(ship, planet, equipToMove) {
  // Add to the planet
  planet.equip.push(equipToMove);
  if (equipToMove.type === c.EQUIP_TYPE_ARMOR) {
    ship.armorMax -= equipToMove.armorAmt;
    if (ship.armor > ship.armorMax) {
      ship.armor = ship.armorMax;
    }
  } else if (equipToMove.type === c.EQUIP_TYPE_STORAGE) {
    ship.resourcesMax -= equipToMove.storageAmount;
    let shipResources = ship.resources.titanium + ship.resources.gold + ship.resources.uranium;
    if (shipResources > ship.resourcesMax) {
      let owing = this.removeResource(ship, 'titanium', (shipResources - ship.resourcesMax));
      if (owing > 0) {
        owing = this.removeResource(ship, 'gold', owing);
      }
      if (owing > 0) {
        owing = this.removeResource(ship, 'uranium', owing);
      }
      if (owing > 0) {
        console.warn("Cannot remove more resources from ship still owing "+owing);
      }
    }
  }
  // Remove the oldEquip from the ship (no new equipment added)
  lodash.remove(ship.equip, (e) => e.id === equipToMove.id);
  selectFirstSecondaryWeapon(ship);
}

/**
 * Destroys unwanted equipment and recovers some material cost
 * @param planet location resources will be added to
 * @param equip to destroy
 */
export function salvageEquip(planet, equip) {
  planet.resources.stored['titanium'] += equip.cost.titanium * c.SALVAGE_RATE;
  planet.resources.stored['gold'] += equip.cost.gold * c.SALVAGE_RATE;
  planet.resources.stored['uranium'] += equip.cost.uranium * c.SALVAGE_RATE;
  // Remove the equip from the planet
  lodash.remove(planet.equip, (e) => e.id === equip.id);
}

/**
 * Destroys unwanted ships and recovers some material cost
 * @param planet location resources will be added to
 * @param ship to destroy
 */
export function salvageShip(planet, ship) {
  // First salvage all equipment on the ship
  for (const equip of ship.equip) {
    salvageEquip(planet, equip);
  }
  // Salvage the ship itself
  planet.resources.stored['titanium'] += ship.cost.titanium * c.SALVAGE_RATE;
  planet.resources.stored['gold'] += ship.cost.gold * c.SALVAGE_RATE;
  planet.resources.stored['uranium'] += ship.cost.uranium * c.SALVAGE_RATE;
  removeShipFromStorage(ship, planet);
  // If ship is currently being used - stop using it!
  if (ship === window.world.ship) {
    const shipSprite = game.getShipSprite(ship);
    shipSprite.visible = false;
    ship.alive = false;
    ship.spriteId = null;
  }
}


/**
 * Removes the resource from the ship
 * @return the amount still owing after removing
 */
export function removeResource(ship, resourceType, amount) {
  ship.resources[resourceType] -= amount;
  if (ship.resources[resourceType] < 0) {
    let owing = Math.abs(ship.resources[resourceType]);
    ship.resources[resourceType] = 0;
    return owing;
  }
  return 0;
}

/**
 * @return true if the equip can be added to the ship
 */
export function canEquip(ship, equip) {
  if (!ship || !ship.equip || !equip) {
    return false;
  }
  // No more space
  if (ship.equip.length >= ship.equipMax) {
    return false;
  }
  // Some equip you can only have one
  if ([EQUIP_TYPE_BRAKE, EQUIP_TYPE_PRIMARY_WEAPON, EQUIP_TYPE_THRUSTER].includes(equip.type)) {
    if (ship.equip.find((eq) => eq.type === equip.type)) {
      return false;
    }
  }
  return true;
}


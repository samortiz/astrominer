import { c, utils, fly, manage } from './';

import lodash from 'lodash';

/**
 * Creates an empty world object, with only basic properties. 
 * This will be populated by setupWorld()
 */
export function createEmptyWorld() {
  return {
    ship:null, 
    aliens:[],
    bullets: [],
    planets:[],
    keys: {}, // Global keypress handlers
    app: null, // Pixi App
    gameState: c.GAME_STATE.INIT, // Curent game state 
    gameLoop: null, // loop function in this state
    selectedPlanet: {resources:{}}, 
    bgSprite: null, // star background
    explosions : [], //contains sprites
    explosionSheet: null, // spritesheet for explosions
    blueprints: {
      ship:[c.SHIP_EXPLORER],
      equip:[c.EQUIP_BRAKE],
      miningXp: 0, // total amount mined
      miningXpLevels: lodash.cloneDeep(c.MINING_XP_LEVELS),
      alienXp: 0, // aliens killed 
      alienXpLevels: lodash.cloneDeep(c.ALIEN_XP_LEVELS),
    },
  };
}

export function setupWorld() {
  let container = window.world.app.stage;
  const world = window.world;
  createBackground(container);
  createPlanets(container);
  // Default selectedPlanet, shouldn't be displayed
  world.selectedPlanet = world.planets[0];
  window.world.shipStartX = c.PLAYER_START_X;
  window.world.shipStartY = c.PLAYER_START_Y;
  world.ship = createShip(c.SHIP_EXPLORER, c.PLAYER);
  //world.ship = createShip(c.SHIP_FAST, c.PLAYER);

  container.addChild(world.ship.sprite);
  // Initial Resources
  world.ship.resources = c.PLAYER_STARTING_RESOURCES;

   // DEBUG test alien
  // createAlien(container, c.SHIP_ALIEN_FIRE, c.PLAYER_START_X - 250, c.PLAYER_START_Y);
  // createAlien(container, c.SHIP_ALIEN_LARGE, c.PLAYER_START_X - 250, c.PLAYER_START_Y+250);
  //
  // world.ship.armorMax = 10000;
  // world.ship.armor = 10000;
  // world.ship.equip[0] = c.EQUIP_BLINK_THRUSTER;
  // world.ship.equip[1] = c.EQUIP_STREAM_BLASTER;
  // world.ship.equip[2] = c.EQUIP_BLINK_BRAKE;
  // let testPlanet = createPlanet(c.GREEN_PLANET_FILE, "home", 0.7, 200, {
  //   titanium : 20500,
  //   gold : 51000,
  //   uranium : 5000,
  // }, container);
  // testPlanet.x = c.PLAYER_START_X + 250;
  // testPlanet.y = c.PLAYER_START_Y - 300;

  createAliens(container);
  setupMiniMap(container);
  setupExplosionSheet();
  setupPlanetCache();
}

export function createBackground(container) {
  window.world.bgSprite = new window.PIXI.TilingSprite(
    window.PIXI.Texture.from(c.STAR_BACKGROUND_FILE),
    c.SCREEN_WIDTH,
    c.SCREEN_HEIGHT,
  );
  container.addChild(window.world.bgSprite);
}

export function createPlanets(container) {
  for (let ring of c.UNIVERSE_RINGS) {
    for (let i=0; i<ring.planetCount; i++) {
      let fileName = ring.planetFiles[utils.randomInt(0, ring.planetFiles.length-1)];
      let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + utils.randomInt(1000,999999);
      let scale = utils.randomInt(ring.minPlanetScale, ring.maxPlanetScale) / 100;
      let mass = scale * 500;
      let maxResource = scale * scale * 800; // exponentially grow resources
      let minResource = scale * scale * 20; // exponentially grow resources
      // Setup the planet
      let planet = createPlanet(fileName, name, scale, mass, {
        titanium : utils.randomInt(minResource, maxResource),
        gold : utils.randomInt(minResource, maxResource),
        uranium : utils.randomInt(minResource, maxResource),
      }, container);
      let {x,y} = getFreeXy(planet, ring.minDistToOtherPlanet, 0, ring.minDist, ring.maxDist);
      planet.x = x;
      planet.y = y;
    }
  }
}

/**
 * Distance to the nearest planet that is not equal to origPlanet
 * @return {nearestAlien, nearestDist} 
 */
function nearestPlanetDistance(origPlanet, x, y) {
  let minDist = 99999999999; 
  let nearestPlanet = null;
  for (let planet of window.world.planets) {
    if (planet !== origPlanet) {
      let dist = utils.distanceBetween(x,y, planet.x,planet.y) - planet.radius;
      if (origPlanet) {
        dist -= origPlanet.radius;
      }
      if (!nearestPlanet || (dist < minDist)) {
        minDist = dist;
        nearestPlanet = planet;
      }
    }
  } // for
  return {nearestPlanet:nearestPlanet, nearestPlanetDist:minDist};
}

/**
 * Distance to the nearest alien
 * @return {nearestAlien, nearestDist} 
 */
function nearestAlienDistance(x, y) {
  let minDist = 99999999999; 
  let nearestAlien = null;
  for (let alien of window.world.aliens) {
    // This assumes the calling code alien is the same size
    let dist = utils.distanceBetween(x,y, alien.x, alien.y) - (alien.radius * 2);
    if (!nearestAlien || (dist < minDist)) {
      minDist = dist;
      nearestAlien = alien;
    }
  } // for
  return {nearestAlien:nearestAlien, nearestAlienDist:minDist};
}

/**
 * Find a free spot of space to stick something
 * This will recurse until it finds a free spot.
 * @return {x,y}
 */
function getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, failCount=0) {
  let dir = utils.randomFloat(0, Math.PI*2);
  let dist = utils.randomInt(minDist, maxDist);
  let {x,y} = utils.getPointFrom(0,0, dir, dist);
  let np = 9999;
  if (minDistToPlanet > 0) {
    let {nearestPlanet, nearestPlanetDist} = nearestPlanetDistance(planet, x,y);
    if (nearestPlanetDist < minDistToPlanet) {
      return getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, ++failCount);
    }
    np = nearestPlanetDist;
  }
  if (minDistToAlien > 0) {
    let {nearestAlien, nearestAlienDist} = nearestAlienDistance(x,y);
    if (nearestAlienDist < minDistToAlien) {
      return getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, ++failCount);
    }
  }
  if (failCount > 200) {
    console.warn("Had a hard time finding a spot, it took "+failCount+" tries on ring "+minDist+" np="+np);
  }
  return {x,y};
}

// Creates and returns a planet (and adds it to the app)
export function createPlanet(fileName, name, scale, mass, resources, container) {
  let planet = {};
  planet.name = name; 
  planet.x = 0; // temp should get reset
  planet.y = 0; // temp should get reset
  planet.mass = mass;
  planet.resources = {
    stored: {titanium:0, gold:0, uranium:0},
    raw: resources
  };
  planet.ships = []; // stored ships 
  planet.equip = []; // stored equipment
  planet.buildings = []; // mines, factories

  // Setup the planet container sprite (contains planet plus buildings)
  planet.sprite = new window.PIXI.Container();
  planet.sprite.x = 0; // will be set on every draw
  planet.sprite.y = 0; 

  // Setup the planet sprite itself
  let planetSprite = new window.PIXI.Sprite(
    window.PIXI.loader.resources[c.SPRITESHEET_JSON].textures[fileName]);
  planetSprite.anchor.set(0.5, 0.5);
  planetSprite.scale.set(scale, scale);
  planet.sprite.addChild(planetSprite);

  planet.radius = planet.sprite.width / 2; // save the calculation later
  // Planets with atmosphere are a little smaller
  if ((fileName === c.PURPLE_PLANET_FILE) || (fileName === c.GREEN_PLANET_FILE)) {
    planet.radius = planet.radius * 0.93; 
  }
  container.addChild(planet.sprite);
  window.world.planets.push(planet);
  return planet;
}

// Creates and returns a ship object
export function createShip(shipType, owner) {
  let ship = lodash.cloneDeep(shipType);
  ship.id = lodash.uniqueId();
  for (let equip of ship.equip) {
    equip.id = lodash.uniqueId();
  }
  ship.owner = owner;
  ship.vx = 0; // velocityX
  ship.vy = 0; // velocityY
  ship.x = window.world.shipStartX;
  ship.y = window.world.shipStartY;

  // Graphics Sprite
  let spritesheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
  ship.sprite = new window.PIXI.Sprite(spritesheet.textures[ship.imageFile]);
  ship.sprite.position.set(c.HALF_SCREEN_WIDTH, c.HALF_SCREEN_HEIGHT);
  ship.sprite.anchor.set(0.5, 0.5);  // pivot on ship center
  ship.sprite.scale.set(ship.imageScale, ship.imageScale);
  return ship;
}

export function createAlien(container, shipType, x, y) {
  let alien = createShip(shipType, c.ALIEN);
  window.world.aliens.push(alien);
  alien.x = x;
  alien.y = y;
  alien.radius = alien.sprite.width/2; // Only for circular aliens
  alien.sprite.x += 100;
  container.addChild(alien.sprite);
  return alien;
}

export function createAliens(container) {

  for (let ring of c.UNIVERSE_RINGS) {
    for (const alienInfo of ring.aliens) {
      for (let i=0; i<alienInfo.count; i++) {
        let {x, y} = getFreeXy(null, c.MIN_ALIEN_DIST_TO_PLANET, c.MIN_ALIEN_DIST_TO_ALIEN, ring.minDist, ring.maxDist);
        createAlien(container, alienInfo.file, x, y);
      } // for i
    } // for alienInfo
  } // for ring
}

export function setupMiniMap(container) {
  let miniMapContainer = new window.PIXI.Container();
  container.addChild(miniMapContainer);

  // Mask so drawings don't spill out of the map
  var mask = new window.PIXI.Graphics();
  mask.drawRect(0, c.SCREEN_HEIGHT-c.MINIMAP_HEIGHT, c.MINIMAP_WIDTH, c.SCREEN_HEIGHT);
  mask.renderable = true;
  mask.cacheAsBitmap = true;
  miniMapContainer.addChild(mask);
  miniMapContainer.mask = mask;  

  // Graphics for drawing shapes on
  var g = new window.PIXI.Graphics();
  miniMapContainer.addChild(g);  
  window.world.miniMapGraphics = g;
}

/**
 * Called when the user clicks on the screen 
 */
export function click(event) {
  let x = event.data.global.x;
  let y = event.data.global.y;
  if ((x < c.MINIMAP_WIDTH) && (y> c.SCREEN_HEIGHT-c.MINIMAP_HEIGHT)) {
    fly.clickOnMinimap(x,y);
  }
}

export function changeGameState(newState) {
  const world = window.world;
  world.gameState = newState;
  if (newState === c.GAME_STATE.FLY) {
    fly.enterFlyState();
    world.gameLoop = fly.flyLoop;
  } else if (newState === c.GAME_STATE.MANAGE) {
    manage.enterManageState();
    world.gameLoop = manage.manageLoop;
  } else {
    world.gameLoop = null;
  }
}

/**
 * Loop to run building, runs in any game mode (fly,manage)
 */
export function runBuildings() {
  const world = window.world;
  for (let planet of world.planets) {
    for (let building of planet.buildings) {
      if (building.type === c.BUILDING_TYPE_MINE) {
        mineResource(planet, 'titanium', c.MINE_SPEED_TITATIUM);
        mineResource(planet, 'gold', c.MINE_SPEED_GOLD);
        mineResource(planet, 'uranium', c.MINE_SPEED_URANIUM);
      }
    } // for building
    // If planet is out of resources stop the mine animations
    if ( (planet.resources.raw.titanium === 0) 
      && (planet.resources.raw.gold === 0)
      && (planet.resources.raw.uranium === 0)) {
        for (let building of planet.buildings) {
          building.sprite.animationSpeed = 0;
        }
    }
  } // for planet
}

function mineResource(planet, resourceType, amount) {
  if (planet.resources.raw[resourceType] > 0) {
    planet.resources.raw[resourceType] -= amount;
    planet.resources.stored[resourceType] += amount;
    if (planet.resources.raw[resourceType] <= 0) {
      planet.resources.raw[resourceType] = 0;
    }
    addMiningXp(amount);
  }
}

function addMiningXp(amount) {
  let blueprints = window.world.blueprints;
  blueprints.miningXp += amount;
  let nextLevel = blueprints.miningXpLevels[0];
  if (nextLevel && (nextLevel.xp <= blueprints.miningXp)) {
    addBlueprint(nextLevel);
    // Remove the item
    blueprints.miningXpLevels.shift();
  }
}

export function addAlienXp(ship) {
  let blueprints = window.world.blueprints;
  blueprints.alienXp += ship.armorMax;
  let nextLevel = blueprints.alienXpLevels[0];
  if (nextLevel && (nextLevel.xp <= blueprints.alienXp)) {
    addBlueprint(nextLevel);
    // Remove the item
    blueprints.alienXpLevels.shift();
  }
}

export function addBlueprint(nextLevel) {
  console.log("Level up ",nextLevel.obj.name); // TODO Toast
  let blueprints = window.world.blueprints;
  if (nextLevel.obj.objType === c.OBJ_EQUIP) {
    blueprints.equip.push(nextLevel.obj);
  } else if (nextLevel.obj.objType === c.OBJ_SHIP) {
    blueprints.ship.push(nextLevel.obj);
  } else {
    console.warn("Could not find blueprint of type "+nextLevel.obj.objType+" nextLevel=",nextLevel);
  }
}

export function canAfford(planet, ship, resources) {
  let titanium = 0;
  let gold = 0;
  let uranium = 0;
  if (planet) {
    titanium += planet.resources.stored.titanium;
    gold += planet.resources.stored.gold;
    uranium += planet.resources.stored.uranium;
  }
  if (ship) {
    titanium += ship.resources.titanium;
    gold += ship.resources.gold;
    uranium += ship.resources.uranium;
  }
  return (titanium >= resources.titanium)
      && (gold >= resources.gold)
      && (uranium >= resources.uranium);
}

export function payResourceCost(planet, ship, resources) {
  payResource(planet, ship, 'titanium', resources.titanium);
  payResource(planet, ship, 'gold', resources.gold);
  payResource(planet, ship, 'uranium', resources.uranium);
}

export function payResource(planet, ship, resourceType, amount) {
  let paid = -amount; // amount owing (overwritten if some payment comes from the planet)
  if (planet) {
    paid = planet.resources.stored[resourceType] - amount; 
    if (paid >= 0) {
      planet.resources.stored[resourceType] -= amount;
      return;
    } else {
      // Planet can't afford this purchase, take some from the ship
      planet.resources.stored[resourceType] = 0;
    }
  }
  if (ship) { 
    ship.resources[resourceType] = ship.resources[resourceType] + paid;
    if (ship.resources[resourceType] < 0) {
      console.warn("Ship is in debt "+ship.resources[resourceType]+" "+resourceType);
    }
  } else if (paid < 0) {
    planet.resources.stored[resourceType] = planet.resources.stored[resourceType] + paid;
    console.warn("Planet is in debt "+planet.resources.stored[resourceType]+" "+resourceType);
  }
}

export function setupExplosionSheet() {
  window.world.explosionSheet = window.PIXI.Loader.shared.resources[c.CRASH_JSON].spritesheet;
  // Preload an explosion sprite animation (these will be cached and reused in world.explosions)
  window.world.explosions.push(createExplosionSprite());
}

export function createExplosionSprite() {
  let sprite = new window.PIXI.AnimatedSprite(window.world.explosionSheet.animations[c.CRASH]);
  sprite.animationSpeed = 0.4;
  sprite.loop = false;
  sprite.anchor.set(0.5, 0.5);
  sprite.scale.set(2, 2);
  sprite.x = c.HALF_SCREEN_WIDTH;
  sprite.y = c.HALF_SCREEN_WIDTH;
  sprite.loop = true;
  sprite.visible = false;
  window.world.explosions.push(sprite);
  window.world.app.stage.addChild(sprite);
  return sprite;
}

/**
 * Creates a cache for all positions in the universe and stores the nearby planets
 */
export function setupPlanetCache() {
  const planetCache = new Array(c.PLANET_CACHE_NUM_STEPS);
  // for every position in the universe
  for (let stepX=0; stepX <c.PLANET_CACHE_NUM_STEPS; stepX++) {
    planetCache[stepX] = new Array(c.PLANET_CACHE_NUM_STEPS);
    for (let stepY=0; stepY<c.PLANET_CACHE_NUM_STEPS; stepY++) {
      const minX = ((stepX - 1) * c.PLANET_CACHE_STEP_SIZE) - c.UNIVERSE_RADIUS;
      const maxX = ((stepX + 2) * c.PLANET_CACHE_STEP_SIZE) - c.UNIVERSE_RADIUS;
      const minY = ((stepY - 1) * c.PLANET_CACHE_STEP_SIZE) - c.UNIVERSE_RADIUS;
      const maxY = ((stepY + 2) * c.PLANET_CACHE_STEP_SIZE) - c.UNIVERSE_RADIUS;
      //console.log('Step ('+stepX+','+stepY+')  x:'+minX+' to '+maxX+'   y:'+minY+' to '+maxY);
      const stepPlanets = new Array();
      // Find planets within view of this location
      for (const planet of window.world.planets) {
        if ((planet.x  - planet.radius >= minX) && (planet.x + planet.radius <= maxX ) &&
            (planet.y - planet.radius >= minY) && (planet.y + planet.radius <= maxY )) {
          stepPlanets.push(planet);
        }
      } // for planets
      planetCache[stepX][stepY] = { planets: stepPlanets };
    } // for stepY
  } // for stepX

  window.world.planetCache = planetCache;
}

/**
 * Find planets from the planetCache that are somewhat near (within SCREEN_SIZE)
 */
export function getPlanetsNear(x, y) {
  let stepX = Math.floor((x + c.UNIVERSE_RADIUS) / c.PLANET_CACHE_STEP_SIZE);
  let stepY = Math.floor((y + c.UNIVERSE_RADIUS) / c.PLANET_CACHE_STEP_SIZE);
  if (stepX < 0) {
    stepX = 0;
  }
  if (stepX >= c.PLANET_CACHE_NUM_STEPS) {
    stepX = c.PLANET_CACHE_NUM_STEPS - 1;
  }
  if (stepY < 0) {
    stepY = 0;
  }
  if (stepY >= c.PLANET_CACHE_NUM_STEPS) {
    stepY = c.PLANET_CACHE_NUM_STEPS - 1;
  }
  ;
  return window.world.planetCache[stepX][stepY].planets;
}


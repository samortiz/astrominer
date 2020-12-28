import { c, utils, fly, manage } from './';
import lodash from 'lodash';

/**
 * Creates an empty world object, with only basic properties. 
 * This will be populated by setupWorld()
 */
export function createEmptyWorld() {
  return {
    saveGameName: null, // name of last game saved/loaded
    ship:null,
    aliens:[],
    planets:[],
    selectedPlanet: {resources:{}},
    blueprints: {
      ship:[c.SHIP_EXPLORER],
      equip:[c.EQUIP_BRAKE],
      miningXp: 0, // total amount mined
      miningXpLevels: lodash.cloneDeep(c.MINING_XP_LEVELS),
      alienXp: 0, // aliens killed 
      alienXpLevels: lodash.cloneDeep(c.ALIEN_XP_LEVELS),
    },
    nextId: 100, // unique ID for sprites, equip, etc...
    // everything in system is transient and not serialized when saving the game
    system: {
      keys: {}, // Global keypress handlers
      app: null, // Pixi App
      gameState: c.GAME_STATE.INIT, // Current game state
      isTyping: false, // used to stop keypress events ('w') when user is typing in input
      gameLoop: null, // loop function in this state
      bgSprite: null, // star background
      explosionSheet: null, // spritesheet for explosions
      explosions : [], //contains sprites
      bullets: [], // contains all the bullets
      planetSpriteCache: {}, // {"green_planet.png" : Map(id:sprite, id:sprite)... }
      shipSpriteCache: {}, // {"alien_small.png" : Map(id:sprite, id:sprite)... }
      spriteContainers: {background:null, planets:null, bullets:null, ships:null, minimap:null},
      miniMapGraphics: null, // used as a canvas for drawing the miniMap
      initializing: true, // set to false when the game fully running (after first draw)
    },
  };
}

export function setupWorld() {
  const world = window.world;
  setupSpriteContainers();
  createBackground();
  createPlanets();
  // Default selectedPlanet, shouldn't be displayed
  world.selectedPlanet = world.planets[0];
  window.world.shipStartX = c.PLAYER_START_X;
  window.world.shipStartX = +1600;
  window.world.shipStartY = c.PLAYER_START_Y;
  //world.ship = createShip(c.SHIP_EXPLORER, c.PLAYER);
  world.ship = createShip(c.SHIP_FIGHTER, c.PLAYER);
  const shipSprite = getShipSprite(world.ship);
  world.ship.resources = c.PLAYER_STARTING_RESOURCES;
  shipSprite.visible = true;
  world.ship.resources = {titanium:10000, gold:10000, uranium:10000};

  // DEBUG test alien
  //createAlien(c.SHIP_ALIEN_LARGE, c.PLAYER_START_X + 250, c.PLAYER_START_Y+70);
  //createAlien(c.SHIP_ALIEN_LARGE, c.PLAYER_START_X + 250, c.PLAYER_START_Y-70);
  world.ship.armorMax = 100000;
  world.ship.armor = 100000;
  world.ship.equip = [c.EQUIP_BLINK_BRAKE, c.EQUIP_STREAM_BLASTER, c.EQUIP_BLINK_THRUSTER, c.EQUIP_STORAGE];
  world.ship.equipMax = world.ship.equip.length;
  let testPlanet = createPlanet(c.GREEN_PLANET_FILE, "home", 100, 200, {
    titanium : 20500,
    gold : 51000,
    uranium : 5000,
  });
  testPlanet.x = c.PLAYER_START_X - 150;
  testPlanet.y = c.PLAYER_START_Y ;
  testPlanet.resources.stored = {titanium:10000, gold:10000, uranium:10000};

  createAliens();
  setupMiniMap();
  setupExplosionSheet();
  setupPlanetCache();
}

/**
 * Sets up the sprite containers in the correct display order
 */
export function setupSpriteContainers() {
  let mainStage = window.world.system.app.stage;
  let spriteContainers = window.world.system.spriteContainers;
  spriteContainers.background = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.background);

  spriteContainers.planets = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.planets);

  spriteContainers.bullets = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.bullets);

  spriteContainers.ships = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.ships);

  spriteContainers.minimap = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.minimap);
}

export function createBackground() {
  let container = window.world.system.spriteContainers.background;
  window.world.system.bgSprite = new window.PIXI.TilingSprite(
    window.PIXI.Texture.from(c.STAR_BACKGROUND_FILE),
    c.SCREEN_WIDTH,
    c.SCREEN_HEIGHT,
  );
  container.addChild(window.world.system.bgSprite);
}

export function createPlanets() {
  let container = window.world.system.spriteContainers.planets;
  for (let ring of c.UNIVERSE_RINGS) {
    for (let i=0; i<ring.planetCount; i++) {
      let fileName = ring.planetFiles[utils.randomInt(0, ring.planetFiles.length-1)];
      let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + utils.randomInt(1000,999999);
      let radius = utils.randomInt(ring.minPlanetRadius, ring.maxPlanetRadius);
      let mass = radius * radius * c.PLANET_DENSITY.get(fileName);
      let maxResource = mass * 2 * 0.3;
      let minResource = mass * 0.1;
      // Setup the planet
      let planet = createPlanet(fileName, name, radius, mass, {
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
 * @return {nearestAlien, nearestPlanetDist}
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
  } // for planet
  return {nearestPlanet:nearestPlanet, nearestPlanetDist:minDist};
}

/**
 * Distance to the nearest alien
 * @return {nearestAlien, nearestAlienDist}
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
    let {nearestPlanetDist} = nearestPlanetDistance(planet, x,y);
    if (nearestPlanetDist < minDistToPlanet) {
      return getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, ++failCount);
    }
    np = nearestPlanetDist;
  }
  if (minDistToAlien > 0) {
    let {nearestAlienDist} = nearestAlienDistance(x,y);
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
export function createPlanet(planetFile, name, radius, mass, resources) {
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
  planet.radius = radius;
  planet.lastLandingDir = 0;
  planet.spriteFile = planetFile;
  planet.spriteId = null; // no sprite created yet
  window.world.planets.push(planet);
  return planet;
}

/**
 * Finds or creates a planet sprite.
 * This cache works a little different, no sprites are re-used.
 * Once a planetSprite is created the buildings are added and it stays attached to the planet
 * Otherwise we would have to empty out the container and redraw the planet and buildings each time
 */
export function getPlanetSprite(planet) {
  let planetSpriteCache = window.world.system.planetSpriteCache[planet.spriteFile];
  // No cache for this file yet - create an empty cache
  if (!planetSpriteCache) {
    planetSpriteCache= new Map();
    window.world.system.planetSpriteCache[planet.spriteFile] = planetSpriteCache;
  }
  // Lookup the sprite in the cache by ID
  let planetContainer = planetSpriteCache.get(planet.spriteId);
  if (planetContainer) {
    return planetContainer;
  }
  // Setup the planet container sprite (contains planet plus buildings)
  planetContainer = new window.PIXI.Container();
  planetContainer.x = 0; // will be set on every draw
  planetContainer.y = 0;
  planetContainer.visible = true;
  window.world.system.spriteContainers.planets.addChild(planetContainer);

  // Setup the planet sprite itself
  const planetSprite = new window.PIXI.Sprite(
    window.PIXI.loader.resources[c.SPRITESHEET_JSON].textures[planet.spriteFile]);
  planetSprite.anchor.set(0.5, 0.5);
  let spriteScale = planet.radius * 2 / planetSprite.width;
  // Planets with atmosphere are a little smaller than the full image size
  if ((planet.spriteFile === c.PURPLE_PLANET_FILE) || (planet.spriteFile === c.GREEN_PLANET_FILE)) {
    spriteScale = spriteScale * 1.08;
  }
  planetSprite.scale.set(spriteScale, spriteScale);
  planetContainer.addChild(planetSprite);

  // TODO : Add buildings to the planet

  // Cache the new sprite
  planet.spriteId = window.world.nextId++;
  planetSpriteCache.set(planet.spriteId, planetContainer);
  return planetContainer;
}

/**
 * Finds or creates a sprite for the ship
 * NOTE: This will return a non-visible sprite, the calling code is responsible for making the sprite visible
 */
export function getShipSprite(ship) {
  if (!ship.alive) {
    console.warn('You should not get sprites for dead ships. This will resurrect the sprite!');
    console.trace();
    window.error(); // does not exist... thus an error!
    return;
  }
  let shipSpriteCache = window.world.system.shipSpriteCache[ship.imageFile];
  // No cache for this file yet - create an empty cache
  if (!shipSpriteCache) {
    shipSpriteCache= new Map();
    window.world.system.shipSpriteCache[ship.imageFile] = shipSpriteCache;
  }
  // Lookup the sprite in the cache by ID
  let sprite = shipSpriteCache.get(ship.spriteId);
  if (sprite) {
    return sprite;
  }
  // Lookup a free sprite (dead or off-screen alien)
  for (let [spriteId, foundSprite] of shipSpriteCache.entries()) {
    if (!foundSprite.visible) {
      foundSprite.visible = false;
      foundSprite.rotation = ship.rotation;
      ship.spriteWidth = foundSprite.width;
      ship.spriteHeight = foundSprite.height;
      ship.radius = foundSprite.width/2; // used for circular aliens
      ship.spriteId = spriteId;
      //console.log('found old sprite '+spriteId+' '+ship.imageFile);
      return foundSprite;
    }
  } // foundSprite
  // No sprite found - create a new one
  let spriteSheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
  sprite = new window.PIXI.Sprite(spriteSheet.textures[ship.imageFile]);
  sprite.position.set(c.HALF_SCREEN_WIDTH, c.HALF_SCREEN_HEIGHT);
  sprite.anchor.set(0.5, 0.5);  // pivot on ship center
  sprite.scale.set(ship.imageScale, ship.imageScale);
  sprite.rotation = ship.rotation;
  sprite.visible = false;
  ship.spriteWidth = sprite.width;
  ship.spriteHeight = sprite.height;
  ship.radius = sprite.width/2; // used for circular aliens
  ship.spriteId = window.world.nextId++;
  shipSpriteCache.set(ship.spriteId, sprite);
  window.world.system.spriteContainers.ships.addChild(sprite);
  //console.log('created new ship sprite '+ship.imageFile, sprite);
  return sprite;
}

// Creates and returns a ship object
export function createShip(shipType, owner) {
  let ship = lodash.cloneDeep(shipType);
  ship.id = window.world.nextId++;
  for (let equip of ship.equip) {
    equip.id = window.world.nextId++;
  }
  ship.owner = owner;
  ship.vx = 0; // velocityX
  ship.vy = 0; // velocityY
  ship.x = window.world.shipStartX;
  ship.y = window.world.shipStartY;
  ship.spriteId = null; // no sprite yet
  ship.alive = true; // set to false if it blows up
  ship.spriteWidth = null; //We won't know until we load the sprite
  ship.rotation = 0;
  return ship;
}

export function createAlien(shipType, x, y) {
  let alien = createShip(shipType, c.ALIEN);
  window.world.aliens.push(alien);
  alien.x = x;
  alien.y = y;
  alien.radius = 50; // will be set to a real value when sprite loads
  return alien;
}

export function createAliens() {
  for (let ring of c.UNIVERSE_RINGS) {
    for (const alienInfo of ring.aliens) {
      for (let i=0; i<alienInfo.count; i++) {
        let {x, y} = getFreeXy(null, c.MIN_ALIEN_DIST_TO_PLANET, c.MIN_ALIEN_DIST_TO_ALIEN, ring.minDist, ring.maxDist);
        createAlien(alienInfo.file, x, y);
      } // for i
    } // for alienInfo
  } // for ring
}

export function setupMiniMap() {
  let container = window.world.system.spriteContainers.minimap;
  let miniMapContainer = new window.PIXI.Container();
  container.addChild(miniMapContainer);

  // Mask so drawings don't spill out of the map
  let mask = new window.PIXI.Graphics();
  mask.drawRect(0, c.SCREEN_HEIGHT-c.MINIMAP_HEIGHT, c.MINIMAP_WIDTH, c.SCREEN_HEIGHT);
  mask.renderable = true;
  mask.cacheAsBitmap = true;
  miniMapContainer.addChild(mask);
  miniMapContainer.mask = mask;  

  // Graphics for drawing shapes on
  let g = new window.PIXI.Graphics();
  miniMapContainer.addChild(g);  
  window.world.system.miniMapGraphics = g;
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
  world.system.gameState = newState;
  if (newState === c.GAME_STATE.FLY) {
    fly.enterFlyState();
    world.system.gameLoop = fly.flyLoop;
  } else if (newState === c.GAME_STATE.MANAGE) {
    manage.enterManageState();
    world.system.gameLoop = manage.manageLoop;
  } else {
    world.system.gameLoop = null;
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
        mineResource(planet, 'titanium', c.MINE_SPEED_TITANIUM);
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
  utils.showToast('New plan: '+nextLevel.obj.name);
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
  window.world.system.explosionSheet = window.PIXI.Loader.shared.resources[c.CRASH_JSON].spritesheet;
  // Preload an explosion sprite animation (these will be cached and reused in world.system.explosions)
  window.world.system.explosions.push(createExplosionSprite());
}

export function createExplosionSprite() {
  let sprite = new window.PIXI.AnimatedSprite(window.world.system.explosionSheet.animations[c.CRASH]);
  sprite.animationSpeed = 0.4;
  sprite.loop = false;
  sprite.anchor.set(0.5, 0.5);
  sprite.scale.set(2, 2);
  sprite.x = c.HALF_SCREEN_WIDTH;
  sprite.y = c.HALF_SCREEN_WIDTH;
  sprite.loop = true;
  sprite.visible = false;
  window.world.system.explosions.push(sprite);
  window.world.system.spriteContainers.bullets.addChild(sprite);
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
      const stepPlanets = [];
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

  window.world.system.planetCache = planetCache;
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
  return window.world.system.planetCache[stepX][stepY].planets;
}


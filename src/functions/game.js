import {c, fly, manage, utils} from './';
import lodash from 'lodash';
import {randomInt} from "./utils";

/**
 * Creates an empty world object, with only basic properties.
 * This will be populated by setupWorld()
 */
export function createEmptyWorld() {
  return {
    appVersion: c.APP_VERSION,
    saveGameName: null, // name of last game saved/loaded
    ship: null,
    view: { // global XY for current view (in manage mode, always ship.xy in fly mode)
      x: 0,
      y: 0,
    },
    ships: [],
    planets: [],
    selectedPlanet: {resources: {}},
    lastPlanetLanded: null,
    gameTickCount : 0,
    nextId: 100, // unique ID for sprites, equip, etc...
    introDialogShown: false,
    blueprints: {
      ship: [],
      equip: [],
      xp: {
        [c.PLANET_ROCK_FILE]: 0,
        [c.PLANET_RED_FILE]: 0,
        [c.PLANET_GREEN_FILE]: 0,
        [c.PLANET_PURPLE_FILE]: 0,
        [c.SHIP_ALIEN_TURRET.name]: 0,
        [c.SHIP_ALIEN.name]: 0,
        [c.SHIP_ALIEN_LARGE.name]: 0,
        [c.SHIP_ALIEN_STEALTH.name]: 0,
        [c.SHIP_ALIEN_STAPLE_TURRET.name]: 0,
        [c.SHIP_ALIEN_FIRE.name]: 0,
        [c.SHIP_ALIEN_MOTHERSHIP.name]: 0,
      },
      xpLevels: lodash.cloneDeep(c.XP_LEVELS),
    },
    // everything in system is transient and not serialized when saving the game
    system: {
      keys: {}, // Global keypress handlers
      buttonKeyDown : {up:false, right:false, down:false, left:false, shoot:false}, // true when a button is depressed
      app: null, // Pixi App
      gameState: c.GAME_STATE.INIT, // Current game state
      isTyping: false, // used to stop keypress events ('w') when user is typing in input
      gameLoop: null, // loop function in this state
      bgSprite: null, // star background
      smokeSheet: null, // spritesheet for smoke animation
      explosionSheet: null, // spritesheet for explosions
      explosions: [], //contains sprites
      bullets: [], // contains all the bullets
      nearby: {planets: [], ships: []}, // ships and planets near enough for collision detection and running AI
      planetSpriteCache: {}, // {"green_planet.png" : Map(id:sprite, id:sprite)... }
      shipSpriteCache: {}, // {"alien_small.png" : Map(id:sprite, id:sprite)... }
      shieldSpriteCache: new Map(), // These sprites are each added to a ship and not reused
      spriteContainers: {background: null, planets: null, bullets: null, ships: null, minimap: null, explosions:null},
      screenHeight: c.SCREEN_HEIGHT, // changed based on window size
      screenWidth: c.SCREEN_WIDTH, // changed in App.js based on window size
      screenScale: 1, // scale due to window sizing
      miniMapGraphics: null, // used as a canvas for drawing the miniMap
      initializing: true, // set to false when the game fully running (after first draw)
      continuousFire: false, // set to true by keypress
      continuousFireUp : false, // set to true to determine when an key-up event happens
    },
  };
}

export function setupWorld() {
  const world = window.world;
  setupSpriteContainers();
  createBackground();
  createPlanets();
  createWormholeLinks();
  // Default selectedPlanet, shouldn't be displayed
  world.selectedPlanet = world.planets[0];
  window.world.shipStartX = c.PLAYER_START_X;
  // window.world.shipStartX = -2500;
  window.world.shipStartY = c.PLAYER_START_Y;
  world.ship = createShip(c.SHIP_EXPLORER, c.PLAYER);
  const shipSprite = getShipSprite(world.ship);
  shipSprite.visible = true;
  world.ship.resources = c.PLAYER_STARTING_RESOURCES;

  // DEBUG SHIP
  const debug = false;
  if (debug) {
    world.ship.armorMax = 500;
    world.ship.armor = 500;
    world.ship.resources = {titanium: 10000, gold: 10000, uranium: 10000};
    world.ship.resourcesMax = 100000;
    world.ship.equip = [manage.makeEquip(c.EQUIP_BLINK_BRAKE), manage.makeEquip(c.EQUIP_AUTOLANDER), manage.makeEquip(c.EQUIP_STREAM_BLASTER), manage.makeEquip(c.EQUIP_SHIELD)];
    world.ship.equipMax = world.ship.equip.length;
    world.blueprints.equip = [...c.ALL_EQUIP];
    world.blueprints.ship = [...c.ALL_SHIPS];
    world.introDialogShown = true;

    // DEBUG test alien
    createAlien(c.SHIP_ALIEN_TURRET, c.PLAYER_START_X + 450, c.PLAYER_START_Y + 70);
    createAlien(c.SHIP_RED_MISSILE, c.PLAYER_START_X + 450, c.PLAYER_START_Y - 70);

    // DEBUG Planet
    let testPlanet = createPlanet(c.PLANET_ROCK_FILE, "home", 100, 200, {
      titanium: 20000,
      gold: 50000,
      uranium: 50000,
    });
    testPlanet.x = c.PLAYER_START_X - 150;
    testPlanet.y = c.PLAYER_START_Y;
    testPlanet.resources.stored = {titanium: 10000, gold: 10000, uranium: 10000};
  }

  createAliens();
  createExtras();
  setupMiniMap();
  setupExplosionSheet();
}

/**
 * Sets up the sprite containers in the correct display order
 */
export function setupSpriteContainers() {
  let mainStage = window.world.system.app.stage;
  let spriteContainers = window.world.system.spriteContainers;

  spriteContainers.background = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.background);

  // Setup the wormhole spritesheet
  const resource = window.PIXI.Loader.shared.resources[c.SMOKE_JSON];
  window.world.system.smokeSheet = resource.spritesheet;

  // Add all the containers, the order here will control which images are on top
  spriteContainers.planets = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.planets);

  spriteContainers.bullets = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.bullets);

  spriteContainers.ships = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.ships);

  spriteContainers.explosions = new window.PIXI.Container();
  mainStage.addChild(spriteContainers.explosions);

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

// Go through all the rings and create planet objects
export function createPlanets() {
  for (let ring of c.UNIVERSE_RINGS) {
    for (let i = 0; i < ring.planetCount; i++) {
      let fileName = ring.planetFiles[utils.randomInt(0, ring.planetFiles.length - 1)];
      let name = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + utils.randomInt(1000, 999999);
      let radius = utils.randomInt(ring.minPlanetRadius, ring.maxPlanetRadius);
      let mass = radius * radius * c.PLANET_DENSITY.get(fileName);
      let maxResource = mass * 2 * 0.3;
      let minResource = mass * 0.15;
      if (radius > 1000) {
        minResource += 10000;
        maxResource += 10000;
      } else if (radius > 500) {
        minResource += 500;
        maxResource += 500;
      }
      // Setup the planet
      let planet = createPlanet(fileName, name, radius, mass, {
        titanium: utils.randomInt(minResource, maxResource),
        gold: utils.randomInt(minResource, maxResource),
        uranium: utils.randomInt(minResource, maxResource),
      });
      let {x, y} = getFreeXy(planet, ring.minDistToOtherPlanet, 0, ring.minDist, ring.maxDist);
      planet.x = x;
      planet.y = y;
    } // for i
  } // for ring
}

// Setup the wormhole locations
function createWormholeLinks() {
  const planets = window.world.planets;
  for (const planet of planets) {
    if (planet.spriteFile === c.WORMHOLE_SPRITE) {
      let otherPlanet = null;
      for (let i=planets.length-1; i>=0; i--) {
        if (planets[i].spriteFile === c.WORMHOLE_SPRITE && !planets[i].jumpToX && !planets[i].jumpToY) {
          otherPlanet = planets[i];
          break;
        }
      } // for i
      if (otherPlanet) {
        planet.jumpToX = otherPlanet.x;
        planet.jumpToY = otherPlanet.y;
        otherPlanet.jumpToX = planet.x;
        otherPlanet.jumpToY = planet.y;
      } else {
        // planet.jumpToX = c.PLAYER_START_X;
        // planet.jumpToY = c.PLAYER_START_Y;
      }
    } // for planet
  } // for planet
}

/**
 * Distance to the nearest planet that is not equal to origPlanet
 * @return {{nearestPlanetDist: number, nearestPlanet: null}}
 */
function nearestPlanetDistance(origPlanet, x, y) {
  let minDist = 99999999999;
  let nearestPlanet = null;
  for (let planet of window.world.planets) {
    if (planet !== origPlanet) {
      let dist = utils.distanceBetween(x, y, planet.x, planet.y) - planet.radius;
      if (origPlanet) {
        dist -= origPlanet.radius;
      }
      if (!nearestPlanet || (dist < minDist)) {
        minDist = dist;
        nearestPlanet = planet;
      }
    }
  } // for planet
  return {nearestPlanet: nearestPlanet, nearestPlanetDist: minDist};
}

/**
 * Distance to the nearest alien
 * @return {{nearestAlien: null, nearestAlienDist: number}}
 */
function nearestAlienDistance(x, y) {
  let minDist = 99999999999;
  let nearestAlien = null;
  for (let alien of window.world.system.nearby.ships) {
    if (alien === window.world.ship) {
      continue;
    }
    // This assumes the calling code alien is the same size
    let dist = utils.distanceBetween(x, y, alien.x, alien.y) - (alien.radius * 2);
    if (!nearestAlien || (dist < minDist)) {
      minDist = dist;
      nearestAlien = alien;
    }
  } // for
  return {nearestAlien: nearestAlien, nearestAlienDist: minDist};
}

/**
 * Find a free spot of space to stick something
 * This will recurse until it finds a free spot.
 * @return {{x, y}}
 */
function getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, failCount = 0) {
  let dir = utils.randomFloat(0, Math.PI * 2);
  let dist = utils.randomInt(minDist, maxDist);
  let {x, y} = utils.getPointFrom(0, 0, dir, dist);
  if (failCount > 200) {
    // If we tried a lot of times and can't find a spot, we will dump the object into the outer ring
    console.warn("Had a hard time finding a spot in ring "+minDist+"-"+maxDist+" dumping to outer ring");
    return getFreeXy(planet, minDistToPlanet, minDistToAlien, c.OUTER_RING_MIN, c.OUTER_RING_MAX, 0);
  }
  if (minDistToPlanet > 0) {
    let {nearestPlanetDist} = nearestPlanetDistance(planet, x, y);
    if (nearestPlanetDist < minDistToPlanet) {
      return getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, ++failCount);
    }
  }
  if (minDistToAlien > 0) {
    let {nearestAlienDist} = nearestAlienDistance(x, y);
    if (nearestAlienDist < minDistToAlien) {
      return getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, ++failCount);
    }
  }
  // For wormholes, we don't want any too close to the player's start location - it would be a really bad way to start the game
  if (planet && planet.spriteFile === c.WORMHOLE_SPRITE &&
      utils.distanceBetween(x, y, c.PLAYER_START_X, c.PLAYER_START_Y) < c.MINIMAP_VIEW_HEIGHT) {
    return getFreeXy(planet, minDistToPlanet, minDistToAlien, minDist, maxDist, ++failCount);
  }
  return {x, y};
}

// Creates and returns a planet (and adds it to the app)
export function createPlanet(planetFile, name, radius, mass, resources) {
  let planet = {};
  planet.id = window.world.nextId++;
  planet.name = name;
  planet.x = 0; // temp should get reset
  planet.y = 0; // temp should get reset
  planet.mass = mass;
  planet.resources = {
    stored: {titanium: 0, gold: 0, uranium: 0},
    raw: resources
  };
  planet.ships = []; // stored ships 
  planet.equip = []; // stored equipment
  planet.buildings = []; // mines, factories
  planet.radius = radius;
  planet.lastLandingDir = 0;
  planet.spriteFile = planetFile;
  planet.spriteId = null; // no sprite created yet
  // jumpToX jumpToY will be set for wormholes
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
    planetSpriteCache = new Map();
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
  if (planet.spriteFile === c.WORMHOLE_SPRITE) {
    let wormholeSprite = new window.PIXI.AnimatedSprite(window.world.system.smokeSheet.animations[c.SMOKE]);
    wormholeSprite.animationSpeed = 0.2;
    wormholeSprite.loop = true;
    wormholeSprite.anchor.set(0.5, 0.5);
    const scale = (planet.radius * 2 / wormholeSprite.width) * 10;
    wormholeSprite.scale.set(scale, scale);
    wormholeSprite.visible = true;
    wormholeSprite.play();
    planetContainer.addChild(wormholeSprite);

  } else {
    const planetSprite = new window.PIXI.Sprite(
        window.PIXI.loader.resources[c.SPRITESHEET_JSON].textures[planet.spriteFile]);
    planetSprite.anchor.set(0.5, 0.5);
    let spriteScale = planet.radius * 2 / planetSprite.width;
    // Planets with atmosphere are a little smaller than the full image size
    if ((planet.spriteFile === c.PLANET_PURPLE_FILE) || (planet.spriteFile === c.PLANET_GREEN_FILE)) {
      spriteScale = spriteScale * 1.08;
    }
    planetSprite.scale.set(spriteScale, spriteScale);
    planetContainer.addChild(planetSprite);

    for (const building of planet.buildings) {
      manage.makeBuildingSprite(building, planet, planetContainer);
    }
  }

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
  // if (!ship.alive) {
  //   console.warn('You should not get sprites for dead ships.');
  //   console.trace();
  //   window.error(); // does not exist... thus an error!
  //   return;
  // }
  let shipSpriteCache = window.world.system.shipSpriteCache[ship.imageFile];
  // No cache for this file yet - create an empty cache
  if (!shipSpriteCache) {
    shipSpriteCache = new Map();
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
      foundSprite.scale.set(ship.imageScale, ship.imageScale);
      ship.spriteWidth = foundSprite.width;
      ship.spriteHeight = foundSprite.height;
      ship.radius = foundSprite.width / 2; // used for circular aliens
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
  ship.radius = sprite.width / 2; // used for circular aliens
  ship.spriteId = window.world.nextId++;
  shipSpriteCache.set(ship.spriteId, sprite);
  window.world.system.spriteContainers.ships.addChild(sprite);
  //console.log('created new ship sprite '+ship.imageFile, sprite);
  return sprite;
}

/**
 * @return The original width/height of the sprite before scaling was applied
 *   {width, height}
 */
export function getSpriteOrigWithHeight(sprite) {
  const origWidth = sprite.width;
  const origHeight = sprite.height;
  sprite.scale.set(1, 1);
  const width = sprite.width;
  const height = sprite.height;
  sprite.width = origWidth;
  sprite.height = origHeight;
  return {width, height};
}

export function setShieldRadius(ship, shield, shieldSprite) {
  const shipSprite = getShipSprite(ship);
  shieldSprite.anchor.set(0.5, 0.5);  // pivot on center
  const {width, height} = getSpriteOrigWithHeight(shipSprite);
  // Radius within the scaled ship sprite
  const shieldWidth = Math.max(width, height) * 1.5; // 1.5 to make it larger than the ship
  shieldSprite.width = shieldWidth;
  shieldSprite.height = shieldWidth;
  shield.radius = (shieldWidth * ship.imageScale) / 2; // size without ship scaling
}

export function getShieldSprite(ship, shield) {
  const cacheId = ship.id + '~' + shield.spriteFile;
  // Lookup the sprite in the cache by ID
  let shieldSprite = window.world.system.shieldSpriteCache.get(cacheId);
  if (shieldSprite) {
    setShieldRadius(ship, shield, shieldSprite);
    return shieldSprite;
  }
  // Add a new shield image to the ship
  const shipSprite = getShipSprite(ship);
  let spriteSheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
  shieldSprite = new window.PIXI.Sprite(spriteSheet.textures[shield.spriteFile]);
  setShieldRadius(ship, shield, shieldSprite);
  shipSprite.addChild(shieldSprite);
  window.world.system.shieldSpriteCache.set(cacheId, shieldSprite);
  return shieldSprite;
}

// Creates and returns a ship object
export function createShip(shipType, owner) {
  let ship = lodash.cloneDeep(shipType);
  ship.id = window.world.nextId++;
  ship.selectedSecondaryWeaponIndex = -1;
  for (let i=0; i<ship.equip.length; i++) {
    const equip = ship.equip[i];
    equip.id = window.world.nextId++;
    if (ship.selectedSecondaryWeaponIndex < 0 && equip.type === c.EQUIP_TYPE_SECONDARY_WEAPON) {
      ship.selectedSecondaryWeaponIndex = i;
    }
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
  window.world.system.nearby.ships.push(ship);
  return ship;
}

export function createAlien(shipType, x, y) {
  let alien = createShip(shipType, c.ALIEN);
  window.world.ships.push(alien);
  alien.x = x;
  alien.y = y;
  alien.radius = 50; // will be set to a real value when sprite loads
  return alien;
}

export function createAliens() {
  // Create motherships
  createAlien(c.SHIP_ALIEN_MOTHERSHIP, 1700, 200);
  createAlien(c.SHIP_ALIEN_MOTHERSHIP, 0, 1700);
  createAlien(c.SHIP_ALIEN_MOTHERSHIP, -1700, 0);
  createAlien(c.SHIP_ALIEN_MOTHERSHIP, 0, -1700);

  for (let ring of c.UNIVERSE_RINGS) {
    for (const alienInfo of ring.aliens) {
      for (let i = 0; i < alienInfo.count; i++) {
        let {x, y} = getFreeXy(null, c.MIN_ALIEN_DIST_TO_PLANET, c.MIN_ALIEN_DIST_TO_ALIEN, ring.minDist, ring.maxDist);
        createAlien(alienInfo.file, x, y);
      } // for i
    } // for alienInfo
  } // for ring
}

export function createExtras() {
  const planetTrail = [
    {
      type: c.PLANET_ROCK_FILE,
      name: 'X500',
      x: c.UNIVERSE_RADIUS + 3000,
      y: 0,
      radius: 100,
      mass: 100,
      resources: {
        titanium: utils.randomInt(100, 500),
        gold: utils.randomInt(100, 500),
        uranium: utils.randomInt(500, 1000),
      },
    },
    {
      type: c.PLANET_ROCK_FILE,
      name: 'X400',
      x: c.UNIVERSE_RADIUS + 5000,
      y: 0,
      radius: 200,
      mass: 100,
      resources: {
        titanium: utils.randomInt(100, 500),
        gold: utils.randomInt(100, 500),
        uranium: utils.randomInt(500, 1000),
      },
    },
    {
      type: c.PLANET_RED_FILE,
      name: 'X300',
      x: c.UNIVERSE_RADIUS + 10000,
      y: 0,
      radius: 300,
      mass: 150,
      resources: {
        titanium: utils.randomInt(200, 500),
        gold: utils.randomInt(200, 1500),
        uranium: utils.randomInt(1000, 1500),
      },
    },
    {
      type: c.PLANET_GREEN_FILE,
      name: 'X200',
      x: c.UNIVERSE_RADIUS + 16000,
      y: 0,
      radius: 300,
      mass: 150,
      resources: {
        titanium: utils.randomInt(200, 500),
        gold: utils.randomInt(200, 1500),
        uranium: utils.randomInt(1000, 1500),
      },
    },

    {
      type: c.PLANET_PURPLE_FILE,
      name: 'X100',
      x: c.UNIVERSE_RADIUS + 25000,
      y: 0,
      radius: 300,
      mass: 150,
      resources: {
        titanium: utils.randomInt(200, 500),
        gold: utils.randomInt(200, 1500),
        uranium: utils.randomInt(1000, 1500),
      },
    },
    {
      type: c.PLANET_ROCK_FILE,
      name: 'A',
      x: c.UNIVERSE_RADIUS + 35000,
      y: -1500,
      radius: 400,
      mass: 500,
      resources: {
        titanium: utils.randomInt(3000, 15000),
        gold: utils.randomInt(3000, 15000),
        uranium: utils.randomInt(3000, 15000),
      },
    },
    {
      type: c.PLANET_ROCK_FILE,
      name: 'B',
      x: c.UNIVERSE_RADIUS + 35000,
      y: 1500,
      radius: 400,
      mass: 500,
      resources: {
        titanium: utils.randomInt(3000, 15000),
        gold: utils.randomInt(3000, 15000),
        uranium: utils.randomInt(3000, 15000),
      },
    },
    {
      type: c.PLANET_ROCK_FILE,
      name: 'C',
      x: c.UNIVERSE_RADIUS + 36500,
      y: 0,
      radius: 400,
      mass: 500,
      resources: {
        titanium: utils.randomInt(3000, 15000),
        gold: utils.randomInt(3000, 15000),
        uranium: utils.randomInt(3000, 15000),
      },
    },
  ];
  for (const planet of planetTrail) {
    let newPlanet = createPlanet(planet.type, planet.name, planet.radius, planet.mass, planet.resources);
    newPlanet.x = planet.x;
    newPlanet.y = planet.y;
  }

  createAlien(c.SHIP_ALIEN_MOTHERSHIP, c.UNIVERSE_RADIUS + 35000, 400);
  createAlien(c.SHIP_ALIEN_MOTHERSHIP, c.UNIVERSE_RADIUS + 35000, -400);
  createAlien(c.SHIP_ALIEN_MOTHERSHIP, c.UNIVERSE_RADIUS + 34800, 200);
  createAlien(c.SHIP_ALIEN_MOTHERSHIP, c.UNIVERSE_RADIUS + 34800, -200);
  const mothershipTemplate = lodash.cloneDeep(c.SHIP_ALIEN_MOTHERSHIP);
  mothershipTemplate.armorMax = 10000;
  mothershipTemplate.armor = 10000;
  mothershipTemplate.imageScale = 2;
  createAlien(mothershipTemplate, c.UNIVERSE_RADIUS + 35000, 0);

  for (let i=0; i<30; i++) {
    const x = c.UNIVERSE_RADIUS + 34000 + randomInt(0,20) - 10;
    const y = (i * 150) - 3000;
    createAlien(c.SHIP_ALIEN_FIRE, x, y);
  }

  for (let i=0; i<40; i++) {
    const x = c.UNIVERSE_RADIUS + 34500;
    const y = (i * 150) - 3000;
    createAlien(c.SHIP_ALIEN_STAPLE_TURRET, x, y);
  }
  for (let i=0; i<40; i++) {
    const x = c.UNIVERSE_RADIUS + 35500;
    const y = (i * 150) - 3000;
    createAlien(c.SHIP_ALIEN_STAPLE_TURRET, x, y);
  }

}


export function setupMiniMap() {
  let container = window.world.system.spriteContainers.minimap;
  let miniMapContainer = new window.PIXI.Container();
  container.addChild(miniMapContainer);

  // Mask so drawings don't spill out of the map
  let mask = new window.PIXI.Graphics();
  mask.drawRect(0, c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT, c.MINIMAP_WIDTH, c.SCREEN_HEIGHT);
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
  const screenScale = window.world.system.screenScale;
  let scaledX = x / screenScale;
  let scaledY = y / screenScale;
  if ((scaledX < c.MINIMAP_WIDTH) && (scaledY > (c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT))) {
    fly.clickOnMinimap(scaledX, scaledY);
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
 * Loop to run building, runs in any game mode (fly + manage)
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
    if ((planet.resources.raw.titanium === 0)
      && (planet.resources.raw.gold === 0)
      && (planet.resources.raw.uranium === 0)) {
      const planetSprite = getPlanetSprite(planet);
      for (const buildingSprite of planetSprite.children) {
        // all animated sprites stop (this may not be true if new building types are added)
        if (buildingSprite.animationSpeed) {
          buildingSprite.animationSpeed = 0;
        }
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
    addMiningXp(amount, planet);
  }
}

function addMiningXp(amount, planet) {
  let blueprints = window.world.blueprints;
  const xp = blueprints.xp[planet.spriteFile] += amount;
  let nextLevel = blueprints.xpLevels[planet.spriteFile][0];
  if (nextLevel && (nextLevel.xp <= xp)) {
    addBlueprint(nextLevel);
    // Remove the item
    blueprints.xpLevels[planet.spriteFile].shift();
  }
}

export function addAlienXp(ship) {
  let blueprints = window.world.blueprints;
  let xp = blueprints.xp[ship.name];
  if (!xp) {
    xp = 1;
  }  else {
    xp += 1;
  }
  blueprints.xp[ship.name] = xp;
  if (blueprints.xpLevels[ship.name]) {
    let nextLevel = blueprints.xpLevels[ship.name][0];
    if (nextLevel && (nextLevel.xp <= xp)) {
      addBlueprint(nextLevel);
      // Remove the item
      blueprints.xpLevels[ship.name].shift();
    }
  }
}

export function addBlueprint(nextLevel) {
  utils.showToast('New plan: ' + nextLevel.obj.name);
  let blueprints = window.world.blueprints;
  if (nextLevel.obj.objType === c.OBJ_EQUIP) {
    blueprints.equip.push(nextLevel.obj);
  } else if (nextLevel.obj.objType === c.OBJ_SHIP) {
    blueprints.ship.push(nextLevel.obj);
  } else {
    console.warn("Could not find blueprint of type " + nextLevel.obj.objType + " nextLevel=", nextLevel);
  }
}

/**
 * Checks if the combined resources of planet and ship can afford the resources
 * Call this before calling payResourceCost
 * @return true if there are enough resources available
 */
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

/**
 * Pays the cost, taking from the planet and the ship as available
 * NOTE: This will not ensure you have enough resources, you can go into debt if you call this without checking
 * first using canAfford()
 * @param planet planet to get resources from
 * @param ship ship to get resources from
 * @param resources amount to pay
 */
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
      console.warn("Ship is in debt " + ship.resources[resourceType] + " " + resourceType);
    }
  } else if (paid < 0) {
    planet.resources.stored[resourceType] = planet.resources.stored[resourceType] + paid;
    console.warn("Planet is in debt " + planet.resources.stored[resourceType] + " " + resourceType);
  }
}

export function setupExplosionSheet() {
  window.world.system.explosionSheet = window.PIXI.Loader.shared.resources[c.CRASH_JSON].spritesheet;
  // Preload an explosion sprite animation (these will be cached and reused in world.system.explosions)
  createExplosionSprite();
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
  window.world.system.spriteContainers.explosions.addChild(sprite);
  return sprite;
}

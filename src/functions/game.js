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
  setShipStartXy(-200, 2500);
  world.ship = createShip(c.SHIP_EXPLORER, c.PLAYER);
  container.addChild(world.ship.sprite);
  // Initial Resources
  world.ship.resources = c.PLAYER_STARTING_RESOURCES;
  // landing planet
  let home = createPlanet(c.ROCK_PLANET_FILE, 'Home', -400, world.ship.y, 0.5, 250, {
    titanium : 1500,
    gold : 1500,
    uranium : 1500,
  }, container);
  home.resources.stored =  {titanium : 1000, gold: 1000,uranium : 1000};
  createAliens(container);
  setupMiniMap(container);
  setupExplosionSheet();
}

export function createBackground(container) {
  window.world.bgSprite = new window.PIXI.TilingSprite(
    window.PIXI.Texture.from(c.STAR_BACKGROUND_FILE),
    500,
    500,
  );
  container.addChild(window.world.bgSprite);
}

export function createPlanets(container) {
  let fileNames = [c.ROCK_PLANET_FILE, c.RED_PLANET_FILE, c.PURPLE_PLANET_FILE, c.GREEN_PLANET_FILE];

  for (let i=0; i<=c.NUM_PLANETS; i++) {
    let index = utils.randomInt(0, fileNames.length-1);
    let fileName = fileNames[index];
    let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + utils.randomInt(1000,999999);
    let {x,y} = generateXy();
    let scale = utils.randomInt(10,120) / 100;
    let mass = scale * 500;
    // Setup the planet
    createPlanet(fileName, name, x, y, scale, mass, {
      titanium : utils.randomInt(0,1000),
      gold : utils.randomInt(0,1000),
      uranium : utils.randomInt(0,1000),
    }, container);
  }
}

/**
 * Find a free spot of space to stick a planet. 
 * This will recurse until it finds a free spot.
 * @return {x,y}
 */
function generateXy() {
  let x = utils.randomInt(0, c.UNIVERSE_WIDTH);
  let y = utils.randomInt(0, c.UNIVERSE_HEIGHT);
  for (let planet of window.world.planets) {
    // Still might overlap because we aren't counting the to-be-created planet's radius
    let dist = utils.distanceBetween(x,y, planet.x, planet.y) - planet.radius;
    if (dist < c.MIN_PLANET_DIST) {
      return generateXy();
    }
  } // for
  for (let alien of window.world.aliens) {
    let dist = utils.distanceBetween(x,y, alien.x, alien.y) - alien.radius;
    if (dist < 100) {
      return generateXy();
    }
  } // for
  return {x:x,y:y};
}

function setShipStartXy(x,y) {
  for (let planet of window.world.planets) {
    if ((utils.distanceBetween(0,y, planet.x, planet.y) - planet.radius) < c.SHIP_START_MIN_DIST_TO_PLANET) {
      setShipStartXy(x, y+10);
      return; // try again and exit
    }
  }
  window.world.shipStartX = x;
  window.world.shipStartY = y;
}

// Creates and returns a planet (and adds it to the app)
export function createPlanet(fileName, name, x, y, scale, mass, resources, container) {
  let planet = {};
  planet.name = name; 
  planet.x = x;
  planet.y = y;
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
  planet.sprite.x = x; // wrong value will be set on every draw
  planet.sprite.y = y; 

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

export function createAliens(container) {
  for (let i=0; i<c.NUM_ALIENS; i++) {
    let {x,y} = generateXy();
    let alien = createShip(c.SHIP_ALIEN, c.ALIEN);
    window.world.aliens.push(alien);
    alien.x = x;
    alien.y = y;
    alien.radius = alien.sprite.width/2; // Only for circular aliens
    alien.sprite.x += 100;
    container.addChild(alien.sprite);
  }
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


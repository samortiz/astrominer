import { c, utils, fly, manage } from './';

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
        if (planet.resources.raw.titanium > 0) {
          planet.resources.raw.titanium -= c.MINE_SPEED_TITATIUM;
          planet.resources.stored.titanium += c.MINE_SPEED_TITATIUM;
          if (planet.resources.raw.titanium <= 0) {
            planet.resources.raw.titanium = 0;
          }
        }
        if (planet.resources.raw.gold > 0) {
          planet.resources.raw.gold -= c.MINE_SPEED_GOLD;
          planet.resources.stored.gold += c.MINE_SPEED_GOLD;
          if (planet.resources.raw.gold < 0) {
            planet.resources.raw.gold = 0;
          }
        }
        if (planet.resources.raw.uranium > 0) {
          planet.resources.raw.uranium -= c.MINE_SPEED_URANIUM;
          planet.resources.stored.uranium += c.MINE_SPEED_URANIUM;
          if (planet.resources.raw.uranium < 0) {
            planet.resources.raw.uranium = 0;
          }
        }
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

/**
 * Creates an empty world object, with only basic properties. 
 * This will be populated by setupWorld()
 */
export function createEmptyWorld() {
  return {
    ship:null, 
    planets:[],
    keys: {}, // Global keypress handlers
    app: null, // Pixi App
    gameState: c.GAME_STATE.INIT, // Curent game state 
    gameLoop: null, // loop function in this state
    selectedPlanet: {resources:{}}, 
    bgSprite: null, // star background
  };
}

export function setupWorld() {
  let container = window.world.app.stage;
  const world = window.world;
  createBackground(container);
  createPlanets(container);
  // Default selectedPlanet, shouldn't be displayed
  world.selectedPlanet = world.planets[0];
  setShipStartXy();
  world.ship = createShip(c.SHIP_EXPLORER);
  container.addChild(world.ship.sprite);
  // Initial Resources
  world.ship.resources = c.PLAYER_STARTING_RESOURCES;
  // landing planet
  createPlanet(c.ROCK_PLANET_FILE, 'Home', -200, world.ship.y, 0.5, 250, {
    titanium : 500,
    gold : 500,
    uranium : 500,
  }, container);
  setupMiniMap(container);
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
  let fileNames = [c.ROCK_PLANET_FILE, c.RED_PLANET_FILE, c.PURPLE_PLANET_FILE];

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
  return {x:x,y:y};
}

function setShipStartXy() {
  let y = utils.randomInt(500, c.UNIVERSE_HEIGHT-500);
  for (let planet of window.world.planets) {
    if ((utils.distanceBetween(0,y, planet.x, planet.y) - planet.radius) < c.SHIP_START_MIN_DIST_TO_PLANET) {
      setShipStartXy();
      return; // try again and exit
    }
  }
  window.world.shipStartX = 0;
  window.world.shipStartY = 0; // TODO y
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
  planet.warehouse = []; // stored ships

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

  planet.buildings = [];

  planet.radius = planet.sprite.width / 2; // save the calculation later
  if (fileName === c.PURPLE_PLANET_FILE) {
    planet.radius = planet.radius * 0.95; // atmosphere
  }
  container.addChild(planet.sprite);
  window.world.planets.push(planet);
  return planet;
}

// Creates and returns a ship object
export function createShip(shipType) {
  let ship = Object.assign({}, shipType);
  ship.owner = c.PLAYER;
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


export function canAfford(planet, ship, resources) {
  return (planet.resources.stored.titanium + ship.resources.titanium >= resources.titanium)
  && (planet.resources.stored.gold + ship.resources.gold >= resources.gold)
  && (planet.resources.stored.uranium + ship.resources.uranium >= resources.uranium);
}

export function payBuildingCost(planet, ship, resources) {
  payResource(planet, ship, 'titanium', resources.titanium);
  payResource(planet, ship, 'gold', resources.gold);
  payResource(planet, ship, 'uranium', resources.uranium);
}

export function payResource(planet, ship, resourceType, amount) {
  let paid = planet.resources.stored[resourceType] - amount; 
  if (paid >= 0) {
    planet.resources.stored[resourceType] -= amount;
    return;
  } else {
    // Planet can't afford this purchase, take some from the ship
    planet.resources.stored[resourceType] = 0;
  }
  ship.resources[resourceType] = ship.resources[resourceType] + paid;
  if (ship.resources[resourceType] < 0) {
    console.warn("Ship is in debt "+ship.resources[resourceType]+" "+resourceType);
  }
  
}
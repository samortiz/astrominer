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
        planet.resources.raw.titanium -= c.MINE_SPEED_TITATIUM;
        planet.resources.stored.titanium += c.MINE_SPEED_TITATIUM;
        planet.resources.raw.gold -= c.MINE_SPEED_GOLD;
        planet.resources.stored.gold += c.MINE_SPEED_GOLD;
        planet.resources.raw.uranium -= c.MINE_SPEED_URANIUM;
        planet.resources.stored.uranium += c.MINE_SPEED_URANIUM;
      }
    } // for building
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
    selectedPlanet: {resources:{}}
  };
}

export function setupWorld(container) {
  const world = window.world;
  createPlanets(container);
  // Default selectedPlanet, shouldn't be displayed
  world.selectedPlanet = world.planets[0];
  setShipStartXy();
  world.ship = createShip(container);
  setupMiniMap(container);
}

export function createPlanets(container) {
  let fileNames = [c.ROCK_PLANET_FILE, c.RED_PLANET_FILE];

  for (let i=0; i<=c.NUM_PLANETS; i++) {
    let index = utils.randomInt(0, fileNames.length-1);
    let fileName = fileNames[index];
    let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + utils.randomInt(1000,999999);
    let {x,y} = generateXy();
    let scale = utils.randomInt(10,80) / 100;
    let mass = scale * 500;
    // Setup the Rock planet
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
  container.addChild(planet.sprite);
  window.world.planets.push(planet);
  return planet;
}

// Creates and returns a ship object
export function createShip(container) {
  let ship = {};
  ship.owner = c.PLAYER;
  ship.vx = 0; // velocityX
  ship.vy = 0; // velocityY
  // best bewteen 0.02 - 0.1
  ship.propulsion = 0.05;
  // best between 0.02 - 0.1 (higher is ok)  
  ship.brakeSpeedPct = 0.04;
  // best between 0.3 - 0.07
  ship.turnSpeed = 0.05;
  ship.cargoMax = 50;
  ship.cargo = {
    titanium : 20,
    gold : 20,
    uranium : 0,
  };
  ship.armor = 100;
  ship.x = window.world.shipStartX;
  ship.y = window.world.shipStartY;
  // Graphics Sprite
  let spritesheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
  ship.sprite = new window.PIXI.Sprite(spritesheet.textures[c.SHIP_FILE]);
  ship.sprite.position.set(c.HALF_SCREEN_WIDTH, c.HALF_SCREEN_HEIGHT);
  ship.sprite.anchor.set(0.5, 0.5);  // pivot on ship center
  ship.sprite.scale.set(c.SHIP_SCALE, c.SHIP_SCALE);
  container.addChild(ship.sprite);
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

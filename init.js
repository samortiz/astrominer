// Constants
export const SCREEN_WIDTH = 500;
export const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
export const SCREEN_HEIGHT = 500;
export const HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;

// size of minimap on screen
export const MINIMAP_WIDTH = 100; 
export const MINIMAP_HEIGHT = 100;
export const HALF_MINIMAP_WIDTH = MINIMAP_WIDTH / 2; 
export const HALF_MINIMAP_HEIGHT = MINIMAP_HEIGHT / 2;
// how far the minimap can view
export const MINIMAP_VIEW_WIDTH = 2500; 
export const MINIMAP_VIEW_HEIGHT = 2500; 
export const HALF_MINIMAP_VIEW_WIDTH = MINIMAP_VIEW_WIDTH / 2;
export const HALF_MINIMAP_VIEW_HEIGHT = MINIMAP_VIEW_HEIGHT / 2;
// convert minimap pixels to real pixels
export const MINIMAP_SCALE_X = MINIMAP_WIDTH / MINIMAP_VIEW_WIDTH;  
export const MINIMAP_SCALE_Y = MINIMAP_HEIGHT / MINIMAP_VIEW_HEIGHT; 

export const NUM_PLANETS = 100;
export const MIN_PLANET_DIST = 300;
export const UNIVERSE_WIDTH = 15000;
export const UNIVERSE_HEIGHT = 5000;
export const SHIP_START_MIN_DIST_TO_PLANET = 300;

export const BLACK = 0X000000;
export const RED = 0xFF0000;
export const WHITE = 0xFFFFFF;
export const MED_GREY = 0x808080;
export const DARK_GREY = 0x303030;
export const LIGHT_GREY = 0x909090;

export const PLAYER = "player";
export const SHIP_SCALE = 0.25;
export const GRAVITATIONAL_CONST = 2;
export const CRASH_SPEED = 2; // speed crash happens at
export const CRASH_ANGLE = 0.5; // angle crash happens at
export const ALLOWED_OVERLAP = 10; // overlap for fudging collision detection
export const TAKEOFF_BOOST = 10; // multiple of vx/vy to start away from the surface
export const TAKEOFF_SPEED = 10; // in units of planet gravity

export const SHIP_FILE = "images/spaceship.png";
export const ROCK_PLANET_FILE = "images/rockPlanet.png";
export const RED_PLANET_FILE = "images/redPlanet.png";

// PIXI Aliases
let loader = PIXI.loader;
let Sprite = PIXI.Sprite;
let TextureCache = PIXI.utils.TextureCache

export const GAME_STATE = {
  INIT: "init",
  FLY: "fly",
  MANAGE: "manage"
};

// All the world data
export let world = {
  ship:null, 
  planets:[],
  // Global keypress handlers
  keys: {}, 

  // Curent game state 
  gameState: GAME_STATE.INIT,
  gameLoop: null // loop function in this state
}

export function setupWorld(container) {
  createPlanets(container);
  // Default selectedPlanet, shouldn't be displayed
  world.selectedPlanet = world.planets[0];
  setShipStartXy();
  world.ship = createShip(container);
  setupMiniMap(container);
}

export function createPlanets(container) {
  let fileNames = [ROCK_PLANET_FILE, RED_PLANET_FILE];

  for (let i=0; i<=NUM_PLANETS; i++) {
    let index = randomNumberBetween(0, fileNames.length-1);
    let fileName = fileNames[index];
    let name = String.fromCharCode(65+Math.floor(Math.random() * 26)) + randomNumberBetween(1000,999999);
    let {x,y} = generateXy();
    let scale = randomNumberBetween(15,80) / 100;
    let mass = scale * 500;
    // Setup the Rock planet
    createPlanet(fileName, name, x, y, scale, mass, {
      titanium : randomNumberBetween(0,1000),
      gold : randomNumberBetween(0,1000),
      uranium : randomNumberBetween(0,1000),
    }, container);
  }

}

/**
 * Find a free spot of space to stick a planet. 
 * This will recurse until it finds a free spot.
 * @return {x,y}
 */
function generateXy() {
  let x = randomNumberBetween(0,UNIVERSE_WIDTH);
  let y = randomNumberBetween(0,UNIVERSE_HEIGHT);
  for (let planet of world.planets) {
    // Still might overlap because we aren't counting the to-be-created planet's radius
    let dist = distanceBetween(x,y, planet.x, planet.y) - planet.radius;
    if (dist < MIN_PLANET_DIST) {
      return generateXy();
    }
  } // for
  return {x:x,y:y};
}

function setShipStartXy() {
  let y = randomNumberBetween(500,UNIVERSE_HEIGHT-500);
  for (let planet of world.planets) {
    if ((distanceBetween(0,y, planet.x, planet.y) - planet.radius) < SHIP_START_MIN_DIST_TO_PLANET) {
      setShipStartXy();
      return; // try again and exit
    }
  }
  world.shipStartX = 0;
  world.shipStartY = y;
}

// Creates and returns a planet (and adds it to the app)
export function createPlanet(fileName, name, x, y, scale, mass, resources, container) {
  let texture = TextureCache[fileName];
  texture.frame = new PIXI.Rectangle(0,0, 750, 750);
  let planetSprite = new Sprite(texture);
  let planet = {};
  planet.sprite = planetSprite;
  planet.name = name; 
  planet.x = x;
  planet.y = y;
  planet.sprite.x = x;
  planet.sprite.y = y;
  planet.mass = mass;
  planet.resources = resources;
  planet.sprite.anchor.set(0.5, 0.5);
  planet.sprite.scale.set(scale, scale);
  planet.radius = planet.sprite.width / 2; // save the calculation later
  container.addChild(planet.sprite);
  world.planets.push(planet);
  return planet;
}

// Creates and returns a ship object
export function createShip(container) {
  let ship = {};
  ship.owner = PLAYER;
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
  ship.x = world.shipStartX;
  ship.y = world.shipStartY;
  // Graphics Sprite
  ship.sprite = new Sprite(loader.resources[SHIP_FILE].texture);
  ship.sprite.position.set(HALF_SCREEN_WIDTH, HALF_SCREEN_HEIGHT);
  ship.sprite.anchor.set(0.5, 0.5);  // pivot on ship center
  ship.sprite.scale.set(SHIP_SCALE, SHIP_SCALE);
  container.addChild(ship.sprite);
  return ship;
}

export function setupMiniMap(container) {
  let miniMapContainer = new PIXI.Container();
  container.addChild(miniMapContainer);

  // Mask so drawings don't spill out of the map
  var mask = new PIXI.Graphics();
  mask.drawRect(0, SCREEN_HEIGHT-MINIMAP_HEIGHT, MINIMAP_WIDTH, SCREEN_HEIGHT);
  mask.renderable = true;
  mask.cacheAsBitmap = true;
  miniMapContainer.addChild(mask);
  miniMapContainer.mask = mask;  

  // Graphics for drawing shapes on
  var g = new PIXI.Graphics();
  miniMapContainer.addChild(g);  
  world.miniMapGraphics = g;

}

// ---  Utils : cannot use utils.js as that hasn't been loaded yet. 

/**
 * @return an int between min and max inclusive
 */
export function randomNumberBetween(minP, maxP) {
    let min = Math.ceil(minP);
    let max = Math.floor(maxP);
    return Math.floor(Math.random() * (max - min +1) + min); 
}

/**
 * Returns the distance between two points 
 */
export function distanceBetween(ax, ay, bx, by) {
  return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));
}

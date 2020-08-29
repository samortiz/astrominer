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
export const MINIMAP_VIEW_WIDTH = 1500; 
export const MINIMAP_VIEW_HEIGHT = 1500; 
export const HALF_MINIMAP_VIEW_WIDTH = MINIMAP_VIEW_WIDTH / 2;
export const HALF_MINIMAP_VIEW_HEIGHT = MINIMAP_VIEW_HEIGHT / 2;
// convert minimap pixels to real pixels
export const MINIMAP_SCALE_X = MINIMAP_WIDTH / MINIMAP_VIEW_WIDTH;  
export const MINIMAP_SCALE_Y = MINIMAP_HEIGHT / MINIMAP_VIEW_HEIGHT; 

export const SHIP_START_X = 420;
export const SHIP_START_Y = 250;
export const SHIP_SCALE = 0.25;

export const BLACK = 0X000000;
export const RED = 0xFF0000;
export const WHITE = 0xFFFFFF;
export const MED_GREY = 0x808080;
export const DARK_GREY = 0x303030;
export const LIGHT_GREY = 0x909090;

export const PLAYER = "player";
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
  world.ship = createShip(container);
  setupMiniMap(container);
}

export function createPlanets(container) {
  // Setup the Rock planet
  createPlanet(ROCK_PLANET_FILE, "X21325", 250, 250, 0.3, 300, {
    titanium : 300,
    gold : 150,
    uranium : 0,
  }, container);

  createPlanet(RED_PLANET_FILE, "X25225", 450, 450, 0.1, 100, {
    titanium : 20,
    gold : 50,
    uranium : 100,
  }, container);

   // Setup the Rock planet
   createPlanet(ROCK_PLANET_FILE, "FarAway", 1250, 250, 0.5, 600, {
    titanium : 450,
    gold : 350,
    uranium : 100,
  }, container);
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
  ship.x = SHIP_START_X;
  ship.y = SHIP_START_Y;
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

// Constants
export const PLAYER = "player";
export const SCREEN_WIDTH = 1000;
export const SCREEN_HEIGHT = 500;
export const BLACK = 0X000000;

export const GRAVITATIONAL_CONST = 2;
export const CRASH_SPEED = 1.5; // speed crash happens at
export const CRASH_ANGLE = 0.25; // angle crash happens at
export const ALLOWED_OVERLAP = 10; // overlap for fudging collision detection

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

export function setupWorld(app) {
  // Setup the Rock planet
  createPlanet(ROCK_PLANET_FILE, "X21325", 250, 250, 0.3, 100, {
    titanium : 300,
    gold : 150,
    uranium : 0,
  }, app);

  createPlanet(RED_PLANET_FILE, "X25225", 850, 150, 0.1, 30, {
    titanium : 20,
    gold : 50,
    uranium : 100,
  }, app);

  // Default selectedPlanet, shouldn't be displayed
  world.selectedPlanet = world.planets[0];

  // Setup the default ship
  world.ship = createShip(app);
}

// Creates and returns a planet (and adds it to the app)
export function createPlanet(fileName, name, x, y, scale, mass, resources, app) {
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
  app.stage.addChild(planet.sprite);
  world.planets.push(planet);
  return planet;
}

// Creates and returns a ship object
export function createShip(app) {
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
  // Graphics Sprite
  ship.sprite = new Sprite(loader.resources[SHIP_FILE].texture);
  ship.sprite.position.set(400, 250);
  ship.sprite.anchor.set(0.5, 0.5);  // pivot on ship center
  ship.sprite.scale.set(0.35, 0.35);
  app.stage.addChild(ship.sprite);
  return ship;
}

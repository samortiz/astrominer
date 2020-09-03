// Colors
export const BLACK = 0X000000;
export const RED = 0xFF0000;
export const WHITE = 0xFFFFFF;
export const MED_GREY = 0x808080;
export const DARK_GREY = 0x303030;
export const LIGHT_GREY = 0x909090;

export const GAME_STATE = {
  INIT: "init",
  FLY: "fly",
  MANAGE: "manage"
};

// Screen Layout
export const SCREEN_WIDTH = 500;
export const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
export const SCREEN_HEIGHT = 500;
export const HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;
// size of minimap on screen
export const MINIMAP_WIDTH = 120; 
export const MINIMAP_HEIGHT = 120;
export const HALF_MINIMAP_WIDTH = MINIMAP_WIDTH / 2; 
export const HALF_MINIMAP_HEIGHT = MINIMAP_HEIGHT / 2;
// how far the minimap can view
export const MINIMAP_VIEW_WIDTH = 4000; 
export const MINIMAP_VIEW_HEIGHT = 4000; 
export const HALF_MINIMAP_VIEW_WIDTH = MINIMAP_VIEW_WIDTH / 2;
export const HALF_MINIMAP_VIEW_HEIGHT = MINIMAP_VIEW_HEIGHT / 2;
// convert minimap pixels to real pixels
export const MINIMAP_SCALE_X = MINIMAP_WIDTH / MINIMAP_VIEW_WIDTH;  
export const MINIMAP_SCALE_Y = MINIMAP_HEIGHT / MINIMAP_VIEW_HEIGHT; 

// Planets and Universe
export const NUM_PLANETS = 100;
export const MIN_PLANET_DIST = 300;
export const UNIVERSE_WIDTH = 15000;
export const UNIVERSE_HEIGHT = 5000;
export const SHIP_START_MIN_DIST_TO_PLANET = 300;

// Files
export const SPRITESHEET_JSON = "images/spritesheet.json";
export const ROCK_PLANET_FILE = "rock_planet.png";
export const RED_PLANET_FILE = "red_planet.png";
export const PURPLE_PLANET_FILE = "purple_planet.png";
export const MINE_FILE = "mine"; // animated
export const FACTORY_FILE = "factory.png";
export const SHIP_CARGO_FILE = "ship_cargo.png";
export const SHIP_EXPLORER_FILE = "ship_explorer.png";
export const SHIP_FAST_FILE = "ship_FAST";
export const SHIP_FIGHTER_FILE = "ship_fighter";
export const SHIP_HEAVY_FILE = "ship_heavy";

// Ships
export const PLAYER = "player";
export const GRAVITATIONAL_CONST = 2;
export const ALLOWED_OVERLAP = 2; // overlap for fudging collision detection
export const TAKEOFF_BOOST = 10; // multiple of vx/vy to start away from the surface
export const TAKEOFF_SPEED = 10; // in units of planet gravity

export const SHIP_EXPLORER = {
  propulsion: 0.05, // best bewteen 0.02 - 0.1
  brakeSpeedPct: 0.04, // best between 0.02 - 0.1 (higher is ok)  
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 50,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  armor: 100,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.8,
  imageFile: SHIP_EXPLORER_FILE,
};

export const SHIP_CARGO = {
  propulsion: 0.025, // best bewteen 0.02 - 0.1
  brakeSpeedPct: 0.03, // best between 0.02 - 0.1 (higher is ok)  
  turnSpeed: 0.04, // // best between 0.3 - 0.07
  resourcesMax: 300,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  armor: 10,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.4,
  imageFile: SHIP_CARGO_FILE,
};

// TODO : fighter, fast, heavy

// Buildings
export const BUILDING_PLACEMENT_ROTATION_INCREMENT = 0.1;

export const BUILDING_TYPE_MINE = "mine";
export const MINE_SCALE = 0.25;
export const MINE_PLACEMENT_FROM_SHIP = 50; // mine is 50px to the right of the ship
export const MINE_ANIMATION_SPEED = 0.5;
export const MINE_SPEED_TITATIUM = 0.50166; // 1 every sec
export const MINE_SPEED_GOLD = 0.50083;  // 1 every 2 sec
export const MINE_SPEED_URANIUM = 0.50033; // 1 every 5 sec
export const MINE_COST = {titanium:20, gold:10, uranium:0};

export const BUILDING_TYPE_FACTORY = "factory";
export const FACTORY_COST = {titanium:100, gold:100, uranium:10};
export const FACTORY_SCALE = 0.25;
export const FACTORY_PLACEMENT_FROM_SHIP = 50; // factory is 50px to the right of the ship

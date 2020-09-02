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
export const GRAVITATIONAL_CONST = 2;
export const CRASH_SPEED = 2; // speed crash happens at
export const CRASH_ANGLE = 0.5; // angle crash happens at
export const ALLOWED_OVERLAP = 10; // overlap for fudging collision detection
export const TAKEOFF_BOOST = 10; // multiple of vx/vy to start away from the surface
export const TAKEOFF_SPEED = 10; // in units of planet gravity
export const SHIP_SCALE = 0.25;

export const MINE_SCALE = 0.25;
export const MINE_PLACEMENT_FROM_SHIP = 50; // mine is 50px to the right of the ship
export const MINE_ANIMATION_SPEED = 0.5;
export const MINE_SPEED_TITATIUM = 0.0166; // 1 every sec
export const MINE_SPEED_GOLD = 0.0083;  // 1 every 2 sec
export const MINE_SPEED_URANIUM = 0.0033; // 1 every 5 sec

export const BUILDING_TYPE_MINE = "mine";
export const BUILDING_TYPE_FACTORY = "factory";

// Files
export const SPRITESHEET_JSON = "images/spritesheet.json";
export const SHIP_FILE = "spaceship.png";
export const ROCK_PLANET_FILE = "rockPlanet.png";
export const RED_PLANET_FILE = "redPlanet.png";
export const MINE_FILE = "mine";

export const GAME_STATE = {
  INIT: "init",
  FLY: "fly",
  MANAGE: "manage"
};

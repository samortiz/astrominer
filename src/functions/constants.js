// Colors
export const BLACK = 0X000000;
export const RED = 0xFF0000;
export const BLUE = 0x0000FF;
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
export const MINE_FILE = "mine"; // animation name in json
export const FACTORY_FILE = "factory.png";
export const SHIP_CARGO_FILE = "ship_cargo.png";
export const SHIP_EXPLORER_FILE = "ship_explorer.png";
export const SHIP_FAST_FILE = "ship_fast.png";
export const SHIP_FIGHTER_FILE = "ship_fighter.png";
export const SHIP_HEAVY_FILE = "ship_heavy.png";
export const STAR_BACKGROUND_FILE = "images/stars.png";
export const CRASH_JSON = "images/crash.json";
export const CRASH = "crash"; // animation name in json
export const BULLET_FILE = "bullet.png";

export const PLAYER = "player";
export const PLAYER_STARTING_RESOURCES = {titanium:40, gold:20, uranium:0};
export const GRAVITATIONAL_CONST = 2;
export const ALLOWED_OVERLAP = 2; // overlap for fudging collision detection
export const TAKEOFF_SPEED = 10; // in units of planet gravity

// Critical Hits
export const CRIT_TYPE_BRAKE = "Brake"
export const CRIT_TYPE_STEER_LEFT = "Steer Left";
export const CRIT_TYPE_STEER_RIGHT = "Steer Right";
export const CRIT_TYPE_ENGINE = "Engine";

// Equipment
export const EQUIP_TYPE_BRAKE = "Brake";
export const EQUIP_TYPE_PRIMARY_WEAPON = "Primary Weapon";
// brakeSpeedPct is best between 0.02 - 0.1 (higher is ok)  
export const EQUIP_BRAKE = {name: "Brake", type:EQUIP_TYPE_BRAKE, brakeSpeedPct:0.04, 
                            crit:{type:CRIT_TYPE_BRAKE, maxHits:1, hits:0, pctLoss:0.95} };
export const EQUIP_BLASTER = {name: "Blaster", type:EQUIP_TYPE_PRIMARY_WEAPON, coolTime:25, cool:0, damage:10, speed:2.5, lifetime:75,
                            crit: {type:CRIT_TYPE_BRAKE, maxHits:1, hits:0}};
export const EQUIP_FAST_BLASTER = {name: "Fast Blaster", type:EQUIP_TYPE_PRIMARY_WEAPON, coolTime:10, cool:0, damage:10, speed:4, lifetime:60,
                            crit: {type:CRIT_TYPE_BRAKE, maxHits:1, hits:0}};
export const EQUIP_STREAM_BLASTER = {name: "Stream Blaster", type:EQUIP_TYPE_PRIMARY_WEAPON, coolTime:3, cool:0, damage:5, speed:5, lifetime:40,
                            crit: {type:CRIT_TYPE_BRAKE, maxHits:1, hits:0}};
export const EQUIP_TYPE_THRUSTERS = "Thrusters";
export const EQUIP_TYPE_REPAIR_DROID = "Repair Droid";

// Ships
export const SHIP_EXPLORER = {
  propulsion: 0.05, // best bewteen 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 50,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 2,
  equip : [EQUIP_BRAKE, EQUIP_BLASTER],
  crits: [{type:CRIT_TYPE_STEER_LEFT, maxHits:1, hits:0, pctLoss:0.95}
        , {type:CRIT_TYPE_STEER_RIGHT, maxHits:1, hits:0, pctLoss:0.95}
        , {type:CRIT_TYPE_ENGINE, maxHits:1, hits:0, pctLoss:0.80}
  ],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.6,
  imageFile: SHIP_EXPLORER_FILE,
};
export const SHIP_EXPLORER_COST =  {titanium:40, gold:40, uranium:30};

export const SHIP_CARGO = {
  propulsion: 0.025, // best bewteen 0.02 - 0.1
  turnSpeed: 0.04, // // best between 0.3 - 0.07
  resourcesMax: 500,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 1,
  equip : [EQUIP_BRAKE],
  armorMax: 20,
  armor: 20,
  crashSpeed: 1.2,
  crashAngle: 0.3,
  imageScale: 0.4,
  imageFile: SHIP_CARGO_FILE,
};
export const SHIP_CARGO_COST =  {titanium:100, gold:50, uranium:50};

export const SHIP_FAST = {
  propulsion: 0.1, // best bewteen 0.02 - 0.1
  turnSpeed: 0.08, // // best between 0.3 - 0.07
  resourcesMax: 40,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 2,
  equip : [EQUIP_BRAKE, EQUIP_BLASTER],
  armorMax : 60,
  armor: 60,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.3,
  imageFile: SHIP_FAST_FILE,
};
export const SHIP_FAST_COST =  {titanium:200, gold:100, uranium:50};

export const SHIP_HEAVY = {
  propulsion: 0.05, // best bewteen 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 300,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 5,
  equip : [EQUIP_BRAKE, EQUIP_FAST_BLASTER],
  armorMax : 300,
  armor: 300,
  crashSpeed: 1.5,
  crashAngle: 0.4,
  imageScale: 0.4,
  imageFile: SHIP_HEAVY_FILE,
};
export const SHIP_HEAVY_COST =  {titanium:500, gold:300, uranium:150};

export const SHIP_FIGHTER = {
  propulsion: 0.08, // best bewteen 0.02 - 0.1
  turnSpeed: 0.07, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 4,
  equip : [EQUIP_BRAKE, EQUIP_STREAM_BLASTER],
  armorMax : 150,
  armor: 150,
  crashSpeed: 1.5,
  crashAngle: 0.6,
  imageScale: 0.5,
  imageFile: SHIP_FIGHTER_FILE,
};
export const SHIP_FIGHTER_COST =  {titanium:500, gold:500, uranium:500};

// Buildings
export const BUILDING_PLACEMENT_ROTATION_INCREMENT = 0.1;
// Mine
export const BUILDING_TYPE_MINE = "mine";
export const MINE_SCALE = 0.25;
export const MINE_PLACEMENT_FROM_SHIP = 50; // mine is 50px to the right of the ship
export const MINE_ANIMATION_SPEED = 0.5;
export const MINE_SPEED_TITATIUM = 10.0166; // 1 every sec
export const MINE_SPEED_GOLD = 10.0083;  // 1 every 2 sec
export const MINE_SPEED_URANIUM = 10.0033; // 1 every 5 sec
export const MINE_COST = {titanium:20, gold:10, uranium:0};
// Factory
export const BUILDING_TYPE_FACTORY = "factory";
export const FACTORY_COST = {titanium:100, gold:100, uranium:10};
export const FACTORY_SCALE = 0.25;
export const FACTORY_PLACEMENT_FROM_SHIP = 50; // how far factory is to the right of the ship TODO: should be based on sprite.height/2

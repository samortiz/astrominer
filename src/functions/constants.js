// Colors
import {c} from "./index";

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
export const SCREEN_WIDTH = 1000;
export const SCREEN_HEIGHT = 1000;
export const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
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

// Files
export const SPRITESHEET_JSON = "images/spritesheet.json";
export const ROCK_PLANET_FILE = "rock_planet.png";
export const RED_PLANET_FILE = "red_planet.png";
export const PURPLE_PLANET_FILE = "purple_planet.png";
export const GREEN_PLANET_FILE = "green_planet.png";
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
export const BULLET_BLUE_FILE = "bullet_blue.png";
export const BULLET_WHITE_FILE = "bullet_white.png";
export const ALIEN_SHIP_FILE = "alien.png";
export const ALIEN_SHIP_SMALL_FILE = "alien_small.png";
export const ALIEN_SHIP_LARGE_FILE = "alien_large.png";
export const ALIEN_SHIP_FIRE_FILE = "alien_fire.png";

// Planets and Universe
export const UNIVERSE_RADIUS = 15000;
export const PLANET_CACHE_STEP_SIZE = SCREEN_WIDTH;
export const PLANET_CACHE_NUM_STEPS = UNIVERSE_RADIUS * 2 / PLANET_CACHE_STEP_SIZE;
export const UNIVERSE_RINGS = [
  { planetCount: 1, 
    minDist: 1, maxDist: 2, 
    minDistToOtherPlanet:10, 
    minPlanetScale:400, maxPlanetScale:401, 
    planetFiles:[GREEN_PLANET_FILE]
  },
  { planetCount: 90, 
    minDist: 1400, maxDist: 5000, 
    minDistToOtherPlanet:150, 
    minPlanetScale:100, maxPlanetScale:180, 
    planetFiles:[RED_PLANET_FILE, PURPLE_PLANET_FILE, GREEN_PLANET_FILE]
  },
  { planetCount: 600, 
    minDist: 5000, maxDist: 10000, 
    minDistToOtherPlanet:150, 
    minPlanetScale:50, maxPlanetScale:100, 
    planetFiles:[ROCK_PLANET_FILE, RED_PLANET_FILE]
  },
  { planetCount: 1000, 
    minDist: 10000, maxDist: 15000, 
    minDistToOtherPlanet:150, 
    minPlanetScale:20, maxPlanetScale:90, 
    planetFiles:[ROCK_PLANET_FILE]
  },
];

export const PLAYER = "player";
export const ALIEN = "alien";
export const PLAYER_STARTING_RESOURCES = {titanium:30, gold:20, uranium:0};
export const GRAVITATIONAL_CONST = 2;
export const ALLOWED_OVERLAP = 2; // overlap for fudging collision detection
export const TAKEOFF_SPEED = 10; // in units of planet gravity
export const PLANET_RESOURCE_MAX = 99999999;
export const PLAYER_START_X = -(UNIVERSE_RADIUS + 1000); // left of the universe
export const PLAYER_START_Y = 0;
export const NUM_ALIENS = 1000;
export const MIN_ALIEN_DIST_TO_PLANET = 50;
export const MIN_ALIEN_DIST_TO_ALIEN = 3;

// Critical Hits
export const CRIT_TYPE_BRAKE = "Brake"
export const CRIT_TYPE_STEER_LEFT = "Steer Left";
export const CRIT_TYPE_STEER_RIGHT = "Steer Right";
export const CRIT_TYPE_ENGINE = "Engine";
export const CRIT_TYPE_GUN = "Engine";
export const CRIT_TYPE_THRUSTER = "Thruster";
export const CRIT_TYPE_MISC = "Misc";

// Buildings
export const BUILDING_PLACEMENT_ROTATION_INCREMENT = 0.1;
// Mine
export const BUILDING_TYPE_MINE = "mine";
export const MINE_SCALE = 0.25;
export const MINE_PLACEMENT_FROM_SHIP = 50; // mine is 50px to the right of the ship
export const MINE_ANIMATION_SPEED = 0.5;
export const MINE_SPEED_TITATIUM = 0.0166; // 1 every sec
export const MINE_SPEED_GOLD = 0.0083;  // 1 every 2 sec
export const MINE_SPEED_URANIUM = 0.0033; // 1 every 5 sec
export const MINE_COST = {titanium:20, gold:10, uranium:0};
// Factory
export const BUILDING_TYPE_FACTORY = "factory";
export const FACTORY_COST = {titanium:50, gold:20, uranium:10};
export const FACTORY_SCALE = 0.25;
export const FACTORY_PLACEMENT_FROM_SHIP = 50; // how far factory is to the right of the ship TODO: should be based on sprite.height/2

// Equipment
export const EQUIP_TYPE_BRAKE = "Brake";
export const EQUIP_TYPE_PRIMARY_WEAPON = "Primary Weapon";
export const EQUIP_TYPE_THRUSTER = "Thruster";
export const EQUIP_TYPE_ARMOR = "Armor";
export const EQUIP_TYPE_REPAIR_DROID = "Repair Droid";
export const EQUIP_TYPE_MISC = "Misc";
export const EQUIP_TYPE_SPEED = "Speed";
export const EQUIP_TYPE_TURN = "Turn";
export const EQUIP_TYPE_STORAGE = "Storage";

export const THRUST_MOMENTUM = "Thrust Momentum";
export const THRUST_BLINK = "Thrust Blink";

// Object type
export const OBJ_EQUIP = "Equip";
export const OBJ_SHIP = "Ship";

export const ALIEN_AI_TURRET = "ALIEN_AI_TURRET";
export const ALIEN_AI_CREEPER = "ALIEN_AI_CREEPER";

// brakeSpeedPct is best between 0.02 - 0.1 (higher is ok)  
export const EQUIP_BRAKE = {name: "Brake", objType:OBJ_EQUIP, type:EQUIP_TYPE_BRAKE, brakeSpeedPct:0.04, 
                            crit: {type:CRIT_TYPE_BRAKE, maxHits:1, hits:0, pctLoss:0.95},
                            cost: {titanium:20, gold:10, uranium:0} };
export const EQUIP_BLINK_BRAKE = {name: "Blink Brake", objType:OBJ_EQUIP, type:EQUIP_TYPE_BRAKE, brakeSpeedPct:0, 
                            crit:{type:CRIT_TYPE_BRAKE, maxHits:1, hits:0, pctLoss:1},
                            cost: {titanium:50, gold:50, uranium:30}};
export const EQUIP_SPEED_BOOST = {name: "Speed Booster", objType:OBJ_EQUIP, type:EQUIP_TYPE_SPEED, boostSpeed:0.05, 
                            crit:{type:CRIT_TYPE_MISC, maxHits:1, hits:0, pctLoss:1},
                            cost: {titanium:0, gold:10, uranium:20}};
export const EQUIP_TURN_BOOST = {name: "Turn Booster", objType:OBJ_EQUIP, type:EQUIP_TYPE_TURN, boostSpeed:0.05, 
                            crit:{type:CRIT_TYPE_MISC, maxHits:1, hits:0, pctLoss:1},
                            cost: {titanium:0, gold:10, uranium:20}};
export const EQUIP_STORAGE = {name: "Storage", objType:OBJ_EQUIP, type:EQUIP_TYPE_STORAGE, storageAmount:100, 
                            crit:{type:CRIT_TYPE_MISC, maxHits:1, hits:0, pctLoss:1},
                            cost: {titanium:50, gold:0, uranium:0}};
export const EQUIP_BLASTER = {name: "Blaster", objType:OBJ_EQUIP, type:EQUIP_TYPE_PRIMARY_WEAPON, coolTime:25, cool:0, damage:10, speed:2.5, lifetime:100, bulletFile:BULLET_FILE,
                            crit: {type:CRIT_TYPE_GUN, maxHits:1, hits:0},
                            cost: {titanium:10, gold:0, uranium:20}};
export const EQUIP_FAST_BLASTER = {name: "Fast Blaster", objType:OBJ_EQUIP, type:EQUIP_TYPE_PRIMARY_WEAPON, coolTime:10, cool:0, damage:10, speed:4, lifetime:80, bulletFile:BULLET_FILE,
                            crit: {type:CRIT_TYPE_GUN, maxHits:1, hits:0},
                            cost: {titanium:20, gold:20, uranium:40}};
export const EQUIP_STREAM_BLASTER = {name: "Stream Blaster", objType:OBJ_EQUIP, type:EQUIP_TYPE_PRIMARY_WEAPON, coolTime:3, cool:0, damage:7, speed:6, lifetime:70, bulletFile:BULLET_FILE,
                            crit: {type:CRIT_TYPE_GUN, maxHits:1, hits:0},
                            cost: {titanium:30, gold:30, uranium:60}};
export const EQUIP_THRUSTER = {name: "Thruster", objType:OBJ_EQUIP, type:EQUIP_TYPE_THRUSTER, thrustSpeed:0.08, thrustType:THRUST_MOMENTUM,
                            crit:{type:CRIT_TYPE_THRUSTER, maxHits:1, hits:0, pctLoss:0.95},
                            cost: {titanium:40, gold:40, uranium:10}};
// blink thrustSpeed is good from 2 to 10                            
export const EQUIP_BLINK_THRUSTER = {name: "Blink Thruster", objType:OBJ_EQUIP, type:EQUIP_TYPE_THRUSTER, thrustSpeed:2.5, thrustType:THRUST_BLINK,
                            crit:{type:CRIT_TYPE_THRUSTER, maxHits:1, hits:0, pctLoss:0.95},
                            cost: {titanium:60, gold:50, uranium:10}};
export const EQUIP_R2D2 = {name: "R2D2 Repair Droid", objType:OBJ_EQUIP, type:EQUIP_TYPE_REPAIR_DROID, repairSpeed:0.03, 
                            crit:{type:CRIT_TYPE_MISC, maxHits:1, hits:0, pctLoss:1},
                            cost: {titanium:20, gold:100, uranium:50}};
export const EQUIP_ALIEN_BLASTER = {name: "Alien Blaster", objType:OBJ_EQUIP, type:EQUIP_TYPE_PRIMARY_WEAPON, coolTime:20, cool:0, damage:4, speed:2, lifetime:120, bulletFile:BULLET_BLUE_FILE,
                            crit: {type:CRIT_TYPE_GUN, maxHits:1, hits:0},
                            cost: {titanium:10, gold:30, uranium:50}};
export const EQUIP_ARMOR = {name: "Armor Plate", objType:OBJ_EQUIP, type:EQUIP_TYPE_ARMOR, armorAmt:100, 
                            crit:{type:CRIT_TYPE_MISC, maxHits:1, hits:0, pctLoss:1},
                            cost: {titanium:50, gold:0, uranium:0}};
export const ALL_EQUIP = [EQUIP_BRAKE, EQUIP_BLINK_BRAKE, EQUIP_SPEED_BOOST, EQUIP_TURN_BOOST, EQUIP_BLASTER, EQUIP_FAST_BLASTER, EQUIP_STREAM_BLASTER,
   EQUIP_THRUSTER, EQUIP_BLINK_THRUSTER, EQUIP_R2D2, EQUIP_ALIEN_BLASTER, EQUIP_ARMOR];

// Ships
export const SHIP_EXPLORER = {
  name: "Explorer",
  objType:OBJ_SHIP,
  propulsion: 0.05, // best bewteen 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 50,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 2,
  equip : [EQUIP_BRAKE, EQUIP_BLASTER], // DEBUG blaster
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
  cost: {titanium:40, gold:30, uranium:30},
};

export const SHIP_CARGO = {
  name: "Cargo",
  objType:OBJ_SHIP,
  propulsion: 0.025, // best bewteen 0.02 - 0.1
  turnSpeed: 0.04, // // best between 0.3 - 0.07
  resourcesMax: 600,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 2,
  equip : [EQUIP_BRAKE],
  armorMax: 20,
  armor: 20,
  crashSpeed: 1.2,
  crashAngle: 0.3,
  imageScale: 0.4,
  imageFile: SHIP_CARGO_FILE,
  cost: {titanium:100, gold:50, uranium:50},
};

export const SHIP_FAST = {
  name: "Fast",
  objType:OBJ_SHIP,
  propulsion: 0.1, // best bewteen 0.02 - 0.1
  turnSpeed: 0.08, // // best between 0.3 - 0.07
  resourcesMax: 40,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 3,
  equip : [EQUIP_BRAKE],
  armorMax : 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.3,
  imageFile: SHIP_FAST_FILE,
  cost: {titanium:200, gold:100, uranium:50},
};

export const SHIP_HEAVY = {
  name: "Heavy",
  objType:OBJ_SHIP,
  propulsion: 0.05, // best bewteen 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 300,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 6,
  equip : [EQUIP_BRAKE],
  armorMax : 300,
  armor: 300,
  crashSpeed: 1.5,
  crashAngle: 0.4,
  imageScale: 0.4,
  imageFile: SHIP_HEAVY_FILE,
  cost: {titanium:500, gold:300, uranium:150},
};

export const SHIP_FIGHTER = {
  name: "Fighter",
  objType:OBJ_SHIP,
  propulsion: 0.08, // best bewteen 0.02 - 0.1
  turnSpeed: 0.07, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 5,
  equip : [EQUIP_BRAKE],
  armorMax : 200,
  armor: 200,
  crashSpeed: 1.5,
  crashAngle: 0.6,
  imageScale: 0.5,
  imageFile: SHIP_FIGHTER_FILE,
  cost: {titanium:500, gold:500, uranium:500},
};

export const SHIP_ALIEN_SMALL = {
  name: "Alien Turret",
  objType:OBJ_SHIP,
  propulsion: 0.05, // best bewteen 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 3,
  equip : [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER],
  crits: [{type:CRIT_TYPE_STEER_LEFT, maxHits:1, hits:0, pctLoss:0.95}
        , {type:CRIT_TYPE_STEER_RIGHT, maxHits:1, hits:0, pctLoss:0.95}
        , {type:CRIT_TYPE_ENGINE, maxHits:1, hits:0, pctLoss:0.80}
  ],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.8,
  imageFile: ALIEN_SHIP_SMALL_FILE,
  cost: {titanium:50, gold:50, uranium:50},
  aiType: ALIEN_AI_CREEPER,
};

export const SHIP_ALIEN_LARGE = {
  name: "Alien Ship",
  objType:OBJ_SHIP,
  propulsion: 0.05, // best bewteen 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium : 0,
    gold : 0,
    uranium : 0,
  },
  equipMax: 3,
  equip : [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER],
  crits: [{type:CRIT_TYPE_STEER_LEFT, maxHits:1, hits:0, pctLoss:0.95}
    , {type:CRIT_TYPE_STEER_RIGHT, maxHits:1, hits:0, pctLoss:0.95}
    , {type:CRIT_TYPE_ENGINE, maxHits:1, hits:0, pctLoss:0.80}
  ],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.9,
  imageFile: ALIEN_SHIP_FILE,
  cost: {titanium:150, gold:100, uranium:80},
  aiType: ALIEN_AI_CREEPER,
};


export const ALL_SHIPS = [SHIP_EXPLORER, SHIP_CARGO, SHIP_FAST, SHIP_HEAVY, SHIP_FIGHTER, SHIP_ALIEN_SMALL];

export const MINING_XP_LEVELS = [
  {xp:10, obj:EQUIP_BLASTER},
  {xp:100, obj:SHIP_CARGO},
  {xp:200, obj:EQUIP_ARMOR},
  {xp:400, obj:SHIP_FAST},
  {xp:1000, obj:EQUIP_FAST_BLASTER},
  {xp:1500, obj:EQUIP_SPEED_BOOST},
  {xp:2000, obj:EQUIP_TURN_BOOST},
  {xp:3000, obj:EQUIP_STORAGE},
  {xp:5000, obj:EQUIP_THRUSTER},
  {xp:8000, obj:SHIP_HEAVY},
  {xp:10000, obj:SHIP_FIGHTER},
]

export const ALIEN_XP_LEVELS = [
  {xp:100, obj:EQUIP_ALIEN_BLASTER},
  {xp:300, obj:EQUIP_BLINK_BRAKE},
  {xp:500, obj:EQUIP_BLINK_THRUSTER},
  {xp:1000, obj:EQUIP_STREAM_BLASTER},
  {xp:1500, obj:EQUIP_R2D2},
  {xp:2000, obj:SHIP_ALIEN_SMALL},
];
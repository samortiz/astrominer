// Colors
export const BLACK = 0X000000;
export const YELLOW = 0xCC55CC;
export const BLUE = 0x00AAFF;
export const WHITE = 0xFFFFFF;
export const DARK_GREY = 0x303030;
export const LIGHT_GREY = 0x909090;

export const GAME_STATE = {
  INIT: "init",
  FLY: "fly",
  MANAGE: "manage"
};

// Saved games
export const LOCALSTORAGE_GAME_NAMES_KEY = 'saved-game-names';

// Screen Layout
export const SCREEN_WIDTH = 1000;
export const SCREEN_HEIGHT = 1000;
export const HALF_SCREEN_WIDTH = SCREEN_WIDTH / 2;
export const HALF_SCREEN_HEIGHT = SCREEN_HEIGHT / 2;
export const NEARBY_WIDTH = SCREEN_WIDTH * 3;
export const NEARBY_HEIGHT = SCREEN_HEIGHT * 3;
// size of minimap on screen
export const MINIMAP_WIDTH = 250;
export const MINIMAP_HEIGHT = 250;
export const HALF_MINIMAP_WIDTH = MINIMAP_WIDTH / 2;
export const HALF_MINIMAP_HEIGHT = MINIMAP_HEIGHT / 2;
// how far the minimap can view
export const MINIMAP_VIEW_WIDTH = 8000;
export const MINIMAP_VIEW_HEIGHT = 8000;
export const HALF_MINIMAP_VIEW_WIDTH = MINIMAP_VIEW_WIDTH / 2;
export const HALF_MINIMAP_VIEW_HEIGHT = MINIMAP_VIEW_HEIGHT / 2;
// convert minimap pixels to real pixels
export const MINIMAP_SCALE_X = MINIMAP_WIDTH / MINIMAP_VIEW_WIDTH;
export const MINIMAP_SCALE_Y = MINIMAP_HEIGHT / MINIMAP_VIEW_HEIGHT;
// MiniMap colors
export const MINIMAP_BORDER_COLOR = LIGHT_GREY;
export const MINIMAP_BACKGROUND_COLOR = DARK_GREY;
export const MINIMAP_PLANET_COLOR = LIGHT_GREY;
export const MINIMAP_SELECTED_PLANET_COLOR = YELLOW;
export const MINIMAP_BUILDING_COLOR = BLUE;
export const MINIMAP_SHIP_COLOR = WHITE;

// Files
export const SPRITESHEET_JSON = "images/spritesheet.json";
export const ALIEN_SHIP_BLACK_FILE = "alien_black.png";
export const ALIEN_SHIP_BLUE_FILE = "alien_blue.png";
export const ALIEN_SHIP_BLUE_LARGE_FILE = "alien_blue_large.png";
export const ALIEN_SHIP_BLUE_SMALL_FILE = "alien_blue_small.png";
export const ALIEN_SHIP_FIRE_FILE = "alien_fire.png";
export const ALIEN_SHIP_GREEN_FILE = "alien_green.png";
export const ALIEN_SHIP_GREEN_SMALL_FILE = "alien_green_small.png";
export const ALIEN_SHIP_GREEN_LARGE_FILE = "alien_green_large.png";
export const ALIEN_SHIP_RED_FILE = "alien_red.png";
export const ALIEN_SHIP_RED_SMALL_FILE = "alien_red_small.png";
export const ALIEN_SHIP_RED_LARGE_FILE = "alien_red_large.png";
export const BULLET_FILE = "bullet.png";
export const BULLET_BLUE_FILE = "bullet_blue.png";
export const BULLET_WHITE_FILE = "bullet_white.png";
export const FACTORY_FILE = "factory.png";
export const MINE_FILE = "mine"; // animation name in json
export const PLANET_GREEN_FILE = "planet_green.png";
export const PLANET_PURPLE_FILE = "planet_purple.png";
export const PLANET_RED_FILE = "planet_red.png";
export const PLANET_ROCK_FILE = "planet_rock.png";
export const SHIELD_BLUE_FILE = "shield_blue.png";
export const SHIELD_GREEN_FILE = "shield_green.png";
export const SHIELD_WHITE_FILE = "shield_white.png";
export const SHIP_BALL_FILE = "ship_ball.png";
export const SHIP_CARGO_FILE = "ship_cargo.png";
export const SHIP_EXPLORER_FILE = "ship_explorer.png";
export const SHIP_FAST_FILE = "ship_fast.png";
export const SHIP_FIGHTER_FILE = "ship_fighter.png";
export const SHIP_HEAVY_FILE = "ship_heavy.png";
export const SHIP_MISSILE_FILE = "ship_missile.png";
export const SHIP_RED_WINGS_FILE = "ship_red_wings.png";
export const SHIP_SKELETON_FILE = "ship_skeleton.png";
export const STAR_BACKGROUND_FILE = "images/stars.png";
export const CRASH_JSON = "images/crash.json";
export const CRASH = "crash"; // animation name in json

export const UNIVERSE_RADIUS = 35000;
export const PLAYER = "player";
export const ALIEN = "alien";
export const PLAYER_STARTING_RESOURCES = {titanium: 30, gold: 20, uranium: 0};
export const GRAVITATIONAL_CONST = 2;
export const ALLOWED_OVERLAP = 2; // overlap for fudging collision detection
export const TAKEOFF_SPEED = 10; // in units of planet gravity
export const PLANET_RESOURCE_MAX = 99999999;
export const PLAYER_START_X = -(UNIVERSE_RADIUS + 1000); // left of the universe
export const PLAYER_START_Y = 0;
export const MIN_ALIEN_DIST_TO_PLANET = 50;
export const MIN_ALIEN_DIST_TO_ALIEN = 3;

// Buildings
export const BUILDING_PLACEMENT_ROTATION_INCREMENT = 0.05;
// Mine
export const BUILDING_TYPE_MINE = "mine";
export const MINE_SCALE = 1;
export const MINE_WIDTH = 52;
export const MINE_ANIMATION_SPEED = 0.5;
export const MINE_SPEED_TITANIUM = 0.0166; // 1 every sec
export const MINE_SPEED_GOLD = 0.0083;  // 1 every 2 sec
export const MINE_SPEED_URANIUM = 0.0033; // 1 every 5 sec
export const MINE_COST = {titanium: 20, gold: 10, uranium: 0};
// Factory
export const BUILDING_TYPE_FACTORY = "factory";
export const FACTORY_COST = {titanium: 50, gold: 20, uranium: 10};
export const FACTORY_WIDTH = 91;
export const FACTORY_SCALE = 0.8;

// Equipment
export const EQUIP_TYPE_BRAKE = "Brake";
export const EQUIP_TYPE_PRIMARY_WEAPON = "Primary Weapon";
export const EQUIP_TYPE_SECONDARY_WEAPON = "Secondary Weapon";
export const EQUIP_TYPE_THRUSTER = "Thruster";
export const EQUIP_TYPE_ARMOR = "Armor";
export const EQUIP_TYPE_REPAIR_DROID = "Repair Droid";
export const EQUIP_TYPE_GUNNERY_DROID = "Gunnery Droid";
export const EQUIP_TYPE_SPEED = "Speed";
export const EQUIP_TYPE_TURN = "Turn";
export const EQUIP_TYPE_STORAGE = "Storage";

export const THRUST_MOMENTUM = "Thrust Momentum";
export const THRUST_BLINK = "Thrust Blink";

export const OBJ_EQUIP = "Equip";
export const OBJ_SHIP = "Ship";

export const ALIEN_AI_TURRET = "ALIEN_AI_TURRET";
export const ALIEN_AI_CREEPER = "ALIEN_AI_CREEPER";
export const ALIEN_AI_MOTHERSHIP = "ALIEN_AI_MOTHERSHIP";
export const ALIEN_AI_KAMIKAZI = "ALIEN_AI_KAMIKAZI";
export const EQUIP_AI_MINE = "EQUIP_AI_MINE";
export const EQUIP_AI_TURRET = "EQUIP_AI_TURRET";
export const EQUIP_AI_MISSILE = "EQUIP_AI_MISSILE";

export const DIR_AHEAD_OF_SHIP = "ahead";
export const DIR_BEHIND_SHIP = "behind";

// Ship Upgrades
// brakeSpeedPct is best between 0.02 - 0.1 (higher is ok)
export const EQUIP_BRAKE = {
  name: "Brake", objType: OBJ_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0.04,
  cost: {titanium: 20, gold: 10, uranium: 0}
};
export const EQUIP_BLINK_BRAKE = {
  name: "Blink Brake", objType: OBJ_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0,
  cost: {titanium: 50, gold: 50, uranium: 30}
};
export const EQUIP_SPEED_BOOST = {
  name: "Speed Booster", objType: OBJ_EQUIP, type: EQUIP_TYPE_SPEED, boostSpeed: 0.05,
  cost: {titanium: 0, gold: 10, uranium: 20}
};
export const EQUIP_TURN_BOOST = {
  name: "Turn Booster", objType: OBJ_EQUIP, type: EQUIP_TYPE_TURN, boostSpeed: 0.05,
  cost: {titanium: 0, gold: 10, uranium: 20}
};
export const EQUIP_STORAGE = {
  name: "Storage", objType: OBJ_EQUIP, type: EQUIP_TYPE_STORAGE, storageAmount: 100,
  cost: {titanium: 50, gold: 0, uranium: 0}
};
export const EQUIP_ENHANCED_STORAGE = {
  name: "Enhanced Storage", objType: OBJ_EQUIP, type: EQUIP_TYPE_STORAGE, storageAmount: 300,
  cost: {titanium: 200, gold: 0, uranium: 0}
};
export const EQUIP_ARMOR = {
  name: "Armor Plate", objType: OBJ_EQUIP, type: EQUIP_TYPE_ARMOR, armorAmt: 100,
  cost: {titanium: 50, gold: 0, uranium: 0}
};
export const EQUIP_ENHANCED_ARMOR = {
  name: "Enhanced Armor", objType: OBJ_EQUIP, type: EQUIP_TYPE_ARMOR, armorAmt: 300,
  cost: {titanium: 300, gold: 0, uranium: 0}
};
export const EQUIP_THRUSTER = {
  name: "Thruster", objType: OBJ_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 0.08, thrustType: THRUST_MOMENTUM,
  cost: {titanium: 40, gold: 40, uranium: 10}
};
// blink thrustSpeed is good from 2 to 10
export const EQUIP_BLINK_THRUSTER = {
  name: "Blink Thruster", objType: OBJ_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 2.5, thrustType: THRUST_BLINK,
  cost: {titanium: 60, gold: 50, uranium: 10}
};

// Primary Weapons
// Dmg:40/c Range:250
export const EQUIP_BLASTER = {
  name: "Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 25,
  cool: 0,
  damage: 10,
  speed: 2.5,
  lifetime: 100,
  jitter: 0.05,
  bulletFile: BULLET_FILE,
  cost: {titanium: 10, gold: 0, uranium: 20}
};
// Dmg:100/c Range:320
export const EQUIP_FAST_BLASTER = {
  name: "Fast Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 10,
  speed: 4,
  lifetime: 80,
  jitter: 0.05,
  bulletFile: BULLET_FILE,
  cost: {titanium: 20, gold: 20, uranium: 40}
};
// Dmg:300/c (but cannot aim) Range:375
export const EQUIP_SPRINKLER_BLASTER = {
  name: "Sprinkler Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 2,
  cool: 2,
  damage: 6,
  speed: 2.5,
  lifetime: 150,
  jitter: 1,
  bulletFile: BULLET_FILE,
  cost: {titanium: 20, gold: 10, uranium: 80}
};
// Dmg 175/c Range:490
export const EQUIP_STREAM_BLASTER = {
  name: "Stream Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 4,
  cool: 0,
  damage: 7,
  speed: 7,
  lifetime: 70,
  jitter: 0.04,
  bulletFile: BULLET_FILE,
  cost: {titanium: 30, gold: 30, uranium: 60}
};
// Dmg: 250/c Range:120
export const EQUIP_MELEE_GUN = {
  name: "Melee Gun",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 10,
  speed: 4,
  lifetime: 30,
  jitter: 0.25,
  bulletFile: BULLET_FILE,
  cost: {titanium: 50, gold: 50, uranium: 50}
};
// Dmg: 66/c Range:720
export const EQUIP_SNIPER_RIFLE = {
  name: "Sniper Rifle",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 120,
  cool: 0,
  damage: 80,
  speed: 8,
  lifetime: 90,
  jitter: 0.0,
  bulletFile: BULLET_FILE,
  cost: {titanium: 50, gold: 50, uranium: 50}
};
// Dmg 25/c Range:240
export const EQUIP_ALIEN_BLASTER = {
  name: "Alien Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 20,
  cool: 0,
  damage: 5,
  speed: 2,
  lifetime: 120,
  jitter: 0.12,
  bulletFile: BULLET_BLUE_FILE,
  cost: {titanium: 10, gold: 30, uranium: 50}
};
// Dmg 120/c Range:480
export const EQUIP_ALIEN_BLASTER_FAST = {
  name: "Alien Fast Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 12,
  speed: 4,
  lifetime: 120,
  jitter: 0.1,
  bulletFile: BULLET_BLUE_FILE,
  cost: {titanium: 10, gold: 30, uranium: 50}
};
// Dmg 150/c Range:600
export const EQUIP_ALIEN_BLASTER_LIGHTNING = {
  name: "Alien Lighting Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 15,
  speed: 12,
  lifetime: 50,
  jitter: 0.08,
  bulletFile: BULLET_BLUE_FILE,
  cost: {titanium: 10, gold: 30, uranium: 50}
};
// Dmg 100/c Range:750
export const EQUIP_STAPLE_GUN = {
  name: "Staple Gun",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 3,
  speed: 3,
  lifetime: 250,
  jitter: 0.2,
  bulletFile: BULLET_WHITE_FILE,
  cost: {titanium: 10, gold: 30, uranium: 50}
};
// Dmg 183/c Range:900
export const EQUIP_STAPLE_GUN_HEAVY = {
  name: "Heavy Staple Gun",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 5.5,
  speed: 3,
  lifetime: 300,
  jitter: 0.15,
  bulletFile: BULLET_WHITE_FILE,
  cost: {titanium: 10, gold: 30, uranium: 50}
};

// Secondary (more at end of file after the ships)
export const EQUIP_SHIELD = {
  name: "Force Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 600,
  shield: {
    active: false,
    armor: 500,
    armorMax: 500,
    lifetime: 240,
    lifetimeMax: 240,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 0, uranium: 100}
};
export const EQUIP_SHIELD_LONG = {
  name: "Long Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1500,
  shield: {
    active: false,
    armor: 300,
    armorMax: 300,
    lifetime: 1000,
    lifetimeMax: 1000,
    spriteFile: SHIELD_WHITE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 0, uranium: 100}
};
export const EQUIP_SHIELD_STRONG = {
  name: "Strong Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 750,
  shield: {
    active: false,
    armor: 1500,
    armorMax: 1500,
    lifetime: 400,
    lifetimeMax: 400,
    spriteFile: SHIELD_GREEN_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 0, uranium: 100}
};
export const EQUIP_SHIELD_ULTRA = {
  name: "Ultra Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1500,
  shield: {
    active: false,
    armor: 1000,
    armorMax: 1000,
    lifetime: 750,
    lifetimeMax: 750,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 0, uranium: 100}
};

export const SHIP_RED_MISSILE = {
  name: "Alien Missile",
  objType: OBJ_SHIP,
  propulsion: 0.1, // best between 0.02 - 0.1
  turnSpeed: 0.3, // // best between 0.3 - 0.07
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 200,
  armor: 200,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.8,
  imageFile: ALIEN_SHIP_RED_SMALL_FILE,
  cost: {titanium: 5, gold: 5, uranium: 10},
  viewRange: SCREEN_WIDTH * 3,
  aiType: ALIEN_AI_KAMIKAZI,
};

export const EQUIP_ALIEN_MISSILE_LAUNCHER = {
  name: "Alien Missile Launcher", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 100,
  createShip: {type: SHIP_RED_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 50, gold: 50, uranium: 100}
};


// Droids
export const EQUIP_R2D2 = {
  name: "R2D2 Repair Droid", objType: OBJ_EQUIP, type: EQUIP_TYPE_REPAIR_DROID, repairSpeed: 0.03,
  cost: {titanium: 20, gold: 100, uranium: 50}
};
export const EQUIP_GUNNERY_DROID = {
  name: "Gunnery Droid", objType: OBJ_EQUIP, type: EQUIP_TYPE_GUNNERY_DROID,
  weapon: EQUIP_FAST_BLASTER, cost: {titanium: 100, gold: 200, uranium: 300}
};


// Ships
export const SHIP_EXPLORER = {
  name: "Explorer",
  objType: OBJ_SHIP,
  propulsion: 0.05, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 50,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 3,
  equip: [EQUIP_BRAKE, EQUIP_BLASTER],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.6,
  imageFile: SHIP_EXPLORER_FILE,
  cost: {titanium: 40, gold: 20, uranium: 10},
};

export const SHIP_CARGO = {
  name: "Cargo",
  objType: OBJ_SHIP,
  propulsion: 0.025, // best between 0.02 - 0.1
  turnSpeed: 0.02, // // best between 0.3 - 0.07
  resourcesMax: 750,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 2,
  equip: [EQUIP_BRAKE],
  armorMax: 20,
  armor: 20,
  crashSpeed: 1.2,
  crashAngle: 0.3,
  imageScale: 1,
  imageFile: SHIP_CARGO_FILE,
  cost: {titanium: 100, gold: 50, uranium: 50},
};

export const SHIP_FAST = {
  name: "Fast",
  objType: OBJ_SHIP,
  propulsion: 0.1, // best between 0.02 - 0.1
  turnSpeed: 0.07, // // best between 0.3 - 0.07
  resourcesMax: 40,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 5,
  equip: [EQUIP_BRAKE],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.6,
  imageFile: SHIP_FAST_FILE,
  cost: {titanium: 200, gold: 100, uranium: 50},
};

export const SHIP_SKELETON = {
  name: "Skeleton",
  objType: OBJ_SHIP,
  propulsion: 0.03, // best between 0.02 - 0.1
  turnSpeed: 0.03, // // best between 0.3 - 0.07
  resourcesMax: 30,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 7,
  equip: [],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.7,
  imageFile: SHIP_SKELETON_FILE,
  cost: {titanium: 200, gold: 200, uranium: 50},
};

export const SHIP_HEAVY = {
  name: "Heavy",
  objType: OBJ_SHIP,
  propulsion: 0.05, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 300,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 7,
  equip: [EQUIP_BRAKE],
  armorMax: 400,
  armor: 400,
  crashSpeed: 1.5,
  crashAngle: 0.4,
  imageScale: 0.5,
  imageFile: SHIP_HEAVY_FILE,
  cost: {titanium: 500, gold: 300, uranium: 250},
};

export const SHIP_FIGHTER = {
  name: "Fighter",
  objType: OBJ_SHIP,
  propulsion: 0.08, // best between 0.02 - 0.1
  turnSpeed: 0.07, // // best between 0.3 - 0.07
  resourcesMax: 200,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 8,
  equip: [EQUIP_BRAKE],
  armorMax: 300,
  armor: 300,
  crashSpeed: 1.5,
  crashAngle: 0.6,
  imageScale: 0.6,
  imageFile: SHIP_FIGHTER_FILE,
  cost: {titanium: 500, gold: 500, uranium: 500},
};

export const SHIP_ALIEN_TURRET = {
  name: "Alien Turret",
  objType: OBJ_SHIP,
  propulsion: 0.001, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 3,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.8,
  imageFile: ALIEN_SHIP_GREEN_SMALL_FILE,
  cost: {titanium: 50, gold: 50, uranium: 50},
  aiType: ALIEN_AI_TURRET,
};

export const SHIP_ALIEN = {
  name: "Alien Ship",
  objType: OBJ_SHIP,
  propulsion: 0.05, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 4,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.9,
  imageFile: ALIEN_SHIP_GREEN_FILE,
  cost: {titanium: 150, gold: 100, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
};

export const SHIP_ALIEN_LARGE = {
  name: "Alien Large",
  objType: OBJ_SHIP,
  propulsion: 0.03, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 7,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER_FAST],
  armorMax: 300,
  armor: 300,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageFile: ALIEN_SHIP_GREEN_LARGE_FILE,
  cost: {titanium: 150, gold: 100, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
};

export const SHIP_ALIEN_STAPLE_TURRET = {
  name: "Alien Staple Turret",
  objType: OBJ_SHIP,
  propulsion: 0.00,
  turnSpeed: 0.001,
  resourcesMax: 100,
  resources: {
     titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 3,
  equip: [EQUIP_BRAKE, EQUIP_STAPLE_GUN_HEAVY],
  armorMax: 200,
  armor: 200,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.3,
  imageFile: ALIEN_SHIP_BLUE_SMALL_FILE,
  cost: {titanium: 150, gold: 150, uranium: 200},
  aiType: ALIEN_AI_TURRET,
};

export const SHIP_ALIEN_FIRE = {
  name: "Alien Fire",
  objType: OBJ_SHIP,
  propulsion: 0.08, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 7,
  equip: [EQUIP_BRAKE, EQUIP_STAPLE_GUN, EQUIP_SHIELD_LONG],
  armorMax: 250,
  armor: 250,
  crashSpeed: 2,
  crashAngle: 0.4,
  imageScale: 1.5,
  imageFile: ALIEN_SHIP_FIRE_FILE,
  cost: {titanium: 250, gold: 200, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
};

export const SHIP_ALIEN_STEALTH = {
  name: "Alien Stealth",
  objType: OBJ_SHIP,
  propulsion: 0.04, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 100,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 6,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER_FAST],
  armorMax: 150,
  armor: 150,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.5,
  imageFile: ALIEN_SHIP_BLACK_FILE,
  cost: {titanium: 100, gold: 200, uranium: 150},
  aiType: ALIEN_AI_CREEPER,
};

export const SHIP_ALIEN_MOTHERSHIP = {
  name: "Alien Mothership",
  objType: OBJ_SHIP,
  propulsion: 0.00,
  turnSpeed: 0.001,
  resourcesMax: 10000,
  resources: {
    titanium: 1000,
    gold: 1000,
    uranium: 5000,
  },
  equipMax: 10,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_MISSILE_LAUNCHER, EQUIP_SHIELD_ULTRA, EQUIP_ALIEN_BLASTER_LIGHTNING],
  armorMax: 1000,
  armor: 1000,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.3,
  imageFile: ALIEN_SHIP_RED_LARGE_FILE,
  cost: {titanium: 1200, gold: 1000, uranium: 750},
  aiType: ALIEN_AI_MOTHERSHIP,
};

export const SHIP_DECOY = {
  name: "Decoy",
  objType: OBJ_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 300,
  armor: 300,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.55,
  imageFile: SHIP_EXPLORER_FILE,
  cost: {titanium: 5, gold: 0, uranium: 10},
  aiType: EQUIP_AI_MINE,
};

export const SHIP_TURRET = {
  name: "Turret",
  objType: OBJ_SHIP,
  propulsion: 0.0,
  turnSpeed: 0.0,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 1,
  equip: [EQUIP_FAST_BLASTER],
  armorMax: 200,
  armor: 200,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.6,
  imageFile: ALIEN_SHIP_BLUE_LARGE_FILE,
  cost: {titanium: 10, gold: 10, uranium: 20},
  aiType: EQUIP_AI_TURRET,
};

export const SHIP_MISSILE = {
  name: "Missile",
  objType: OBJ_SHIP,
  propulsion: 0.08, // best between 0.02 - 0.1
  turnSpeed: 0.25, // // best between 0.3 - 0.07
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 200,
  armor: 200,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageFile: SHIP_BALL_FILE,
  cost: {titanium: 0, gold: 0, uranium: 10},
  aiType: EQUIP_AI_MISSILE,
};

export const SHIP_FRIENDSHIP_MISSILE = {
  name: "Friendship Missile",
  objType: OBJ_SHIP,
  propulsion: 0.09, // best between 0.02 - 0.1
  turnSpeed: 0.25, // // best between 0.3 - 0.07
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 30,
  armor: 30,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.5,
  imageFile: ALIEN_SHIP_BLUE_FILE,
  cost: {titanium: 0, gold: 10, uranium: 0},
  aiType: EQUIP_AI_MISSILE,
};

export const ALL_SHIPS = [SHIP_EXPLORER, SHIP_CARGO, SHIP_FAST, SHIP_SKELETON, SHIP_HEAVY, SHIP_FIGHTER,
  SHIP_ALIEN, SHIP_ALIEN_TURRET, SHIP_ALIEN_LARGE, SHIP_ALIEN_STAPLE_TURRET, SHIP_ALIEN_FIRE, SHIP_ALIEN_STEALTH];

// This equipment needs to go after the ships (ugh)
export const EQUIP_DECOY_DEPLOYER = {
  name: "Decoy Deployer", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 25, cool: 0,
  createShip: {type: SHIP_DECOY, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 30, gold: 50, uranium: 100}
};
export const EQUIP_TURRET_DEPLOYER = {
  name: "Turret Deployer", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_TURRET, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 100, gold: 100, uranium: 200}
};
export const EQUIP_MISSILE_LAUNCHER = {
  name: "Missile Launcher", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 75, cool: 0,
  createShip: {type: SHIP_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 50, gold: 50, uranium: 150}
};
export const EQUIP_FRIENDSHIP_GUN = {
  name: "Friendship Gun", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_FRIENDSHIP_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 100, gold: 300, uranium: 100}
};


export const EQUIP_UPGRADES = [EQUIP_BRAKE, EQUIP_BLINK_BRAKE, EQUIP_THRUSTER, EQUIP_BLINK_THRUSTER, EQUIP_ARMOR, EQUIP_SPEED_BOOST, EQUIP_TURN_BOOST,
  EQUIP_STORAGE, EQUIP_ENHANCED_ARMOR, EQUIP_ENHANCED_STORAGE];
export const EQUIP_PRIMARY_WEAPONS = [EQUIP_BLASTER, EQUIP_FAST_BLASTER, EQUIP_STREAM_BLASTER, EQUIP_SPRINKLER_BLASTER, EQUIP_MELEE_GUN, EQUIP_SNIPER_RIFLE, EQUIP_ALIEN_BLASTER, EQUIP_STAPLE_GUN, EQUIP_STAPLE_GUN_HEAVY, EQUIP_ALIEN_BLASTER_FAST, EQUIP_ALIEN_BLASTER_LIGHTNING];
export const EQUIP_SECONDARY_WEAPONS = [EQUIP_DECOY_DEPLOYER, EQUIP_TURRET_DEPLOYER, EQUIP_MISSILE_LAUNCHER, EQUIP_SHIELD, EQUIP_SHIELD_LONG, EQUIP_SHIELD_STRONG, EQUIP_SHIELD_ULTRA];
export const EQUIP_DROIDS = [EQUIP_R2D2, EQUIP_GUNNERY_DROID];
export const ALL_EQUIP = [...EQUIP_UPGRADES, ...EQUIP_PRIMARY_WEAPONS, ...EQUIP_SECONDARY_WEAPONS, ...EQUIP_DROIDS];

export const XP_LEVELS = {
  // Mining resources
  [PLANET_ROCK_FILE]: [
    {xp: 1, obj: EQUIP_BLASTER},
    {xp: 10, obj: EQUIP_BRAKE},
    {xp: 50, obj: SHIP_EXPLORER},
    {xp: 100, obj: SHIP_CARGO},
    {xp: 200, obj: EQUIP_ARMOR},
    {xp: 1000, obj: EQUIP_SPEED_BOOST},
  ],
  [PLANET_RED_FILE]: [
    {xp: 10, obj: EQUIP_STORAGE},
    {xp: 50, obj: EQUIP_BLINK_BRAKE},
    {xp: 100, obj: EQUIP_THRUSTER},
    {xp: 500, obj: SHIP_FAST},
    {xp: 1000, obj: EQUIP_BLINK_THRUSTER},
  ],
  [PLANET_GREEN_FILE]: [
    {xp: 10, obj: SHIP_SKELETON},
    {xp: 50, obj: EQUIP_R2D2},
    {xp: 500, obj1: SHIP_HEAVY},
  ],
  [PLANET_PURPLE_FILE]: [
    {xp: 10, obj: EQUIP_TURN_BOOST},
    {xp: 300, obj: EQUIP_SHIELD_STRONG},
    {xp: 750, obj: EQUIP_GUNNERY_DROID},
    {xp: 1000, obj: SHIP_FIGHTER}
  ],
  // Killing aliens
  [SHIP_ALIEN_TURRET.name]: [
    {xp: 1, obj: EQUIP_FAST_BLASTER},
    {xp: 5, obj: EQUIP_ALIEN_BLASTER},
    {xp: 10, obj: EQUIP_ALIEN_BLASTER_FAST},
  ],
  [SHIP_ALIEN.name]: [
    {xp: 1, obj: EQUIP_SHIELD},
    {xp: 5, obj: EQUIP_DECOY_DEPLOYER},
    {xp: 10, obj: EQUIP_SHIELD_LONG},
    {xp: 20, obj: SHIP_ALIEN},
  ],
  [SHIP_ALIEN_LARGE.name]: [
    {xp: 1, obj: EQUIP_STREAM_BLASTER},
    {xp: 5, obj: EQUIP_TURRET_DEPLOYER},
    {xp: 10, obj: EQUIP_SNIPER_RIFLE},
    {xp: 20, obj: SHIP_ALIEN_LARGE},
  ],
  [SHIP_ALIEN_STEALTH.name]: [
    {xp: 1, obj: EQUIP_MISSILE_LAUNCHER},
    {xp: 4, obj: EQUIP_SPRINKLER_BLASTER},
    {xp: 7, obj: EQUIP_MELEE_GUN},
  ],
  [SHIP_ALIEN_STAPLE_TURRET.name]: [
    {xp: 1, obj: EQUIP_STAPLE_GUN},
    {xp: 4, obj: EQUIP_FRIENDSHIP_GUN},
    {xp: 7, obj: EQUIP_ENHANCED_STORAGE},
  ],
  [SHIP_ALIEN_FIRE.name]: [
    {xp: 1, obj: EQUIP_STAPLE_GUN_HEAVY},
    {xp: 4, obj: EQUIP_ENHANCED_ARMOR},
    {xp: 7, obj: EQUIP_SHIELD_ULTRA},
    {xp: 15, obj: SHIP_ALIEN_FIRE},
  ],
  [SHIP_ALIEN_MOTHERSHIP.name]: [
    {xp: 1, obj: EQUIP_ALIEN_BLASTER_LIGHTNING},
  ]
}

export const PLANET_DENSITY = new Map();
PLANET_DENSITY.set(PLANET_GREEN_FILE, 0.01)
PLANET_DENSITY.set(PLANET_PURPLE_FILE, 0.015)
PLANET_DENSITY.set(PLANET_RED_FILE, 0.019)
PLANET_DENSITY.set(PLANET_ROCK_FILE, 0.025)

// Universe Rings
export const UNIVERSE_RINGS = [
  {
    planetCount: 1,
    minDist: 1, maxDist: 2,
    minDistToOtherPlanet: 10,
    minPlanetRadius: 1500, maxPlanetRadius: 1501,
    planetFiles: [PLANET_PURPLE_FILE],
    aliens: [{count: 0, file: null}],
  },
  {
    planetCount: 0,
    minDist: 1700, maxDist: 2500,
    minDistToOtherPlanet: 10,
    minPlanetRadius: 10, maxPlanetRadius: 10,
    planetFiles: [],
    aliens: [
      {count: 50, file: SHIP_ALIEN_STEALTH},
      {count: 50, file: SHIP_ALIEN_FIRE},
      {count: 30, file: SHIP_ALIEN_STAPLE_TURRET},
    ],
  },
  {
    planetCount: 200,
    minDist: 2500, maxDist: 10000,
    minDistToOtherPlanet: 150,
    minPlanetRadius: 280, maxPlanetRadius: 500,
    planetFiles: [PLANET_RED_FILE, PLANET_PURPLE_FILE, PLANET_GREEN_FILE],
    aliens: [
      {count: 100, file: SHIP_ALIEN_STAPLE_TURRET},
      {count: 200, file: SHIP_ALIEN},
      {count: 750, file: SHIP_ALIEN_LARGE},
      {count: 400, file: SHIP_ALIEN_STEALTH},
    ],
  },
  {
    planetCount: 520,
    minDist: 10000, maxDist: 15000,
    minDistToOtherPlanet: 150,
    minPlanetRadius: 180, maxPlanetRadius: 300,
    planetFiles: [PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_GREEN_FILE],
    aliens: [
      {count: 1000, file: SHIP_ALIEN_TURRET},
      {count: 500, file: SHIP_ALIEN},
      {count: 200, file: SHIP_ALIEN_LARGE},
    ],
  },
  {
    planetCount: 2000,
    minDist: 15000, maxDist: 25000,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 150, maxPlanetRadius: 200,
    planetFiles: [PLANET_ROCK_FILE, PLANET_RED_FILE],
    aliens: [
      {count: 1000, file: SHIP_ALIEN_TURRET},
      {count: 150, file: SHIP_ALIEN}
    ],
  },
  {
    planetCount: 1000,
    minDist: 25000, maxDist: 30000,
    minDistToOtherPlanet: 300,
    minPlanetRadius: 150, maxPlanetRadius: 180,
    planetFiles: [PLANET_ROCK_FILE],
    aliens: [{count: 500, file: SHIP_ALIEN_TURRET}],
  },
  {
    planetCount: 800,
    minDist: 30000, maxDist: UNIVERSE_RADIUS,
    minDistToOtherPlanet: 500,
    minPlanetRadius: 80, maxPlanetRadius: 150,
    planetFiles: [PLANET_ROCK_FILE],
    aliens: [],
  },
];

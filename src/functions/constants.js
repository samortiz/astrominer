// Main Version
export const APP_VERSION = "0.4a";
// Colors
export const BLACK = 0X000000;
export const YELLOW = 0xFFCC55;
export const BLUE = 0x00AAFF;
export const WHITE = 0xFFFFFF;
export const DARKER_GREY = 0x202020;
export const DARK_GREY = 0x303030;
export const LIGHT_GREY = 0x909090;
export const GREY = 0x808080;
export const RED = 0x500000;
export const GREEN = 0x005000;
export const PURPLE = 0x500050;

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
export const WORMHOLE_SPRITE = "wormhole_sprite" // Flag value to do wormhole sprite handling
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
export const SMOKE_JSON = "images/smoke.json"
export const SMOKE = "smoke";

// Misc
export const UNIVERSE_RADIUS = 40000;
export const OUTER_RING_MIN = 50000; // This is where we dump extra planets and aliens that won't fit into the universe
export const OUTER_RING_MAX = 70000;
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

// MiniMap colors
export const MINIMAP_BORDER_COLOR = LIGHT_GREY;
export const MINIMAP_BACKGROUND_COLOR = DARK_GREY;
export const MINIMAP_BUILDING_COLOR = BLUE;
export const MINIMAP_SHIP_COLOR = WHITE;
export const MINIMAP_SELECTED_PLANET_COLOR = YELLOW;
export const PLANET_COLORS = {
  [PLANET_ROCK_FILE]: GREY,
  [PLANET_RED_FILE]: RED,
  [PLANET_GREEN_FILE]: GREEN,
  [PLANET_PURPLE_FILE]: PURPLE,
  [WORMHOLE_SPRITE]: DARKER_GREY,
};

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
export const SALVAGE_RATE = 0.5; // amount returned when salvaging equipment or ships
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
export const EQUIP_TYPE_SHIELD_DROID = "Shield Droid";
export const EQUIP_TYPE_SPEED = "Speed";
export const EQUIP_TYPE_TURN = "Turn";
export const EQUIP_TYPE_STORAGE = "Storage";
export const EQUIP_TYPE_AUTOLANDER = "Autolander";
export const EQUIP_TYPE_GRAVITY_SHIELD = "GravityShield";

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
export const EQUIP_AI_RESOURCE_DROID = "EQUIP_AI_RESOURCE_DROID";

export const DIR_AHEAD_OF_SHIP = "ahead";
export const DIR_BEHIND_SHIP = "behind";

// Ship Upgrades
// brakeSpeedPct is best between 0.02 - 0.1 (higher is ok)
export const EQUIP_BRAKE = {
  name: "Brake", objType: OBJ_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0.04,
  cost: {titanium: 20, gold: 10, uranium: 0},
  description: "Slows your ship down.",
};
export const EQUIP_BLINK_BRAKE = {
  name: "Blink Brake", objType: OBJ_EQUIP, type: EQUIP_TYPE_BRAKE, brakeSpeedPct: 0,
  cost: {titanium: 50, gold: 50, uranium: 30},
  description: "Stops your ship immediately.",
};
export const EQUIP_SPEED_BOOST = {
  name: "Speed Booster", objType: OBJ_EQUIP, type: EQUIP_TYPE_SPEED, boostSpeed: 0.05,
  cost: {titanium: 0, gold: 20, uranium: 10},
  description: "Increase the ship's acceleration. Helps slow ships take off of large planets.",
};
export const EQUIP_TURN_BOOST = {
  name: "Turn Booster", objType: OBJ_EQUIP, type: EQUIP_TYPE_TURN, boostSpeed: 0.04,
  cost: {titanium: 0, gold: 10, uranium: 20},
  description: "Increase turning speed.",
};
export const EQUIP_STORAGE = {
  name: "Storage", objType: OBJ_EQUIP, type: EQUIP_TYPE_STORAGE, storageAmount: 100,
  cost: {titanium: 30, gold: 0, uranium: 0},
  description: "100 more resource storage.",
};
export const EQUIP_ENHANCED_STORAGE = {
  name: "Enhanced Storage", objType: OBJ_EQUIP, type: EQUIP_TYPE_STORAGE, storageAmount: 300,
  cost: {titanium: 200, gold: 0, uranium: 0},
  description: "300 more resources.",
};
export const EQUIP_ARMOR = {
  name: "Armor Plate", objType: OBJ_EQUIP, type: EQUIP_TYPE_ARMOR, armorAmt: 100,
  cost: {titanium: 50, gold: 0, uranium: 0},
  description: "Increase armor by 100.",
};
export const EQUIP_ENHANCED_ARMOR = {
  name: "Enhanced Armor", objType: OBJ_EQUIP, type: EQUIP_TYPE_ARMOR, armorAmt: 300,
  cost: {titanium: 300, gold: 0, uranium: 0},
  description: "Increase armor by 300.",
};
export const EQUIP_THRUSTER = {
  name: "Thruster", objType: OBJ_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 0.08, thrustType: THRUST_MOMENTUM,
  cost: {titanium: 40, gold: 40, uranium: 10},
  description: "Enable lateral movement. Use 'q' and 'e' keys.",
};
// blink thrustSpeed is good from 2 to 10
export const EQUIP_BLINK_THRUSTER = {
  name: "Blink Thruster", objType: OBJ_EQUIP, type: EQUIP_TYPE_THRUSTER, thrustSpeed: 2.5, thrustType: THRUST_BLINK,
  cost: {titanium: 60, gold: 50, uranium: 10},
  description: "Lateral movement without momentum. Use 'q' and 'e' keys.",
};
export const EQUIP_AUTOLANDER = {
  name: "Auto Lander", objType: OBJ_EQUIP, type: EQUIP_TYPE_AUTOLANDER,
  cost: {titanium: 60, gold: 50, uranium: 10},
  description: "Never crash into a planet again!",
};
export const EQUIP_GRAVITY_SHIELD = {
  name: "Gravity Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_GRAVITY_SHIELD,
  cost: {titanium: 100, gold: 200, uranium: 150},
  description: "Be free from the effect of gravity.",
};

// Primary Weapons
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
  cost: {titanium: 0, gold: 0, uranium: 10}
};
export const EQUIP_FAST_BLASTER = {
  name: "Fast Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 7.5,
  speed: 4,
  lifetime: 75,
  jitter: 0.05,
  bulletFile: BULLET_FILE,
  cost: {titanium: 20, gold: 20, uranium: 40}
};
export const EQUIP_SPRINKLER_BLASTER = {
  name: "Sprinkler Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 2,
  cool: 0,
  damage: 8,
  speed: 2.5,
  lifetime: 150,
  jitter: 1,
  bulletFile: BULLET_FILE,
  cost: {titanium: 10, gold: 10, uranium: 80}
};
export const EQUIP_STREAM_BLASTER = {
  name: "Stream Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 4,
  cool: 0,
  damage: 8,
  speed: 7,
  lifetime: 70,
  jitter: 0.04,
  bulletFile: BULLET_FILE,
  cost: {titanium: 0, gold: 50, uranium: 150}
};
export const EQUIP_MELEE_GUN = {
  name: "Melee Gun",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 12,
  speed: 3,
  lifetime: 40,
  jitter: 0.25,
  bulletFile: BULLET_FILE,
  cost: {titanium: 0, gold: 150, uranium: 200}
};
export const EQUIP_SNIPER_RIFLE = {
  name: "Sniper Rifle",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 100,
  cool: 0,
  damage: 160,
  speed: 9,
  lifetime: 90,
  jitter: 0.0,
  bulletFile: BULLET_FILE,
  cost: {titanium: 0, gold: 200, uranium: 300}
};
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
  cost: {titanium: 0, gold: 0, uranium: 5}
};
export const EQUIP_ALIEN_BLASTER_FAST = {
  name: "Alien Fast Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 12,
  speed: 5,
  lifetime: 110,
  jitter: 0.1,
  bulletFile: BULLET_BLUE_FILE,
  cost: {titanium: 0, gold: 50, uranium: 80}
};
export const EQUIP_ALIEN_BLASTER_LIGHTNING = {
  name: "Alien Lighting Blaster",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 10,
  cool: 0,
  damage: 25,
  speed: 12,
  lifetime: 50,
  jitter: 0.08,
  bulletFile: BULLET_BLUE_FILE,
  cost: {titanium: 0, gold: 300, uranium: 500}
};
export const EQUIP_STAPLE_GUN = {
  name: "Staple Gun",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 5,
  speed: 3,
  lifetime: 250,
  jitter: 0.2,
  bulletFile: BULLET_WHITE_FILE,
  cost: {titanium: 0, gold: 50, uranium: 200}
};
export const EQUIP_STAPLE_GUN_HEAVY = {
  name: "Heavy Staple Gun",
  objType: OBJ_EQUIP,
  type: EQUIP_TYPE_PRIMARY_WEAPON,
  coolTime: 3,
  cool: 0,
  damage: 6,
  speed: 3,
  lifetime: 250,
  jitter: 0.15,
  bulletFile: BULLET_WHITE_FILE,
  cost: {titanium: 0, gold: 250, uranium: 400}
};

// Secondary (more at end of file after the ships)
export const EQUIP_SHIELD = {
  name: "Force Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 600,
  shield: {
    active: false,
    armor: 500,
    armorMax: 500,
    lifetime: 300,
    lifetimeMax: 300,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 100, uranium: 10}
};
export const EQUIP_SHIELD_LONG = {
  name: "Long Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1200,
  shield: {
    active: false,
    armor: 500,
    armorMax: 500,
    lifetime: 1100,
    lifetimeMax: 1100,
    spriteFile: SHIELD_WHITE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 200, uranium: 10}
};
export const EQUIP_SHIELD_STRONG = {
  name: "Strong Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1000,
  shield: {
    active: false,
    armor: 1500,
    armorMax: 1500,
    lifetime: 400,
    lifetimeMax: 400,
    spriteFile: SHIELD_GREEN_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 200, uranium: 10}
};
export const EQUIP_SHIELD_ULTRA = {
  name: "Ultra Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 1000,
  shield: {
    active: false,
    armor: 1200,
    armorMax: 1200,
    lifetime: 800,
    lifetimeMax: 800,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 300, uranium: 100}
};
export const EQUIP_SHIELD_BLINK = {
  name: "Blink Shield", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, cool: 0, coolTime: 600,
  shield: {
    active: false,
    armor: 900,
    armorMax: 900,
    lifetime: 500,
    lifetimeMax: 500,
    spriteFile: SHIELD_BLUE_FILE,
    radius: 0
  },
  cost: {titanium: 0, gold: 500, uranium: 100}
};

export const SHIP_RED_MISSILE = {
  name: "Alien Missile",
  objType: OBJ_SHIP,
  propulsion: 0.08,
  turnSpeed: 0.3,
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
  cost: {titanium: 150, gold: 150, uranium: 200},
  description: "Fires red alien missiles that persistently follow enemies.",
};

// Droids
export const EQUIP_R2D2 = {
  name: "R2D2 Repair Droid", objType: OBJ_EQUIP, type: EQUIP_TYPE_REPAIR_DROID, repairSpeed: 0.2,
  cost: {titanium: 50, gold: 300, uranium: 100},
  description: "Repairs your ship while you are flying."
};
export const EQUIP_GUNNERY_DROID = {
  name: "Gunnery Droid", objType: OBJ_EQUIP, type: EQUIP_TYPE_GUNNERY_DROID,
  weapon: EQUIP_FAST_BLASTER, cost: {titanium: 100, gold: 400, uranium: 200},
  description: "Fires a fast blaster at the nearest enemy.",
};
export const EQUIP_LIGHTING_DROID = {
  name: "Lightning Droid", objType: OBJ_EQUIP, type: EQUIP_TYPE_GUNNERY_DROID,
  weapon: EQUIP_ALIEN_BLASTER_LIGHTNING, cost: {titanium: 100, gold: 500, uranium: 300},
  description: "Fires a lightning blaster at the nearest enemy.",
};
export const EQUIP_SHIELD_DROID = {
  name: "Shield Droid", objType: OBJ_EQUIP, type: EQUIP_TYPE_SHIELD_DROID,
  cost: {titanium: 50, gold: 600, uranium: 50},
  description: "Deploys your shields automatically when bullets are flying.",
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
  equipMax: 4,
  equip: [EQUIP_BRAKE, EQUIP_BLASTER],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.6,
  imageFile: SHIP_EXPLORER_FILE,
  cost: {titanium: 40, gold: 20, uranium: 10},
  description: "A basic ship with good handling and 4 slots.",
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
  equipMax: 3,
  equip: [EQUIP_BRAKE],
  armorMax: 20,
  armor: 20,
  crashSpeed: 1.2,
  crashAngle: 0.3,
  imageScale: 1,
  imageFile: SHIP_CARGO_FILE,
  cost: {titanium: 100, gold: 50, uranium: 50},
  description: "A large, slow ship that can carry 750 resources, but only has 3 slots.",
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
  description: "A fast ship with good handling and 5 slots.",
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
  equipMax: 8,
  equip: [],
  armorMax: 50,
  armor: 50,
  crashSpeed: 2,
  crashAngle: 0.5,
  imageScale: 0.7,
  imageFile: SHIP_SKELETON_FILE,
  cost: {titanium: 200, gold: 200, uranium: 50},
  description: "A framework with 8 slots that makes it flexible.",
};

export const SHIP_HEAVY = {
  name: "Heavy",
  objType: OBJ_SHIP,
  propulsion: 0.055, // best between 0.02 - 0.1
  turnSpeed: 0.05, // // best between 0.3 - 0.07
  resourcesMax: 300,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 8,
  equip: [EQUIP_BRAKE],
  armorMax: 500,
  armor: 500,
  crashSpeed: 1.5,
  crashAngle: 0.4,
  imageScale: 0.5,
  imageFile: SHIP_HEAVY_FILE,
  cost: {titanium: 500, gold: 400, uranium: 300},
  description: "A large ship with 500 armor, 300 resources and 8 slots.",
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
  equipMax: 10,
  equip: [EQUIP_BRAKE],
  armorMax: 300,
  armor: 300,
  crashSpeed: 1.5,
  crashAngle: 0.6,
  imageScale: 0.6,
  imageFile: SHIP_FIGHTER_FILE,
  cost: {titanium: 500, gold: 500, uranium: 500},
  description: "A fast, ship with 300 armor, 200 resources and 10 slots.",
};

export const SHIP_WING = {
  name: "Wing Ship",
  objType: OBJ_SHIP,
  propulsion: 0.075, // best between 0.02 - 0.1
  turnSpeed: 0.06, // // best between 0.3 - 0.07
  resourcesMax: 300,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 12,
  equip: [EQUIP_BLINK_BRAKE],
  armorMax: 500,
  armor: 500,
  crashSpeed: 3,
  crashAngle: 0.5,
  imageScale: 0.7,
  imageFile: SHIP_RED_WINGS_FILE,
  cost: {titanium: 1000, gold: 1000, uranium: 1000},
  description: "A large ship with good handling 500 armor, 300 resources and 12 slots.",
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
  description: "A basic turret with an alien blaster",
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
  equipMax: 5,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER],
  armorMax: 100,
  armor: 100,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.9,
  imageFile: ALIEN_SHIP_GREEN_FILE,
  cost: {titanium: 150, gold: 100, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
  description: "The basic alien scout ship.",
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
  equipMax: 8,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_BLASTER_FAST],
  armorMax: 300,
  armor: 300,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageFile: ALIEN_SHIP_GREEN_LARGE_FILE,
  cost: {titanium: 150, gold: 100, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
  description: "A large heavily armored alien.",
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
  armorMax: 230,
  armor: 230,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1.3,
  imageFile: ALIEN_SHIP_BLUE_SMALL_FILE,
  cost: {titanium: 150, gold: 150, uranium: 200},
  aiType: ALIEN_AI_TURRET,
  description: "A hard-to-hit turret with a heavy staple gun.",
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
  equipMax: 8,
  equip: [EQUIP_BRAKE, EQUIP_STAPLE_GUN_HEAVY, EQUIP_SHIELD_LONG],
  armorMax: 450,
  armor: 450,
  crashSpeed: 2,
  crashAngle: 0.4,
  imageScale: 1.5,
  imageFile: ALIEN_SHIP_FIRE_FILE,
  cost: {titanium: 250, gold: 200, uranium: 80},
  aiType: ALIEN_AI_CREEPER,
  description: "A tough alien ship with a shield and heavy staple gun.",
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
  description: "An alien with a cloak making it hard to see.",
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
    uranium: 2000,
  },
  equipMax: 10,
  equip: [EQUIP_BRAKE, EQUIP_ALIEN_MISSILE_LAUNCHER, EQUIP_SHIELD_ULTRA, EQUIP_ALIEN_BLASTER_LIGHTNING],
  armorMax: 1000,
  armor: 1000,
  crashSpeed: 3,
  crashAngle: 10,
  imageScale: 1.3,
  imageFile: ALIEN_SHIP_RED_LARGE_FILE,
  cost: {titanium: 1200, gold: 1000, uranium: 750},
  aiType: ALIEN_AI_MOTHERSHIP,
  description: "A large heavily armored ship with smart missiles.",
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
  armorMax: 350,
  armor: 350,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.55,
  imageFile: SHIP_EXPLORER_FILE,
  cost: {titanium:10, gold: 0, uranium: 0},
  aiType: EQUIP_AI_MINE,
  description: "An empty shell of a ship.",
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
  armorMax: 350,
  armor: 350,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.6,
  imageFile: ALIEN_SHIP_BLUE_LARGE_FILE,
  cost: {titanium: 5, gold: 10, uranium: 5},
  aiType: EQUIP_AI_TURRET,
  description: "A turret with a fast blaster.",
};

export const SHIP_STREAM_TURRET = {
  name: "Stream Turret",
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
  equip: [EQUIP_STREAM_BLASTER],
  armorMax: 250,
  armor: 250,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.4,
  imageFile: ALIEN_SHIP_BLUE_LARGE_FILE,
  cost: {titanium: 10, gold: 30, uranium: 20},
  aiType: EQUIP_AI_TURRET,
  description: "A turret with a stream blaster",
};

export const SHIP_MISSILE = {
  name: "Missile",
  objType: OBJ_SHIP,
  propulsion: 0.08,
  turnSpeed: 0.25,
  resourcesMax: 0,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 220,
  armor: 220,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageFile: SHIP_BALL_FILE,
  cost: {titanium: 0, gold: 15, uranium: 15},
  aiType: EQUIP_AI_MISSILE,
  description: "An enemy seeking missile.",
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
  armorMax: 40,
  armor: 40,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 0.5,
  imageFile: ALIEN_SHIP_BLUE_FILE,
  cost: {titanium: 0, gold: 5, uranium: 5},
  aiType: EQUIP_AI_MISSILE,
  description: "A missile that turns enemies into friends.",
};

export const SHIP_RESOURCE_DROID = {
  name: "Resource Droid",
  objType: OBJ_SHIP,
  propulsion: 0.1,
  turnSpeed: 0.1,
  resourcesMax: 50,
  resources: {
    titanium: 0,
    gold: 0,
    uranium: 0,
  },
  equipMax: 0,
  equip: [],
  armorMax: 10,
  armor: 10,
  crashSpeed: 2,
  crashAngle: 10,
  imageScale: 1,
  imageFile: SHIP_MISSILE_FILE,
  cost: {titanium: 30, gold: 20, uranium: 0},
  aiType: EQUIP_AI_RESOURCE_DROID,
  autonomousShip: true, // Used to launch the ship
  description: "Self-piloting ship that brings resources to this planet.",
};

export const ALL_ALIENS = [SHIP_ALIEN_TURRET, SHIP_ALIEN, SHIP_ALIEN_LARGE, SHIP_ALIEN_STEALTH,  SHIP_ALIEN_STAPLE_TURRET, SHIP_ALIEN_FIRE, SHIP_ALIEN_MOTHERSHIP];
export const ALL_SHIPS = [SHIP_EXPLORER, SHIP_CARGO, SHIP_FAST, SHIP_RESOURCE_DROID, SHIP_SKELETON, SHIP_HEAVY, SHIP_FIGHTER, SHIP_WING, ...ALL_ALIENS];

// This equipment needs to go after the ships (ugh)
export const EQUIP_DECOY_DEPLOYER = {
  name: "Decoy Deployer", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 25, cool: 0,
  createShip: {type: SHIP_DECOY, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 0, gold: 50, uranium: 100},
  description: "Drops a fake ship."
};
export const EQUIP_TURRET_DEPLOYER = {
  name: "Turret Deployer", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_TURRET, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 0, gold: 200, uranium: 100},
  description: "Drops a turret with a fast blaster.",
};
export const EQUIP_STREAM_TURRET_DEPLOYER = {
  name: "Stream Turret Deployer", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_STREAM_TURRET, dir: DIR_BEHIND_SHIP},
  cost: {titanium: 100, gold: 400, uranium: 400},
  description: "Drops a turret with a stream blaster.",
};

export const EQUIP_MISSILE_LAUNCHER = {
  name: "Missile Launcher", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 50, gold: 250, uranium: 300},
  description: "Fires enemy-seeking missiles.",
};
export const EQUIP_FRIENDSHIP_GUN = {
  name: "Friendship Gun", objType: OBJ_EQUIP, type: EQUIP_TYPE_SECONDARY_WEAPON, coolTime: 100, cool: 0,
  createShip: {type: SHIP_FRIENDSHIP_MISSILE, dir: DIR_AHEAD_OF_SHIP},
  cost: {titanium: 100, gold: 300, uranium: 100},
  description: "Fires a missile that turns your enemies into allies.",
};


export const EQUIP_UPGRADES = [EQUIP_BRAKE, EQUIP_BLINK_BRAKE, EQUIP_THRUSTER, EQUIP_BLINK_THRUSTER, EQUIP_ARMOR, EQUIP_SPEED_BOOST, EQUIP_TURN_BOOST,
  EQUIP_STORAGE, EQUIP_ENHANCED_ARMOR, EQUIP_ENHANCED_STORAGE, EQUIP_AUTOLANDER, EQUIP_GRAVITY_SHIELD];
export const EQUIP_PRIMARY_WEAPONS = [EQUIP_BLASTER, EQUIP_FAST_BLASTER, EQUIP_STREAM_BLASTER, EQUIP_SPRINKLER_BLASTER, EQUIP_MELEE_GUN, EQUIP_SNIPER_RIFLE, EQUIP_ALIEN_BLASTER, EQUIP_STAPLE_GUN, EQUIP_STAPLE_GUN_HEAVY, EQUIP_ALIEN_BLASTER_FAST, EQUIP_ALIEN_BLASTER_LIGHTNING];
export const EQUIP_SECONDARY_WEAPONS = [EQUIP_DECOY_DEPLOYER, EQUIP_TURRET_DEPLOYER, EQUIP_STREAM_TURRET_DEPLOYER, EQUIP_MISSILE_LAUNCHER, EQUIP_ALIEN_MISSILE_LAUNCHER, EQUIP_FRIENDSHIP_GUN, EQUIP_SHIELD, EQUIP_SHIELD_LONG, EQUIP_SHIELD_STRONG, EQUIP_SHIELD_ULTRA, EQUIP_SHIELD_BLINK];
export const EQUIP_DROIDS = [EQUIP_R2D2, EQUIP_GUNNERY_DROID, EQUIP_LIGHTING_DROID, EQUIP_SHIELD_DROID];
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
    {xp: 1000, obj: EQUIP_AUTOLANDER},
    {xp: 2000, obj: EQUIP_TURN_BOOST},
  ],
  [PLANET_GREEN_FILE]: [
    {xp: 10, obj: SHIP_SKELETON},
    {xp: 50, obj: EQUIP_R2D2},
    {xp: 500, obj: SHIP_HEAVY},
    {xp: 1000, obj: EQUIP_BLINK_THRUSTER},
  ],
  [PLANET_PURPLE_FILE]: [
    {xp: 300, obj: EQUIP_SHIELD_STRONG},
    {xp: 750, obj: EQUIP_GUNNERY_DROID},
    {xp: 1000, obj: SHIP_FIGHTER},
    {xp: 2000, obj: EQUIP_SHIELD_ULTRA},
  ],
  // Killing aliens
  [SHIP_ALIEN_TURRET.name]: [
    {xp: 1, obj: EQUIP_FAST_BLASTER},
    {xp: 5, obj: EQUIP_ALIEN_BLASTER},
    {xp: 10, obj: EQUIP_DECOY_DEPLOYER},
  ],
  [SHIP_ALIEN.name]: [
    {xp: 1, obj: EQUIP_SHIELD},
    {xp: 5, obj: SHIP_RESOURCE_DROID},
    {xp: 10, obj: EQUIP_ALIEN_BLASTER_FAST},
    {xp: 20, obj: EQUIP_SHIELD_LONG},
    {xp: 30, obj: SHIP_ALIEN},
  ],
  [SHIP_ALIEN_LARGE.name]: [
    {xp: 1, obj: EQUIP_TURRET_DEPLOYER},
    {xp: 5, obj: EQUIP_STREAM_BLASTER},
    {xp: 10, obj: EQUIP_ENHANCED_STORAGE},
    {xp: 15, obj: EQUIP_SNIPER_RIFLE},
    {xp: 25, obj: SHIP_ALIEN_LARGE},
  ],
  [SHIP_ALIEN_STEALTH.name]: [
    {xp: 1, obj: EQUIP_SPRINKLER_BLASTER},
    {xp: 7, obj: EQUIP_MISSILE_LAUNCHER},
    {xp: 15, obj: EQUIP_FRIENDSHIP_GUN},
  ],
  [SHIP_ALIEN_STAPLE_TURRET.name]: [
    {xp: 1, obj: EQUIP_STAPLE_GUN},
    {xp: 5, obj: EQUIP_MELEE_GUN},
    {xp: 10, obj: EQUIP_ENHANCED_ARMOR},
    {xp: 20, obj: EQUIP_SHIELD_DROID},
  ],
  [SHIP_ALIEN_FIRE.name]: [
    {xp: 1, obj: EQUIP_STAPLE_GUN_HEAVY},
    {xp: 5, obj: EQUIP_SHIELD_BLINK},
    {xp: 10, obj: EQUIP_STREAM_TURRET_DEPLOYER},
    {xp: 20, obj: EQUIP_GRAVITY_SHIELD},
    {xp: 30, obj: SHIP_ALIEN_FIRE},
  ],
  [SHIP_ALIEN_MOTHERSHIP.name]: [
    {xp: 1, obj: EQUIP_ALIEN_BLASTER_LIGHTNING},
    {xp: 2, obj: EQUIP_ALIEN_MISSILE_LAUNCHER},
    {xp: 3, obj: EQUIP_LIGHTING_DROID},
    {xp: 4, obj: SHIP_WING},
  ]
}

export const PLANET_DENSITY = new Map();
PLANET_DENSITY.set(PLANET_ROCK_FILE, 0.026);
PLANET_DENSITY.set(PLANET_RED_FILE, 0.021);
PLANET_DENSITY.set(PLANET_GREEN_FILE, 0.014);
PLANET_DENSITY.set(PLANET_PURPLE_FILE, 0.011);
PLANET_DENSITY.set(WORMHOLE_SPRITE, 15);

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
      {count: 75, file: SHIP_ALIEN_FIRE},
      {count: 30, file: SHIP_ALIEN_STAPLE_TURRET},
    ],
  },
  {
    planetCount: 180,
    minDist: 2500, maxDist: 10000,
    minDistToOtherPlanet: 150,
    minPlanetRadius: 300, maxPlanetRadius: 600,
    planetFiles: [PLANET_RED_FILE, PLANET_PURPLE_FILE, PLANET_GREEN_FILE],
    aliens: [
      {count: 400, file: SHIP_ALIEN_STAPLE_TURRET},
      {count: 500, file: SHIP_ALIEN_LARGE},
      {count: 500, file: SHIP_ALIEN_STEALTH},
    ],
  },
  {
    planetCount: 20,
    minDist: 2501, maxDist: 10001,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 10, maxPlanetRadius:20,
    planetFiles: [WORMHOLE_SPRITE],
    aliens: [],
  },
  {
    planetCount: 0,
    minDist: 8000, maxDist: 12000,
    minDistToOtherPlanet: 10,
    minPlanetRadius: 10, maxPlanetRadius: 10,
    planetFiles: [PLANET_RED_FILE],
    aliens: [
      {count: 100, file: SHIP_ALIEN_STAPLE_TURRET},
      {count: 400, file: SHIP_ALIEN_STEALTH},
    ],
  },
  {
    planetCount: 1000,
    minDist: 10000, maxDist: 20000,
    minDistToOtherPlanet: 150,
    minPlanetRadius: 200, maxPlanetRadius: 360,
    planetFiles: [PLANET_ROCK_FILE, PLANET_RED_FILE, PLANET_GREEN_FILE],
    aliens: [
      {count: 400, file: SHIP_ALIEN_TURRET},
      {count: 800, file: SHIP_ALIEN},
      {count: 400, file: SHIP_ALIEN_LARGE},
    ],
  },
  {
    planetCount: 20,
    minDist: 10001, maxDist: 20001,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 10, maxPlanetRadius:20,
    planetFiles: [WORMHOLE_SPRITE],
    aliens: [],
  },
  {
    planetCount: 2000,
    minDist: 20000, maxDist: 30000,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 170, maxPlanetRadius: 220,
    planetFiles: [PLANET_ROCK_FILE, PLANET_RED_FILE],
    aliens: [
      {count: 1300, file: SHIP_ALIEN_TURRET},
      {count: 400, file: SHIP_ALIEN}
    ],
  },
  {
    planetCount: 1000,
    minDist: 30000, maxDist: 35000,
    minDistToOtherPlanet: 300,
    minPlanetRadius: 150, maxPlanetRadius: 180,
    planetFiles: [PLANET_ROCK_FILE],
    aliens: [{count: 600, file: SHIP_ALIEN_TURRET}],
  },
  {
    planetCount: 20,
    minDist: 20001, maxDist: 35001,
    minDistToOtherPlanet: 200,
    minPlanetRadius: 10, maxPlanetRadius:20,
    planetFiles: [WORMHOLE_SPRITE],
    aliens: [],
  },
  {
    planetCount: 900,
    minDist: 35000, maxDist: UNIVERSE_RADIUS,
    minDistToOtherPlanet: 500,
    minPlanetRadius: 80, maxPlanetRadius: 150,
    planetFiles: [PLANET_ROCK_FILE],
    aliens: [],
  },
  {
    planetCount: 20,
    minDist: UNIVERSE_RADIUS-300, maxDist: UNIVERSE_RADIUS+800,
    minDistToOtherPlanet: 500,
    minPlanetRadius: 10, maxPlanetRadius:20,
    planetFiles: [WORMHOLE_SPRITE],
    aliens: [],
  },
];

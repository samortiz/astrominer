import { world, GAME_STATE, TAKEOFF_BOOST, TAKEOFF_SPEED, SPRITESHEET_JSON, MINE_FILE, MINE_SCALE, HALF_SCREEN_WIDTH, 
  HALF_SCREEN_HEIGHT, MINE_PLACEMENT_FROM_SHIP, BUILDING_TYPE_MINE, MINE_ANIMATION_SPEED } from './init.js';
import { changeGameState } from './game.js';
import { calcGravity, normalizeRadian } from './utils.js';

export function enterManageState() {
  console.log("enter manage state");
}

// When managing planet resources - loop runs 60/s
export function manageLoop(delta) {
  if (world.keys.up.isDown) {
    takeOff();
  }
}

function takeOff() {
  let ship = world.ship;
  changeGameState(GAME_STATE.FLY);
  let gravity = calcGravity(ship.x, ship.y, world.selectedPlanet);
  ship.vx = gravity.x * -TAKEOFF_SPEED;
  ship.vy = gravity.y * -TAKEOFF_SPEED;
  ship.x += ship.vx * TAKEOFF_BOOST;
  ship.y += ship.vy * TAKEOFF_BOOST;
}

export function buildMine() {
  let mine = {type: BUILDING_TYPE_MINE};
  let planet = world.selectedPlanet;
  let ship = world.ship;

  //Setup the graphics
  let sheet = PIXI.Loader.shared.resources[SPRITESHEET_JSON].spritesheet;
  mine.sprite = new PIXI.AnimatedSprite(sheet.animations[MINE_FILE]);
  mine.sprite.animationSpeed = MINE_ANIMATION_SPEED; 
  mine.sprite.play();
  mine.sprite.anchor.set(0.5, 0.5);
  mine.sprite.scale.set(MINE_SCALE, MINE_SCALE);
  planet.sprite.addChild(mine.sprite);

  // Calcuate position
  let deg = world.ship.sprite.rotation + Math.PI/2; // 90 deg (right of the ship)
  let degX = ship.x + MINE_PLACEMENT_FROM_SHIP * Math.cos(deg); // Some point Xpx to the right of the ship
  let degY = ship.y + MINE_PLACEMENT_FROM_SHIP * Math.sin(deg);
  // Calculate the rotation direction to get to that point
  mine.sprite.rotation = normalizeRadian(Math.atan2(degY - planet.y, degX - planet.x));
  // Calculate the X,Y point near the surface of the planet
  mine.x = planet.x + ((planet.radius + 10) * Math.cos(mine.sprite.rotation));
  mine.y = planet.y + ((planet.radius + 10) * Math.sin(mine.sprite.rotation));
  mine.sprite.x = (mine.x - planet.x);
  mine.sprite.y = (mine.y - planet.y);

  // TODO : Check for collision with other building and adjust position further along planet

  planet.buildings.push(mine);
}

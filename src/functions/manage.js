import { c, utils, game } from './';

export function enterManageState() {
  console.log("enter manage state");
}

// When managing planet resources - loop runs 60/s
export function manageLoop(delta) {
  if (window.world.keys.up.isDown) {
    takeOff();
  }
}

function takeOff() {
  let world = window.world;
  let ship = world.ship;
  game.changeGameState(c.GAME_STATE.FLY);
  let gravity = utils.calcGravity(ship.x, ship.y, world.selectedPlanet);
  ship.vx = gravity.x * -c.TAKEOFF_SPEED;
  ship.vy = gravity.y * -c.TAKEOFF_SPEED;
  ship.x += ship.vx * c.TAKEOFF_BOOST;
  ship.y += ship.vy * c.TAKEOFF_BOOST;
}

export function buildMine() {
  let world = window.world;
  let mine = {type: c.BUILDING_TYPE_MINE};
  let planet = world.selectedPlanet;
  let ship = world.ship;

  //Setup the graphics
  let sheet = window.PIXI.Loader.shared.resources[c.SPRITESHEET_JSON].spritesheet;
  mine.sprite = new window.PIXI.AnimatedSprite(sheet.animations[c.MINE_FILE]);
  mine.sprite.animationSpeed = c.MINE_ANIMATION_SPEED; 
  mine.sprite.play();
  mine.sprite.anchor.set(0.5, 0.5);
  mine.sprite.scale.set(c.MINE_SCALE, c.MINE_SCALE);
  planet.sprite.addChild(mine.sprite);

  // Calcuate position
  let deg = world.ship.sprite.rotation + Math.PI/2; // 90 deg (right of the ship)
  let degX = ship.x + c.MINE_PLACEMENT_FROM_SHIP * Math.cos(deg); // Some point Xpx to the right of the ship
  let degY = ship.y + c.MINE_PLACEMENT_FROM_SHIP * Math.sin(deg);
  // Calculate the rotation direction to get to that point
  mine.sprite.rotation = utils.normalizeRadian(Math.atan2(degY - planet.y, degX - planet.x));
  // Calculate the X,Y point near the surface of the planet
  mine.x = planet.x + ((planet.radius + 10) * Math.cos(mine.sprite.rotation));
  mine.y = planet.y + ((planet.radius + 10) * Math.sin(mine.sprite.rotation));
  mine.sprite.x = (mine.x - planet.x);
  mine.sprite.y = (mine.y - planet.y);

  // TODO : Check for collision with other building and adjust position further along planet

  planet.buildings.push(mine);
}

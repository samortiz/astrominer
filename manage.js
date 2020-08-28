import { world, GAME_STATE, TAKEOFF_BOOST, TAKEOFF_SPEED } from './init.js';
import { changeGameState } from './game.js';
import { calcGravity } from './utils.js';

export function enterManageState() {
  console.log("enter manage state");
}

// When managing planet resources - loop runs 60/s
export function manageLoop(delta) {
  if (world.keys.up.isDown) {
    let ship = world.ship;
    changeGameState(GAME_STATE.FLY);
    let gravity = calcGravity(ship.x, ship.y, world.selectedPlanet);
    ship.vx = gravity.x * -TAKEOFF_SPEED;
    ship.vy = gravity.y * -TAKEOFF_SPEED;
    ship.x += ship.vx * TAKEOFF_BOOST;
    ship.y += ship.vy * TAKEOFF_BOOST;
  }
}



import { world, GAME_STATE } from './init.js';
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
    let gravity = calcGravity(ship.sprite.x, ship.sprite.y, world.selectedPlanet);
    ship.vx = gravity.x * -2;
    ship.vy = gravity.y * -2;
    ship.sprite.x += ship.vx * 5;
    ship.sprite.y += ship.vy * 5;
  }
}



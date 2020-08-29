import { keyboard } from './utils.js';
import { flyLoop, enterFlyState } from './fly.js';
import { enterManageState, manageLoop } from './manage.js';
import { infoPanelComponent } from './info.js';
import { world, GAME_STATE, setupWorld, SCREEN_WIDTH, SCREEN_HEIGHT, BLACK, SHIP_FILE, ROCK_PLANET_FILE, RED_PLANET_FILE } from './init.js';

// This is created in game.js
let app = null;

// Setup the App
app = new PIXI.Application({width: SCREEN_WIDTH, height: SCREEN_HEIGHT});
app.renderer.backgroundColor = BLACK;
document.getElementById("mainview").appendChild(app.view);
PIXI.loader
  .add(SHIP_FILE)
  .add(ROCK_PLANET_FILE)
  .add(RED_PLANET_FILE)
  .load(setup);

function setup() {
  setupWorld(app.stage);
  setupKeyboard();
  changeGameState(GAME_STATE.FLY);
  app.ticker.add(delta => mainLoop(delta));
}

export function changeGameState(newState) {
  world.gameState = newState;
  if (newState === GAME_STATE.FLY) {
    enterFlyState();
    world.gameLoop = flyLoop;
    infoPanelComponent.forceUpdate()
  } else if (newState === GAME_STATE.MANAGE) {
    enterManageState();
    world.gameLoop = manageLoop;
    infoPanelComponent.forceUpdate()
  } else {
    world.gameLoop = null;
  }
}

// Main loop runs 60 times per sec
function mainLoop(delta) {
  if (world.gameLoop) {
    world.gameLoop(delta);
  }
}

function setupKeyboard() {
  // Keypress listeners
  world.keys.left = keyboard("ArrowLeft");
  world.keys.right = keyboard("ArrowRight");
  world.keys.up = keyboard("ArrowUp");
  world.keys.down = keyboard("ArrowDown");
}
import { keyboard } from './utils.js';
import { flyLoop, enterFlyState } from './fly.js';
import { enterManageState, manageLoop } from './manage.js';
import { infoPanelComponent } from './info.js';
import { world, GAME_STATE, setupWorld, SCREEN_WIDTH, SCREEN_HEIGHT, BLACK, 
  SPRITESHEET_JSON, BUILDING_TYPE_MINE, MINE_SPEED_TITATIUM, MINE_SPEED_GOLD, MINE_SPEED_URANIUM} from './init.js';

export let app = new PIXI.Application({width: SCREEN_WIDTH, height: SCREEN_HEIGHT});
app.renderer.backgroundColor = BLACK;
document.getElementById("mainview").appendChild(app.view);
PIXI.loader
  .add(SPRITESHEET_JSON)
  .load(setup);
world.app = app;

// Setup the App
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
  } else if (newState === GAME_STATE.MANAGE) {
    enterManageState();
    world.gameLoop = manageLoop;
  } else {
    world.gameLoop = null;
  }
}

// Main loop runs 60 times per sec
function mainLoop(delta) {
  if (world.gameLoop) {
    runBuildings();
    world.gameLoop(delta);
  }
  infoPanelComponent.forceUpdate()
}

function setupKeyboard() {
  // Keypress listeners
  world.keys.left = keyboard("ArrowLeft");
  world.keys.right = keyboard("ArrowRight");
  world.keys.up = keyboard("ArrowUp");
  world.keys.down = keyboard("ArrowDown");
}

/**
 * Loop to run building, runs in any game mode (fly,manage)
 */
function runBuildings() {
  for (let planet of world.planets) {
    for (let building of planet.buildings) {
      if (building.type === BUILDING_TYPE_MINE) {
        planet.resources.raw.titanium -= MINE_SPEED_TITATIUM;
        planet.resources.stored.titanium += MINE_SPEED_TITATIUM;
        planet.resources.raw.gold -= MINE_SPEED_GOLD;
        planet.resources.stored.gold += MINE_SPEED_GOLD;
        planet.resources.raw.uranium -= MINE_SPEED_URANIUM;
        planet.resources.stored.uranium += MINE_SPEED_URANIUM;
      }
    } // for building
  } // for planet
}
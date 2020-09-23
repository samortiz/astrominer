import React from 'react';
import './App.css';
import { InfoPanel } from './InfoPanel';
import { utils, c, game, fly } from './functions';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    console.log("created world");
    window.world = game.createEmptyWorld();
    this.pixiRef = React.createRef();
  }

componentDidMount() {
  console.log("mounted");
  this.createPixiApp();
}

render() {
  return (
    <table>
      <tbody>
      <tr>
        <td>
        <div ref={this.pixiRef} />
        </td>
        <td className='info-panel'>
          <InfoPanel />
        </td>
      </tr>
      </tbody>
    </table>
   );
  }

  createPixiApp = () => {
    console.log("Creating PIXI app");
    let app = new window.PIXI.Application({width: c.SCREEN_WIDTH, height: c.SCREEN_HEIGHT});
    app.renderer.backgroundColor = c.BLACK;
    this.pixiRef.current.appendChild(app.view);
    window.PIXI.loader
      .add(c.SPRITESHEET_JSON)
      .add(c.CRASH_JSON)
      .load(this.setupGame);
    window.world.app = app;
  }

  // Setup the App
  setupGame = () => {
    game.setupWorld();
    this.setupKeyboardListeners();
    game.changeGameState(c.GAME_STATE.FLY);
    window.world.app.renderer.plugins.interaction.on('pointerdown', (event) => { 
      game.click(event);
    });
    window.world.app.ticker.add(delta => this.mainLoop(delta));
  }
  
  // Main loop runs 60 times per sec
  mainLoop = (delta) => {
    if (window.world.gameLoop) {
      game.runBuildings();
      fly.moveBullets();
      fly.coolAllWeapons();
      fly.moveAliens();
      window.world.gameLoop(delta);
    }
    this.forceUpdate()
  }

  setupKeyboardListeners = () => {
    window.world.keys.left = utils.keyboardListener("ArrowLeft");
    window.world.keys.right = utils.keyboardListener("ArrowRight");
    window.world.keys.up = utils.keyboardListener("ArrowUp");
    window.world.keys.down = utils.keyboardListener("ArrowDown");
    window.world.keys.space = utils.keyboardListener(" ");
    window.world.keys.w = utils.keyboardListener("w"); // up
    window.world.keys.a = utils.keyboardListener("a"); // left
    window.world.keys.s = utils.keyboardListener("s"); // down
    window.world.keys.d = utils.keyboardListener("d"); // right
    window.world.keys.q = utils.keyboardListener("q"); // thrust left
    window.world.keys.e = utils.keyboardListener("e"); // thrust right
  }
  
}

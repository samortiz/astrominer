import React from 'react';
import './App.css';
import { InfoPanel } from './InfoPanel';
import { utils, c, game } from './functions';

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
      .load(this.setupGame);
    window.world.app = app;
  }

  // Setup the App
  setupGame = () => {
    game.setupWorld(window.world.app.stage);
    this.setupKeyboardListeners();
    game.changeGameState(c.GAME_STATE.FLY);
    window.world.app.ticker.add(delta => this.mainLoop(delta));
  }
  
  // Main loop runs 60 times per sec
  mainLoop = (delta) => {
    if (window.world.gameLoop) {
      game.runBuildings();
      window.world.gameLoop(delta);
    }
    this.forceUpdate()
  }

  setupKeyboardListeners = () => {
    window.world.keys.left = utils.keyboardListener("ArrowLeft");
    window.world.keys.right = utils.keyboardListener("ArrowRight");
    window.world.keys.up = utils.keyboardListener("ArrowUp");
    window.world.keys.down = utils.keyboardListener("ArrowDown");
  }
  
}

import React from 'react';
import './App.css';
import {InfoPanel} from './InfoPanel';
import {ai, c, fly, game, utils} from './functions';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    window.world = game.createEmptyWorld();
    this.pixiRef = React.createRef();
  }

  componentDidMount() {
    this.createPixiApp();
  }

  render() {
    return (
      <table className='root-app' width='100%'>
        <tbody>
        <tr>
          <td width='10%'>
            <div className='viewport' ref={this.pixiRef}/>
          </td>
          <td className='info-panel' width='100%' height={c.SCREEN_HEIGHT + 'px'}>
            <InfoPanel/>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }

  createPixiApp = () => {
    let app = new window.PIXI.Application({width: c.SCREEN_WIDTH, height: c.SCREEN_HEIGHT});
    app.renderer.backgroundColor = c.BLACK;
    this.pixiRef.current.appendChild(app.view);
    window.PIXI.loader
      .add(c.SPRITESHEET_JSON)
      .add(c.CRASH_JSON)
      .load(this.setupGame);
    window.world.system.app = app;
  }

  // Setup the App
  setupGame = () => {
    game.setupWorld();
    this.setupKeyboardListeners();
    game.changeGameState(c.GAME_STATE.FLY);
    window.world.system.app.renderer.plugins.interaction.on('pointerdown', (event) => {
      game.click(event);
    });
    window.world.system.app.ticker.add(delta => this.mainLoop(delta));
  }

  // Main loop runs 60 times per sec
  mainLoop = (delta) => {
    if (window.world.system.gameLoop) {
      game.runBuildings();
      fly.moveBullets();
      fly.coolAllWeapons();
      ai.moveAliens();
      window.world.system.gameLoop(delta);
    }
    this.forceUpdate()
  }

  setupKeyboardListeners = () => {
    window.world.system.keys.left = utils.keyboardListener("ArrowLeft");
    window.world.system.keys.right = utils.keyboardListener("ArrowRight");
    window.world.system.keys.up = utils.keyboardListener("ArrowUp");
    window.world.system.keys.down = utils.keyboardListener("ArrowDown");
    window.world.system.keys.space = utils.keyboardListener(" ");
    window.world.system.keys.w = utils.keyboardListener("w"); // up
    window.world.system.keys.a = utils.keyboardListener("a"); // left
    window.world.system.keys.s = utils.keyboardListener("s"); // down
    window.world.system.keys.d = utils.keyboardListener("d"); // right
    window.world.system.keys.q = utils.keyboardListener("q"); // thrust left
    window.world.system.keys.e = utils.keyboardListener("e"); // thrust right
    window.world.system.keys.x = utils.keyboardListener("x"); // secondary weapon
  }

}

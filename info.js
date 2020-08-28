import { GAME_STATE, world } from './init.js';
'use strict';

const e = React.createElement;

class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    if (world.gameState === GAME_STATE.MANAGE) {
      return e('div', null,
        e('div', null, `Planet ${world.selectedPlanet.name}`),
        e('div', {className:"resource-list"}, `Resources`),
        e('div', null, `Titatium ${world.selectedPlanet.resources.titanium}`),
        e('div', null, `Gold ${world.selectedPlanet.resources.gold}`),
        e('div', null, `Uranium ${world.selectedPlanet.resources.uranium}`),
      );

    } else if (world.gameState === GAME_STATE.FLY) {
      return e('div', null,
        e('div', null, `Ship`),
        e('div', {className:"resource-list"}, `Cargo`),
        e('div', null, `Titatium ${world.ship.cargo.titanium}`),
        e('div', null, `Gold ${world.ship.cargo.gold}`),
        e('div', null, `Uranium ${world.ship.cargo.uranium}`),
      );
    }
    return e('div', null, '...');
  }
}

const domContainer = document.querySelector('#infopanel');
export let infoPanelComponent = ReactDOM.render(e(InfoPanel), domContainer);


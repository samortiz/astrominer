import React from 'react';
import { c, manage } from './functions';
import './InfoPanel.css';

export class InfoPanel extends React.Component {
  constructor(props) {
    console.log("infopanel constructor");
    super(props);
    this.state = {};
  }

  render() {
    let world = window.world;
    let planetResources = window.world.selectedPlanet.resources;
    if (world.gameState === c.GAME_STATE.MANAGE) {
      return (
        <div className='planet-info'> 
          <div>Planet {world.selectedPlanet.name}</div>
          <button onClick={() => manage.buildMine()}>Build Mine</button>
          <div className='resource-list'>Resources</div>
          <div>Titatium {Math.floor(planetResources.stored.titanium)} / {Math.floor(planetResources.raw.titanium)}</div>
          <div>Gold {Math.floor(planetResources.stored.gold)} / {Math.floor(planetResources.raw.gold)}</div>
          <div>Uranium {Math.floor(planetResources.stored.uranium)} / {Math.floor(planetResources.raw.uranium)}</div>
        </div>);
        } else if (world.gameState === c.GAME_STATE.FLY) {
          return (
          <div className='ship-info'>
            <div>Ship</div>
            <div className='resource-list'>Resources</div>
            <div> Titatium {world.ship.cargo.titanium}</div>
            <div> Gold {world.ship.cargo.gold}</div>
            <div> Uranium {world.ship.cargo.uranium}</div>
          </div>
          );
        }
        return (<div>...</div>);
  }
}


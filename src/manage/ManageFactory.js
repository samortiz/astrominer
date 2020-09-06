import React from 'react';
import { c, manage, game } from '../functions';
import './ManageFactory.css';

export class ManageFactory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let world = window.world;
    let planet = world.selectedPlanet;
    let ship = world.ship;
    
    return (
      <div className='factory-info'> 
        <div>
          <button 
            disabled={!game.canAfford(planet, ship, c.FACTORY_COST)} 
            onClick={() => manage.buildFactory()}>Build Factory</button>
            Cost: T:{c.FACTORY_COST.titanium} G:{c.FACTORY_COST.gold} U:{c.FACTORY_COST.uranium}
        </div>  
        <div>
          <button 
            disabled={!game.canAfford(planet, ship, c.SHIP_CARGO_COST)} 
            onClick={() => manage.buildShip(c.SHIP_CARGO)}>Build Cargo Ship</button>
            Cost: T:{c.SHIP_CARGO_COST.titanium} G:{c.SHIP_CARGO_COST.gold} U:{c.SHIP_CARGO_COST.uranium}
        </div>  
        <div>
          <button 
            disabled={!game.canAfford(planet, ship, c.SHIP_EXPLORER_COST)} 
            onClick={() => manage.buildShip(c.SHIP_EXPLORER)}>Build Explorer Ship</button>
            Cost: T:{c.SHIP_EXPLORER_COST.titanium} G:{c.SHIP_EXPLORER_COST.gold} U:{c.SHIP_EXPLORER_COST.uranium}
        </div>  
      </div>);
  }
}


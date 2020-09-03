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
        <button 
          disabled={!game.canAfford(planet, ship, c.FACTORY_COST)} 
          onClick={() => manage.buildFactory()}>Build Factory</button>
          Cost: T:{c.FACTORY_COST.titanium} G:{c.FACTORY_COST.gold} U:{c.FACTORY_COST.uranium}
      </div>);
  }
}


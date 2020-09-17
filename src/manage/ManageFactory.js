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
        <div className='build-button'>
          <button 
            disabled={!game.canAfford(planet, ship, c.FACTORY_COST)} 
            onClick={() => manage.buildFactory()}>Build Factory</button>
            Cost: T:{c.FACTORY_COST.titanium} G:{c.FACTORY_COST.gold} U:{c.FACTORY_COST.uranium}
        </div>  
        <div className='build-button'>
          <button 
            disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, c.SHIP_CARGO_COST)} 
            onClick={() => manage.buildShip(c.SHIP_CARGO)}>Build Cargo Ship</button>
            Cost: T:{c.SHIP_CARGO_COST.titanium} G:{c.SHIP_CARGO_COST.gold} U:{c.SHIP_CARGO_COST.uranium}
        </div>  
        <div className='build-button'>
          <button 
            disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, c.SHIP_EXPLORER_COST)} 
            onClick={() => manage.buildShip(c.SHIP_EXPLORER)}>Build Explorer Ship</button>
            Cost: T:{c.SHIP_EXPLORER_COST.titanium} G:{c.SHIP_EXPLORER_COST.gold} U:{c.SHIP_EXPLORER_COST.uranium}
        </div>  
        <div className='build-button'>
          <button 
            disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, c.SHIP_FAST_COST)} 
            onClick={() => manage.buildShip(c.SHIP_FAST)}>Build Fast Ship</button>
            Cost: T:{c.SHIP_FAST_COST.titanium} G:{c.SHIP_FAST_COST.gold} U:{c.SHIP_FAST_COST.uranium}
        </div>  
        <div className='build-button'>
          <button 
            disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, c.SHIP_HEAVY_COST)} 
            onClick={() => manage.buildShip(c.SHIP_HEAVY)}>Build Heavy Ship</button>
            Cost: T:{c.SHIP_HEAVY_COST.titanium} G:{c.SHIP_HEAVY_COST.gold} U:{c.SHIP_HEAVY_COST.uranium}
        </div>
        <div className='build-button'>
          <button 
            disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, c.SHIP_FIGHTER_COST)} 
            onClick={() => manage.buildShip(c.SHIP_FIGHTER)}>Build Fighter Ship</button>
            Cost: T:{c.SHIP_FIGHTER_COST.titanium} G:{c.SHIP_FIGHTER_COST.gold} U:{c.SHIP_FIGHTER_COST.uranium}
        </div>
      </div>);
  }
}


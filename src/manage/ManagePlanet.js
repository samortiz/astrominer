import React from 'react';
import { c, manage, game } from '../functions';
import './ManagePlanet.css';
import 'font-awesome/css/font-awesome.min.css';

export class ManagePlanet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {titanium:'', gold:'', uranium:''};
  }

  valueChanged(event, resourceType) {
    let newState = Object.assign({}, this.state);
    newState[resourceType] = event.target.value;
    this.setState(newState);
  }

  render() {
    let world = window.world;
    let planet = window.world.selectedPlanet;
    let ship = window.world.ship;
    let shipOnPlanet = ((planet === window.world.lastPlanetLanded) && ship.alive);
    return (
      <div className='planet-info'> 
        <div className='section'><b>Planet Name</b> {world.selectedPlanet.name}</div>
        <div className='build-button'>
          <button 
            disabled={!game.canAfford(planet, (shipOnPlanet ? ship : null), c.MINE_COST)}
            onClick={() => manage.buildMine()}>Build Mine</button>
            Cost: T:{c.MINE_COST.titanium} G:{c.MINE_COST.gold}
        </div>
        <div className='build-button'>
          <button 
            disabled={!game.canAfford(planet, (shipOnPlanet ? ship : null), c.FACTORY_COST)}
            onClick={() => manage.buildFactory()}>Build Factory</button>
            Cost: T:{c.FACTORY_COST.titanium} G:{c.FACTORY_COST.gold} U:{c.FACTORY_COST.uranium}
        </div>
        <div className='section'><b>Resources</b></div>
        <div>Titatium {Math.floor(planet.resources.raw.titanium)}</div>
        <div>Gold {Math.floor(planet.resources.raw.gold)}</div>
        <div>Uranium {Math.floor(planet.resources.raw.uranium)}</div>

        {shipOnPlanet && <table>
          <thead>
            <tr>
              <th>Resource</th>
              <th>Planet</th>
              <th>Transfer</th>
              <th>Ship ({ship.resourcesMax})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Titanium</td>
              <td>{Math.floor(planet.resources.stored.titanium)}</td>
              <td>
                <span className='transfer-button'
                        onClick={() => manage.transferResource(ship.resources, planet.resources.stored,
                          'titanium', this.state.titanium, c.PLANET_RESOURCE_MAX)}><i className="fa fa-arrow-left"> </i></span>
                  <input type='text' className='transfer-input' 
                  value={this.state.titanium} 
                  onChange={(event)=>this.valueChanged(event, 'titanium')}/>
                  <span className='transfer-button' 
                        onClick={() => manage.transferResource(planet.resources.stored, ship.resources,
                        'titanium', this.state.titanium, ship.resourcesMax)}><i className="fa fa-arrow-right"> </i></span>
              </td>
              <td>{Math.floor(ship.resources.titanium)}</td>
            </tr>
            <tr>
              <td>Gold</td>
              <td>{Math.floor(planet.resources.stored.gold)}</td>
              <td>
                <span className='transfer-button' 
                        onClick={() => manage.transferResource(ship.resources, planet.resources.stored, 
                        'gold', this.state.gold, c.PLANET_RESOURCE_MAX)}><i className="fa fa-arrow-left"> </i></span>
                  <input type='text' className='transfer-input' 
                  value={this.state.gold} 
                  onChange={(event)=>this.valueChanged(event, 'gold')}/>
                  <span className='transfer-button' 
                        onClick={() => manage.transferResource(planet.resources.stored, ship.resources,
                        'gold', this.state.gold, ship.resourcesMax)}><i className="fa fa-arrow-right"> </i></span>
              </td>
              <td>{Math.floor(ship.resources.gold)}</td>
            </tr>
            <tr>
              <td>Uranium</td>
              <td>{Math.floor(planet.resources.stored.uranium)}</td>
              <td>
                <span className='transfer-button' 
                        onClick={() => manage.transferResource(ship.resources, planet.resources.stored, 
                        'uranium', this.state.uranium, c.PLANET_RESOURCE_MAX)}><i className="fa fa-arrow-left"> </i></span>
                  <input type='text' className='transfer-input' 
                  value={this.state.uranium} 
                  onChange={(event)=>this.valueChanged(event, 'uranium')}/>
                  <span className='transfer-button' 
                        onClick={() => manage.transferResource(planet.resources.stored, ship.resources,
                        'uranium', this.state.uranium, ship.resourcesMax)}><i className="fa fa-arrow-right"> </i></span>
              </td>
              <td>{Math.floor(ship.resources.uranium)}</td>
            </tr>
          </tbody>
        </table>}

        {!shipOnPlanet &&
        <table>
          <thead>
          <tr>
            <th>Resource</th>
            <th>Planet</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Titanium</td>
            <td>{Math.floor(planet.resources.stored.titanium)}</td>
          </tr>
          <tr>
            <td>Gold</td>
            <td>{Math.floor(planet.resources.stored.gold)}</td>
          </tr>
          <tr>
            <td>Uranium</td>
            <td>{Math.floor(planet.resources.stored.uranium)}</td>
          </tr>
          </tbody>
        </table>}
      </div>);
  }
}


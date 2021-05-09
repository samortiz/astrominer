import React, {useState} from 'react';
import {c, game, manage} from '../functions';
import './ManagePlanet.css';
import 'font-awesome/css/font-awesome.min.css';

export function ManagePlanet() {
  const [titaniumAmt, setTitaniumAmt] = useState('');
  const [goldAmt, setGoldAmt] = useState('');
  const [uraniumAmt, setUraniumAmt] = useState('');

  let world = window.world;
  let planet = window.world.selectedPlanet;
  let ship = window.world.ship;
  let shipOnPlanet = ((planet === window.world.lastPlanetLanded) && ship.alive);
  return (
    <div className='planet-info'>
      <div className='section'><b>Planet Name: </b> {world.selectedPlanet.name}</div>
      <div className='build-button'>
        <button
          disabled={!game.canAfford(planet, (shipOnPlanet ? ship : null), c.MINE_COST)}
          onClick={() => manage.buildMine()}>Build Mine
        </button>
        Cost: T:{c.MINE_COST.titanium} G:{c.MINE_COST.gold}
      </div>
      <div className='build-button'>
        <button
          disabled={!game.canAfford(planet, (shipOnPlanet ? ship : null), c.FACTORY_COST)}
          onClick={() => manage.buildFactory()}>Build Factory
        </button>
        Cost: T:{c.FACTORY_COST.titanium} G:{c.FACTORY_COST.gold} U:{c.FACTORY_COST.uranium}
      </div>

      <div style={{display:ship.alive?'block':'none'}} className='build-button'>
        <div className='section'><b>Ship</b> ({Math.round(ship.armor) +' / '+ ship.armorMax}) </div>
        <button style={{marginLeft:'10px'}}
                onClick={() => manage.unloadShip(ship, planet)}>
          Unload
        </button>
        <button style={{marginLeft:'10px'}}
                onClick={() => manage.resupplyShip(ship, planet)}>
            Resupply
        </button>
        <button style={{marginLeft:'10px'}}
                onClick={() => manage.repairShip(ship, planet)}
                disabled={ship.armorMax <= ship.armor}>
          Repair
        </button>
      </div>

      <div className='section'>
        <b>Resources</b>
      </div>
      <div className="row-item">Titanium {Math.floor(planet.resources.raw.titanium)}</div>
      <div className="row-item">Gold {Math.floor(planet.resources.raw.gold)}</div>
      <div className="row-item">Uranium {Math.floor(planet.resources.raw.uranium)}</div>

      {shipOnPlanet && <table  className="row-item">
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
                      'titanium', titaniumAmt, c.PLANET_RESOURCE_MAX)}><i className="fa fa-arrow-left"> </i></span>
            <input type='text' className='transfer-input'
                   defaultValue={titaniumAmt}
                   onChange={(event) => setTitaniumAmt(event.target.value)}/>
            <span className='transfer-button'
                  onClick={() => manage.transferResource(planet.resources.stored, ship.resources,
                    'titanium', titaniumAmt, ship.resourcesMax)}><i className="fa fa-arrow-right"> </i></span>
          </td>
          <td>{Math.floor(ship.resources.titanium)}</td>
        </tr>
        <tr>
          <td>Gold</td>
          <td>{Math.floor(planet.resources.stored.gold)}</td>
          <td>
              <span className='transfer-button'
                    onClick={() => manage.transferResource(ship.resources, planet.resources.stored,
                      'gold', goldAmt, c.PLANET_RESOURCE_MAX)}><i className="fa fa-arrow-left"> </i></span>
            <input type='text' className='transfer-input'
                   defaultValue={goldAmt}
                   onChange={(event) => setGoldAmt(event.target.value)}/>
            <span className='transfer-button'
                  onClick={() => manage.transferResource(planet.resources.stored, ship.resources,
                    'gold', goldAmt, ship.resourcesMax)}><i className="fa fa-arrow-right"> </i></span>
          </td>
          <td>{Math.floor(ship.resources.gold)}</td>
        </tr>
        <tr>
          <td>Uranium</td>
          <td>{Math.floor(planet.resources.stored.uranium)}</td>
          <td>
              <span className='transfer-button'
                    onClick={() => manage.transferResource(ship.resources, planet.resources.stored,
                      'uranium', uraniumAmt, c.PLANET_RESOURCE_MAX)}><i className="fa fa-arrow-left"> </i></span>
            <input type='text' className='transfer-input'
                   defaultValue={uraniumAmt}
                   onChange={(event) => setUraniumAmt(event.target.value)}/>
            <span className='transfer-button'
                  onClick={() => manage.transferResource(planet.resources.stored, ship.resources,
                    'uranium', uraniumAmt, ship.resourcesMax)}><i className="fa fa-arrow-right"> </i></span>
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


import React from 'react';
import { manage } from '../functions';
import './ManageStorage.css';

export class ManageStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedShip:null};
  }

  viewShip(ship) {
    this.setState({selectedShip:ship});
  }

  startUsingShip() {
    manage.switchToShip(this.state.selectedShip);
    this.setState({selectedShip:null});
  }

  render() {
    let world = window.world;
    let planet = world.selectedPlanet;
    let currentShip = world.ship;
    let selectedShip = this.state.selectedShip;
    let shipOnPlanet = ((planet === window.world.lastPlanetLanded) && currentShip.alive);

    // Default to selecting the current ship
    if (!selectedShip && shipOnPlanet) {
      selectedShip = currentShip;
    }

    let selectedShipEquip = [];
    if (selectedShip) {
      for (let equip of selectedShip.equip) {
        selectedShipEquip.push(
          <div className="item" key={equip.id}>
            {equip.name} &nbsp;
            <button onClick={() => manage.moveEquipFromShipToPlanet(selectedShip, planet, equip)} >Remove</button>
          </div>);
      }
    }

    return (
      <div>
        <div className='storage-section'> 
          <div className='title'>Ships</div>
          <span className='item-list'>
            {(shipOnPlanet ? [currentShip] : []).concat(planet.ships).map((ship, i) => {
              return <div key={i} 
                          onClick={() => this.viewShip(ship)} 
                          className={`ship ${selectedShip===ship ? 'selected-item' : 'non-selected-item'}`} >{ship.name}</div>
            })}
          </span>
          <span className='item-details'>
            { selectedShip != null && // exclude this block if no ship selected
            <div>
              <div className='item-attr'>
                <button onClick={() => this.startUsingShip()} disabled={selectedShip === currentShip}>Use Ship</button>
              </div>             
              <div className='item-attr'><b>Name</b> {selectedShip.name} {selectedShip.id}</div>
              <div className='item-attr'><b>Engine</b> Propulsion:{Math.floor(selectedShip.propulsion*100)} Turn:{Math.floor(selectedShip.turnSpeed*100)}</div>
              <div className='item-attr'><b>Landing</b> Speed:{Math.floor(selectedShip.crashSpeed)} Angle:{Math.floor(selectedShip.crashAngle*10)}</div>
              <div className='item-attr'><b>Armor</b> 
                {Math.floor(selectedShip.armor)} of {Math.floor(selectedShip.armorMax)} 
                <button onClick={() => manage.repairShip(planet, selectedShip)}
                        disabled={selectedShip.armorMax <= selectedShip.armor} >Repair</button> 
                 &nbsp; Cost {Math.floor(selectedShip.armorMax - selectedShip.armor)} titanium
              </div>
              <div className='item-attr'><b>Resources Max</b>{Math.floor(selectedShip.resourcesMax)}</div>
              <div className='item-attr'><b>Equip</b> (Max {selectedShip.equipMax})
                {selectedShipEquip}
              </div>
            </div>
            }
          </span>
        </div>

        <div className='storage-section'> 
          <div className='title'>Equipment</div>
          <span className='equip-list'>
            {planet.equip.map((equip, i) => {
              return <div key={i} className='item'>
                {equip.name} &nbsp;
                <button onClick={() => manage.moveEquipFromPlanetToShip(selectedShip, planet, equip)}
                        disabled={!manage.canEquip(selectedShip, equip)}
                >Equip</button>
              </div>
            })}
          </span>
        </div>
      </div>);
  }
}


import React, {useState} from 'react';
import {manage} from '../functions';
import './ManageStorage.css';

export function ManageStorage() {
  const [selectedShip, setSelectedShip] = useState();
  let world = window.world;
  let planet = world.selectedPlanet;
  let currentShip = world.ship;
  let shipOnPlanet = ((planet === window.world.lastPlanetLanded) && currentShip.alive);

  function viewShip(ship) {
    setSelectedShip(ship);
  }

  function startUsingShip() {
    manage.switchToShip(selectedShip);
    setSelectedShip(null);
  }

  function salvageShip(selectedShip) {
    if (!window.confirm("Are you sure you want to salvage your " + selectedShip.name + "?")) {
      return;
    }
    manage.salvageShip(planet, selectedShip);
    setSelectedShip(null);
  }

  function salvageEquip(equip) {
    if (!window.confirm("Are you sure you want to this " + equip.name + "?")) {
      return;
    }
    manage.salvageEquip(planet, equip)
  }

  // Default to selecting the current ship
  if (!selectedShip && shipOnPlanet) {
    setSelectedShip(currentShip);
  }

  let selectedShipEquip = [];
  if (selectedShip) {
    for (let equip of selectedShip.equip) {
      selectedShipEquip.push(
        <div className="item" key={equip.id}>
          {equip.name} &nbsp;
          <button onClick={() => manage.moveEquipFromShipToPlanet(selectedShip, planet, equip)}>Remove</button>
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
                        onClick={() => viewShip(ship)}
                        className={`ship ${selectedShip === ship ? 'selected-item' : 'non-selected-item'}`}>{ship.name}</div>
          })}
        </span>
        <span className='item-details'>
          {selectedShip != null && // exclude this block if no ship selected
          <div>
            <div className='item-attr'>
              <button onClick={() => startUsingShip()} disabled={selectedShip === currentShip}>Use Ship</button>
              <button onClick={() => salvageShip(selectedShip)} style={{marginLeft:'10px'}}>Salvage</button>
            </div>
            <div className='item-attr'><b>Name</b> {selectedShip.name} {selectedShip.id}</div>
            <div className='item-attr'>
              <b>Engine</b> Propulsion:{Math.floor(selectedShip.propulsion * 100)} Turn:{Math.floor(selectedShip.turnSpeed * 100)}
            </div>
            <div className='item-attr'>
              <b>Landing</b> Speed:{Math.floor(selectedShip.crashSpeed)} Angle:{Math.floor(selectedShip.crashAngle * 10)}
            </div>
            <div className='item-attr'><b>Armor</b> &nbsp;
              {Math.floor(selectedShip.armor)} of {Math.floor(selectedShip.armorMax)}&nbsp;
              <button onClick={() => manage.repairShip(selectedShip, planet)}
                      disabled={selectedShip.armorMax <= selectedShip.armor}> Repair
              </button>
              &nbsp; Cost {Math.floor(manage.costToRepair(selectedShip).titanium)} titanium
            </div>
            <div className='item-attr'><b>Resources Max</b>{Math.floor(selectedShip.resourcesMax)}</div>
            <div className='item-attr'><b>Equip</b> ({selectedShip.equip.length} of {selectedShip.equipMax})
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
              >Equip
              </button>
              <button onClick={() => salvageEquip(equip)} style={{marginLeft:'10px'}}>Salvage</button>
            </div>
          })}
        </span>
      </div>
    </div>);
}


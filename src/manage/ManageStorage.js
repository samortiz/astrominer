import React from 'react';
import { manage, game } from '../functions';
import './ManageStorage.css';
import { EquipSelect } from './EquipSelect';

export class ManageStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedShip:null, selectedEquip:null};
  }

  viewShip(ship) {
    this.setState({selectedShip:ship});
  }

  viewEquip(equip) {
    this.setState({selectedEquip:equip});
  }

  startUsingShip() {
    manage.switchToShip(this.state.selectedShip, window.world.selectedPlanet);    
    this.setState({selectedShip:null});
  }

  render() {
    let world = window.world;
    let planet = world.selectedPlanet;
    let currentShip = world.ship;
    let selectedShip = this.state.selectedShip;
    
    // Default to selecting the current ship
    if (!selectedShip && currentShip.sprite.visible) {
      selectedShip = currentShip;
    }

    let selectedShipEquip = [];
    if (selectedShip) {
      for (let i=0; i<selectedShip.equipMax; i++) {
        let equip = selectedShip.equip.length > i ? selectedShip.equip[i] : null;
        selectedShipEquip.push(<EquipSelect key={equip ? equip.id : 'empty-'+i} planet={planet} ship={selectedShip} equip={equip} />);
      }
    }

    return (
      <div>
        <div className='storage-section'> 
          <div className='title'>Ships</div>
          <span className='item-list'>
            {(currentShip.sprite.visible ? [currentShip] : []).concat(planet.ships).map((ship, i) => {
              return <div key={i} 
                          onClick={() => this.viewShip(ship)} 
                          className={`ship ${selectedShip===ship ? 'selected-item' : 'non-selected-item'}`} >{ship.name}</div>
            })}
          </span>
          <span className='item-details'>
            { selectedShip != null && // exclude this block if no ship selected
            <div>
              <div className='button-row'>
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
              <div className='item-attr'><b>Resources</b> Max:{Math.floor(selectedShip.resourcesMax)}</div>
              <div className='item-attr'><b>Equip</b> Max:{selectedShip.equipMax}
                {selectedShipEquip}
              </div>
            </div>
            }
          </span>
        </div>
        <div className='storage-section'> 
          <div className='title'>Equipment</div>
          <span className='item-list'>
            {planet.equip.map((equip, i) => {
              return <div key={i} 
                          onClick={() => this.viewEquip(equip)} 
                          className={`item ${this.state.selectedEquip===equip ? 'selected-item' : 'non-selected-item'}`} >{equip.name}</div>
            })}
          </span>
          <span className='item-details'>
            { this.state.selectedEquip != null && // exclude this block if no equip selected
            <div>
              <div className='item-attr'><b>Name</b> {this.state.selectedEquip.name} {this.state.selectedEquip.id}</div>
            </div>
            }
          </span>
        </div>
      </div>);
  }
}


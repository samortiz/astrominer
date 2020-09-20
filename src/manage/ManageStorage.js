import React from 'react';
import { c, manage, game } from '../functions';
import './ManageStorage.css';
import lodash from 'lodash';
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

  canRepair(planet, ship) {
    return game.canAfford(planet, ship, manage.costToRepair(ship)) 
        && (Math.floor(this.state.selectedShip.armorMax - this.state.selectedShip.armor) <= 0);
  }

  changeEquip(ship, equip) {
    console.log("Equiping ",ship, "with ",equip);
  }

  render() {
    let world = window.world;
    let planet = world.selectedPlanet;
    let selectedShip = this.state.selectedShip;

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
            {[world.ship].concat(planet.ships).map((ship, i) => {
              return <div key={i} 
                          onClick={() => this.viewShip(ship)} 
                          className={`ship ${this.state.selectedShip===ship ? 'selected-item' : 'non-selected-item'}`} >{ship.name}</div>
            })}
          </span>
          <span className='item-details'>
            { this.state.selectedShip != null && // exclude this block if no ship selected
            <div>
              <div className='button-row'>
                <button onClick={() => this.startUsingShip()}>Use Ship</button>
              </div>             
              <div className='item-attr'><b>Name</b> {this.state.selectedShip.name} {this.state.selectedShip.id}</div>
              <div className='item-attr'><b>Engine</b> Propulsion:{Math.floor(this.state.selectedShip.propulsion*100)} Turn:{Math.floor(this.state.selectedShip.turnSpeed*100)}</div>
              <div className='item-attr'><b>Landing</b> Speed:{Math.floor(this.state.selectedShip.crashSpeed)} Angle:{Math.floor(this.state.selectedShip.crashAngle*10)}</div>
              <div className='item-attr'><b>Armor</b> 
                {Math.floor(this.state.selectedShip.armor)} of {Math.floor(this.state.selectedShip.armorMax)} 
                <button onClick={() => manage.repairShip(planet, this.state.selectedShip)}
                        disabled={this.canRepair(planet, this.state.selectedShip)}
                >Repair</button> 
                 Cost {Math.floor(this.state.selectedShip.armorMax - this.state.selectedShip.armor)} titanium
              </div>
              <div className='item-attr'><b>Resources</b> Max:{Math.floor(this.state.selectedShip.resourcesMax)}</div>
              <div className='item-attr'><b>Equip</b> Max:{this.state.selectedShip.equipMax}
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


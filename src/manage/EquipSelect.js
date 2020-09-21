import React from 'react';
import { c } from '../functions';
import lodash from 'lodash';
import './EquipSelect.css';

export const EMPTY_ID = "";

export class EquipSelect extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = {};
  }

  changeEquip(planet, ship, oldEquip, event) {
    // Add old equip to the planet
    if (oldEquip) {
      planet.equip.push(oldEquip);
      this.removeEquip(ship, oldEquip);
    } 
    // Remove newEquip from planet
    let newEquip = lodash.remove(planet.equip, (e) => e.id === event.target.value)[0];

    if (newEquip) {
      // Add new equip to the ship
      if (!oldEquip) {
        ship.equip.push(newEquip);
      } else {
        let oldEquipIndex = lodash.findIndex(ship.equip, {id: oldEquip.id});  
        if (oldEquipIndex >= 0) {
          // Replace oldEquip with newEquip
          ship.equip.splice(oldEquipIndex,1, newEquip);
        } else {
          console.warn("index "+oldEquipIndex+" Could not find oldEquip ", oldEquip, "on ship ",ship);
        }
      }
      this.addEquip(ship, newEquip);
    } else {
      // Remove the oldEquip from the ship (no new equipment added)
      lodash.remove(ship.equip, (e) => e.id === oldEquip.id);
    }
  }

  addEquip(ship, newEquip) {
    if (newEquip.type === c.EQUIP_TYPE_ARMOR) {
      // Only add armor if the ship is in full repair
      if (ship.armor === ship.armorMax) {
        ship.armor += newEquip.armorAmt;
      }
      ship.armorMax += newEquip.armorAmt;
    } else if (newEquip.type === c.EQUIP_TYPE_STORAGE) {
      ship.resourcesMax += newEquip.storageAmount;
    }
  }

  removeEquip(ship, oldEquip) {
    if (oldEquip.type === c.EQUIP_TYPE_ARMOR) {
      ship.armorMax -= oldEquip.armorAmt;
      if (ship.armor > ship.armorMax) {
        ship.armor = ship.armorMax;
      }
    } else if (oldEquip.type === c.EQUIP_TYPE_STORAGE) {
      ship.resourcesMax -= oldEquip.storageAmount;
      let shipResources = ship.resources.titanium + ship.resources.gold + ship.resources.uranium;
      if (shipResources > ship.resourcesMax) {
        let owing = this.removeResource(ship, 'titanium', (shipResources - ship.resourcesMax));
        if (owing > 0) {
          owing = this.removeResource(ship, 'gold', owing);
        }
        if (owing > 0) {
          owing = this.removeResource(ship, 'uranium', owing);
        }
        if (owing > 0) {
          console.warn("Cannot remove more resources from ship still owing "+owing);
        }
      }
    }
  }

  /**
   * Removes the resource from the ship
   * @return the amount still owing after removing
   */
  removeResource(ship, resourceType, amount) {
    ship.resources[resourceType] -= amount;
    if (ship.resources[resourceType] < 0) {
      let owing = Math.abs(ship.resources[resourceType]);
      ship.resources[resourceType] = 0;
      return owing;
    }
    return 0;
  }

  render() {
    let selectedOption = !this.props.equip ? null : 
     <option key={'selectedequip'} value={this.props.equip.id}>{this.props.equip.name} ({this.props.equip.id})</option>;

    return (
      <span> 
        <select value={this.props.equip ? this.props.equip.id : EMPTY_ID} 
                onChange={(event) => this.changeEquip(this.props.planet, this.props.ship, this.props.equip, event)}>
          <option key='none' value="none">Choose...</option>
          {selectedOption}
          {this.props.planet.equip.map((equip, i) => {
            return <option key={'equip-'+i} value={equip.id}>{equip.name} ({equip.id})</option>
          })}
        </select>                
      </span>
    );
  }
}


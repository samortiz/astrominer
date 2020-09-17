import React from 'react';
import { c, manage, game } from '../functions';
import './ManageStorage.css';

export class ManageStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedShip:null};
  }

  viewShip(ship) {
    this.setState({selectedShip:ship});
    console.log("Viewing ship "+ship.name);
  }

  startUsingShip() {
    manage.switchToShip(this.state.selectedShip, window.world.selectedPlanet);    
    this.setState({selectedShip:null});
  }

  render() {
    let world = window.world;
    let planet = world.selectedPlanet;

    return (
      <div className='storage-section'> 
      <div className='ship-title'>Ships</div>
       <span className='ship-list'>
          {planet.ships.map((ship, i) => {
            return <div key={i} 
                        onClick={() => this.viewShip(ship)} 
                        className={`ship ${this.state.selectedShip===ship ? 'selected-ship' : 'non-selected-ship'}`} >{ship.name}</div>
          })}
        </span>
        <span className='ship-details'>
          { this.state.selectedShip != null && // exclude this block if no ship selected
           <div>
             <div className='ship-attr'><b>Name</b> {this.state.selectedShip.name}</div>
             <div className='ship-attr'><b>Engine</b> Propulsion:{Math.floor(this.state.selectedShip.propulsion*100)} Turn:{Math.floor(this.state.selectedShip.turnSpeed*100)}</div>
             <div className='ship-attr'><b>Landing</b> Speed:{Math.floor(this.state.selectedShip.crashSpeed)} Angle:{Math.floor(this.state.selectedShip.crashAngle*10)}</div>
             <div className='ship-attr'><b>Armor</b> {Math.floor(this.state.selectedShip.armor)} of {Math.floor(this.state.selectedShip.armorMax)}</div>
             <div className='ship-attr'><b>Equip</b> Max:{this.state.selectedShip.equipMax}</div>
             <div className='ship-attr'><b>Resources</b> Max:{Math.floor(this.state.selectedShip.resourcesMax)}</div>
             <div className='button-row'>
             <button onClick={() => this.startUsingShip()}>Use Ship</button>
             </div>
           </div>
          }
        </span>
      </div>);
  }
}


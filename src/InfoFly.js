import React from 'react';
import './InfoFly.css';

export class InfoFly extends React.Component {

  render() {
    let world = window.world;
    return (
    <div className='section'>
      <div>Ship</div>
      <div>Armor {Math.floor(world.ship.armor)} / {world.ship.armorMax} </div>
      <div>Equip (max {world.ship.equipMax})
        {world.ship.equip.map((equip, i) => {
          return <span key={i} className='equip'>{equip.name}</span>
        })}
      </div>
      <div className='section'>Resources</div>
      <div> Titatium {Math.floor(world.ship.resources.titanium)}</div>
      <div> Gold {Math.floor(world.ship.resources.gold)}</div>
      <div> Uranium {Math.floor(world.ship.resources.uranium)}</div>
    </div>
    );
  }
}


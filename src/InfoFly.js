import React from 'react';
import { c, manage, game } from './functions';
import './InfoPanel.css';

export class InfoFly extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let world = window.world;
    return (
    <div className='ship-info'>
      <div>Ship</div>
      <div className='resource-list'>Resources</div>
      <div> Titatium {world.ship.resources.titanium}</div>
      <div> Gold {world.ship.resources.gold}</div>
      <div> Uranium {world.ship.resources.uranium}</div>
    </div>
    );
  }
}

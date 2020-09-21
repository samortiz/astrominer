import React from 'react';
import { c, manage, game} from '../functions';
import './FactoryButton.css';

export class FactoryButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  build(template) {
    if (template.objType === c.OBJ_SHIP) {
      manage.buildShip(this.props.template);
    } else if (template.objType === c.OBJ_EQUIP) {
      manage.buildEquip(this.props.template);
    }
  }

  render() {
    let world = window.world;
    let planet = world.selectedPlanet;
    let ship = world.ship;
    
    return (
      <div className='build-button'>
        <button 
          disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, this.props.template.cost)} 
          onClick={() => this.build(this.props.template)}>{this.props.template.name}</button>
          <span className='cost'>Cost: T:{this.props.template.cost.titanium} G:{this.props.template.cost.gold} U:{this.props.template.cost.uranium}</span>
      </div>);
  }
}


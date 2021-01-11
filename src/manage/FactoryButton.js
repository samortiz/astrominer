import React from 'react';
import { c, manage, game} from '../functions';
import './FactoryButton.css';

export function FactoryButton({template}) {
  let world = window.world;
  let planet = world.selectedPlanet;
  let ship = world.ship;

  function build(templateArg) {
    if (templateArg.objType === c.OBJ_SHIP) {
      manage.buildShip(templateArg);
    } else if (templateArg.objType === c.OBJ_EQUIP) {
      manage.buildEquip(templateArg);
    }
  }

  return (
    <div className='build-button'>
      <button
        disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, template.cost)}
        onClick={() => build(template)}>{template.name}</button>
        <span className='cost'>Cost: T:{template.cost.titanium} G:{template.cost.gold} U:{template.cost.uranium}</span>
    </div>);
};


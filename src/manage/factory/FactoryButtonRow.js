import React from 'react';
import { c, manage, game} from '../../functions';
import './FactoryButtonRow.css';

export function FactoryButtonRow({template}) {
  const world = window.world;
  const planet = world.selectedPlanet;
  const ship = world.ship;
  let existingInventory = (template.objType === c.OBJ_SHIP) ?
    planet.ships.filter(s=> s.name === template.name).length:
    planet.equip.filter(e=> e.name === template.name).length;

  // We pretend the current ship is in storage in the planet
  if (ship.alive && template.name === ship.name) {
    existingInventory += 1;
  }

  function build(templateArg) {
    if (templateArg.objType === c.OBJ_SHIP) {
      manage.buildShip(templateArg);
    } else if (templateArg.objType === c.OBJ_EQUIP) {
      manage.buildEquip(templateArg);
    }
  }

  return (
    <tr>
      <td>
        {existingInventory}
      </td>
      <td>
      <button className="factory-button"
        disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, template.cost)}
        onClick={() => build(template)}>{template.name}</button>
      </td>
      <td>
        <span className='cost'>{template.cost.titanium}T {template.cost.gold}G {template.cost.uranium}U</span>
      </td>
    </tr>);
};


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

  // Calculate the description
  let description = template.description;
  if (!description && template.damage) {
    description = `${Math.round(template.damage * (60 / template.coolTime))} dmg/s Range ${template.speed * template.lifetime} Speed ${template.speed} `;
  }
  if (!description && template.shield) {
    const shield = template.shield;
    description = `${shield.armorMax}dmg for ${Math.round(shield.lifetimeMax/60)}s every ${Math.round(template.coolTime/60)}s`;
  }
  if (template.createShip) {
    const newShip = template.createShip.type;
    description += ` Cost (${newShip.cost.titanium}T ${newShip.cost.gold}G ${newShip.cost.uranium}U)`;
  }

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
      <td className="factory-row">
        {existingInventory}
      </td>
      <td className="factory-row">
      <button className="factory-button"
        disabled={!manage.hasFactory(planet) || !game.canAfford(planet, ship, template.cost)}
        onClick={() => build(template)}>{template.name}</button>
      </td>
      <td className="factory-row">
        <span className='cost'>{template.cost.titanium}T {template.cost.gold}G {template.cost.uranium}U</span>
      </td>
      <td className="factory-row">
        {description}
      </td>
    </tr>);
}


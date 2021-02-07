import React from 'react';
import {c, fly} from '../functions';
import './InfoFly.css';
import {HEATBAR, Heatbar} from "./Heatbar";
import {PushButton} from "./PushButton";
import {StatusButton} from "./StatusButton";

export function InfoFly() {
  const ship = window.world.ship;
  const shield = fly.getEquippedShield(ship);

  return (
    <div className='section'
         style={{backgroundImage: 'url("images/metalbackground.png")', backgroundSize: 'cover', height: '100%'}}>
      <div>{ship.name}</div>

      <table>
        <thead>
        <tr>
          <th style={{paddingRight: '10px'}}>Armor</th>
          <th>Shield</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td style={{textAlign: 'center'}}>
            <Heatbar type={HEATBAR.COLOR} curr={ship.armor} max={ship.armorMax}/>
          </td>
          <td>
            {shield && shield.shield.active &&
            <span>
                <Heatbar type={HEATBAR.RED} curr={shield.shield.lifetime} max={shield.shield.lifetimeMax}/>
                <Heatbar type={HEATBAR.COLOR} curr={shield.shield.armor} max={shield.shield.armorMax}/>
              </span>
            }
          </td>
        </tr>
        <tr>
          <td>
            {Math.floor(ship.armor)} / {ship.armorMax}
          </td>
          <td></td>
          <td></td>
        </tr>
        </tbody>
      </table>

      <div className='section'>Equip (max {ship.equipMax})
        <table>
          <tbody>
          {ship.equip.map((equip, i) => {
            return <tr key={i} className='equip'>
              <td>
                {equip.type === c.EQUIP_TYPE_SECONDARY_WEAPON &&
                <PushButton selected={i === ship.selectedSecondaryWeaponIndex} onChange={() => {
                  ship.selectedSecondaryWeaponIndex = i;
                }}/>}
              </td>
              <td>
                <StatusButton curr={equip.coolTime - equip.cool} max={equip.coolTime}/>
              </td>
              <td>
                {equip.name}
              </td>
            </tr>
          })}
          </tbody>
        </table>
      </div>

      <div className='section'>
        <table>
          <tbody>
          <tr>
            <td className='bluescreen-container'>
              <div className='bluescreen-background'>
                <img src='images/blue_screen.png' className='stretch'/>
              </div>
              <div className='bluescreen-text'>
                <table cellPadding='4'>
                  <thead>
                  <tr>
                    <th colSpan='100%'>Resources</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Titatium</td>
                    <td>{Math.floor(ship.resources.titanium)}</td>
                  </tr>
                  <tr>
                    <td>Gold</td>
                    <td>{Math.floor(ship.resources.gold)}</td>
                  </tr>
                  <tr>
                    <td>Uranium</td>
                    <td>{Math.floor(ship.resources.uranium)}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}



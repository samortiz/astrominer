import React from 'react';
import { c } from '../../functions/';
import './ManageFactory.css';
import {Tab, Tabs} from "react-bootstrap";
import {FactoryTab} from "./FactoryTab";


export function FactoryTabs() {
  const equip = window.world.blueprints.equip;

  const upgrades =  equip.filter((e) => c.EQUIP_UPGRADES.find(u => u.name === e.name));
  const primaryWeapons = equip.filter((e) => c.EQUIP_PRIMARY_WEAPONS.find(p => p.name === e.name));
  const secondaryWeapons = equip.filter((e) => c.EQUIP_SECONDARY_WEAPONS.find(s => s.name === e.name));
  const droids = equip.filter((e) => c.EQUIP_DROIDS.find(d => d.name === e.name));

  return (
    <div className='factory-info'>
      <Tabs defaultActiveKey='ships' id='factory-tabs'>
        <Tab eventKey='ships' title="Ships">
          <FactoryTab type='ship' templateList={window.world.blueprints.ship} />
        </Tab>

        {upgrades && upgrades.length > 0 &&
        <Tab eventKey='upgrades' title="Upgrades">
          <FactoryTab type='equip' templateList={upgrades} />
        </Tab>
        }

        {primaryWeapons && primaryWeapons.length > 0 &&
        <Tab eventKey='primaryWeapons' title="Primary Weapons">
          <FactoryTab type='equip' templateList={primaryWeapons} />
        </Tab>
        }

        {secondaryWeapons && secondaryWeapons.length > 0 &&
        <Tab eventKey='secondaryWeapons' title="Secondary Weapons">
          <FactoryTab type='equip' templateList={secondaryWeapons} />
        </Tab>
        }

        {droids && droids.length > 0 &&
        <Tab eventKey='droids' title="Droids">
          <FactoryTab type='equip' templateList={droids} />
        </Tab>
        }

      </Tabs>
    </div>);
}


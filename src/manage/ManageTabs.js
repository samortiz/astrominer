import React, {useState} from 'react';
import { ManagePlanet } from './ManagePlanet';
import './ManageTabs.css';
import { ManageFactory } from './ManageFactory';
import { ManageStorage } from './ManageStorage';
import {ManageSystem} from "./ManageSystem";

export function ManageTabs() {
  const TAB_PLANET = 'planet';
  const TAB_FACTORY = 'factory';
  const TAB_STORAGE = 'storage';
  const TAB_SYSTEM = 'system';
  const TABS = [
    { key: TAB_PLANET, name: 'Planet', obj: <ManagePlanet/> },
    { key: TAB_FACTORY, name: 'Factory', obj: <ManageFactory/> },
    { key: TAB_STORAGE, name: 'Storage', obj: <ManageStorage/> },
    { key: TAB_SYSTEM, name: 'System', obj: <ManageSystem/> },
  ];
  const [selectedTab, setSelectedTab] = useState(TAB_PLANET);


  return (
    <div className='tab-set'>
      {TABS.map(tab =>
        <span key={tab.key} className={`tab ${selectedTab === tab.key ? 'active-tab' : 'non-active-tab'}`}
              onClick={() => setSelectedTab(tab.key)}
        >{tab.name}</span>
      )}
      {TABS.map(tab =>
        <div key={tab.key} className={`tab-body ${selectedTab === tab.key ? '' : 'tab-hidden'}`}>
          {tab.obj}
        </div>
      )}
    </div>);
}


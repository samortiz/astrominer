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

  function getTabBody(key) {
    if (key === TAB_PLANET) {
      return <ManagePlanet/>;
    } else if (key === TAB_FACTORY) {
      return <ManageFactory/>;
    } else if (key === TAB_STORAGE) {
      return <ManageStorage/>;
    } else if (key === TAB_SYSTEM) {
      return <ManageSystem/>;
    }
  }

  const TABS = [
    { key: TAB_PLANET, name: 'Planet'},
    { key: TAB_FACTORY, name: 'Factory'},
    { key: TAB_STORAGE, name: 'Storage'},
    { key: TAB_SYSTEM, name: 'System'},
  ];
  const [selectedTab, setSelectedTab] = useState(TAB_PLANET);


  return (
    <div className='tab-set'>
      {TABS.map(tab =>
        <span key={tab.key} className={`tab ${selectedTab === tab.key ? 'active-tab' : 'non-active-tab'}`}
              onClick={() => setSelectedTab(tab.key)}
        >{tab.name}</span>
      )}
      <div className='tab-body'>
        {getTabBody(selectedTab)}
      </div>
    </div>);
}


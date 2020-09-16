import React from 'react';
import { ManagePlanet } from './ManagePlanet';
import './ManageTabs.css';
import { ManageFactory } from './ManageFactory';
import { ManageStorage } from './ManageStorage';

export class ManageTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {activeTab:'planet'};
  }

  isActive() {
    return 'active-tab';
  }

  render() {
    return (
      <div className='tab-set'>
        <span className={`tab ${this.state.activeTab==='planet'?'active-tab':'non-active-tab'}`}
              onClick={() => this.setState({activeTab:'planet'})}
           >Planet</span>
        <span className={`tab ${this.state.activeTab==='factory'?'active-tab':'non-active-tab'}`}
              onClick={() => this.setState({activeTab:'factory'})}
           >Factory</span>
        <span className={`tab ${this.state.activeTab==='storage'?'active-tab':'non-active-tab'}`}
              onClick={() => this.setState({activeTab:'storage'})}
           >Storage</span>
        <div className={`tab-body ${this.state.activeTab==='planet'?'':'tab-hidden'}`}>
          <ManagePlanet/> 
        </div>
        <div className={`tab-body ${this.state.activeTab==='factory'?'':'tab-hidden'}`}>
          <ManageFactory/> 
        </div>
        <div className={`tab-body ${this.state.activeTab==='storage'?'':'tab-hidden'}`}>
          <ManageStorage/> 
        </div>

      </div>);
  }
}


import React from 'react';
import { c } from './functions';
import './InfoPanel.css';
import { InfoFly } from './InfoFly';
import { ManageTabs } from './manage/ManageTabs';

export class InfoPanel extends React.Component {
  render() {
    let world = window.world;
    if (world.gameState === c.GAME_STATE.MANAGE) {
      return (<ManageTabs/>);
    } else if (world.gameState === c.GAME_STATE.FLY) {
      return (<InfoFly/>);
    }
    return (<div>...</div>);
  }
}


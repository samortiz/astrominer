import React from 'react';
import { c } from './functions';
import './InfoPanel.css';
import { InfoManage } from './InfoManage';
import { InfoFly } from './InfoFly';

export class InfoPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let world = window.world;
    if (world.gameState === c.GAME_STATE.MANAGE) {
      return (<InfoManage/>);
    } else if (world.gameState === c.GAME_STATE.FLY) {
      return (<InfoFly/>);
    }
    return (<div>...</div>);
  }
}


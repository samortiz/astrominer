import React from 'react';
import './ManageFactory.css';
import { FactoryButton } from './FactoryButton';

export class ManageFactory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className='factory-info'> 
        <div className='title'> Ships </div>
        <div className='build-ship'>
        {window.world.blueprints.ship.map((shipTemplate, i) => {
          return <FactoryButton key={'ship'+i} template={shipTemplate} />;
        })}
        </div>

        <div className='title'> Equipment </div>
        <div className='build-equip'>
        {window.world.blueprints.equip.map((equipTemplate, i) => {
          return <FactoryButton key={'equip'+i} template={equipTemplate} />;
        })}
        </div>
      </div>);
  }
}


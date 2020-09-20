import React from 'react';
import { c, manage, game } from '../functions';
import './ManageFactory.css';
import { FactoryButton } from './FactoryButton';

export class ManageFactory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedType:'ship'};
  }

  render() {
    return (
      <div className='factory-info'> 
        <div className='build-ship'>
          <FactoryButton type='ship' template={c.SHIP_CARGO} name='Cargo'/>
          <FactoryButton type='ship' template={c.SHIP_EXPLORER} name='Explorer'/>
          <FactoryButton type='ship' template={c.SHIP_FAST} name='Fast'/>
          <FactoryButton type='ship' template={c.SHIP_HEAVY} name='Heavy'/>
          <FactoryButton type='ship' template={c.SHIP_FIGHTER} name='Fighter'/>
        </div>

        <div className='build-equip'>
          <FactoryButton type='equip' template={c.EQUIP_BRAKE} name='Brake'/>
          <FactoryButton type='equip' template={c.EQUIP_BLASTER} name='Blaster'/>
          <FactoryButton type='equip' template={c.EQUIP_FAST_BLASTER} name='Fast Blaster'/>
          <FactoryButton type='equip' template={c.EQUIP_STREAM_BLASTER} name='Stream Blaster'/>
          <FactoryButton type='equip' template={c.EQUIP_THRUSTER} name='Thruster'/>
          <FactoryButton type='equip' template={c.EQUIP_R2D2} name='R2D2'/>
          <FactoryButton type='equip' template={c.EQUIP_ALIEN_BLASTER} name='Alien Blaster'/>
        </div>

      </div>);
  }
}


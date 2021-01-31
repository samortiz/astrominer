import React from 'react';
import { c } from '../../functions/';
import './FactoryTab.css';
import {FactoryButton} from "./FactoryButton";

export function FactoryTab({type, templateList}) {
  return (
    <div  className='container factory-tab' style={{maxHeight: (c.SCREEN_HEIGHT - 200)}}>
      {templateList.map((template, i) => {
        return <FactoryButton key={type+i} template={template} />;
      })}
    </div>);
}


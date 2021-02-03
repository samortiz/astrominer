import React from 'react';
import './Heatbar.css';

const IMG_HEIGHT = 100;
const IMG_WIDTH = 24;

export const HEATBAR = {
  GREEN : 'heatbar-green.png',
  RED: 'heatbar-red.png',
  COLOR: 'heatbar-color.png'
};

export function Heatbar({type, curr, max}) {
  if (type !== HEATBAR.GREEN &&
    type !== HEATBAR.RED &&
    type !== HEATBAR.COLOR) {
    console.warn('unknown heatbar type '+type);
    return <span />;
  }

  const pct = curr / max;
  const topFree = 100 - (pct * IMG_HEIGHT );

  // Use red or green as the base
  let colorImgSrc = 'images/'+(type === HEATBAR.RED ? HEATBAR.RED : HEATBAR.GREEN);

  // Multicolor is based off green
  if (type === HEATBAR.COLOR && (topFree > 60)) {
    colorImgSrc = 'images/heatbar-color.png'
  }

  return (
    <span className='heatbar-container' style={{width:IMG_WIDTH+'px',  height:IMG_HEIGHT+'px'}}>
      <span className='heatbar-base'>
        <img src='images/heatbar-base.png' width={IMG_WIDTH+'px'} height={IMG_HEIGHT+'px'} alt='heat' />
      </span>
      <span className='heatbar-color'>
        <img src={colorImgSrc} width={IMG_WIDTH+'px'} height={IMG_HEIGHT+'px'} alt='heat' style={{
          clipPath: 'inset('+topFree+'px 0px 00px 0px)'
        }}
        />
      </span>
    </span>);
}


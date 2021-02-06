import React from 'react';
import './StatusButton.css';

const IMG_HEIGHT = 24;
const IMG_WIDTH = 48;
// pct at which red turns into yellow
const YELLOW_PCT = 0.7; // pct to change to yellow at
const BORDER = 5; // width of button border (non drawing part of button)

const BUTTON = {
  GREEN: 'button_long_green.png',
  RED: 'button_long_red.png',
  YELLOW: 'button_long_yellow.png',
  BLACK: 'button_long_black.png'
};

function getStatus(curr, max) {
  if (!max || max <= 0) {
    return {rightFree: 0, colorImgSrc: 'images/' + BUTTON.BLACK};
  }
  if (curr >= max) {
    return {rightFree: 0, colorImgSrc: 'images/' + BUTTON.GREEN};
  }
  // Red
  if (curr / max < YELLOW_PCT) {
    const pct = curr / (max * YELLOW_PCT);
    const rightFree = IMG_WIDTH - (BORDER + pct * (IMG_WIDTH - (2 * BORDER)));
    return {rightFree, colorImgSrc: 'images/' + BUTTON.RED};
  }
  // Yellow
  const pct = (curr - (max * YELLOW_PCT)) / (max * (1 - YELLOW_PCT));
  const rightFree = IMG_WIDTH - (BORDER + pct * (IMG_WIDTH - (2 * BORDER)));
  return {rightFree, colorImgSrc: 'images/' + BUTTON.YELLOW};
}


export function StatusButton({curr, max}) {

  const {rightFree, colorImgSrc} = getStatus(curr, max);

  return (
    <span className='statusbutton-container' style={{width: IMG_WIDTH + 'px', height: IMG_HEIGHT + 'px'}}>
      <span className='statusbutton-base'>
        <img src={'images/' + BUTTON.BLACK} width={IMG_WIDTH + 'px'} height={IMG_HEIGHT + 'px'} alt='status'/>
      </span>
      <span className='statusbutton-color'>
        <img src={colorImgSrc} width={IMG_WIDTH + 'px'} height={IMG_HEIGHT + 'px'} alt='heat' style={{
          clipPath: 'inset(0px ' + rightFree + 'px 0px 0px)'
        }}
        />
      </span>
    </span>);
}


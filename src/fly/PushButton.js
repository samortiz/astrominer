import React from 'react';
import './PushButton.css';

const IMG_HEIGHT = 26;
const IMG_WIDTH = 44;

export function PushButton({selected, onChange}) {
  const imgFile = selected ? 'images/button_push_on.png' : 'images/button_push_off.png';
  return (
    <img src={imgFile} width={IMG_WIDTH + 'px'} height={IMG_HEIGHT + 'px'} alt='button' onClick={() => {
      onChange();
    }}/>
  );
}

import React, {Fragment, useState} from 'react';
import './CodeEntry.css';

export function CodeEntry() {
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const planet = window.world.selectedPlanet;
  const ship = window.world.ship;
  const shipOnPlanet = ((planet === window.world.lastPlanetLanded) && ship.alive);
  const onCenterPlanet = shipOnPlanet && (planet?.id === 100);

  const [steep, setSteep] = useState('');
  const [heap, setHeap] = useState('');
  const [deep, setDeep] = useState('');
  const [steepOk, setSteepOk] = useState('');
  const [heapOk, setHeapOk] = useState('');
  const [deepOk, setDeepOk] = useState('');
  const codesAllGood = steepOk === 'good' && heapOk === 'good' && deepOk === 'good'


  function submitCodes() {
    setSteepOk((steep.toUpperCase() === 'H2401') ? 'good' : 'wrong');
    setHeapOk((heap === '4194304') ? 'good' : 'wrong');
    setDeepOk((deep === '2187') ? 'good' : 'wrong');
  }

  return (
      <Fragment>
        {onCenterPlanet &&
        <div className='system-section code-section'>
          <button type='button' onClick={() => setShowCodeEntry(true)}> Enter Codes</button>

          <div className="code-dialog" style={{display: showCodeEntry ? "block" : "none"}}>
            <span className="close-code-dialog" onClick={() => setShowCodeEntry(false)}>X</span>
            <div className='code-title code-center'>Code Entry</div>
            <div className='code-text'>
              Enter the calculated values for codes you have found here.
            </div>
            <div className='code-input'>
              The Steep
              <input type='text' value={steep} onChange={e => setSteep(e.target.value)}/>
              {steepOk === 'good' && <span className='code-good'>GOOD</span>}
              {steepOk === 'wrong' && <span className='code-wrong'>WRONG</span>}
            </div>
            <div className='code-input'>
              The Heap
              <input type='text' value={heap} onChange={e => setHeap(e.target.value)}/>
              {heapOk === 'good' && <span className='code-good'>GOOD</span>}
              {heapOk === 'wrong' && <span className='code-wrong'>WRONG</span>}
            </div>
            <div className='code-input'>
              The Deep
              <input type='text' value={deep} onChange={e => setDeep(e.target.value)}/>
              {deepOk === 'good' && <span className='code-good'>GOOD</span>}
              {deepOk === 'wrong' && <span className='code-wrong'>WRONG</span>}
            </div>

            {!codesAllGood &&
            <div className='code-submit'>
              <button type='button' onClick={() => submitCodes()}>Check Codes</button>
            </div>
            }

            {codesAllGood &&
            <div className='code-answer'>
              <b>Congratulations</b>, you have found all the codes! <br/>
              The treasure is almost yours.<br/>
              Go to the thinking rock at <a href='https://goo.gl/maps/Bkh6o5eDeKKaC7ey9'>44.478953, -63.673837</a> <br/>
              The entrance is 30m east of the thinking rock at the bottom of the cliff.<br/>
              Once you go in the entrance follow the hallway until you get to the hard right turn and then look in the cellar.<br/>
            </div>
            }
          </div>
        </div>
        }
      </Fragment>
  );
}


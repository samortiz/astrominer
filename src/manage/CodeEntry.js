import React, {Fragment, useState} from 'react';
import './CodeEntry.css';

export function CodeEntry() {
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const onCenterPlanet = window.world?.selectedPlanet?.x < 10 && window.world?.selectedPlanet?.y < 10;
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
    setDeepOk((deep === '3187') ? 'good' : 'wrong');
  }

  return (
      <Fragment>
        {onCenterPlanet &&
        <div className='system-section'>
          <button type='button' onClick={() => setShowCodeEntry(true)}> Enter Codes</button>
          <div className="code-dialog" style={{display: showCodeEntry ? "block" : "none"}}>
            <span className="close-code-dialog" onClick={() => setShowCodeEntry(false)}>X</span>
            <div className='code-title code-center'>Code Entry</div>
            <div className='code-text'>
              Enter the codes you have found here. You may have to do a little math as they were shortened.
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
              Congratulations, you have found all the codes! <br/>
              The treasure is hidden at 44.625491, -63.642425
            </div>
            }
          </div>
        </div>
        }
      </Fragment>
  );
}


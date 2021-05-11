import React from 'react';
import {c} from '../functions';
import './ManageLog.css';

export function ManageLog() {
  const xp = window.world.blueprints.xp;

  const gameTickCount = window.world.gameTickCount;
  let timeSpentMin = Math.floor((gameTickCount / 360))/10;
  let timeSpentHr = 0;
  if (timeSpentMin > 60) {
    timeSpentHr = Math.floor(timeSpentMin / 60);
    timeSpentMin = Math.floor(timeSpentMin - (timeSpentHr * 60));
  }

  const translations = {
    [c.PLANET_ROCK_FILE]: 'Rock Planet',
    [c.PLANET_RED_FILE]: 'Red Planet',
    [c.PLANET_GREEN_FILE]: 'Green Planet',
    [c.PLANET_PURPLE_FILE]: 'Purple Planet',
  }

  return (
    <div>
      <div className='system-section'>
        <div className='section'><b>Experience Log</b></div>
        <div>
          <table className="log-table">
            <tbody>
            {Object.entries(xp).map((entry) => {
              const [key, value] = entry;
              if (value) {
                return <tr key={key}>
                  <td><b>{translations[key] || key}</b></td>
                  <td>{Math.round(value)}</td>
                </tr>;
              }
              return <tr key={key}/>;
              })}
            </tbody>
          </table>
          <div className="tick-count">
            Total time spent : {timeSpentHr ? timeSpentHr + ' hour'+(timeSpentHr > 1 ? 's ': ' ') : ''} {timeSpentMin} min
          </div>
        </div>
      </div>
    </div>
  );
}


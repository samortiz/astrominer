import React from 'react';
import {c} from '../functions';
import './ManageLog.css';

export function ManageLog() {
  const xp = window.world.blueprints.xp;

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
        </div>
      </div>
    </div>
  );
}


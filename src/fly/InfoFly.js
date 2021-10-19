import React from 'react';
import {c, fly} from '../functions';
import './InfoFly.css';
import {HEATBAR, Heatbar} from "./Heatbar";
import {PushButton} from "./PushButton";
import {StatusButton} from "./StatusButton";

export function InfoFly() {
  const ship = window.world.ship;
  const shield = fly.getEquippedShield(ship);

  function closeIntroDialog() {
    window.world.introDialogShown = true;
  }

  function buttonDown(dir) {
    window.world.system.buttonKeyDown[dir] = true;
  }

  function buttonUp(dir) {
    window.world.system.buttonKeyDown[dir] = false;
  }

  function killContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  return (
    <div className='section'
         style={{backgroundImage: 'url("images/metalbackground.png")', backgroundSize: 'cover', height: '100%', paddingLeft:'3px'}}>

      <div className='top-row'>
        <div>
          <div>{ship.name}</div>
          <table>
            <thead>
            <tr>
              <th style={{paddingRight: '10px'}}>Armor</th>
              <th>Shield</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td style={{textAlign: 'center'}}>
                <Heatbar type={HEATBAR.COLOR} curr={ship.armor} max={ship.armorMax}/>
              </td>
              <td>
                {shield && shield.shield.active &&
                <span>
                    <Heatbar type={HEATBAR.RED} curr={shield.shield.lifetime} max={shield.shield.lifetimeMax}/>
                    <Heatbar type={HEATBAR.COLOR} curr={shield.shield.armor} max={shield.shield.armorMax}/>
                  </span>
                }
              </td>
            </tr>
            <tr>
              <td>
                {Math.floor(ship.armor)} / {ship.armorMax}
              </td>
              <td> </td>
              <td> </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div className='bluescreen-container'>
          <div className='bluescreen-background'>
            <img src='images/blue_screen.png' className='stretch' alt='bluescreen'/>
          </div>
          <div className='bluescreen-text'>
            <table cellPadding='4'>
              <thead>
              <tr>
                <th colSpan='100%'>Resources</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>Titatium</td>
                <td>{Math.floor(ship.resources.titanium)}</td>
              </tr>
              <tr>
                <td>Gold</td>
                <td>{Math.floor(ship.resources.gold)}</td>
              </tr>
              <tr>
                <td>Uranium</td>
                <td>{Math.floor(ship.resources.uranium)}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <table>
        <tbody>
        <tr>
          <td>
            <div>
              <b>Equip (max {ship.equipMax})</b>
            </div>
            <table>
              <tbody>
              {ship.equip.map((equip, i) => {
                return <tr key={i} className='equip'>
                  <td>
                    {equip.type === c.EQUIP_TYPE_SECONDARY_WEAPON &&
                    <PushButton selected={i === ship.selectedSecondaryWeaponIndex} onChange={() => {
                      ship.selectedSecondaryWeaponIndex = i;
                    }}/>}
                  </td>
                  <td>
                    <StatusButton curr={equip.coolTime - equip.cool} max={equip.coolTime}/>
                  </td>
                  <td>
                    {equip.name}
                  </td>
                </tr>
              })}
              </tbody>
            </table>
          </td>
          <td style={{paddingLeft:'10px'}}> </td>
        </tr>
        </tbody>
      </table>

      <div className="button-control-container">
        <div className="space">
          <button type='button' onMouseDown={() => buttonDown('space')} onMouseUp={() => buttonUp('space')}
                                onTouchStart={() => buttonDown('space')} onTouchEnd={() => buttonUp('space')}
                                onContextMenu={(event) => killContextMenu(event)}>
            <i className="fa fa-crosshairs"> </i>
          </button>
        </div>
        <table>
          <tbody>
          <tr>
            <td> </td>
            <td>
              <button type='button' onMouseDown={() => buttonDown('up')} onMouseUp={() => buttonUp('up')}
                                      onTouchStart={() => buttonDown('up')} onTouchEnd={() => buttonUp('up')}
                                      onContextMenu={(event) => killContextMenu(event)}>
                <i className="fa fa-arrow-up"> </i>
              </button>
            </td>
            <td> </td>
          </tr>
          <tr>
            <td>
              <button type='button' onMouseDown={() => buttonDown('left')} onMouseUp={() => buttonUp('left')}
                                      onTouchStart={() => buttonDown('left')} onTouchEnd={() => buttonUp('left')}
                                      onContextMenu={(event) => killContextMenu(event)}>
                <i className="fa fa-arrow-left"> </i>
              </button>
            </td>
            <td>
              <button type='button' onMouseDown={() => buttonDown('down')} onMouseUp={() => buttonUp('down')}
                                      onTouchStart={() => buttonDown('down')} onTouchEnd={() => buttonUp('down')}
                                      onContextMenu={(event) => killContextMenu(event)}>
                <i className="fa fa-arrow-down"> </i>
              </button>
            </td>
            <td>
              <button type='button' onMouseDown={() => buttonDown('right')} onMouseUp={() => buttonUp('right')}
                                      onTouchStart={() => buttonDown('right')} onTouchEnd={() => buttonUp('right')}
                                      onContextMenu={(event) => killContextMenu(event)}>
                <i className="fa fa-arrow-right"> </i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div className="intro-dialog" onClick={() => closeIntroDialog()} style={{display: window.world.introDialogShown ? "none": "block"}}>
        <span className="close-intro-dialog">X</span>
        <p>Ship's Log: Day 348</p>
        <p> After a long trip through deep space, I have finally made it to the edge of the asteroid field that until now I wasn't certain actually existed.
          We will see if it lives up to the rumors from old men in taverns of asteroids full of titanium, gold and uranium, a place where a man can make
          a fortune mining.  So it really does exist, but where are all the other people who came to make their fortune? This place looks empty.</p>
        <p>It took years to save up enough to get this Explorer-class spaceship, and I outfitted it with a state-of-the-art AI which can build
          autonomous mines to extract resources. It can also create fully automated factories to produce ships and equipment. The AI can learn new patterns
          for the factories to build by being exposed to various different environments and equipment.  I have heard a lot about the power of this AI and
           can't wait to try it out.</p>
        <p>The first step is to find a planet with a good amount of resources and build a mine. I will have to be careful landing the ship though,
          as the ship must be going slow enough and land on it's landing gear or it will be damaged.</p>
        <p> Use the arrow keys or W-A-S-D keys to move the ship, and the spacebar to shoot. X will deploy a secondary weapon.</p>
      </div>

    </div>
  );
}



import React, {useRef} from 'react';
import {c, savegame} from '../functions';
import './ManageSystem.css';
import lodash from 'lodash';
import {showToast} from "../functions/utils";

export function ManageSystem() {
  const world = window.world;
  const nameInput = useRef();
  let gameNames = savegame.loadLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY);

  function setCurrentGame(newName) {
    nameInput.current.value = newName;
    world.saveGameName = newName;
    console.log('new name ' + newName);
  }

  /**
   * Adds a game name to the list of saved game names.
   */
  function addGameName(newGameName) {
    if (newGameName && !gameNames.includes(newGameName)) {
      gameNames.push(newGameName)
    }
    savegame.saveLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY, gameNames);
  }

  // If no games are saved, setup an empty list of game names
  if (!gameNames) {
    gameNames = [];
    addGameName(null);
  }

  function saveGame() {
    const saveGameName = nameInput.current.value;
    if (!saveGameName) {
      showToast('Cannot save game without name');
      return;
    }
    // Save the world in indexedDB
    savegame.saveWorld(saveGameName);
    // Save the game name in localStorage
    addGameName(saveGameName);
    setCurrentGame(saveGameName);
  }

  function loadGame(gameName) {
    savegame.loadWorld(gameName);
    setCurrentGame(gameName);
  }

  function deleteGame(gameName) {
    if (!window.confirm("Are you sure you want to delete " + gameName + "?")) {
      return;
    }
    savegame.deleteWorld(gameName);
    gameNames = lodash.remove(gameNames, (name) => name !== gameName);
    savegame.saveLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY, gameNames);
    if (world.saveGameName === gameName) {
      world.saveGameName = null;
    }
    if (nameInput.current.value === gameName) {
      nameInput.current.value = '';
    }
  }

  return (
    <div style={{paddingLeft:'10px'}}>
      <div className='system-section'>
        <div className='section'><b>Current Game</b></div>
        <input type='text' defaultValue={world.saveGameName} onFocus={() => world.system.isTyping = true}
               onBlur={() => world.system.isTyping = false} ref={nameInput}/>
        <button name="Save" onClick={() => saveGame()}>Save</button>
        <div className='section'><b>Saved Game</b></div>
        {gameNames.map(gameName => (
          <div key={gameName} className={'game-list-row ' + (world.saveGameName === gameName ? 'selected-game' : '')}>
            <span className='game-list-item'><button onClick={() => loadGame(gameName)}>Load </button></span>
            <span className='game-list-item'><button onClick={() => deleteGame(gameName)}>Delete</button></span>
            <span className='game-list-item'>{gameName}</span>
          </div>
        ))}
      </div>
      <div style={{color:"#909090"}}>
        Version {world.appVersion}
        {world.appVersion !== c.APP_VERSION && <span> in {c.APP_VERSION}</span>}
      </div>
    </div>);
}


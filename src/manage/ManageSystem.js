import React, {useRef} from 'react';
import { savegame, c } from '../functions';
import './ManageSystem.css';
import lodash from 'lodash';
import {saveLocalStorage} from "../functions/savegame";

export function ManageSystem() {
  const world = window.world;
  const localStorage = window.localStorage;
  const nameInput = useRef(null);
  //localStorage.clear();
  let gameNames = savegame.loadLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY);

  /**
   * Adds a game name to the list of saved game names.
   */
  function addGameName(newGameName) {
    if (newGameName && !gameNames.includes(newGameName)) {
      gameNames.push(newGameName)
    }
    saveLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY, gameNames);
    world.system.saveGameName = newGameName;
  }

  // If no games are saved, setup an empty list of game names
  if (!gameNames) {
    gameNames = [];
    addGameName(null);
  }

  function saveGame() {
    const saveGameName = nameInput.current.value;
    // Save the game world
    const worldStr = savegame.serializeWorld();
    saveLocalStorage(c.LOCALSTORAGE_GAME_PREFIX+saveGameName, worldStr);
    // Save the game name
    addGameName(saveGameName);
  }

  function loadGame() {

  }

  function deleteGame(gameName) {
    // TODO : confirm
    localStorage.removeItem(c.LOCALSTORAGE_GAME_PREFIX+gameName);
    gameNames = lodash.remove(gameNames, (name) => name !== gameName );
    saveLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY, gameNames);
    if (world.system.saveGameName === gameName) {
      world.system.saveGameName = null;
    }
    if (nameInput.current.value === gameName) {
      nameInput.current.value = '';
    }
  }

  return (
    <div>
      <div className='system-section'>
        <div className='section'><b>Current Game</b></div>
        <input type='text' onFocus={() => world.system.isTyping = true } onBlur={() => world.system.isTyping = false } ref={nameInput} />
        <button name="Save" onClick={() => saveGame() }>Save</button>
        <div className='section'><b>Saved Game</b></div>
        {gameNames.map(gameName => (
          <div key={gameName} className={'game-list-row '+(world.system.saveGameName === gameName ? 'selected-game' : '')}>
            <span className='game-list-item'><button>Load </button></span>
            <span className='game-list-item'><button onClick={() => deleteGame(gameName)}>Delete</button></span>
            <span className='game-list-item'>{gameName}</span>
          </div>
        ))}
      </div>
    </div>);
}


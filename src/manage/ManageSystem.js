import React, {useRef} from 'react';
import { savegame, c } from '../functions';
import './ManageSystem.css';
import lodash from 'lodash';

export function ManageSystem() {
  const world = window.world;
  const nameInput = useRef(null);
  let gameNames = savegame.loadLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY);

  /**
   * Adds a game name to the list of saved game names.
   */
  function addGameName(newGameName) {
    if (newGameName && !gameNames.includes(newGameName)) {
      gameNames.push(newGameName)
    }
    savegame.saveLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY, gameNames);
    world.system.saveGameName = newGameName;
  }

  // If no games are saved, setup an empty list of game names
  if (!gameNames) {
    gameNames = [];
    addGameName(null);
  }

  function saveGame() {
    const saveGameName = nameInput.current.value;
    // Save the world in indexedDB
    savegame.saveWorld(c.DB_GAME_PREFIX+saveGameName);
    // Save the game name in localStorage
    addGameName(saveGameName);
  }

  function deleteGame(gameName) {
    // TODO : confirm
    savegame.deleteWorld(c.DB_GAME_PREFIX+gameName);
    gameNames = lodash.remove(gameNames, (name) => name !== gameName );
    savegame.saveLocalStorage(c.LOCALSTORAGE_GAME_NAMES_KEY, gameNames);
    if (world.saveGameName === gameName) {
      world.saveGameName = null;
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
          <div key={gameName} className={'game-list-row '+(world.saveGameName === gameName ? 'selected-game' : '')}>
            <span className='game-list-item'><button onClick={() => savegame.loadWorld(c.DB_GAME_PREFIX+gameName)}>Load </button></span>
            <span className='game-list-item'><button onClick={() => deleteGame(gameName)}>Delete</button></span>
            <span className='game-list-item'>{gameName}</span>
          </div>
        ))}
      </div>
    </div>);
}


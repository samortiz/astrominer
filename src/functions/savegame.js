import {fly, game, utils} from './';
import lodash from 'lodash';

// IndexedDB constants
const WORLD_STORE = 'world';
const DB_NAME = 'astrominer';
const DB_VERSION = 1;

/** Saves an object in localstorage.
 * @param key key to store/retrieve
 * @param objToSave: should be an Object or Array, NOT a primitive as the JSON.parse will fail
 */
export function saveLocalStorage(key, objToSave) {
  const existing = localStorage.getItem(key);
  if (existing) {
    localStorage.removeItem(key);
  }
  localStorage.setItem(key, JSON.stringify(objToSave));
}

/**
 *  Loads an object from localstorage.
 * NOTE: The item stored must be an Object or Array as primitives will fail the JSON.parse
 */
export function loadLocalStorage(key) {
  if (!key) {
    console.warn('Unable to from localStorage without a key');
    return;
  }
  const objString = localStorage.getItem(key)
  //console.log('loaded objString ='+objString);
  if (!objString) {
    return null;
  }
  return JSON.parse(objString);
}

function upgradeDB(event) {
  let db = event.target.result;
  if (event.oldVersion >= 1) {
    db.deleteObjectStore(WORLD_STORE);
  }
  db.createObjectStore(WORLD_STORE, {keyPath: "saveGameName"});
}

/**
 * Start using a newWorld, the old world and it's state will be discarded.
 * param key:  storage key where the world is kept
 */
export function loadWorld(key) {
  let dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onerror = function (event) {
    console.log('error ', event);
  };
  dbRequest.onupgradeneeded = upgradeDB;
  dbRequest.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction([WORLD_STORE]);
    let objectStore = transaction.objectStore(WORLD_STORE);
    let request = objectStore.get(key);
    request.onerror = function (event) {
      console.log('Request error loading:', event);
    };
    request.onsuccess = function (event) {
      const newWorld = request.result;
      const oldSystem = window.world.system;
      window.world = newWorld;
      window.world.system = oldSystem;

      // Clear the old containers of whatever they had
      window.world.system.spriteContainers.planets.removeChildren();
      window.world.system.planetSpriteCache = {};
      window.world.system.spriteContainers.ships.removeChildren();
      window.world.system.shipSpriteCache = {};
      window.world.system.shieldSpriteCache = new Map();
      window.world.system.bullets = []; // remove all active bullets from the screen
      window.world.system.spriteContainers.bullets.removeChildren();
      window.world.system.explosions = [];
      window.world.system.spriteContainers.explosions.removeChildren();

      // Reset/Redraw all the sprites
      window.world.ship.spriteId = null;
      const shipSprite = game.getShipSprite(window.world.ship);
      shipSprite.visible = window.world.ship.alive;
      fly.repositionScreen();
      utils.showToast('Loaded game');
    };
  }

}

export function saveWorld(key) {
  const worldToStore = lodash.cloneDeep(lodash.omit(window.world, ['system']));
  worldToStore.saveGameName = key;

  let dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onerror = function (event) {
    console.log('DB Request Error:', event);
  };
  dbRequest.onupgradeneeded = upgradeDB;
  dbRequest.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction([WORLD_STORE], "readwrite");
    let objectStore = transaction.objectStore(WORLD_STORE);
    let objectStoreRequest = objectStore.put(worldToStore);
    objectStoreRequest.onsuccess = function (event) {
      utils.showToast('Saved game');
    };
    objectStoreRequest.onerror = function (event) {
      console.log('failed to save ', event.target);
    }
  }
}

export function deleteWorld(key) {
  let dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onerror = function (event) {
    console.log('DB Request Error:', event);
  };
  dbRequest.onupgradeneeded = upgradeDB;
  dbRequest.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction([WORLD_STORE], "readwrite");
    let objectStore = transaction.objectStore(WORLD_STORE);
    let objectStoreRequest = objectStore.delete(key);
    objectStoreRequest.onsuccess = function (event) {
      utils.showToast('Deleted game ' + key);
    };
    objectStoreRequest.onerror = function (event) {
      console.log('failed to delete ', event.target);
    }
  }
}

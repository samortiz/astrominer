import lodash from 'lodash';
import pako from 'pako';

const WORLD_STORE = 'world';
const DB_NAME = 'astrominer';
const DB_VERSION = 4;

/** Saves an object in localstorage.
 * @param objToSave: should be an Object or Array, NOT a primitive as the JSON.parse will fail
 */
export function saveLocalStorage(key, objToSave) {
  const existing = localStorage.getItem(key);
  if (existing) {
    console.log('removing ', key);
    localStorage.removeItem(key);
  }
  localStorage.setItem(key, JSON.stringify(objToSave));
  console.log("Saved "+key+" in localstorage ", objToSave);
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
  console.log('upgrading');
  let db = event.target.result;
  if (event.oldVersion >= 1) {
    db.deleteObjectStore(WORLD_STORE);
  }
  let objectStore = db.createObjectStore(WORLD_STORE, { keyPath: "saveGameName" });
}

/**
 * Start using a newWorld, the old world and it's state will be discarded.
 * @param key : storage key where the world is kept
 */
export function loadWorld(key) {
  let dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onerror = function(event) {
    console.log('error ', event);
  };
  dbRequest.onupgradeneeded = upgradeDB;
  dbRequest.onsuccess = function(event) {
    console.log('DB opened OK ');
    let db = event.target.result;
    let transaction = db.transaction([WORLD_STORE]);
    let objectStore = transaction.objectStore(WORLD_STORE);
    let request = objectStore.get(key);
    request.onerror = function(event) {
      console.log('Request error loading:', event);
    };
    request.onsuccess = function(event) {
      const newWorld = request.result;
      const oldSystem = window.world.system;
      window.world = newWorld;
      window.world.system = oldSystem;
      console.log('Loaded world ', window.world);
      // TODO: Need to reset spriteIds and sprite.visible for all ships and planets so they get reloaded
      // TODO: reset any data in system that needs copying
    };
  }

}

export function saveWorld(key) {
  const worldToStore = lodash.cloneDeep(lodash.omit(window.world, ['system']));
  worldToStore.saveGameName = key;

  let dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
  dbRequest.onerror = function(event) {
    console.log('DB Request Error:', event);
  };
  dbRequest.onupgradeneeded = upgradeDB;
  dbRequest.onsuccess = function(event) {
    console.log('DB success ');
    let db = event.target.result;
    let transaction = db.transaction([WORLD_STORE], "readwrite");
    transaction.oncomplete = function(event) {
      console.log("SaveWorld transaction complete!");
    };
    transaction.onerror = function(event) {
      console.log('SaveWorld transaction error');
    };
    let objectStore = transaction.objectStore(WORLD_STORE);
    let objectStoreRequest = objectStore.add(worldToStore);
    objectStoreRequest.onsuccess = function(event) {
        console.log('stored world OK');
    };
  }
}

export function deleteWorld(key) {
  // TODO
}

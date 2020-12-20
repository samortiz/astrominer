import {c} from "./index";

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

export function serializeWorld() {
  const worldStr = '{test:"test"}'; // JSON.stringify(window.world);
  console.log('worldStr '+worldStr);
  return worldStr;
}

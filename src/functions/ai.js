import {c, fly, utils} from './';
import {getShipSprite} from "./game";

export function moveAliens() {
  let ship = window.world.ship;
  for (let alien of window.world.system.nearby.ships) {
    if (!alien.alive || ship === alien) {
      continue;
    }
    let hasMoved = false;
    if (alien.aiType === c.ALIEN_AI_CREEPER) {
      hasMoved = creeperAi(alien, false);
    } else if (alien.aiType === c.ALIEN_AI_KAMIKAZI) {
      hasMoved = creeperAi(alien, true);
    } else if (alien.aiType === c.EQUIP_AI_TURRET) {
      hasMoved = turretAi(alien, 0.7);
    } else if (alien.aiType === c.ALIEN_AI_TURRET) {
      hasMoved = turretAi(alien, 0.25);
    } else if (alien.aiType === c.EQUIP_AI_MISSILE) {
      hasMoved = missileAi(alien);
    } else if (alien.aiType === c.ALIEN_AI_MOTHERSHIP) {
      mothershipAi(alien);
    }
    if (hasMoved) {
      checkForCollisionWithPlanet(alien);
      checkForCollisionWithShip(alien);
    }

    // If alien is in the viewport
    if ((ship.x + c.HALF_SCREEN_WIDTH + alien.radius >= alien.x) && // Right
      (ship.x - c.HALF_SCREEN_WIDTH - alien.radius <= alien.x) && // Left
      (ship.y + c.HALF_SCREEN_HEIGHT + alien.radius >= alien.y) && // Bottom
      (ship.y - c.HALF_SCREEN_HEIGHT - alien.radius <= alien.y)) { // Top
      // alien may have died in a collision
      if (alien.alive) {
        // Set alien ship relative to the ship's viewport
        const alienSprite = getShipSprite(alien);
        alienSprite.visible = true;
        alienSprite.rotation = alien.rotation;
        alienSprite.x = (alien.x - ship.x) + c.HALF_SCREEN_WIDTH;
        alienSprite.y = (alien.y - ship.y) + c.HALF_SCREEN_HEIGHT;
      }
    } else { // alien is not in view
      // Release the sprite if the alien is not in the view
      if (alien.spriteId) {
        const alienSprite = getShipSprite(alien);
        alienSprite.visible = false;
        alien.spriteId = null;
      }
    }
  } // for alien
}

/**
 * Fire primary weapon in the direction of x,y
 * @ship ship with gun to fire
 * @x/y  the location to aim at
 * @jitter amount (in radians) of randomness added to direction component
 *         0 - shoots directly at player
 *         PI - shoot completely randomly
 */
export function shootAt(shooter, x, y, jitter) {
  shooter.rotation = utils.normalizeRadian(Math.atan2(y - shooter.y, x - shooter.x));
  fly.firePrimaryWeapon(shooter, jitter);
}

export function turretAi(turretShip, jitter) {
  const {target, dist} = getNearestOpponentTarget(turretShip);
  if (!target || !target.alive) {
    return false;
  }
  if (dist < fly.primaryWeaponRange(turretShip)) {
    shootAt(turretShip, target.x, target.y, jitter);
  }
  return false;
}

export function mothershipAi(alien) {
  let ship = window.world.ship;
  if (!ship.alive) {
    return;
  }
  const distanceToPlayer = utils.distanceBetween(alien.x, alien.y, ship.x, ship.y);
  if (distanceToPlayer < fly.primaryWeaponRange(alien)) {
    shootAt(alien, ship.x, ship.y, 0.3);
  }
  if (distanceToPlayer < c.SCREEN_WIDTH*3) {
    fly.fireSecondaryWeapon(alien);
  }
  if (alien.armor < alien.armorMax) {
    enableShieldIfNeeded(alien);
  }
}

/**
 * Finds the nearest ship on the other team
 * @param ship ship to determine x,y and player
 */
export function getNearestOpponentTarget(ship) {
  return (ship.owner === c.PLAYER)
    ? getNearestAlienTarget(ship.x, ship.y, ship.id)
    : getNearestPlayerTarget(ship.x, ship.y, ship.id);
}

/**
 * Finds the nearest ship on the same team
 * @param ship ship to determine x,y and player
 */
export function getNearestFriendlyTarget(ship) {
  return (ship.owner === c.PLAYER)
    ? getNearestPlayerTarget(ship.x, ship.y, ship.id)
    : getNearestAlienTarget(ship.x, ship.y, ship.id);
}

/**
 * Simple AI for missiles - find nearest target and move toward it attempting to crash
 */
export function missileAi(missile) {
  const {target, dist} = getNearestOpponentTarget(missile);
  // Missiles don't track targets really far away
  if (target && dist < c.SCREEN_WIDTH) {
    let dirToTarget = utils.directionTo(missile.x, missile.y, target.x, target.y);
    let {xAmt, yAmt} = utils.dirComponents(dirToTarget, missile.propulsion);
    missile.vx += xAmt;
    missile.vy += yAmt;
    missile.x += missile.vx;
    missile.y += missile.vy;
    return true;
  }
  // Don't move if there's nobody to move towards
  return false;
}

/**
 * AI for aliens that move toward the player and shoots
 * @return true if alien moved false otherwise
 */
export function creeperAi(alien, crashIntoPlayer=false) {
  let ship = window.world.ship;
  if (!ship.alive) {
    return;
  }
  const viewRange = alien.viewRange || c.SCREEN_WIDTH;
  let moved = false;
  const {target:playerTarget, dist:distToOpponent} = getNearestOpponentTarget(alien);
  if (!playerTarget) {
    return;
  }
  if (distToOpponent < viewRange) {
    let dirToTarget = utils.directionTo(alien.x, alien.y, playerTarget.x, playerTarget.y);
    let {xAmt, yAmt} = utils.dirComponents(dirToTarget, 25 * alien.propulsion);
    // Check if we are too close to a planet (need to move around the planet)
    for (let planet of window.world.system.nearby.planets) {
      if (utils.distanceBetween(alien.x + xAmt, alien.y + yAmt, planet.x, planet.y) < (planet.radius + alien.radius + 10)) {
        const dirToPlanet = utils.directionTo(alien.x, alien.y, planet.x, planet.y);
        let dirDiff = dirToPlanet - dirToTarget;
        let rightLeft = (dirDiff >= 0) ? -1 : 1;
        if (Math.abs(dirDiff) > Math.PI) {
          rightLeft = rightLeft * -1;
        }
        const turnDir = dirToPlanet + (rightLeft * Math.PI / 2);
        ({xAmt, yAmt} = utils.dirComponents(turnDir, 20 * alien.propulsion));
      }
    } // for planet
    // Too close to an enemy, don't move as you might crash
    if (!crashIntoPlayer && distToOpponent < (ship.spriteWidth + alien.radius + 20)) {
      xAmt = 0;
      yAmt = 0;
    }
    // Don't crash into friends
    const {target: friend} = getNearestFriendlyTarget(alien);
    if (friend &&
      (utils.distanceBetween(alien.x + xAmt, alien.y + yAmt, friend.x, friend.y) < (alien.radius + friend.radius + 10))) {
      xAmt = 0;
      yAmt = 0;
    }
    if (alien.armor < alien.armorMax) {
      enableShieldIfNeeded(alien);
    }
    alien.x += xAmt;
    alien.y += yAmt;
    alien.rotation = dirToTarget;
    moved = true;
  }
  if (distToOpponent < fly.primaryWeaponRange(alien)) {
    shootAt(alien, playerTarget.x, playerTarget.y, 0.15);
  }
  return moved;
}

/**
 * Finds the nearest alien target to the x,y location
 * @shipId : any alien except the one with a matching shipId
 * returns {target:X, dist:Y }  x and y will be null if no living targets are found
 */
export function getNearestAlienTarget(x, y, shipId = 'none') {
  let target = null;
  let minDist = null;
  for (let alien of window.world.system.nearby.ships) {
    if (alien.alive && alien.owner === c.ALIEN && alien.id !== shipId) {
      let dist = utils.distanceBetween(x, y, alien.x, alien.y);
      if (!target || (dist < minDist)) {
        target = alien;
        minDist = dist;
      }
    }
  } // for
  return {target: target, dist: minDist};
}

/**
 * Finds the nearest player target to the x,y location
 * @shipId : any ship except the one matching shipId
 * returns {target:X, dist:Y }  x and y will be null if no living targets are found
 */
export function getNearestPlayerTarget(x, y, shipId='none') {
  const ship = window.world.ship;
  let target = ship;
  let minDist = ship.id !== shipId ? utils.distanceBetween(x, y, ship.x, ship.y) : 99999999999;
  for (let ship of window.world.system.nearby.ships) {
    if (ship.alive && ship.owner === c.PLAYER && ship.id !== shipId) {
      let dist = utils.distanceBetween(x, y, ship.x, ship.y);
      if (!target || (dist < minDist)) {
        target = ship;
        minDist = dist;
      }
    }
  } // for
  return {target: target, dist: minDist};
}


export function checkForCollisionWithPlanet(alien) {
  for (let planet of window.world.system.nearby.planets) {
    let dist = utils.distanceBetween(alien.x, alien.y, planet.x, planet.y);
    if (dist <= (alien.radius + planet.radius)) {
      fly.destroyShip(alien, null);
    }
  } // for
}

export function checkForCollisionWithShip(ship) {
  for (let otherShip of window.world.system.nearby.ships) {
    if (otherShip.alive && ship !== otherShip) {
      let dist = utils.distanceBetween(ship.x, ship.y, otherShip.x, otherShip.y);
      if (dist <= (ship.radius + otherShip.radius)) {
        fly.shipsCollide(ship, otherShip);
        if (ship.name === c.SHIP_FRIENDSHIP_MISSILE.name && otherShip.owner !== ship.owner) {
          otherShip.owner = ship.owner;
        }
      }
    }
  } // for
}

export function enableShieldIfNeeded(ship) {
  const shieldEquip = getShield(ship);
  if (!shieldEquip || shieldEquip.cool > 0) {
    return;
  }
  fly.enableShield(ship, shieldEquip.shield);
  shieldEquip.cool = shieldEquip.coolTime;
}

export function getShield(ship) {
  for (let i = 0; i < ship.equip.length; i++) {
    const equip = ship.equip[i];
    if ((equip.type === c.EQUIP_TYPE_SECONDARY_WEAPON) && equip.shield) {
      return equip;
    }
  } // for
  return null;
}
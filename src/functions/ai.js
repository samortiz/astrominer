import {c, fly, game, utils} from './';
import {getShipSprite} from "./game";

export function moveAliens() {
  let ship = window.world.ship;
  for (let alien of window.world.aliens) {
    if (!alien.alive) {
      continue;
    }
    let hasMoved = false;
    if (alien.aiType === c.ALIEN_AI_TURRET) {
      turretAi(alien);
    } else if (alien.aiType === c.ALIEN_AI_CREEPER) {
      hasMoved = creeperAi(alien);
    } else if (alien.aiType === c.EQUIP_AI_TURRET_MINE) {
      hasMoved = turretMineAi(alien);
    }
    if (hasMoved) {
      checkForCollisionWithPlanet(alien);
      checkForCollisionWithAlien(alien);
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
export function shootAt(shooter, x,y, jitter) {
  let dirToShoot = utils.normalizeRadian(Math.atan2(y - shooter.y, x - shooter.x));
  let jitterAmt = jitter * Math.random() * (utils.randomBool() ? -1 : 1);
  shooter.rotation = utils.normalizeRadian(dirToShoot + jitterAmt);
  fly.firePrimaryWeapon(shooter);
  shooter.rotation = dirToShoot;
}

export function turretAi(alien) {
  let ship = window.world.ship;
  if (!ship.alive) {
    return;
  }
  if (utils.distanceBetween(alien.x, alien.y, ship.x, ship.y) < 300) {
    shootAt(alien, alien.x, alien.y, 0.7);
  }
}

export function turretMineAi(turret) {
  let nearestTarget = null;
  let nearestTargetDist = null;
  for (let alien of window.world.aliens) {
    if (alien.alive && alien.owner === c.ALIEN) {
      let dist = utils.distanceBetween(turret.x, turret.y, alien.x, alien.y);
      if ((dist < fly.primaryWeaponRange(turret)) && (!nearestTarget || (dist < nearestTargetDist))) {
        nearestTarget = alien;
        nearestTargetDist = dist;
      }
    }
  } // for
  if (nearestTarget) {
    shootAt(turret, nearestTarget.x, nearestTarget.y, 0.1);
  }
  return false; // never moves
}

/**
 * Runs the AI for moving aliens.
 * @return true if alien moved false otherwise
 */
export function creeperAi(alien) {
  let ship = window.world.ship;
  if (!ship.alive) {
    return;
  }
  let moved = false;
  // Close enough to player to move
  const distanceToPlayer = utils.distanceBetween(alien.x, alien.y, ship.x, ship.y);
  if (distanceToPlayer < c.SCREEN_WIDTH) {
    let dirToPlayer = utils.directionTo(alien.x, alien.y, ship.x, ship.y);
    let {xAmt, yAmt} = utils.dirComponents(dirToPlayer, 25 * alien.propulsion);
    // Check if we are too close to a planet (need to move around the planet)
    for (let planet of game.getPlanetsNear(alien.x, alien.y)) {
      if (utils.distanceBetween(alien.x + xAmt, alien.y + yAmt, planet.x, planet.y) < (planet.radius + alien.radius + 10)) {
        const dirToPlanet = utils.directionTo(alien.x, alien.y, planet.x, planet.y);
        let dirDiff = dirToPlanet - dirToPlayer;
        let rightLeft = (dirDiff >= 0) ? -1 : 1;
        if (Math.abs(dirDiff) > Math.PI) {
          rightLeft = rightLeft * -1;
        }
        const turnDir = dirToPlanet + (rightLeft * Math.PI / 2);
        ({xAmt, yAmt} = utils.dirComponents(turnDir, 20 * alien.propulsion));
      }
    } // for planet
    // Too close to player, don't move closer
    if (distanceToPlayer < (ship.spriteWidth + alien.radius + 20)) {
      xAmt = 0;
      yAmt = 0;
    }
    alien.x += xAmt;
    alien.y += yAmt;
    alien.rotation = dirToPlayer;
    moved = true;
  }
  if (utils.distanceBetween(alien.x, alien.y, ship.x, ship.y) < 300) {
    shootAt(alien, ship.x, ship.y, 0.15);
  }
  return moved;
}


export function checkForCollisionWithPlanet(alien) {
  for (let planet of window.world.planets) {
    let dist = utils.distanceBetween(alien.x, alien.y, planet.x, planet.y);
    if (dist <= (alien.radius + planet.radius)) {
      fly.destroyShip(alien, null);
    }
  } // for
}

export function checkForCollisionWithAlien(alien) {
  for (let otherAlien of window.world.aliens) {
    if (otherAlien.alive && alien !== otherAlien) {
      let dist = utils.distanceBetween(alien.x, alien.y, otherAlien.x, otherAlien.y);
      if (dist <= (alien.radius + otherAlien.radius)) {
        fly.shipsCollide(alien, otherAlien);
      }
    }
  } // for
}
import { c, game, fly, utils} from './';

export function moveAliens() {
  let ship = window.world.ship;
  for (let alien of window.world.aliens) {
    if (!alien.sprite.visible) {
      continue;
    }
    let hasMoved = false;
    if (alien.aiType === c.ALIEN_AI_TURRET) {
      turretAi(alien);
    } else if (alien.aiType === c.ALIEN_AI_CREEPER) {
      hasMoved = creeperAi(alien);
    }

    if (hasMoved) {
      checkForCollisionWithPlanet(alien);
      checkForCollisionWithAlien(alien);
    }

    // Set alien ship relative to the ship's viewport
    alien.sprite.x = (alien.x - ship.x) + c.HALF_SCREEN_WIDTH;
    alien.sprite.y = (alien.y - ship.y) + c.HALF_SCREEN_HEIGHT;
  } // for
}

/**
 * Fire primary weapon in the direction of the player
 * @jitter amount (in radians) of randomness added to direction component
 *         0 - shoots directly at player
 *         PI - shoot completely randomly
 */
export function shootAtPlayer(alien, jitter) {
  let ship = window.world.ship;
  let dirToPlayer = utils.normalizeRadian(Math.atan2(ship.y - alien.y, ship.x - alien.x));
  let jitterAmt = jitter * Math.random() * (utils.randomBool() ? -1 : 1);
  alien.sprite.rotation = utils.normalizeRadian(dirToPlayer + jitterAmt);
  fly.firePrimaryWeapon(alien);
  alien.sprite.rotation = dirToPlayer;
}

export function turretAi(alien) {
  let ship = window.world.ship;
  if (utils.distanceBetween(alien.x, alien.y, ship.x, ship.y) < 300) {
    shootAtPlayer(alien, 0.7);
  }
}

/**
 * Runs the AI for moving aliens.
 * @return true if alien moved false otherwise
 */
export function creeperAi(alien) {
    let ship = window.world.ship;
    let moved = false;
    // Close enough to player to move
    if (utils.distanceBetween(alien.x, alien.y, ship.x, ship.y) < c.SCREEN_WIDTH) {
      let dirToPlayer = utils.directionTo(alien.x, alien.y, ship.x, ship.y);
      let { xAmt, yAmt} = utils.dirComponents(dirToPlayer, 25 * alien.propulsion);

      // Check if we are too close to a planet (need to move around the planet)
      for (let planet of game.getPlanetsNear(alien.x, alien.y)) {
        if (utils.distanceBetween(alien.x+xAmt, alien.y+yAmt, planet.x, planet.y) < (planet.radius + alien.radius + 10)) {
           const dirToPlanet = utils.directionTo(alien.x, alien.y, planet.x, planet.y);
           let dirDiff = dirToPlanet - dirToPlayer;
           let rightLeft = (dirDiff >= 0) ? -1 : 1;
           if (Math.abs(dirDiff) > Math.PI) {
             rightLeft = rightLeft * -1;
           }
           const turnDir = dirToPlanet + (rightLeft * Math.PI/2);
           ({xAmt, yAmt} = utils.dirComponents(turnDir, 20 * alien.propulsion));
        }
      }

      alien.x += xAmt;
      alien.y += yAmt;
      moved = true;
    }
    if (utils.distanceBetween(alien.x, alien.y, ship.x, ship.y) < 300) {
      shootAtPlayer(alien, 0.15);
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
    if (otherAlien.sprite.visible && alien !== otherAlien) {
      let dist = utils.distanceBetween(alien.x, alien.y, otherAlien.x, otherAlien.y);
      if (dist <= (alien.radius + otherAlien.radius)) {
        fly.shipsCollide(alien, otherAlien);
      }
    }
  } // for
}
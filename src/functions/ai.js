import {c, fly, game, manage, utils} from './';
import {showToast} from "./utils";
import {getEquip} from "./fly";

export function moveAliens() {
  let ship = window.world.ship;
  for (let alien of window.world.system.nearby.ships) {
    if (!alien.alive || ship === alien) {
      continue;
    }
    let hasMoved = false;
    if (alien.aiType === c.ALIEN_AI_CREEPER) {
      hasMoved = creeperAi(alien, false, false);
    } else if (alien.aiType === c.ALIEN_AI_CREEPER_AIMED) {
      hasMoved = creeperAi(alien, false, true);
    } else if (alien.aiType === c.ALIEN_AI_KAMIKAZI) {
      hasMoved = creeperAi(alien, true, false);
    } else if (alien.aiType === c.ALIEN_AI_TURRET) {
      hasMoved = turretAi(alien, 0.3, false);
    } else if (alien.aiType === c.ALIEN_AI_TURRET_AIMED) {
      hasMoved = turretAi(alien, 0, true);
    } else if (alien.aiType === c.EQUIP_AI_TURRET) {
      hasMoved = turretAi(alien, 0, true);
    } else if (alien.aiType === c.EQUIP_AI_MISSILE) {
      hasMoved = missileAi(alien);
    } else if (alien.aiType === c.ALIEN_AI_MOTHERSHIP) {
      mothershipAi(alien);
    } else if (alien.aiType === c.EQUIP_AI_RESOURCE_DROID) {
      hasMoved = resourceDroidAi(alien);
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
        const alienSprite = game.getShipSprite(alien);
        alienSprite.visible = true;
        alienSprite.rotation = alien.rotation;
        alienSprite.x = (alien.x - ship.x) + c.HALF_SCREEN_WIDTH;
        alienSprite.y = (alien.y - ship.y) + c.HALF_SCREEN_HEIGHT;
      }
    } else { // alien is not in view
      // Release the sprite if the alien is not in the view
      if (alien.spriteId) {
        const alienSprite = game.getShipSprite(alien);
        alienSprite.visible = false;
        alien.spriteId = null;
      }
    }
  } // for alien
}

/**
 * Fire primary weapon in the direction of x,y
 * @shooter ship with gun to fire
 * @x/y  the location to aim at
 * @jitter amount (in radians) of randomness added to direction component
 *         0 - shoots directly at player
 *         PI - shoot completely randomly
 */
export function shootAt(shooter, x, y, jitter) {
  shooter.rotation = utils.normalizeRadian(Math.atan2(y - shooter.y, x - shooter.x));
  fly.firePrimaryWeapon(shooter, jitter);
}

/**
 * Fire primary weapon in a best attempt to hit target ship
 * This will take into account the target's movement and lead the shot
 * @shooter ship with gun to fire
 * @target ship to try to hit
 * @jitter amount (in radians) of randomness added to direction component
 *         0 - shoots directly at player
 *         PI - shoot completely randomly
 */
export function aimShotAt(shooter, target, jitter) {
  const gun = getEquip(shooter, c.EQUIP_TYPE_PRIMARY_WEAPON);
  if (!gun) {
    return;
  }
  const bulletSpeed = gun.speed;
  const deltaX = target.x - shooter.x;
  const deltaY = target.y - shooter.y;

  // Target speed squared (v_t^2)
  const targetSpeedSquared = target.vx * target.vx + target.vy * target.vy;

  // Quadratic coefficients: a*t^2 + b*t + c = 0
  const a = targetSpeedSquared - bulletSpeed * bulletSpeed;
  const b = 2 * (deltaX * target.vx + deltaY * target.vy);
  const cee = deltaX * deltaX + deltaY * deltaY;

  // Calculate discriminant
  const discriminant = b * b - 4 * a * cee;

  // Check if a solution exists (discriminant >= 0)
  if (discriminant < 0) {
    // We can't make a shot, so shoot in their general direction
    fly.firePrimaryWeapon(shooter, jitter);
    return;
  }

  // Solve quadratic equation for time (take the positive root)
  const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t = (t1 > 0 && (t2 < 0 || t1 < t2)) ? t1 : t2;

  if (t <= 0) {
    // We can't make the shot, so shoot generally over that-a-way
    fly.firePrimaryWeapon(shooter, jitter);
    return;
  }

  // Calculate interception point
  const interceptX = target.x + target.vx * t;
  const interceptY = target.y + target.vy * t;

  // Calculate direction vector and angle (in radians)
  const dirX = interceptX - shooter.x;
  const dirY = interceptY - shooter.y;
  const angle = Math.atan2(dirY, dirX); // Angle in radians

  // Fire
  shooter.rotation = utils.normalizeRadian(angle);
  fly.firePrimaryWeapon(shooter, 0);
}


export function turretAi(turretShip, jitter, aimed=false) {
  const {target, dist} = getNearestOpponentTarget(turretShip);
  if (!target || !target.alive) {
    return false;
  }
  if (dist < fly.primaryWeaponRange(turretShip)) {
    if (aimed) {
      console.log('aimed');
      aimShotAt(turretShip, target, jitter);
    } else {
      shootAt(turretShip, target.x, target.y, jitter)
      console.log('not aimed');
    }
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
    aimShotAt(alien, ship, 0);
  }
  if (distanceToPlayer < c.SCREEN_WIDTH*3) {
    fly.fireSecondaryWeapon(alien);
  }
  if (alien.armor < alien.armorMax) {
    enableShieldIfNeeded(alien);
  }
}

export function resourceDroidAi(droid) {
  if (!droid.aiData.targetPlanet) {
    droid.aiData.targetPlanet = getTargetPlanetWithResources(droid);
  }
  const targetPlanet = droid.aiData.targetPlanet;
  // No planets to get resources from
  if (!targetPlanet) {
    return true;
  }
  // If the droid is stuck for a long time, then we choose a new target to break up the traffic jam.
  if (droid.aiData.stuckCounter > 500) {
    let newTarget = getTargetPlanetWithResources(droid);
    let counter = 0;
    while (newTarget === droid.aiData.targetPlanet && counter < 100) {
      newTarget = getTargetPlanetWithResources(droid);
      counter++;
    }
    droid.aiData.targetPlanet = newTarget;
  }

  droid.rotation = utils.directionTo(droid.x, droid.y, targetPlanet.x, targetPlanet.y);
  let {xAmt, yAmt} = getXYToMoveTowards(droid, targetPlanet.x, targetPlanet.y, false)
  if (xAmt && yAmt) {
    droid.x += xAmt;
    droid.y += yAmt;
    droid.aiData.stuckCounter = 0;
  } else {
    droid.aiData.stuckCounter++;
  }
  // check for landing on planet
  const distToTarget = utils.distanceBetween(droid.x, droid.y, targetPlanet.x, targetPlanet.y);
  if (distToTarget <= targetPlanet.radius + droid.radius + 15) {
    if (targetPlanet.id === droid.aiData.homePlanet.id) {
      unloadDroid(droid, targetPlanet)
    } else {
      loadDroid(droid, targetPlanet);
    }
  }
  return true;
}

export function unloadDroid(droid, planet) {
  manage.transferResource(droid.resources, planet.resources.stored, 'titanium', droid.resources.titanium, null);
  manage.transferResource(droid.resources, planet.resources.stored, 'gold', droid.resources.gold, null);
  manage.transferResource(droid.resources, planet.resources.stored, 'uranium', droid.resources.uranium, null);
  // Finished unloading - go get more
  droid.aiData.targetPlanet = getTargetPlanetWithResources(droid);
}

export function loadDroid(droid, planet) {
  const desiredAmt = droid.resourcesMax / 3;
  manage.transferResource(planet.resources.stored, droid.resources, 'titanium', desiredAmt, droid.resourcesMax);
  manage.transferResource(planet.resources.stored, droid.resources, 'gold', desiredAmt, droid.resourcesMax);
  manage.transferResource(planet.resources.stored, droid.resources, 'uranium', desiredAmt, droid.resourcesMax);
  if (droid.resourcesMax > (droid.resources.titanium + droid.resources.gold + droid.resources.uranium)) {
    manage.transferResource(planet.resources.stored, droid.resources, 'titanium', droid.resourcesMax, droid.resourcesMax);
    manage.transferResource(planet.resources.stored, droid.resources, 'gold', droid.resourcesMax, droid.resourcesMax);
    manage.transferResource(planet.resources.stored, droid.resources, 'uranium', droid.resourcesMax, droid.resourcesMax);
  }
  // Go back to home planet
  droid.aiData.targetPlanet = droid.aiData.homePlanet;
}

// Returns true if there are any resource droids for the player
export function hasDroids() {
  for (let droid of window.world.ships) {
    if (droid.aiType === c.EQUIP_AI_RESOURCE_DROID) {
      return true;
    }
  } // for droid
  return false;
}

export function summonAllDroids() {
  const currPlanet = window.world.selectedPlanet;
  let droidCount = 0;
  for (let droid of window.world.ships) {
    if (droid.aiType === c.EQUIP_AI_RESOURCE_DROID && droid.alive) {
      droid.aiData.homePlanet = currPlanet;
      droid.aiData.targetPlanet = currPlanet;
      droidCount++;
    }
  } // for droid
  showToast(droidCount+" droids summoned");
}

/**
 * Find a planet with resources to go collect from
 */
export function getTargetPlanetWithResources(droid) {
  const planetsWithResources = [];
  let homePlanetId = droid.aiData.homePlanet.id;
  for (let planet of window.world.planets) {
    const resourcesMined = planet.resources.stored;
    const totalResources = resourcesMined.titanium + resourcesMined.gold + resourcesMined.uranium;
    if (totalResources > 1 && homePlanetId !== planet.id) {
      const dist = utils.distanceBetween(planet.x, planet.y, droid.x, droid.y);
      planetsWithResources.push({planet, dist, totalResources});
    }
  } // for planet

  // Sort nearest planets first
  planetsWithResources.sort((a,b) => a.dist - b.dist);

  // Calculate planet scores
  const minPlanetDist = planetsWithResources.length ? planetsWithResources[0].dist : 0;
  for (let planetInfo of planetsWithResources) {
    const distScore = 1 / (planetInfo.dist / minPlanetDist) * 2;
    const resourceScore = Math.min(planetInfo.totalResources / (droid.resourcesMax * 3), 1);
    planetInfo.score = distScore * resourceScore * 100;
  }

  // Sort by score, take the top 10
  const planetOptions = planetsWithResources.sort((a,b) => b.score - a.score).slice(0,10);
  const totalScore = planetOptions.reduce((prev, curr) => prev + curr.score, 0);
  let chosenValue = utils.randomInt(0, totalScore);
  for (let planetOption of planetOptions) {
    if (planetOption.score >= chosenValue) {
      return planetOption.planet;
    }
    chosenValue -= planetOption.score;
  }
  // Couldn't find a planet
  console.warn("Could not find any planet to collect resources from");
  return null;
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
    if (missile.armor < missile.armorMax) {
      enableShieldIfNeeded(missile);
    }
    return true;
  }
  // Don't move if there's nobody to move towards
  return false;
}

/**
 * Determine x,y amounts needed to move around an obstacle, moving right or left from dirToTarget
 */
export function goAround(x, y, propulsion, obstacleX, obstacleY, dirToTarget) {
  const dirToObstacle = utils.directionTo(x, y, obstacleX, obstacleY);
  let dirDiff = dirToObstacle - dirToTarget;
  let rightLeft = (dirDiff >= 0) ? -1 : 1;
  if (Math.abs(dirDiff) > Math.PI) {
    rightLeft = rightLeft * -1;
  }
  const turnDir = dirToObstacle + (rightLeft * Math.PI / 2);
  const moveAmts = utils.dirComponents(turnDir, 20 * propulsion);
  const xAmt = moveAmts.xAmt;
  const yAmt = moveAmts.yAmt;
  return {xAmt, yAmt};
}

/**
 * This will return xAmt, yAmt which would be a reasonable next step to get to targetX, targetY from your current position.
 * This will go around planets and other ships, trying not to crash into things.
 * @param shipToMove : ship that will be moving - NOTE: This function does NOT move the ship, you need to do that.
 * @param targetX amount to move in X
 * @param targetY amount to move in Y
 * @param crashIntoEnemy if true will crash into enemy ships, if false will avoid all ships
 * @ret {xAmt, yAmt} amount to add to the X/y coord to move in the right direction
 */
export function getXYToMoveTowards(shipToMove, targetX, targetY, crashIntoEnemy) {
  if (!shipToMove || !shipToMove.alive) {
    return;
  }
  let dirToTarget = utils.directionTo(shipToMove.x, shipToMove.y, targetX, targetY);
  let {xAmt, yAmt} = utils.dirComponents(dirToTarget, 25 * shipToMove.propulsion);

  // Check if we are too close to a planet (need to move around the planet)
  for (let planet of window.world.planets) {
    if (utils.distanceBetween(shipToMove.x + xAmt, shipToMove.y + yAmt, planet.x, planet.y) < (planet.radius + shipToMove.radius + 10)) {
      const moveAmt = goAround(shipToMove.x, shipToMove.y, shipToMove.propulsion, planet.x, planet.y, dirToTarget);
      if (willCollideWithPlanet(shipToMove.x + moveAmt.xAmt, shipToMove.y + moveAmt.yAmt, shipToMove.radius)) {
        xAmt = 0;
        yAmt = 0;
      } else {
        xAmt = moveAmt.xAmt;
        yAmt = moveAmt.yAmt;
      }
    }
  } // for planet

  // Check for ships we should go around
  const nearestShip = crashIntoEnemy ? getNearestFriendlyTarget(shipToMove) :
      getNearestShip(shipToMove.x + xAmt, shipToMove.y + yAmt, shipToMove.id);
  if (nearestShip.target && nearestShip.dist <= nearestShip.target.radius + shipToMove.radius + 20) {
    const moveAmt = goAround(shipToMove.x, shipToMove.y, shipToMove.propulsion, nearestShip.target.x, nearestShip.target.y, dirToTarget);
    if (willCollideWithShip(shipToMove.x + moveAmt.xAmt, shipToMove.y + moveAmt.yAmt, shipToMove.id, shipToMove.radius)) {
      xAmt = 0;
      yAmt = 0;
    } else {
      xAmt = moveAmt.xAmt;
      yAmt = moveAmt.yAmt;
    }
  }
  return {xAmt, yAmt};
}

export function willCollideWithShip(x, y, shipId, shipRadius) {
  for (let ship of window.world.ships) {
    if (ship.alive && ship.id !== shipId) {
      let dist = utils.distanceBetween(ship.x, ship.y, x, y);
      if (dist <= (ship.radius + shipRadius)) {
        return true;
      }
    }
  } // for
  return false;
}

export function willCollideWithPlanet(x, y, shipRadius) {
  for (let planet of window.world.planets) {
    let dist = utils.distanceBetween(planet.x, planet.y, x, y);
    if (dist <= (planet.radius + shipRadius)) {
      return true;
    }
  } // for
  return false;
}

/**
 * AI for aliens that move toward the player and shoots
 * @ aimed : use good aim
 * @return true if alien moved false otherwise
 */
export function creeperAi(alien, crashIntoPlayer=false, aimed=false) {
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
    let {xAmt, yAmt} = getXYToMoveTowards(alien, playerTarget.x, playerTarget.y, crashIntoPlayer);
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
    if (aimed) {
      aimShotAt(alien, playerTarget, 0.15);
    } else {
      shootAt(alien, playerTarget.x, playerTarget.y, 0.15);
    }
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

export function getNearestShip(x, y, shipId, ) {
  let minDist = 99999999999;
  let target = null;
  for (let ship of [...window.world.ships, window.world.ship]) {
    if (ship.alive && ship.id !== shipId) {
      let dist = utils.distanceBetween(x, y, ship.x, ship.y);
      if (!target || (dist < minDist)) {
        target = ship;
        minDist = dist;
      }
    }
  } // for
  return {target:target, dist: minDist};
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
import {ai, c, game, manage, utils} from './';

export function enterFlyState() {
  console.log("Take off");
}

// Main play mode - flying
export function flyLoop(delta) {
  if (delta > 1.005) {
    console.log('Lagging with delta=' + delta);
  }
  let world = window.world;
  let ship = window.world.ship;

  // Cache all the nearby planets and ships
  setupNearby();

  // When ship.alive is false the ship is exploding
  if (ship.alive) {
    runDroids(ship);
    // Keypress handling
    if (world.system.keys.left.isDown || world.system.keys.a.isDown) {
      turnShip(ship, true);
    }
    if (world.system.keys.right.isDown || world.system.keys.d.isDown) {
      turnShip(ship, false);
    }
    if (world.system.keys.up.isDown || world.system.keys.w.isDown) {
      propelShip(ship);
    }
    if (world.system.keys.down.isDown || world.system.keys.s.isDown) {
      brakeShip(ship);
    }
    if (world.system.keys.space.isDown) {
      firePrimaryWeapon(ship, 0.05);
    }
    if (world.system.keys.x.isDown) {
      fireSecondaryWeapon(ship);
    }
    if (world.system.keys.q.isDown) {
      thrustShip(ship, true);
    }
    if (world.system.keys.e.isDown) {
      thrustShip(ship, false);
    }

    // Find planets in view
    let planetsInView = [];
    for (let planet of world.system.nearby.planets) {
      if (planetInView(ship, planet)) {
        planetsInView.push(planet);
      }
    }

    // Gravity
    for (let planet of planetsInView) {
      let grav = utils.calcGravity(ship.x, ship.y, planet);
      ship.vx += grav.x;
      ship.vy += grav.y;
    }

    // move the ship
    ship.x += ship.vx;
    ship.y += ship.vy;
    world.view.x = ship.x;
    world.view.y = ship.y;

    let shipSprite = game.getShipSprite(ship);
    shipSprite.rotation = ship.rotation;

    // Don't detect collisions until all the drawing is done
    // Pixijs sometimes gets the sprite locations wrong when they haven't been rendered yet
    if (!world.system.initializing) {
      // Ship-Planet Collisions
      for (let planet of planetsInView) {
        if (detectCollisionWithPlanet(ship, shipSprite, planet)) {
          landShip(ship, planet);
          return; // exit loop
        }
      } // for planet
      // Ship-Alien collision
      for (let alien of world.system.nearby.ships) {
        if (alien.alive && detectCollisionWithAlien(ship, shipSprite, alien)) {
          shipsCollide(ship, alien);
        }
      }
    }
  }

  moveExplosions(); // especially alien explosions
  moveBackground(ship);
  drawMiniMap();
  // first draw is done
  if (world.system.initializing) {
    world.system.initializing = false;
  }
}


/**
 * Creates a cache of all nearby planets and ships
 */
export function setupNearby() {
  const nearby = window.world.system.nearby;
  const ship = window.world.ship;
  const minX = ship.x - c.NEARBY_WIDTH / 2;
  const maxX = ship.x + c.NEARBY_WIDTH / 2;
  const minY = ship.y - c.NEARBY_HEIGHT / 2;
  const maxY = ship.y + c.NEARBY_HEIGHT / 2;

  nearby.planets = [];
  // for every planet
  for (const planet of window.world.planets) {
    if ((planet.x + planet.radius >= minX) && (planet.x - planet.radius <= maxX) &&
      (planet.y + planet.radius >= minY) && (planet.y - planet.radius <= maxY)) {
      nearby.planets.push(planet);
    }
  } // for planet

  // for every ship
  nearby.ships = [window.world.ship]; // ship is always nearby
  for (const ship of window.world.ships) {
    if ((ship.x + ship.radius >= minX) && (ship.x - ship.radius <= maxX) &&
      (ship.y + ship.radius >= minY) && (ship.y - ship.radius <= maxY)) {
      nearby.ships.push(ship);
    }
  } // for ship
}

/**
 * Redraw all planets and aliens
 */
export function repositionScreen() {
  const ship = window.world.ship;
  // Reposition all the planets
  for (let planet of window.world.planets) {
    planetInView(ship, planet);
  }
  for (const ship of window.world.ships) {
    if (ship.spriteId) {
      game.getShipSprite(ship).visible = false;
      ship.spriteId = null;
    }
  }
  setupNearby();
  // Reposition all the aliens
  ai.moveAliens();
  drawMiniMap();
}

/**
 * Cools all ship weapons, run in mainLoop
 */
export function coolAllWeapons() {
  // Ship is in nearby
  for (let ship of window.world.system.nearby.ships) {
    coolWeapons(ship);
  }
}

/**
 * called in flyLoop to cool weapons
 */
export function coolWeapons(ship) {
  for (let equip of ship.equip) {
    // If equip has a cool time
    if (equip.cool) {
      equip.cool -= 1;
    }
    // Gunnery Droids are equip with weapons
    if (equip.weapon && equip.weapon.cool) {
      equip.weapon.cool -= 1;
    }
    if (equip.shield && equip.shield.active) {
      equip.shield.lifetime -= 1;
      if (equip.shield.lifetime <= 0) {
        equip.shield.lifetime = 0;
        disableShield(ship, equip.shield);
      }
    }
  }
}

export function resetWeaponsCool(ship) {
  for (let equip of ship.equip) {
    if ((equip.type === c.EQUIP_TYPE_PRIMARY_WEAPON) && (equip.cool > 0)) {
      equip.cool = 0;
    }
  }
}

export function runDroids(ship) {
  for (let droid of ship.equip) {
    if ((droid.type === c.EQUIP_TYPE_REPAIR_DROID) && (ship.armor < ship.armorMax)) {
      let cost = {titanium: 0, gold: 0, uranium: 0};
      if (game.canAfford(null, ship, cost)) {
        ship.armor += droid.repairSpeed;
        game.payResourceCost(null, ship, cost);
      }
    } else if (droid.type === c.EQUIP_TYPE_GUNNERY_DROID) {
      shootAtNearestAlien(ship, droid.weapon);
    }
  } // for
}

/**
 * Fires the weapon in the direction of the nearest alien (if able to )
 */
export function shootAtNearestAlien(ship, weapon) {
  // If we can't shoot, don't waste our time
  if (weapon.cool > 0) {
    return;
  }
  let nearestAlien = null;
  let nearestAlienDist = null;
  for (let alien of window.world.system.nearby.ships) {
    if (alien.alive && alien.owner === c.ALIEN) {
      let dist = utils.distanceBetween(ship.x, ship.y, alien.x, alien.y);
      if (!nearestAlien || (dist < nearestAlienDist)) {
        nearestAlien = alien;
        nearestAlienDist = dist;
      }
    }
  } // for
  if (nearestAlien && (nearestAlienDist <= weaponRange(weapon))) {
    const origDir = ship.rotation;
    ship.rotation = utils.normalizeRadian(Math.atan2(nearestAlien.y - ship.y, nearestAlien.x - ship.x));
    fireWeapon(weapon, ship, 0.1);
    ship.rotation = origDir;
  }
}

export function moveBackground(ship) {
  let bgSprite = window.world.system.bgSprite;
  bgSprite.tilePosition.x = (100 - ship.x) + c.HALF_SCREEN_WIDTH;
  bgSprite.tilePosition.y = (100 - ship.y) + c.HALF_SCREEN_HEIGHT;
}

/**
 * @return true if the planet is in view of the ship, false otherwise
 * NOTE: This will set the sprite.visible and sprite x/y attributes for the planet
 */
export function planetInView(ship, planet) {
  // Right side
  if ((ship.x + c.HALF_SCREEN_WIDTH + planet.radius < planet.x) || // Right
    (ship.x - c.HALF_SCREEN_WIDTH - planet.radius > planet.x) || // Left
    (ship.y + c.HALF_SCREEN_HEIGHT + planet.radius < planet.y) || // Bottom
    (ship.y - c.HALF_SCREEN_HEIGHT - planet.radius > planet.y)) { // Top
    // Planet is not currently visible, but if it has an Id then it used to be visible
    if (planet.spriteId) {
      const sprite = game.getPlanetSprite(planet);
      if (sprite.visible) {
        sprite.visible = false;
      }
    }
    return false;
  }
  // Here we know this planet is in view
  const sprite = game.getPlanetSprite(planet);
  sprite.visible = true;
  // Set planet relative to the ship's viewport
  sprite.x = (planet.x - ship.x) + c.HALF_SCREEN_WIDTH;
  sprite.y = (planet.y - ship.y) + c.HALF_SCREEN_HEIGHT;
  return true;
}

/**
 * @return the first active shield the ship is equipped with
 */
export function getActiveShield(ship) {
  for (const equip of ship.equip) {
    if (equip.shield && equip.shield.active) {
      return equip.shield;
    }
  }
  return null;
}

/**
 * @return the first active shield equip in the ship, and if none are active, returns the first shield it finds.
 * returns an equip (not equip.shield like getActiveShield)
 */
export function getEquippedShield(ship) {
  let shield = null;
  for (const equip of ship.equip) {
    if (equip.shield) {
      shield = equip;
      if (equip.shield.active) {
        return shield;
      }
    }
  } // for equip
  return shield;
}

// Returns true if there is a collision and false otherwise
export function detectCollisionWithPlanet(ship, shipSprite, planet) {
  const shield = getActiveShield(ship);
  if (shield) {
    // shield collision is round
    return utils.distanceBetween(ship.x, ship.y, planet.x, planet.y) < (planet.radius + shield.radius);
  }
  // [[x,y],[x,y]]
  let collisionPoints = utils.getVertexData(ship.x, ship.y, shipSprite);
  for (let point of collisionPoints) {
    let dist = utils.distanceBetween(point[0], point[1], planet.x, planet.y);
    if (dist < planet.radius - c.ALLOWED_OVERLAP) {
      return true;
    }
  }
  return false;
}

// Returns true if there is a collision and false otherwise
export function detectCollisionWithAlien(ship, shipSprite, alien) {
  if (ship === alien) {
    return false;
  }
  const shield = getActiveShield(ship);
  if (shield) {
    // shield collision is round
    return utils.distanceBetween(ship.x, ship.y, alien.x, alien.y) < (alien.radius + shield.radius);
  }
  let collisionPoints = utils.getVertexData(ship.x, ship.y, shipSprite);
  for (let point of collisionPoints) {
    // Only works with circular aliens (need different logic for squares)
    if (alien.radius) {
      let dist = utils.distanceBetween(point[0], point[1], alien.x, alien.y);
      if (dist < alien.radius - c.ALLOWED_OVERLAP) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Land the ship on the planet
 * NOTE: This will cause damage to the ship attempting to land (side-effects)
 */
function landShip(ship, planet) {
  // atan2 has parameters (y,x)
  let planetDir = utils.normalizeRadian(Math.atan2(ship.y - planet.y, ship.x - planet.x));
  let dirDiff = Math.abs(ship.rotation - planetDir);
  let speed = Math.abs(ship.vx) + Math.abs(ship.vy);
  // 0 and PI*2 are right beside each other, so large values are very close to small values
  let success = ((dirDiff < ship.crashAngle) || (dirDiff > (Math.PI * 2 - ship.crashAngle)))
    && (speed < ship.crashSpeed)
  // Stop moving
  ship.vx = 0;
  ship.vy = 0;
  if (!success) {
    // The landing was rough - do damage
    let speedDiff = Math.max(speed - ship.crashSpeed, 0); // 0 if negative
    let dirDiffAdj = Math.max(dirDiff - ship.crashAngle, 0); // 0 if negative
    if (dirDiffAdj > Math.PI) {
      dirDiffAdj = (Math.PI * 2) - dirDiff - ship.crashAngle;
    }
    let dmgPct = (speedDiff / 3) + dirDiffAdj;
    let dmg = dmgPct * ship.armorMax;
    damageShip(ship, dmg, resetGame);
  }
  // Disable shields when landing
  const shield = getActiveShield(ship);
  if (shield) {
    disableShield(ship, shield);
  }
  // If the ship survived the landing
  if (ship.armor > 0) {
    window.world.selectedPlanet = planet; // currently selected planet (for manage UI)
    window.world.lastPlanetLanded = planet; // last planet landed on
    //Set ship position and angle on the planet surface
    let dir = utils.directionTo(planet.x, planet.y, ship.x, ship.y)
    let r = planet.radius + ship.spriteWidth / 2;
    let {xAmt, yAmt} = utils.dirComponents(dir, r);
    ship.x = planet.x + xAmt;
    ship.y = planet.y + yAmt;
    ship.rotation = dir;
    planet.lastLandingDir = dir;
    game.getShipSprite(ship).rotation = dir;
    repositionScreen();
    game.changeGameState(c.GAME_STATE.MANAGE);
  }
}

export function getExplosionSprite(ship) {
  let sprite = null;
  for (let explosionSprite of window.world.system.explosions) {
    if (!explosionSprite.visible) {
      sprite = explosionSprite;
      break;
    }
  }
  if (!sprite) {
    sprite = game.createExplosionSprite();
  }
  let playerShip = window.world.ship;
  sprite.visible = true;
  sprite.globalX = ship.x;
  sprite.globalY = ship.y;
  sprite.x = (ship.x - playerShip.x) + c.HALF_SCREEN_WIDTH;
  sprite.y = (ship.y - playerShip.y) + c.HALF_SCREEN_HEIGHT;
  return sprite
}

/**
 * Destroys the ship playing an explosion animation
 * @param ship: the one to explode
 * @param afterExplosion: function to run after exploding (or null if nothing to do)
 */
export function destroyShip(ship, afterExplosion) {
  if (ship.owner === c.ALIEN) {
    game.addAlienXp(ship);
  }
  let explosionSprite = getExplosionSprite(ship);
  const shipSprite = game.getShipSprite(ship);
  shipSprite.visible = false;
  ship.alive = false;
  ship.spriteId = null;
  explosionSprite.play();
  // This function runs after the animation finishes a loop
  explosionSprite.onLoop = () => {
    explosionSprite.stop(); // pause until we crash again
    explosionSprite.visible = false;
    if (afterExplosion) {
      afterExplosion();
    }
  };
}

function resetGame() {
  // loadNewShip will setup a new ship but not position it
  let ship = window.world.ship;
  let planet = window.world.selectedPlanet;
  // The current ship is gone
  ship.resourcesMax = 0;
  ship.resources = {titanium: 0, gold: 0, uranium: 0};
  ship.equip = [];
  ship.armorMax = 0;
  ship.armor = 0;

  // If the most recently used planet doesn't have any buildings
  if (!planet || (planet.buildings.length === 0)) {
    // find a planet with a mine
    for (let planet of window.world.planets) {
      if (planet.buildings.length > 0) {
        window.world.selectedPlanet = planet;
        break;
      }
    }
    // No buildings on any planet- game over! 
    if (!planet) {
      window.world.selectedPlanet = window.world.planets[0];
    }
  }
  let {x, y, rotation} = manage.getAvailablePlanetXY(planet, ship, planet.lastLandingDir, 20, 0);
  ship.x = x;
  ship.y = y;
  ship.vx = 0;
  ship.vy = 0;
  ship.rotation = rotation;
  repositionScreen();
  game.changeGameState(c.GAME_STATE.MANAGE);
}

/**
 * Explosion position update on screen as ship moves
 * This is called in the fly loop
 */
function moveExplosions() {
  let ship = window.world.ship;
  for (let sprite of window.world.system.explosions) {
    sprite.x = (sprite.globalX - ship.x) + c.HALF_SCREEN_WIDTH;
    sprite.y = (sprite.globalY - ship.y) + c.HALF_SCREEN_HEIGHT;
  }
}

function turnShip(ship, left) {
  let turnSpeed = ship.turnSpeed;
  let turnBooster = getEquip(ship, c.EQUIP_TYPE_TURN);
  if (turnBooster) {
    turnSpeed += turnBooster.boostSpeed;
  }
  ship.rotation = utils.normalizeRadian(ship.rotation + turnSpeed * (left ? -1 : 1));
}

function propelShip(ship) {
  let propulsion = ship.propulsion;
  let booster = getEquip(ship, c.EQUIP_TYPE_TURN);
  if (booster) {
    propulsion += booster.boostSpeed;
  }
  ship.vx += propulsion * Math.cos(ship.rotation);
  ship.vy += propulsion * Math.sin(ship.rotation);
}

function brakeShip(ship) {
  let brake = getEquip(ship, c.EQUIP_TYPE_BRAKE);
  if (brake) {
    if (brake.brakeSpeedPct > 0) {
      ship.vx -= ship.vx * brake.brakeSpeedPct;
      ship.vy -= ship.vy * brake.brakeSpeedPct;
    } else {
      // Blink brake pct is 0, immediate stop (no momentum)
      ship.vx = 0;
      ship.vy = 0;
    }
  }
}

function thrustShip(ship, left) {
  let thruster = getEquip(ship, c.EQUIP_TYPE_THRUSTER);
  if (thruster) {
    let dir = utils.normalizeRadian(ship.rotation + ((left ? -1 : 1) * Math.PI / 2)); // 90 deg turn
    const thrustX = thruster.thrustSpeed * Math.cos(dir);
    const thrustY = thruster.thrustSpeed * Math.sin(dir);
    if (thruster.thrustType === c.THRUST_MOMENTUM) {
      ship.vx += thrustX;
      ship.vy += thrustY
    } else if (thruster.thrustType === c.THRUST_BLINK) {
      ship.x += thrustX;
      ship.y += thrustY;
    } else {
      console.warn("Unable to use thruster with type " + thruster.thrustType);
    }
  }
}

/**
 * Fires the weapon from the location and direction of the ship
 */
export function fireWeapon(weapon, ship, jitter) {
  if (weapon && (weapon.cool <= 0)) {
    fireBullet(ship, weapon, jitter);
    weapon.cool = weapon.coolTime; // this is decremented in coolWeapons
  }
}

export function firePrimaryWeapon(ship, jitter) {
  let gun = getEquip(ship, c.EQUIP_TYPE_PRIMARY_WEAPON);
  if (gun) {
    fireWeapon(gun, ship, gun.jitter ? gun.jitter : jitter);
  }
}

export function getSecondaryWeapon(ship) {
  if (!ship.selectedSecondaryWeaponIndex || ship.selectedSecondaryWeaponIndex < 0) {
    // Just find any secondary weapon - none was selected
    return getEquip(ship, c.EQUIP_TYPE_SECONDARY_WEAPON);
  }
  // Find the equipped weapon
  const equip = ship.equip[ship.selectedSecondaryWeaponIndex];
  if (equip.type !== c.EQUIP_TYPE_SECONDARY_WEAPON) {
    manage.selectFirstSecondaryWeapon(ship);
    return getEquip(ship, c.EQUIP_TYPE_SECONDARY_WEAPON);
  }
  return equip;
}

export function fireSecondaryWeapon(ship) {
  let weapon = getSecondaryWeapon(ship);
  if (weapon && (weapon.cool <= 0)) {
    if (weapon.createShip) {
      if (!game.canAfford(null, ship, weapon.createShip.type.cost)) {
        // We don't fire the weapon - we can't afford it
        return;
      }
      game.payResourceCost(null, ship, weapon.createShip.type.cost);
      const child = game.createShip(weapon.createShip.type, ship.owner);
      const childSprite = game.getShipSprite(child);
      const shipRadius = ship.spriteWidth || (ship.radius * 2);
      const childDistFromShip = (shipRadius / 2) + (child.spriteWidth / 2) + 20;
      const dir = weapon.createShip.dir === c.DIR_AHEAD_OF_SHIP ? utils.normalizeRadian(ship.rotation - Math.PI) : ship.rotation;
      const {xAmt, yAmt} = utils.dirComponents(dir, childDistFromShip);
      child.x = ship.x - xAmt;
      child.y = ship.y - yAmt;
      if (child.propulsion) {
        child.vx = ship.vx;
        child.vy = ship.vy;
      }
      child.rotation = utils.normalizeRadian(dir - Math.PI);
      childSprite.x = (child.x - window.world.ship.x) + c.HALF_SCREEN_WIDTH;
      childSprite.y = (child.y - window.world.ship.y) + c.HALF_SCREEN_HEIGHT;
      childSprite.visible = true;
      window.world.ships.push(child);
      // Since it may not move we need to check if it collides with anything
      ai.checkForCollisionWithPlanet(child);
      ai.checkForCollisionWithShip(child);
    }
    if (weapon.shield) {
      enableShield(ship, weapon.shield);
    }
    weapon.cool = weapon.coolTime; // this is decremented in coolWeapons
  }
}

/**
 * Called to enable a ship's shield.
 * This will add a shield sprite to the ship and set it to visible
 */
export function enableShield(ship, shield) {
  const shieldSprite = game.getShieldSprite(ship, shield);
  shieldSprite.visible = true;
  shield.active = true;
  shield.lifetime = shield.lifetimeMax;
  shield.armor = shield.armorMax;
  // Increase the ship size to the size of the shield
  ship.spriteWidth = shield.radius * 2;
  ship.spriteHeight = shield.radius * 2;
}

/**
 * Called to disable, and stop drawing a shield on a ship
 */
export function disableShield(ship, shield) {
  const shieldSprite = game.getShieldSprite(ship, shield);
  shieldSprite.visible = false;
  shield.active = false;
  // Reset the ship size back to regular
  const shipSprite = game.getShipSprite(ship);
  ship.spriteWidth = shipSprite.width;
  ship.spriteHeight = shipSprite.height;
}

/**
 * Fires a bullet from the ship
 */
export function fireBullet(ship, gun, jitter) {
  let bullet = findOrCreateBullet(gun.bulletFile);
  bullet.lifetime = gun.lifetime;
  bullet.damage = gun.damage;
  const jitterAmt = jitter ? (jitter * Math.random() * (utils.randomBool() ? -1 : 1)) : 0;
  const rotation = ship.rotation + jitterAmt;
  bullet.vx = ship.vx + gun.speed * Math.cos(rotation);
  bullet.vy = ship.vy + gun.speed * Math.sin(rotation);
  bullet.x = ship.x + Math.sqrt(ship.spriteWidth * ship.spriteWidth + ship.spriteHeight * ship.spriteHeight) / 2 * Math.cos(rotation);
  bullet.y = ship.y + Math.sqrt(ship.spriteWidth * ship.spriteWidth + ship.spriteHeight * ship.spriteHeight) / 2 * Math.sin(rotation);
}

/**
 * Gets the next available bullet (one that is not visible)
 */
function findOrCreateBullet(bulletFile) {
  for (let bullet of window.world.system.bullets) {
    if (!bullet.active && (bullet.fileName === bulletFile)) {
      bullet.active = true;
      bullet.sprite.visible = true;
      return bullet;
    }
  }
  // Create a new bullet
  let bullet = {active: true, damage: 0, x: 0, y: 0, vx: 0, vy: 0, lifetime: 1, fileName: bulletFile};
  // Setup sprite
  let spritesheet = window.PIXI.loader.resources[c.SPRITESHEET_JSON];
  let sprite = new window.PIXI.Sprite(spritesheet.textures[bulletFile]);
  sprite.x = -100;
  sprite.y = -100;
  sprite.anchor.set(0.5, 0.5);
  sprite.scale.set(0.5, 0.5);
  window.world.system.spriteContainers.bullets.addChild(sprite);
  bullet.sprite = sprite;
  window.world.system.bullets.push(bullet);
  return bullet;
}

function killBullet(bullet) {
  bullet.active = false;
  bullet.sprite.visible = false;
  bullet.sprite.x = -100;
  bullet.sprite.y = -100;
  bullet.vx = 0;
  bullet.vy = 0;
}

/**
 * Moves all the bullets (called every draw cycle from app.js mainLoop)
 */
export function moveBullets() {
  let ship = window.world.ship;
  for (let bullet of window.world.system.bullets) {
    if (bullet.active) {
      bullet.x = bullet.x + bullet.vx;
      bullet.y = bullet.y + bullet.vy;
      bullet.sprite.x = (bullet.x - ship.x) + c.HALF_SCREEN_WIDTH;
      bullet.sprite.y = (bullet.y - ship.y) + c.HALF_SCREEN_HEIGHT;
      bullet.lifetime = bullet.lifetime - 1;
      if (bullet.lifetime <= 0) {
        killBullet(bullet);
      }
      checkForBulletCollision(bullet);
    }
  } // for bullet
}

function checkForBulletCollision(bullet) {
  let ship = window.world.ship;
  // Collision with planet
  for (let planet of window.world.system.nearby.planets) {
    if (utils.distanceBetween(planet.x, planet.y, bullet.x, bullet.y) < planet.radius) {
      killBullet(bullet);
    }
  }
  // Collision with ship
  if (ship.alive) {
    const shield = getActiveShield(ship);
    if (shield && utils.distanceBetween(ship.x, ship.y, bullet.x, bullet.y) < shield.radius) {
      bulletHitShip(bullet, ship, resetGame);
    } else {
      const shipSprite = game.getShipSprite(ship);
      if (utils.pointInSprite(ship.x, ship.y, shipSprite, bullet.x, bullet.y)) {
        bulletHitShip(bullet, ship, resetGame);
      }
    }
  }
  // Collision with alien ship
  for (let alien of window.world.system.nearby.ships) {
    if ((alien !== ship) && alien.alive && alien.radius) {
      const shield = getActiveShield(alien);
      if ((shield && utils.distanceBetween(alien.x, alien.y, bullet.x, bullet.y) < shield.radius) || // hit alien shield
        (utils.distanceBetween(alien.x, alien.y, bullet.x, bullet.y) <= alien.radius)) { // hit alien ship
        bulletHitShip(bullet, alien, null);
      }
    }
  } // for alien
}

/**
 * Apply damage from bullet to ship, also kills the bullet
 */
function bulletHitShip(bullet, ship, afterExplosion) {
  damageShip(ship, bullet.damage, afterExplosion);
  killBullet(bullet);
}

/**
 * applies damage to the ship, destroying the ship if needed
 */
export function damageShip(ship, damage, afterExplosion) {
  const shield = getActiveShield(ship);
  if (shield) {
    shield.armor -= damage;
    if (shield.armor <= 0) {
      shield.armor = 0;
      disableShield(ship, shield);
    }
  } else { // no shield
    ship.armor = ship.armor - damage;
    if (ship.armor <= 0) {
      ship.armor = 0;
      destroyShip(ship, afterExplosion);
    }
  }
}

/**
 * collision between player ship and alien (sometimes alien and alien)
 */
export function shipsCollide(ship, alien) {
  if (ship === alien) {
    return; // can't collide with yourself
  }
  let shipDamage = ship.armor;
  let alienDamage = alien.armor;
  damageShip(alien, shipDamage, (window.world.ship === alien) ? resetGame : null);
  damageShip(ship, alienDamage, (window.world.ship === ship) ? resetGame : null);
  // If you died hitting an alien, stop moving
  if (!ship.alive) {
    ship.vx = 0;
    ship.vy = 0;
  }
}

/**
 * @return matching acc equipment type if it is found, null otherwise
 */
export function getEquip(ship, equipType) {
  for (let equip of ship.equip) {
    if (equip.type === equipType) {
      return equip;
    }
  }
  return null;
}

export function drawMiniMap() {
  let g = window.world.system.miniMapGraphics;
  let view = window.world.view;
  let l = 0;
  let t = c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT;
  let r = c.MINIMAP_WIDTH;
  let b = c.SCREEN_HEIGHT;
  g.clear();
  // Background
  g.beginFill(c.MINIMAP_BACKGROUND_COLOR);
  g.lineStyle(1, c.MINIMAP_BORDER_COLOR);
  g.drawRect(l, t, r, b);
  g.endFill();
  // Planets
  for (let planet of window.world.planets) {
    if (planetOnMap(view, planet)) {
      let x = l + c.HALF_MINIMAP_WIDTH + ((planet.x - view.x) * c.MINIMAP_SCALE_X);
      let y = t + c.HALF_MINIMAP_HEIGHT + ((planet.y - view.y) * c.MINIMAP_SCALE_Y);
      const planetColor = window.world.selectedPlanet === planet ? c.MINIMAP_SELECTED_PLANET_COLOR : c.MINIMAP_PLANET_COLOR;
      g.lineStyle(2, planetColor);
      g.drawCircle(x, y, planet.radius * c.MINIMAP_SCALE_X);
      // Buildings
      for (let building of planet.buildings) {
        let buildingX = l + c.HALF_MINIMAP_WIDTH + ((building.x - view.x) * c.MINIMAP_SCALE_X) - 1.5;
        let buildingY = t + c.HALF_MINIMAP_HEIGHT + ((building.y - view.y) * c.MINIMAP_SCALE_Y) - 1.5;
        g.lineStyle(1, c.MINIMAP_BUILDING_COLOR);
        g.drawRect(buildingX, buildingY, 2, 2);
      }
    }
  }
  // Ship
  g.lineStyle(1, c.MINIMAP_SHIP_COLOR);
  const x = l + c.HALF_MINIMAP_WIDTH + ((window.world.ship.x - view.x) * c.MINIMAP_SCALE_X);
  const y = t + c.HALF_MINIMAP_HEIGHT + ((window.world.ship.y - view.y) * c.MINIMAP_SCALE_Y);
  g.drawCircle(x, y, 2);
}

/**
 * Handles clicks on the minimap
 */
export function clickOnMinimap(clickX, clickY) {
  if (window.world.system.gameState === c.GAME_STATE.MANAGE) {
    const view = window.world.view
    let globalX = view.x + ((clickX - c.HALF_MINIMAP_WIDTH) * (1 / c.MINIMAP_SCALE_X));
    let globalY = view.y + (((clickY - (c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT)) - c.HALF_MINIMAP_HEIGHT) * (1 / c.MINIMAP_SCALE_X));
    for (let planet of window.world.planets) {
      if (utils.distanceBetween(globalX, globalY, planet.x, planet.y) <= planet.radius) {
        window.world.selectedPlanet = planet;
      }
    }
    view.x = globalX;
    view.y = globalY;
    drawMiniMap();
  }
}

function planetOnMap(view, planet) {
  // Right side
  return !((view.x + c.HALF_MINIMAP_VIEW_WIDTH + planet.radius < planet.x) || // Right
    (view.x - c.HALF_MINIMAP_VIEW_WIDTH - planet.radius > planet.x) || // Left
    (view.y + c.HALF_MINIMAP_VIEW_HEIGHT + planet.radius < planet.y) || // Bottom
    (view.y - c.HALF_MINIMAP_VIEW_HEIGHT - planet.radius > planet.y));
}

/**
 * @return the max range of the weapon
 */
export function weaponRange(weapon) {
  if (!weapon) {
    return 0;
  }
  // Not sure what the fudge factor is, but the range seems a little short without it
  return weapon.speed * weapon.lifetime * 1.4;
}

/**
 * @return the max range of the primary weapon on the ship
 */
export function primaryWeaponRange(ship) {
  let gun = getEquip(ship, c.EQUIP_TYPE_PRIMARY_WEAPON);
  return weaponRange(gun);
}
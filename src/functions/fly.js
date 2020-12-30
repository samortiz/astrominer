import {utils, c, game, manage, ai, fly} from './';
import {getPlanetSprite, getShipSprite} from "./game";
import {shootAt} from "./ai";

export function enterFlyState() {
  console.log("Take off");
}

// Main play mode - flying
export function flyLoop(delta) {
  let world = window.world;
  let ship = window.world.ship;
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
      firePrimaryWeapon(ship);
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
    for (let planet of world.planets) {
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

    let shipSprite = getShipSprite(ship);
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
      for (let alien of world.aliens) {
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
 * Recalculates all the locations of planets and aliens
 */
export function repositionScreen() {
  // Reposition all the planets
  for (let planet of window.world.planets) {
    planetInView(window.world.ship, planet);
  }
  // Reposition all the aliens
  ai.moveAliens();
  drawMiniMap();
}

/**
 * Cools all ship weapons, run in mainLoop 
 */
export function coolAllWeapons() {
  coolWeapons(window.world.ship);
  for (let alien of window.world.aliens) {
    coolWeapons(alien);
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
      let cost = {titanium:droid.repairSpeed, gold:0, uranium:0};
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
  for (let alien of window.world.aliens) {
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
    let dirToShoot = utils.normalizeRadian(Math.atan2(nearestAlien.y - ship.y, nearestAlien.x - ship.x));
    let jitterAmt = 0.1 * Math.random() * (utils.randomBool() ? -1 : 1);
    ship.rotation = utils.normalizeRadian(dirToShoot + jitterAmt);
    fireWeapon(weapon, ship);
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
      const sprite = getPlanetSprite(planet);
      if (sprite.visible) {
        sprite.visible = false;
      }
    }
    return false;
  }
  // Here we know this planet is in view
  const sprite = getPlanetSprite(planet);
  sprite.visible = true;
  // Set planet relative to the ship's viewport
  sprite.x = (planet.x - ship.x) + c.HALF_SCREEN_WIDTH;
  sprite.y = (planet.y - ship.y) + c.HALF_SCREEN_HEIGHT;
  return true;
}

// Returns true if there is a collision and false otherwise
export function detectCollisionWithPlanet(ship, shipSprite, planet) {
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
  // If the ship survived the landing
  if (ship.armor > 0) {
    window.world.selectedPlanet = planet;
    //Set ship position and angle on the planet surface
    let dir = utils.directionTo(planet.x, planet.y, ship.x, ship.y)
    let r = planet.radius + ship.spriteWidth / 2;
    let {xAmt, yAmt} = utils.dirComponents(dir, r);
    ship.x = planet.x + xAmt;
    ship.y = planet.y + yAmt;
    ship.rotation = dir;
    planet.lastLandingDir = dir;
    getShipSprite(ship).rotation = dir;
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
  const shipSprite = getShipSprite(ship);
  shipSprite.visible = false;
  ship.alive = false;
  ship.spriteId = null;
  explosionSprite.play();
  // This function runs after the animation finishes a loop
  explosionSprite.onLoop= () => {
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
  ship.resources = {titanium : 0,gold : 0,uranium : 0};
  ship.equip = [];
  ship.armorMax = 0;
  ship.armor = 0;

  // If the most recently used planet doesn't have any buildings
  if (!planet || (planet.buildings.length === 0)) {
    console.log("Looking for suitable planet");
    // find a planet with a mine
    for (let planet of window.world.planets) {
      if (planet.buildings.length > 0) {
        console.log("Found "+planet.name+" with buildings");
        window.world.selectedPlanet = planet;
        break;
      }
    }
    // No buildings on any planet- game over! 
    if (!planet) {
      console.log("no planets with buildings");
      window.world.selectedPlanet = window.world.planets[0];
    }
  }
  console.log('before finding new location');
  let {x,y,rotation} = manage.getAvailablePlanetXY(planet, ship, planet.lastLandingDir, 20, 0);
  ship.x = x;
  ship.y = y;
  ship.vx = 0;
  ship.vy = 0;
  ship.rotation = rotation;
  console.log('start fly');
  flyLoop(0); // redraw the screen once
  console.log('end fly');
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
    let dir =utils.normalizeRadian(ship.rotation + ((left ? -1 : 1) * Math.PI/2)); // 90 deg turn
    if (thruster.thrustType === c.THRUST_MOMENTUM) {
      ship.vx += thruster.thrustSpeed * Math.cos(dir);
      ship.vy += thruster.thrustSpeed * Math.sin(dir);
    } else if (thruster.thrustType === c.THRUST_BLINK) {
      ship.x += thruster.thrustSpeed * Math.cos(dir);
      ship.y += thruster.thrustSpeed * Math.sin(dir);
    } else {
      console.warn("Unable to use thruster with type "+thruster.thrustType);
    }
  }
}

/**
 * Fires the weapon from the location and direction of the ship
 */
export function fireWeapon(weapon, ship) {
  if (weapon && (weapon.cool <= 0)) {
    fireBullet(ship, weapon);
    weapon.cool = weapon.coolTime; // this is decremented in coolWeapons
  }
}

export function firePrimaryWeapon(ship) {
  let gun = getEquip(ship, c.EQUIP_TYPE_PRIMARY_WEAPON);
  fireWeapon(gun, ship);
}

export function fireSecondaryWeapon(ship) {
  let weapon = getEquip(ship, c.EQUIP_TYPE_SECONDARY_WEAPON);
  if (weapon && (weapon.cool <= 0)) {
    if (weapon.createShip) {
      const mine = game.createShip(weapon.createShip, c.PLAYER);
      const mineSprite = getShipSprite(mine);
      const mineDistFromShip = ship.spriteWidth/2 + mine.spriteWidth/2 + 20;
      const {xAmt, yAmt} = utils.dirComponents(ship.rotation, mineDistFromShip);
      mine.x = ship.x - xAmt;
      mine.y = ship.y - yAmt;
      mineSprite.visible = true;
      mineSprite.x = (mine.x - ship.x) + c.HALF_SCREEN_WIDTH;
      mineSprite.y = (mine.y - ship.y) + c.HALF_SCREEN_HEIGHT;
      window.world.aliens.push(mine);
    }
    weapon.cool = weapon.coolTime; // this is decremented in coolWeapons
  }
}

/**
 * Fires a bullet from the ship
 */
export function fireBullet(ship, gun) {
  let bullet = findOrCreateBullet(gun.bulletFile);
  bullet.lifetime = gun.lifetime;
  bullet.damage = gun.damage;
  bullet.vx = ship.vx + gun.speed * Math.cos(ship.rotation);
  bullet.vy = ship.vy + gun.speed * Math.sin(ship.rotation);
  bullet.x = ship.x + Math.max(ship.spriteWidth, ship.spriteHeight)/2 * Math.cos(ship.rotation);
  bullet.y = ship.y + Math.max(ship.spriteWidth, ship.spriteHeight)/2 * Math.sin(ship.rotation);
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
  let bullet = {active:true, damage:0, x:0, y:0, vx:0, vy:0, lifetime:1, fileName:bulletFile};
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
      bullet.lifetime =  bullet.lifetime - 1;
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
  for (let planet of window.world.planets) {
    if (utils.distanceBetween(planet.x, planet.y, bullet.x, bullet.y) < planet.radius) {
      // TODO: Check for building damage
      killBullet(bullet);
    }
  }
  // Collision with ship
  if (ship.alive) {
    const shipSprite = getShipSprite(ship);
    if (shipSprite.containsPoint({x:bullet.sprite.x, y:bullet.sprite.y})) {
      bulletHitShip(bullet, ship, resetGame);
    }
  } 
  // Collision with alien ship
  for (let alien of window.world.aliens) {
    // This check will only work with circular aliens, need a separate check for rectangular ones
    if (alien.alive && alien.radius && utils.distanceBetween(alien.x, alien.y, bullet.x, bullet.y) <= alien.radius) {
      bulletHitShip(bullet, alien, null);
    }
  }
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
  ship.armor = ship.armor - damage;
  if (ship.armor <= 0) {
    ship.armor = 0;
    destroyShip(ship, afterExplosion);
  }
}

/**
 * collision between player ship and alien (sometimes alien and alien)
 */
export function shipsCollide(ship, alien) {
  let shipDamage = ship.armor;
  let alienDamage = alien.armor;
  damageShip(alien, shipDamage, null);
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
      g.lineStyle(1, c.MINIMAP_PLANET_COLOR);
      g.drawCircle(x,y, planet.radius * c.MINIMAP_SCALE_X);
      // Buildings
      for (let building of planet.buildings) {
        let buildingX = l + c.HALF_MINIMAP_WIDTH + ((building.x - view.x) * c.MINIMAP_SCALE_X) -1.5;
        let buildingY = t + c.HALF_MINIMAP_HEIGHT + ((building.y - view.y) * c.MINIMAP_SCALE_Y) -1.5;
        g.lineStyle(1, c.MINIMAP_BUILDING_COLOR);
        g.drawRect(buildingX,buildingY,3,3); 
      }
    }
  }
  // Ship
  g.lineStyle(1, c.MINIMAP_SHIP_COLOR);
  g.drawCircle(l+c.MINIMAP_WIDTH/2,t+c.MINIMAP_HEIGHT/2, 2);
}

/**
 * Handles clicks on the minimap 
 */
export function clickOnMinimap(clickX, clickY) {
  if (window.world.system.gameState === c.GAME_STATE.MANAGE) {
    const view = window.world.view
    let globalX = view.x + ((clickX - c.HALF_MINIMAP_WIDTH) * (1/c.MINIMAP_SCALE_X));
    let globalY = view.y + (((clickY - (c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT)) - c.HALF_MINIMAP_HEIGHT) * (1/c.MINIMAP_SCALE_X));
    for (let planet of window.world.planets) {
      if (utils.distanceBetween(globalX, globalY, planet.x, planet.y) <= planet.radius) {
        window.world.selectedPlanet = planet;
      }
    }
    view.x = globalX;
    view.y =  globalY;
    drawMiniMap();
  }
}


function planetOnMap(view, planet) {
  // Right side
  if ((view.x + c.HALF_MINIMAP_VIEW_WIDTH + planet.radius < planet.x) || // Right
      (view.x - c.HALF_MINIMAP_VIEW_WIDTH - planet.radius > planet.x) || // Left
      (view.y + c.HALF_MINIMAP_VIEW_HEIGHT + planet.radius < planet.y) || // Bottom
      (view.y - c.HALF_MINIMAP_VIEW_HEIGHT - planet.radius > planet.y)) { // Top
    return false;
  }
  return true;
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
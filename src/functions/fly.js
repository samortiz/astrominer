import { utils, c, game, manage, ai } from './';

export function enterFlyState() {
  console.log("Take off");
}

// Main play mode - flying
export function flyLoop(delta) {
  let world = window.world;
  let ship = world.ship;
  // When sprite.visible is false the ship is exploding
  if (ship.sprite.visible) {
    runRepairDroids(ship);
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
    if (world.system.keys.q.isDown) {
      thrustShip(ship, true);
    }
    if (world.system.keys.e.isDown) {
      thrustShip(ship, false);
    }
  }
  // Find planets in view
  let planetsInView = [];
  for (let planet of world.planets) {
    if (planetInView(ship, planet)) {
      planetsInView.push(planet);
    }
  }
  if (ship.sprite.visible) {
    // Gravity
    for (let planet of planetsInView) {
      let grav = utils.calcGravity(ship.x, ship.y, planet);
      ship.vx += grav.x;
      ship.vy += grav.y;
    }
  }
  // move the ship
  ship.x += ship.vx;
  ship.y += ship.vy;
  moveExplosions(); // especially alien explosions
  moveBackground(ship);
  // if ship is not busy exploding
  if (ship.sprite.visible) { 
    // Ship-Planet Collisions
    for (let planet of planetsInView) {
      if (detectCollisionWithPlanet(ship, planet)) {
        if (successfulLanding(ship, planet)) {
          landShip(ship, planet);
        } else {
          crash(ship);
        }
        return; // exit loop
      }
    } // for planet
    // Ship-Alien collision
    for (let alien of world.aliens) {
      if (alien.sprite.visible && detectCollisionWithAlien(ship, alien)) {
        shipsCollide(ship, alien);
      }
    }
  }
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
    if ((equip.type === c.EQUIP_TYPE_PRIMARY_WEAPON) && (equip.cool > 0)) {
      equip.cool -= 1;
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

export function runRepairDroids(ship) {
  for (let droid of ship.equip) {
    if ((droid.type === c.EQUIP_TYPE_REPAIR_DROID) && (ship.armor < ship.armorMax)) {
      let cost = {titanium:droid.repairSpeed, gold:0, uranium:0};
      if (game.canAfford(null, ship, cost)) {
        ship.armor += droid.repairSpeed;
        game.payResourceCost(null, ship, cost);
      }
    }
  } // for
}

export function moveBackground(ship) {
  let bgSprite = window.world.bgSprite;
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
     planet.sprite.visible = false;
    return false;
  }
  planet.sprite.visible = true;
  // Set planet relative to the ship's viewport
  planet.sprite.x = (planet.x - ship.x) + c.HALF_SCREEN_WIDTH;
  planet.sprite.y = (planet.y - ship.y) + c.HALF_SCREEN_HEIGHT;
  return true;
}

// Returns true if there is a collision and false otherwise
export function detectCollisionWithPlanet(ship, planet) {
  // [[x,y],[x,y]]
  let collisionPoints = utils.getVertexData(ship.x, ship.y, ship.sprite); 
  for (let point of collisionPoints) {
    let dist = utils.distanceBetween(point[0], point[1], planet.x, planet.y);
    if (dist < planet.radius - c.ALLOWED_OVERLAP) { 
      return true;
    } 
  }
  return false;
}

// Returns true if there is a collision and false otherwise
export function detectCollisionWithAlien(ship, alien) {
  let collisionPoints = utils.getVertexData(ship.x, ship.y, ship.sprite); 
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
 * @return true if the landing was successful
 * NOTE: This will cause damage to the ship attempting to land (side-effects)
 */
function successfulLanding(ship, planet) {
  // atan2 has parameters (y,x)
  let planetDir = utils.normalizeRadian(Math.atan2(ship.y - planet.y, ship.x - planet.x));
  let dirDiff = Math.abs(ship.sprite.rotation - planetDir);
  let speed = Math.abs(ship.vx) + Math.abs(ship.vy);
  // 0 and PI*2 are right beside each other, so large values are very close to small values
  let success = ((dirDiff < ship.crashAngle) || (dirDiff > (Math.PI * 2 - ship.crashAngle)))
                && (speed < ship.crashSpeed)
  if (success) {
    // The landing was good - no damage done
    return success;
  }
  // damage ship for poor landing
  let speedDiff = Math.max(speed - ship.crashSpeed, 0); // 0 if negative
  let dirDiffAdj = Math.max(dirDiff - ship.crashAngle, 0); // 0 if negative
  if (dirDiffAdj > Math.PI) {
    dirDiffAdj = (Math.PI * 2) - dirDiff - ship.crashAngle;
  }
  let dmgPct = (speedDiff/3) + dirDiffAdj;
  let dmg = dmgPct * ship.armorMax;
  damageShip(ship, dmg, resetGame);
  // If the ship survived return true
  return ship.armor > 0;
}

function landShip(ship, planet) {
  window.world.selectedPlanet = planet;
  // Stop moving (even though the event loop stops movement)
  ship.vx = 0;
  ship.vy = 0;
  //Set ship position and angle on the planet surface
  let dir = utils.normalizeRadian(Math.atan2(ship.y - planet.y, ship.x - planet.x));
  let r = planet.radius + ship.sprite.width/2; 
  ship.x = planet.x + (r * Math.cos(dir));
  ship.y = planet.y + (r * Math.sin(dir));
  ship.sprite.rotation = dir;
  game.changeGameState(c.GAME_STATE.MANAGE);
}

export function crash(ship) {
  // Hit a planet so stop moving suddenly
  ship.vx = 0;
  ship.vy = 0;
  destroyShip(ship, resetGame);
}

export function getExplosionSprite(ship) {
  let sprite = null;
  for (let explosionSprite of window.world.explosions) {
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
 * @param ship : the one to explode
 * @param afterExplosion : function to run after exploding (or null if nothing to do)
 */
export function destroyShip(ship, afterExplosion) {
  if (ship !== window.world.ship) {
    game.addAlienXp(ship);
  }
  let explosionSprite = getExplosionSprite(ship);
  ship.sprite.visible = false;
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
  ship.sprite.visible = false;
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
  let {x,y,rotation} = manage.getAvailablePlanetXY(planet, ship, 0, 20, 0);
  ship.x = x;
  ship.y = y;
  ship.vx = 0;
  ship.vy = 0;
  ship.sprite.rotation = rotation;
  flyLoop(0); // redraw the screen once
  game.changeGameState(c.GAME_STATE.MANAGE);
}

/**
 * Explosion position update on screen as ship moves
 * This is called in the fly loop
 */
function moveExplosions() {
  let ship = window.world.ship;
  for (let sprite of window.world.explosions) {
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
  ship.sprite.rotation = utils.normalizeRadian(ship.sprite.rotation + turnSpeed * (left ? -1 : 1));
}

function propelShip(ship) {
  let propulsion = ship.propulsion;
  let booster = getEquip(ship, c.EQUIP_TYPE_TURN);
  if (booster) {
    propulsion += booster.boostSpeed;
  }
  ship.vx += propulsion * Math.cos(ship.sprite.rotation);
  ship.vy += propulsion * Math.sin(ship.sprite.rotation);
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
    let dir =utils.normalizeRadian(ship.sprite.rotation + ((left ? -1 : 1) * Math.PI/2)); // 90 deg turn
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

export function firePrimaryWeapon(ship) {
  let gun = getEquip(ship, c.EQUIP_TYPE_PRIMARY_WEAPON);
  if (gun && (gun.cool <= 0)) {
    fireBullet(ship, gun);
    gun.cool = gun.coolTime; // this is decremented in coolWeapons
  }
}

/**
 * Fires a bullet from the ship
 */
export function fireBullet(ship, gun) {
  let bullet = findOrCreateBullet(gun.bulletFile);
  bullet.lifetime = gun.lifetime;
  bullet.damage = gun.damage;
  bullet.vx = ship.vx + gun.speed * Math.cos(ship.sprite.rotation);
  bullet.vy = ship.vy + gun.speed * Math.sin(ship.sprite.rotation);
  bullet.x = ship.x + Math.max(ship.sprite.width, ship.sprite.height)/2 * Math.cos(ship.sprite.rotation);
  bullet.y = ship.y + Math.max(ship.sprite.width, ship.sprite.height)/2 * Math.sin(ship.sprite.rotation);
}

/**
 * Gets the next available bullet (one that is not visible)
 */
function findOrCreateBullet(bulletFile) {
  for (let bullet of window.world.bullets) {
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
  window.world.system.app.stage.addChild(sprite);
  bullet.sprite = sprite;
  window.world.bullets.push(bullet);
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
  for (let bullet of window.world.bullets) {
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
  if (ship.sprite.visible && ship.sprite.containsPoint({x:bullet.sprite.x, y:bullet.sprite.y})) {
    bulletHitShip(bullet, ship, resetGame);
  } 
  // Collision with alien ship
  for (let alien of window.world.aliens) {
    // This check will only work with circular aliens, need a separate check for rectangular ones
    if (alien.sprite.visible && alien.radius && utils.distanceBetween(alien.x, alien.y, bullet.x, bullet.y) <= alien.radius) {
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
 * collision between player ship and alien
 */
export function shipsCollide(ship, alien) {
  let shipDamage = ship.armor;
  let alienDamage = alien.armor;
  damageShip(alien, shipDamage, null);
  damageShip(ship, alienDamage, (window.world.ship === ship) ? resetGame : null);
  // If you died hitting an alien, stop moving
  if (!ship.sprite.visible) {
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
  let g = window.world.miniMapGraphics;
  let ship = window.world.ship;
  let l = 0;
  let t = c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT;
  let r = c.MINIMAP_WIDTH;
  let b = c.SCREEN_HEIGHT;
  g.clear();
  // Background
  g.beginFill(c.DARK_GREY);
  g.lineStyle(1, c.MED_GREY); 
  g.drawRect(l, t, r, b);
  g.endFill();
  // Planets
  for (let planet of window.world.planets) {
    if (planetOnMap(ship, planet)) {
      let x = l + c.HALF_MINIMAP_WIDTH + ((planet.x - ship.x) * c.MINIMAP_SCALE_X);
      let y = t + c.HALF_MINIMAP_HEIGHT + ((planet.y - ship.y) * c.MINIMAP_SCALE_Y);
      g.lineStyle(1, c.LIGHT_GREY);
      g.drawCircle(x,y, planet.radius * c.MINIMAP_SCALE_X);
      // Buildings
      for (let building of planet.buildings) {
        let buildingX = l + c.HALF_MINIMAP_WIDTH + ((building.x - ship.x) * c.MINIMAP_SCALE_X) -1.5; 
        let buildingY = t + c.HALF_MINIMAP_HEIGHT + ((building.y - ship.y) * c.MINIMAP_SCALE_Y) -1.5;
        g.lineStyle(1, c.RED); 
        g.drawRect(buildingX,buildingY,3,3); 
      }
    }
  }
  // Ship
  g.lineStyle(1, c.WHITE);
  g.drawCircle(l+c.MINIMAP_WIDTH/2,t+c.MINIMAP_HEIGHT/2, 2);
}

/**
 * Handles clicks on the minimap 
 */
export function clickOnMinimap(clickX, clickY) {
  if (window.world.system.gameState === c.GAME_STATE.MANAGE) {
    let ship = window.world.ship;
    let globalX = ship.x + ((clickX - c.HALF_MINIMAP_WIDTH) * (1/c.MINIMAP_SCALE_X));
    let globalY = ship.y + (((clickY - (c.SCREEN_HEIGHT - c.MINIMAP_HEIGHT)) - c.HALF_MINIMAP_HEIGHT) * (1/c.MINIMAP_SCALE_X));
    for (let planet of window.world.planets) {
      if (utils.distanceBetween(globalX, globalY, planet.x, planet.y) <= planet.radius) {
        window.world.selectedPlanet = planet;
        // TODO: redraw based on what ship?
      }
    }
  }
}


function planetOnMap(ship, planet) {
  // Right side
  if ((ship.x + c.HALF_MINIMAP_VIEW_WIDTH + planet.radius < planet.x) || // Right
      (ship.x - c.HALF_MINIMAP_VIEW_WIDTH - planet.radius > planet.x) || // Left
      (ship.y + c.HALF_MINIMAP_VIEW_HEIGHT + planet.radius < planet.y) || // Bottom
      (ship.y - c.HALF_MINIMAP_VIEW_HEIGHT - planet.radius > planet.y)) { // Top
    return false;
  }
  return true;
}


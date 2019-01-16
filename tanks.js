// class Tank extends Sprite {
//   constructor(x, y, vx,vy) {
//     this.x = x;
//     this.y = y;
//     this.vx = vx;
//     this.vy = vy;
//   }
// }

//create app and add to html
let app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

//create stabe
let stage = new PIXI.Container();

//load
  PIXI.loader
  .add('tank', 'tankGreen.png')
  .add('tank2', 'tankGreen.png')
  .add('bullet','bulletBeigeSilver_outline.png')
  .add('smoke','smokeYellow4.png')
  .load(setup);

//initialize tanks
let tank;
let tank2;
let bullet;

function setup() {
  stage.interactive = true;

  // create a new Sprite from an image path
  tank = new PIXI.Sprite(
    PIXI.loader.resources['tank'].texture
  );
  
  //create second tank
  tank2 = new PIXI.Sprite(
    PIXI.loader.resources['tank2'].texture
  );
  

  //add attributes to tanks
  setTankVal(tank, app.screen.width / 2, app.screen.width / 2, 0, 0);
  setTankVal(tank2, app.screen.width / 4, app.screen.width / 4, 0, 0);

  app.stage.addChild(tank);
  app.stage.addChild(tank2);
  
  // setKeys(tank2,"ArrowLeft","ArrowRight","ArrowUp","ArrowDown");
  setKeys(tank,"ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ");
 // setKeys(tank,"KeyA","KeyD","KeyW","KeyS"); 

  
  //when tank gets hit
  // app.stage.removeChild(anySprite)
  //anySprite.visible = false;

}

function hitTestRectangle(r1, r2) {

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

function setKeys(obj,l, r, u ,d , s){

  //Capture the keyboard arrow keys
  let left = keyboard(l),
      up = keyboard(u),
      right = keyboard(r),
      down = keyboard(d);
      space = keyboard(s);

  //Left arrow key `press` method
  left.press = () => {
    //Change the tank's velocity when the key is pressedtank
    obj.vx = -5;
    obj.vy = 0;
  };
  
  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the obj isn't moving vertically:
    //Stop the obj
    if (!right.isDown && obj.vy === 0) {
      obj.vx = 0;
    }
  };

  //Up
  up.press = () => {
    obj.vy = -5;
    obj.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && obj.vx === 0) {
      obj.vy = 0;
    }
  };

  //Right
  right.press = () => {
    obj.vx = 5;
    obj.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && obj.vy === 0) {
      obj.vx = 0;
    }
  };
  
  //Down
  down.press = () => {
    obj.vy = 5;
    obj.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && obj.vx === 0) {
      obj.vy = 0;
    }
  };

  space.press = () => {
    console.log("yo")
    shoot();
  };

  //Set the game state
  state = play;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));

}

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  

  return key;
}
var bullets = [];  

function shoot (){
  bullet = new PIXI.Sprite(
    PIXI.loader.resources['bullet'].texture
  );
  bullet.x = tank.x;
  bullet.y = tank.y;
  bullet.vy = 3;
  app.stage.addChild(bullet);
  bullets.push(bullet);
}

function gameLoop(delta){

  //Update the current game state:
  state(delta);
}

function play(delta) {
  //bullet.y += bullet.vy;
  //Use the tank's velocity to make it move

  for(var b=bullets.length-1;b>=0;b--){
    bullets[b].position.y -= bullet.vy
    if (hitTestRectangle(tank2,bullets[b])){
      bullets[b].visible = false;
      tank2.texture = PIXI.utils.TextureCache["smoke"];
    }
  }

  
  tank.x += tank.vx;
  tank.y += tank.vy;
  tank2.x += tank2.vx;
  tank2.y += tank2.vy
}

function setTankVal(obj, x, y, vx, vy) {
  obj.x = x;
  obj.y = y;
  obj.vx = vx;
  obj.vy = vy;

}



// window.addEventListener('keydown',function(event) {
//   event.preventDefault();
//   tank.x += tank.vx;
// });


// Listen for animate update


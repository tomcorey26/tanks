// class Tank extends Sprite {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
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
  .load(setup);

//initialize tanks
let tank;
let tank2;

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
 
  //Capture the keyboard arrow keys
  let left = keyboard("KeyA"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");
      aKey = keyboard("KeyA");
      //sKey = keyboard

  

  //Left arrow key `press` method
  left.press = () => {
    //Change the tank's velocity when the key is pressedtank
    tank.vx = -5;
    tank.vy = 0;
    console.log('meep2');
  };
  
  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the tank isn't moving vertically:
    //Stop the tank
    if (!right.isDown && tank.vy === 0) {
      tank.vx = 0;
    }
  };

  //Up
  up.press = () => {
    tank.vy = -5;
    tank.vx = 0;
    console.log("meep")
  };
  up.release = () => {
    if (!down.isDown && tank.vx === 0) {
      tank.vy = 0;
    }
  };

  //Right
  right.press = () => {
    tank.vx = 5;
    tank.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && tank.vy === 0) {
      tank.vx = 0;
    }
  };
  
  //Down
  down.press = () => {
    tank.vy = 5;
    tank.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && tank.vx === 0) {
      tank.vy = 0;
    }
  };

  //Set the game state
  state = play;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));

  // setKeys(tank,"ArrowLeft","ArrowRight","ArrowUp","ArrowDown");
  // setKeys(tank,"KeyA","KeyD","KeyW","KeyS");

  
  //when tank gets hit
  // app.stage.removeChild(anySprite)
  //anySprite.visible = false;

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


function gameLoop(delta){

  //Update the current game state:
  state(delta);
}

function play(delta) {

  //Use the tank's velocity to make it move
  tank.x += tank.vx;
  tank.y += tank.vy
}

function setTankVal(tank, x, y, vx, vy) {
  tank.x = x;
  tank.y = y;
  tank.vx = vx;
  tank.vy = vy;

}



// window.addEventListener('keydown',function(event) {
//   event.preventDefault();
//   tank.x += tank.vx;
// });


// Listen for animate update

function setKeys(obj,l, r, u ,d){

  //Capture the keyboard arrow keys
  let left = keyboard(l),
      up = keyboard(u),
      right = keyboard(r),
      down = keyboard(d);

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
    console.log("meep")
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
      tank.vy = 0;
    }
  };

  //Set the game state
  state = play;

  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));

}
import * as PIXI from "pixi.js";
import { Howl } from "howler";
import * as gamepad from "./gamepad";
import SoundEffect from "./SoundEffect";

var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

var sound = new SoundEffect("sounds/boing.mp3");

PIXI.utils.sayHello(type);

PIXI.loader.add(["images/testImage.png", "images/square.png"]).load(setup);

function setup() {
  var renderer = PIXI.autoDetectRenderer(256, 256);
  document.body.appendChild(renderer.view);

  var sprite = new PIXI.Sprite(
    PIXI.loader.resources["images/testImage.png"].texture
  );
  var square = new PIXI.Sprite(
    PIXI.loader.resources["images/square.png"].texture
  );
  square.x = 128;
  square.y = 128;
  sprite.vx = 0;
  sprite.vy = 0;

  var style = new PIXI.TextStyle({
    fontSize: 12,
    fill: "#fff"
  });
  var basicText = new PIXI.Text("World domination is near!", style);
  basicText.x = 50;
  basicText.y = 10;

  var stage = new PIXI.Container();
  stage.addChild(basicText);
  stage.addChild(sprite);
  stage.addChild(square);
  renderer.render(stage);

  function gameLoop() {
    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);

    if (gamepad.right.isDown) {
      sprite.vx += 1;
    }

    if (gamepad.left.isDown) {
      sprite.vx -= 1;
    }

    if (gamepad.up.isDown) {
      sprite.vy -= 1;
    }

    if (gamepad.down.isDown) {
      sprite.vy += 1;
    }

    // apply drag
    let drag = 0.2;
    sprite.vx *= 1 - drag;
    sprite.vy *= 1 - drag;

    sprite.vx = sprite.vx;
    sprite.vy = sprite.vy;

    var oldX = sprite.x;
    var oldY = sprite.y;
    sprite.x += sprite.vx;
    sprite.y += sprite.vy;

    console.log(sprite.x, sprite.y, sprite.vx, sprite.vy);

    if (sprite.x < 0) {
      sprite.x = 0;
      sprite.vx = 0;
      boing();
    }
    if (sprite.y < 0) {
      sprite.y = 0;
      sprite.vy = 0;
      boing();
    }
    if (sprite.y + sprite.height > 256) {
      sprite.y = 256 - sprite.height;
      sprite.vy = 0;
      boing();
    }
    if (sprite.x + sprite.width > 256) {
      sprite.x = 256 - sprite.width;
      sprite.vx = 0;
      boing();
    }

    if (isCollide(sprite, square)) {
      sprite.x = oldX;
      sprite.y = oldY;
      sprite.vx *= -1 * 0.1;
      sprite.vy *= -1 * 0.1;
      boing();
    }

    //Render the stage to see the animation
    renderer.render(stage);
  }

  function isCollide(a, b) {
    return !(
      a.y + a.height < b.y ||
      a.y > b.y + b.height ||
      a.x + a.width < b.x ||
      a.x > b.x + b.width
    );
  }

  function boing() {
    sound.play();
  }
  //Start the game loop
  gameLoop();
}

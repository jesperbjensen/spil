import * as PIXI from "pixi.js";
import keyboard from "./keyboard";
import { Howl } from "howler";

var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

var sound = new Howl({
  src: ["sounds/boing.mp3"]
});

PIXI.utils.sayHello(type);

PIXI.loader.add("images/testImage.png").load(setup);

function setup() {
  var left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  var renderer = PIXI.autoDetectRenderer(256, 256);
  //   renderer.view.style.position = "absolute";
  //   renderer.view.style.display = "block";
  //   renderer.autoResize = true;
  //   renderer.resize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.view);

  var sprite = new PIXI.Sprite(
    PIXI.loader.resources["images/testImage.png"].texture
  );
  sprite.vx = 0;
  sprite.vy = 0;

  var stage = new PIXI.Container();
  stage.addChild(sprite);
  renderer.render(stage);

  function gameLoop() {
    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);

    if (right.isDown) {
      sprite.vx += 1;
    }

    if (left.isDown) {
      sprite.vx -= 1;
    }

    if (up.isDown) {
      sprite.vy -= 1;
    }

    if (down.isDown) {
      sprite.vy += 1;
    }

    // apply drag
    let drag = 0.2;
    sprite.vx *= 1 - drag;
    sprite.vy *= 1 - drag;

    sprite.x += sprite.vx;
    sprite.y += sprite.vy;

    if (sprite.x < 0) {
      sprite.x = 0;
      boing();
    }
    if (sprite.y < 0) {
      sprite.y = 0;
      boing();
    }
    if (sprite.y + sprite.height > 256) {
      sprite.y = 256 - sprite.height;
      boing();
    }
    if (sprite.x + sprite.width > 256) {
      sprite.x = 256 - sprite.width;
      boing();
    }

    //Render the stage to see the animation
    renderer.render(stage);
  }

  function boing() {
    if (!sound.playing()) {
      sound.play();
    }
  }
  //Start the game loop
  gameLoop();
}

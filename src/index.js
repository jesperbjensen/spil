import * as PIXI from "pixi.js";
import { Howl } from "howler";
import * as gamepad from "./gamepad";
import SoundEffect from "./SoundEffect";
import Map from "./Map";
import * as map1 from "./maps/map1";

var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

var sound = new SoundEffect("sounds/boing.mp3");

PIXI.utils.sayHello(type);

PIXI.loader
  .add(["images/testImage.png", "images/square.png", "images/tileset.png"])
  .load(setup);

function setup() {
  let lights = [];
  let baseTextures = [169, 170, 171, 172, 173, 174, 175, 176];
  let flameTextures = [153, 154, 155, 156, 157, 158, 159, 160];

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

  var texture = new PIXI.Texture(
    PIXI.loader.resources["images/tileset.png"].texture,
    new PIXI.Rectangle(0, 0, 16, 16)
  );

  var map = new Map("images/tileset.png", map1);

  var tile = new PIXI.Sprite(texture);
  var texture2 = new PIXI.Texture(
    PIXI.loader.resources["images/tileset.png"].texture,
    new PIXI.Rectangle(0, 16, 16, 16)
  );
  var tile2 = new PIXI.Sprite(texture2);

  //Position the rocket sprite on the canvas
  tile.x = 32;
  tile.y = 32;
  tile2.x = 32;
  tile2.y = 32 + 16;

  var stage = new PIXI.Container();
  //Add the rocket to the stage
  map.onObject = object => {
    if (object.gid == 169) {
      addLight(stage, map, object.x, object.y);
    }
  };
  map.addToStage(stage);
  stage.addChild(basicText);
  stage.addChild(sprite);
  stage.addChild(square);
  renderer.render(stage);

  function addLight(stage, map, x, y) {
    let index = Math.floor(Math.random() * 8);
    var base = map.getTileTexture(baseTextures[index]);
    var flame = map.getTileTexture(flameTextures[index]);
    var tile = new PIXI.Sprite(base);
    tile.x = x;
    tile.y = y - 16;
    var tile2 = new PIXI.Sprite(flame);
    tile2.x = x;
    tile2.y = y - 32;
    stage.addChild(tile);
    stage.addChild(tile2);

    lights.push({ index, base, flame, delta: 0 });
  }

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

    lights.forEach(light => {
      light.delta--;
      if (light.delta <= 0) {
        light.delta = 8;
        let newIndex = light.index + 1;
        if (newIndex == 8) {
          newIndex = 0;
        }
        light.base.frame = map.getTileRectangle(baseTextures[newIndex]);
        light.flame.frame = map.getTileRectangle(flameTextures[newIndex]);
        light.index = newIndex;
      }
    });

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

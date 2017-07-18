import * as PIXI from "pixi.js";

var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

PIXI.utils.sayHello(type);

PIXI.loader.add("images/testImage.png").load(setup);

function setup() {
  var renderer = PIXI.autoDetectRenderer(256, 256);
  renderer.view.style.position = "absolute";
  renderer.view.style.display = "block";
  renderer.autoResize = true;
  renderer.resize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.view);

  var sprite = new PIXI.Sprite(
    PIXI.loader.resources["images/testImage.png"].texture
  );

  var stage = new PIXI.Container();
  stage.addChild(sprite);
  renderer.render(stage);
}

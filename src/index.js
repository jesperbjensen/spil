import * as PIXI from "pixi.js";

var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

PIXI.utils.sayHello(type);

var renderer = PIXI.autoDetectRenderer(256, 256);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

var stage = new PIXI.Container();
renderer.render(stage);

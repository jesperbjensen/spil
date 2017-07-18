import * as PIXI from "pixi.js";

function component() {
  var element = document.createElement("div");

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = "Hello world!";

  return element;
}

var type = "WebGL";
if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

PIXI.utils.sayHello(type);

document.body.appendChild(component());

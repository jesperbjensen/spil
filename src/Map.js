export default class Map {
  constructor(tilesetSrc, mapData) {
    this.tilesetSrc = tilesetSrc;
    this.mapData = mapData;
  }

  getTileTexture(number) {
    let texture = new PIXI.Texture(
      PIXI.loader.resources[this.tilesetSrc].texture,
      this.getTileRectangle(number)
    );
    return texture;
  }

  getTileRectangle(number) {
    let textureY = Math.floor((number - 1) / 16);
    let textureX = Math.round((number - 1) % 16);
    return new PIXI.Rectangle(textureX * 16, textureY * 16, 16, 16);
  }

  addToStage(stage) {
    this.mapData.layers.forEach(layer => {
      layer.data &&
        layer.data.forEach((data, index) => {
          if (data > 0) {
            var texture = this.getTileTexture(data);
            var tile = new PIXI.Sprite(texture);
            tile.x = Math.round(index % 16) * 16;
            tile.y = Math.floor(index / 16) * 16;
            stage.addChild(tile);
          }
        });

      layer.objects &&
        layer.objects.forEach(object => {
          if (this.onObject) {
            this.onObject(object);
          }
        });
    });
  }
}

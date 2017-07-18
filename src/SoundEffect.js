export default class SoundEffect {
  constructor(src) {
    this.sound = new Howl({
      src: [src],
      loop: false
    });
  }

  play() {
    console.log("I will play");
    if (!this.sound.playing()) {
      this.sound.play();
    }
  }
}

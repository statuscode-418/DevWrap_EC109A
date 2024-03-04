// This class averages out the framerate over a
// specified number of frames. Creates a much smoother
// experience. FPS and delta is written to the State
// every frame.

import State from "./State";

export class DeltaTime {

// Properties:
//lastRenderTime: Tracks the time of the last render.
//FPSarray: Array to store FPS values.
//arraySize: Specifies the size of the array for averaging.
lastRenderTime = 0;
  FPSarray = [];
  arraySize = 60; // Higher number for smoother results.

//  Takes scene as a parameter.
//Sets up an observer on the scene's onBeforeRenderObservable.
//Calculates the FPS and delta time.
//Updates the FPS and delta time in the State object.

  constructor(scene) {
    this.loop = scene.onBeforeRenderObservable.add(() => {
      let timeNow = Date.now();
      let ms = timeNow - this.lastRenderTime;
      this.lastRenderTime = timeNow;
      let FPS = 1000 / ms;
      this.FPSarray.push(FPS);
      if (this.FPSarray.length > this.arraySize) this.FPSarray.shift();

      State.FPS = this.average(this.FPSarray);
      State.delta = State.defaultFPS / State.FPS;
    });
  }

//Calculates the average of an array of numbers.
  average(arr) {
    return arr.reduce((a, b) => a + b) / arr.length;
  }
}



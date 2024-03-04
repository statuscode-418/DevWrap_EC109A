export class AliensController {

//Static Properties:

//_formation: Static property representing the formation position with initial values { x: 0, y: 75 }.
//Constructor:

//Takes scene as a parameter (although not utilized within the constructor).
//Getter and Setter Methods:

//get formation(): Retrieves the current formation position.
//set formation(newformation): Sets the new formation position.
//Methods:

//recenterFormation(): Resets the formation position to its initial values { x: 0, y: 75 }.
  static _formation = {
    x: 0,
    y: 75
  };

  constructor(scene) {
  }

  get formation() {
    return AliensController._formation;
  }

  set formation(newformation) {
    AliensController._formation = newformation;
  }

  recenterFormation() {
    AliensController._formation = {
      x: 0,
      y: 75
    }
  }
}

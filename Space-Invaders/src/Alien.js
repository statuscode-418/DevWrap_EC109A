import {Color3, MeshBuilder, Scalar, Vector3} from "@babylonjs/core";
import {AliensController} from "./AliensController";

export class Alien extends AliensController {

 //Takes scene, mesh, x, and y as parameters.
//Sets default values for x and y.
//Initializes properties like sourceMesh, x, y, z, and scene.
//Calls initAlien() method.
//initAlien():

  constructor(scene, mesh = null, x = 0, y = 0) {
    super();
    this.sourceMesh = mesh;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.scene = scene;
    this.initAlien();
  }
//Randomizes x and y coordinates if they're not provided.
//Generates random values for the randomiser array.
//Generates a unique ID for the mesh.
//Creates a new mesh using MeshBuilder.CreateBox() or clones the provided sourceMesh.
//Sets properties like name, position, collisions, and metadata for the mesh.
//updateMeshPosition(v):
  initAlien() {
    if (this.x === 0 && this.y === 0) {
      this.x = Math.random() * 3000 - 1500;
      this.y = Math.random() * 3000 + 70;
    }
    this.randomiser = [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100)
    ];
    let id = Math.floor(Math.random() * 100000).toString(16);
    if (!this.sourceMesh) {
      this.mesh = new MeshBuilder.CreateBox("alien-" + id, {
        width: 4,
        height: 3,
        depth: 2,
      }, this.scene);
    } else{
      this.mesh = this.sourceMesh.clone("alien-" + id);
    }
    this.mesh.name = "alien-" + id;
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = this.z;
    this.mesh.checkCollisions = true;
    this.mesh.collisionGroup = 2;
    this.mesh.collisionMask = 17;
    this.mesh.metadata = {
      type: "alien",
      scoreValue: 10
    };
  }

//Updates the position of the mesh.
//Calculates new position based on formation and x and y.
//Interpolates between current and new positions using Scalar.Lerp.
//Moves the mesh with collisions enabled.
//Checks for collisions with other meshes and handles accordingly.


  updateMeshPosition(v = 0.05) {
    let currentPosition = this.mesh.position;
    let newPosition = {
      x: this.formation.x + this.x,
      y: this.formation.y + this.y
    }
    //this.mesh.position.x = Scalar.Lerp(currentPosition.x, newPosition.x, v);
    //this.mesh.position.y = Scalar.Lerp(currentPosition.y, newPosition.y, v);
    let newX = Scalar.Lerp(currentPosition.x, newPosition.x, v);
    let newY = Scalar.Lerp(currentPosition.y, newPosition.y, v);
    let scalarX = newX - currentPosition.x;
    let scalarY = newY - currentPosition.y;
    this.mesh.moveWithCollisions(new Vector3(scalarX, scalarY, currentPosition.z));
    if (this.mesh.collider.collidedMesh) {
      this.handleCollision();
    }

    return newPosition;
  }

  
//Handles collisions with other objects.
//Determines the type of collided object.
//If it's a player, disposes of both the collided mesh and the alien mesh.
//If it's a barrier, disposes of only the collided barrier mesh.
  
    handleCollision() {
    let collidedWithType = (this.mesh.collider.collidedMesh.metadata).type;
    if (collidedWithType === "player") {
      this.mesh.collider.collidedMesh.dispose(); // perform action with player meshes onDispose event.
      this.mesh.dispose();
    }
    if (collidedWithType === "barrier") {
      this.mesh.collider.collidedMesh.dispose(); // perform action with meshes onDispose event.
    }
  }
}

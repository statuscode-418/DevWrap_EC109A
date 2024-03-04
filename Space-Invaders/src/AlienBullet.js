import {MeshBuilder, Vector3} from "@babylonjs/core";
import State from "./State";

export class AlienBullet {

//Takes scene and playerMesh as parameters.
//Initializes properties like scene, minY, offset, and bulletSpeed.
//Creates a bullet mesh using MeshBuilder.CreateBox() with specified dimensions.
//Sets bullet's initial position relative to the player's position.
//Rotates the bullet within a certain arc for variation.
//Configures collision properties for the bullet.
//Calls startBulletLoop().

  constructor(scene, playerMesh) {
    this.scene = scene;
    this.minY = -30;
    this.offset = -2;
    this.bulletSpeed = -0.5;
    this.bullet = new MeshBuilder.CreateBox("bullet", {
      width: 0.5,
      height: 3,
      depth: 1
    }, this.scene);
    this.bullet.position = new Vector3(
      playerMesh.position.x,
      playerMesh.position.y + this.offset,
      playerMesh.position.z
    );
    let bulletArc = Math.PI/6;
    this.bullet.rotate(new Vector3(0, 0, 1), (Math.random() * bulletArc) - bulletArc/2);
    this.bullet.checkCollisions = true;
    this.bullet.collisionGroup = 8;
    this.bullet.collisionMask = 17;

    this.startBulletLoop();
  }

//Adds an observable to the scene's onBeforeRenderObservable.
//Moves the bullet with collisions based on its speed.
//Checks if the bullet is out of bounds or collided with other meshes.
//Calls destroyBullet() if necessary.


  startBulletLoop() {
    this.bulletObserver = this.scene.onBeforeRenderObservable.add(() => {
      let moveVector = this.bullet.calcMovePOV(0, this.bulletSpeed * State.delta, 0);
      this.bullet.moveWithCollisions(moveVector);
      if (this.bullet.position.y < this.minY) {
        this.destroyBullet();
      }
      if (this.bullet.collider.collidedMesh) {
        this.handleCollision();
      }

    });
  }

//Handles collisions with other objects.
//Determines the type of collided object.
//If it's a player or barrier, disposes of both the collided mesh and the bullet.

  handleCollision() {
    let collidedWithType = (this.bullet.collider.collidedMesh.metadata).type;
    if (collidedWithType === "player") {
      this.bullet.collider.collidedMesh.dispose(); // perform action with player meshes onDispose event.
      this.destroyBullet();
    }
    if (collidedWithType === "barrier") {
      this.bullet.collider.collidedMesh.dispose();
      this.destroyBullet();
    }
  }
  
//Removes the bullet's observer from the scene's observable.
//Disposes of the bullet mesh.
//Sets a flag to indicate that this instance has been disposed of.
  
    destroyBullet() {
    this.scene.onBeforeRenderObservable.remove(this.bulletObserver);
    this.bullet.dispose();
    this.disposed = true; // Tells our game loop to destroy this instance.
  }
}

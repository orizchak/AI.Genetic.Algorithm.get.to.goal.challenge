
class Brain {
  constructor(size) {
    this.directions = []; //series of vectors which get the dot to the goal (hopefully)
    this.step = 0;
    this.directions = new Array(size);
    this.randomize();
  }
  //--------------------------------------------------------------------------------------------------------------------------------
  //sets all the vectors in directions to a random vector with length 1
  randomize() {
    for (var i = 0; i < this.directions.length; i++) {
      var randomAngle = Math.random() * 2 * Math.PI;
      this.directions[i] = PVector.fromAngle(randomAngle);
    }
  }
  //-------------------------------------------------------------------------------------------------------------------------------------
  //returns a perfect copy of this brain object
  clone() {
    var clone = new Brain(this.directions.length);
    for (var i = 0; i < this.directions.length; i++) {
      clone.directions[i] = this.directions[i].clone();
    }
    return clone;
  }
  //----------------------------------------------------------------------------------------------------------------------------------------
  //mutates the brain by setting some of the directions to random vectors
  mutate() {
    for (var i = 0; i < this.directions.length; i++) {
      var rand = Math.random(1);
      if (rand < mutationRate) {
        //set this direction as a random direction 
        var randomAngle = Math.random() * 2 * Math.PI;
        this.directions[i] = PVector.fromAngle(randomAngle);
      }
    }
  }
}

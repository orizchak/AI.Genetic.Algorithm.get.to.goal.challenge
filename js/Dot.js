
class Dot {
  constructor() {
    //start the dots at the bottom of the window with a no velocity or acceleration
    this.pos = new PVector(width / 2, height - 10);
    this.vel = new PVector(0, 0);
    this.acc = new PVector(0, 0);
    this.brain = new Brain(1000); //new brain with 1000 instructions
    this.dead = false;
    this.reachedGoal = false;
    this.isBest = false; // true if this dot is the best dot from the previous generation
    this.fitness = 0;
  }
  //-----------------------------------------------------------------------------------------------------------------
  //draws the dot on the screen
  show() {
    //if this dot is the best dot from the previous generation then draw it as a big green dot
    if (this.isBest) {
      ctx.fillStyle = 'green'
      ellipse(this.pos.x, this.pos.y, 8, 8);
    }
    else { //all other dots are just smaller black dots
      ctx.fillStyle = 'black'
      ellipse(this.pos.x, this.pos.y, 2, 2);
    }

    // if (this.dead && !this.reachedGoal && !this.isBest) {
    //   this.erase();
    // }
  }

  erase() {
    //if this dot is the best dot from the previous generation then draw it as a big green dot
    if (this.isBest) {
      ctx.fillStyle = 'white'
      ellipse(this.pos.x, this.pos.y, 8, 8);
    }
    else { //all other dots are just smaller black dots
      ctx.fillStyle = 'white'
      ellipse(this.pos.x, this.pos.y, 2, 2);
    }
  }

  //-----------------------------------------------------------------------------------------------------------------------
  //moves the dot according to the brains directions
  move() {
    this.erase()
    //if there are still directions left then set the acceleration as the next PVector in the direcitons array
    if (this.brain.directions.length > this.brain.step) {
      this.acc = this.brain.directions[this.brain.step];
      this.brain.step++;
    }
    else { //if at the end of the directions array then the dot is dead
      this.dead = true;
    }
    //apply the acceleration and move the dot
    this.vel.add(this.acc);
    this.vel.limit(5); //not too fast
    this.pos.add(this.vel);
  }
  //-------------------------------------------------------------------------------------------------------------------
  //calls the move function and check for collisions and stuff
  update() {
    if (!this.dead && !this.reachedGoal) {
      this.move();

      //if near the edges of the window then kill it
      if (this.pos.x < 2 || this.pos.y < 2 || this.pos.x > width - 2 || this.pos.y > height - 2) {
        this.dead = true;
      }
      //if reached goal
      else if (this.pos.dist(goal) < 5) {
        this.reachedGoal = true;
      }
      // if hit obstacle
      else if (this.hitObstacle()) {
        this.dead = true;
      }
    }
  }

  hitObstacle() {
    //  obstacles.push({ x: 100, y: 500, width: 600, height: 10 });
    for (var i = 0; i < obstacles.length; i++) {
      const rect = obstacles[i];
      if (this.pos.x < rect.x + rect.width &&
        this.pos.x > rect.x &&
        this.pos.y < rect.y + rect.height &&
        this.pos.y > rect.y) {
        return true;
      }
    }
    return false;
  }

  distToObstacle(obstacle) {
    var rx = obstacle.x;
    var ry = obstacle.y;
    var rwidth = obstacle.width;
    var rheight = obstacle.height;
    var px = this.pos.x;
    var py = this.pos.y;

    var cx = Math.max(Math.min(px, rx + rwidth), rx);
    var cy = Math.max(Math.min(py, ry + rheight), ry);

    return Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));
  }

  sumDistanceToObstacles() {
    var sum = 0.0;
    for (var i = 0; i < obstacles.length; i++) {
      const rect = obstacles[i];
      sum += this.distToObstacle(rect);
    }
    return sum;
  }
  //--------------------------------------------------------------------------------------------------------------------------------------
  //calculates the fitness
  calculateFitness() {
    //if the dot reached the goal then the fitness is based on the amount of steps it took to get there
    if (this.reachedGoal) {
      this.fitness = 1.0 / 16.0 + 10000.0 / (this.brain.step * this.brain.step);
    }
    //if the dot didn't reach the goal then the fitness is based on how close it is to the goal
    else {
      var sumDistanceToObstacles = 0; //this.sumDistanceToObstacles();
      var distanceToGoal = (this.pos.dist(goal) ** 2);

      this.fitness = 1.0 / (distanceToGoal - sumDistanceToObstacles);
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------------
  //clone it 
  gimmeBaby() {
    var baby = new Dot();
    baby.brain = this.brain.clone(); //babies have the same brain as their parents
    return baby;
  }
}

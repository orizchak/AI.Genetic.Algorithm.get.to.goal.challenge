
var width = 700;
var height = 700;

var canvas = document.getElementById('canvas');
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext("2d");

var N = 2000;
var mutationRate = 0.015; //chance that any vector in directions gets changed

var test = new Population(N);//create a new population with 1000 members
var goal = new PVector(width / 2, 10);

var panel = document.getElementById('panel');

var obstacles = [];

function createObstacles() {

  obstacles.push({ x: 200, y: 200, width: 500, height: 10 });
  obstacles.push({ x: 0, y: 300, width: 500, height: 10 });
  obstacles.push({ x: 200, y: 400, width: 500, height: 10 });
  obstacles.push({ x: 0, y: 500, width: 500, height: 10 });
  obstacles.push({ x: 200, y: 600, width: 500, height: 10 });
  ctx.fillStyle = "grey";

  obstacles.forEach(rect => {
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  });

}

function init() {
  var startedDate = new Date();

  createObstacles();

  (function draw() {
    //draw goal
    ctx.fillStyle = "red";
    ellipse(goal.x, goal.y, 10, 10);

    var html = '';

    if (test.allDotsDead()) {
      //genetic algorithm
      test.calculateFitness();
      test.naturalSelection();
      test.mutateDemBabies();
    } else {
      //if any of the dots are still alive then update and then show them
      test.update();
      test.show();
    }

    var elapsed =  elapsed = (new Date().getTime() - startedDate) / 1000;

    const diff = {};

    diff.days    = Math.floor(elapsed / 86400);
    diff.hours   = Math.floor(elapsed / 3600 % 24);
    diff.minutes = Math.floor(elapsed / 60 % 60);
    diff.seconds = Math.floor(elapsed % 60);

    let message = `${diff.days}d ${diff.hours}h ${diff.minutes}m ${diff.seconds}s.`;
    message = message.replace(/(?:0. )+/, '');


    html += '<br/> time_elapsed: <br/>' + message;
    html += '<br/> gen: <br/>' + test.gen;
    html += '<br/> minStep: <br/>' + test.minStep;
    html += '<br/> countDead: <br/>' + test.countDead() + '/' + N;
    html += '<br/> fitnessSum: <br/>' + test.fitnessSum;
    html += '<br/> bestDot: <br/>' + test.bestDot;
    html += '<br/> bestDotStep: <br/>' + test.dots[test.bestDot].brain.step;
    html += '<br/> bestDotDist: <br/>' + test.dots[test.bestDot].pos.dist(goal);
    html += '<br/> sumDistanceToObstacles: <br/>' + test.dots[test.bestDot].sumDistanceToObstacles();

    panel.innerHTML = html;

    if (test.minStep <= 2) {
      console.log('finish')
      return;
    }
    requestAnimationFrame(draw);
  })();

}

function fill(r, g, b) {
  var rgb = 'rgb(' + r + ', ' + b + ', ' + b + ')';
  ctx.fillStyle = rgb;
  // console.log(rgb)
}

function ellipse(cx, cy, rx, ry) {
  ctx.beginPath();
  ctx.arc(cx, cy, rx, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

init();
